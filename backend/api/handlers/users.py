from api.schemas.generic import ResponseSchema
from api.schemas.users import ProcessClick, ProcessClickResponse, GetUserIncomeResponse


from api.core import GetUser, GetUserBlock
from api.core import DBSession

import services as srvc
from services.dto.users import GetUserInfoDTO, ClaimPendingPassiveIncomeDTO, GetPassiveIncomeDataDTO

from fastapi import APIRouter


router = APIRouter()


@router.post("/process-click", response_model=ResponseSchema[ProcessClickResponse])
async def process_click(session: DBSession, user: GetUserBlock, data: ProcessClick):
    data = await srvc.users.process_click(session, user, data.click_amount)
    return ResponseSchema(data=data)


@router.get("/income", response_model=ResponseSchema[GetUserIncomeResponse])
async def get_user_income(session: DBSession, user: GetUser): #must be depricated
    click_income = await srvc.users.get_user_income(session, user, "click")
    passive_income = await srvc.users.get_user_income(session, user, "passive")
    return ResponseSchema(data=GetUserIncomeResponse(click_income=click_income, passive_income=passive_income))


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