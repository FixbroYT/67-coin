from api.schemas.generic import ResponseSchema
from api.schemas.quests import GetAllQuestsResponse, GetUserQuestsResponse

from api.core import GetUser
from api.core import DBSession

import db.requests as db

from fastapi import APIRouter


router = APIRouter()


@router.get("/get-all", response_model=ResponseSchema[list[GetAllQuestsResponse]])
async def get_all_quests(session: DBSession):
    data = await db.quests.get_all_quests(session)
    return ResponseSchema(data=data)


@router.get("/get-user-quests", response_model=ResponseSchema[list[GetUserQuestsResponse]])
async def get_user_quests(session: DBSession, user: GetUser):
    data = await db.quests.get_user_quests(session, user.id)
    return ResponseSchema(data=data)