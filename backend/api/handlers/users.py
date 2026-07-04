from api.schemas.generic import ResponseSchema
from api.schemas.users import ProcessClick, WSRequest

from api.core import GetUser, GetUserBlock
from api.core import DBSession

import services as srvc
from services.dto.users import GetUserInfoDTO, ClaimPendingPassiveIncomeDTO, GetPassiveIncomeDataDTO
from services.core.exceptions import AuthorizationException, UserNotFoundException, GameServiceException
from services.core.security import verify_init_data

from db.models import async_session

from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query, status
from pydantic import ValidationError

from config import settings
from logger import get_logger

import json
from json import JSONDecodeError

from contextlib import asynccontextmanager
from pydantic import BaseModel


logger = get_logger(__name__)
router = APIRouter()

_MISSING = object()


class GameWebSocketSession:
    def __init__(self, websocket: WebSocket):
        self.websocket = websocket

    async def send_success(self, message_type: str, data: dict):
        await self.websocket.send_json({
            "success": True,
            "type": message_type,
            "data": data
        })

    async def send_error(self, error: dict):
        await self.websocket.send_json({
            "success": False,
            "error": error
        })

    async def receive_json(self) -> dict:
        raw_data = await self.websocket.receive_text()
        
        try:
            return json.loads(raw_data)
        except JSONDecodeError:
            await self.send_error({"code": "JSONDecodeError", "message": "Invalid JSON format. Check your syntax."})
            return _MISSING

    async def validate_data(self, data: dict, schema: BaseModel):
        try:
            return schema.model_validate(data)
        except ValidationError as exc:
            await self.send_error({"code": "ValidationError", "message": exc.errors()})

    @asynccontextmanager
    async def safe_action(self):
        try:
            yield
        except GameServiceException as exc:
            await self.send_error({
                "code": exc.__class__.__name__, 
                "message": exc.message
            })
        except Exception as exc:
            logger.error(f"Database transaction failed: {exc}", exc_info=exc)
            await self.send_error({
                "code": "DatabaseError", 
                "message": "Internal server error."
            })


async def _handle_message(ws_session: GameWebSocketSession, tg_id: int, packet: WSRequest[ProcessClick]):
    async with async_session() as session:
        user = await srvc.users.get_internal_user(session, tg_id)

        match packet.action:
            case "click":
                user = await srvc.users.process_click(session, user, packet.data.click_amount)
                await ws_session.send_success(
                    message_type="click_resp", 
                    data={
                        "coins": user.coins,
                        "xp": user.xp,
                        "energy": user.energy,
                        "total_taps": user.total_taps
                    })
            case _:
                await ws_session.send_error({
                    "code": "UnknownAction",
                    "message": f"Unknown action: {packet.action}",
                })


@router.websocket("/ws")
async def click_websocket(websocket: WebSocket, init_data: str = Query(..., alias="initData")):
    await websocket.accept()

    try:
        tg_id = verify_init_data(init_data=init_data, bot_token=settings.BOT_TOKEN)
    except (AuthorizationException, UserNotFoundException) as exc:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        logger.error(f"WS Auth Rejected: {exc.message}")
        return
    
    ws_session = GameWebSocketSession(websocket)

    try:
        while True:
            data = await ws_session.receive_json()
            if data is _MISSING:
                continue

            packet = await ws_session.validate_data(data, WSRequest[ProcessClick])
            if not packet:
                continue

            async with ws_session.safe_action():
                await _handle_message(ws_session, tg_id, packet)


    except WebSocketDisconnect:
        logger.info("WebSocket disconnected.")
    except Exception as exc:
        logger.error(f"Critical WS error for user {tg_id}: {exc}", exc_info=exc)
        await websocket.close(code=status.WS_1011_INTERNAL_ERROR)


@router.get("/get-user-info", response_model=ResponseSchema[GetUserInfoDTO])
async def get_user_info(session: DBSession, user: GetUser):
    data = await srvc.users.get_user_info(session, user)
    return ResponseSchema(data=data)    


@router.get("/get-passive-income-data", response_model=ResponseSchema[GetPassiveIncomeDataDTO])
async def get_passive_income_data(session: DBSession, user: GetUser):
    data = await srvc.users.get_passive_income_data(session, user)
    return ResponseSchema(data=data)


@router.post("/claim-pending-passive-income", response_model=ResponseSchema[ClaimPendingPassiveIncomeDTO])
async def claim_pending_passive_income(session: DBSession, user: GetUserBlock):
    data = await srvc.users.claim_pending_passive_income(session, user)
    await session.commit()
    return ResponseSchema(data=data)