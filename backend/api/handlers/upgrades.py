from api.schemas.generic import ResponseSchema
from api.schemas.upgrades import GetAllUpgradesResponse, BuyUpgrade, GetUserUpgradesResponse

from api.core import GetUser, GetUserBlock
from api.core import DBSession

import services as srvc
from services.dto.upgrades import BuyUpgradeDTO

import db.requests as db

from fastapi import APIRouter


router = APIRouter()


@router.get("/get-user-upgrades", response_model=ResponseSchema[list[GetUserUpgradesResponse]])
async def get_user_upgrades(session: DBSession, user: GetUser):
    data = await db.upgrades.get_user_upgrades(session, user.id)
    return ResponseSchema(data=data)


@router.get("/get-all", response_model=ResponseSchema[list[GetAllUpgradesResponse]])
async def get_all_upgrades(session: DBSession):
    data = await db.upgrades.get_all_upgrades(session)
    return ResponseSchema(data=data)


@router.post("/buy-upgrade", response_model=ResponseSchema[BuyUpgradeDTO])
async def buy_upgrade(session: DBSession, user: GetUserBlock, data: BuyUpgrade):
    data = await srvc.upgrades.buy_upgrade(session, user, data.upgrade_id)
    return ResponseSchema(data=data)