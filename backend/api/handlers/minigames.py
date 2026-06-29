from api.schemas.generic import ResponseSchema
from api.schemas.minigames import Slots
from api.core import DBSession, GetUser, GetUserBlock

import services as srvc
from services.dto.minigames import SpinSlotsDTO, GetUserMinigamesDataDTO

from fastapi import APIRouter


router = APIRouter()


@router.get("/get-user-minigames-data", response_model=ResponseSchema[GetUserMinigamesDataDTO])
async def get_user_minigames_data(session: DBSession, user: GetUser):
    data = await srvc.minigames.get_user_minigames_data(session, user)
    return ResponseSchema(data=data)


@router.post("/slots/spin", response_model=ResponseSchema[SpinSlotsDTO])
async def spin_slots(session: DBSession, user: GetUserBlock, data: Slots):
    data = await srvc.minigames.spin_slots(session, user, data.stake)
    return ResponseSchema(data=data)