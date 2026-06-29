from api.schemas.generic import ResponseSchema
from api.schemas.referrals import GetRefBonus

from api.core import GetUser, GetUserBlock
from api.core import DBSession

import services as srvc
from services.dto.referrals import GetReferralsDTO, GetRefBonusDTO

from fastapi import APIRouter


router = APIRouter()


@router.get("/get-all", response_model=ResponseSchema[list[GetReferralsDTO]])
async def get_referrals(session: DBSession, user: GetUser):
    data = await srvc.referrals.get_referrals(session, user.id)
    return ResponseSchema(data=data)


@router.post("/get-ref-bonus", response_model=ResponseSchema[GetRefBonusDTO])
async def get_ref_bonus(session: DBSession, user: GetUserBlock, data: GetRefBonus):
    referred = await srvc.users.get_internal_user(session, data.referred_tg_id)
    data = await srvc.referrals.get_ref_bonus(session, user.id, referred.id)
    return ResponseSchema(data=data)