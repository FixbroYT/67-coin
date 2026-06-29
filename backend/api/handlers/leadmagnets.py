from api.schemas.leadmagnets import GetLDBonus, GetAllResponse, GetClaimedLeadmagnetsResponse
from api.schemas.generic import ResponseSchema
from api.core import DBSession, GetUser

from services.dto.leadmagnets import GetBonusDTO

import services as srvc
import db.requests as db

from fastapi import APIRouter


router = APIRouter()


@router.get("/get-all", response_model=ResponseSchema[list[GetAllResponse]])
async def get_all_leadmagnets(session: DBSession):
    data = await srvc.leadmagnets.get_all(session)
    return ResponseSchema(data=data)


@router.get("/get-claimed", response_model=ResponseSchema[list[GetClaimedLeadmagnetsResponse]])
async def get_claimed_leadmagnets(session: DBSession, user: GetUser):
    data = await db.leadmagnets.get_claimed_leadmagnets(session, user.id)
    return ResponseSchema(data=data)


@router.post("/get-bonus", response_model=ResponseSchema[GetBonusDTO])
async def get_leadmagnet_bonus(session: DBSession, user: GetUser, data: GetLDBonus):
    data = await srvc.leadmagnets.get_bonus(session, user, data.leadmagnet_id)
    return ResponseSchema(data=data)