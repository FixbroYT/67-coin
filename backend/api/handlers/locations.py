from api.schemas.generic import ResponseSchema
from api.schemas.locations import SetLocation, GetLocationsResponse, GetUserLocationsResponse, BuyLocation
from services.dto.locations import SetLocationDTO, BuyLocationDTO

from api.core import DBSession, GetUser, GetUserBlock
from typing import Annotated
from fastapi import Query

import services as srvc
import db.requests as db

from fastapi import APIRouter


router = APIRouter()
LocationIdFromQuery = Annotated[int, Query(..., description="Location id")]


@router.get("/get-all", response_model=ResponseSchema[list[GetLocationsResponse]])
async def get_locations(session: DBSession):
    data = await db.locations.get_all_locations(session)
    return ResponseSchema(data=data)


@router.get("/get-user-locations", response_model=ResponseSchema[list[GetUserLocationsResponse]])
async def get_user_locations(session: DBSession, user: GetUser):
    data = await db.locations.get_user_locations(session, user.id)
    return ResponseSchema(data=data)


@router.post("/set-location", response_model=ResponseSchema[SetLocationDTO])
async def set_location(session: DBSession, user: GetUser, data: SetLocation):
    data = await srvc.locations.set_location(session, data.location_id, user)
    return ResponseSchema(data=data)


@router.post("/buy-location", response_model=ResponseSchema[BuyLocationDTO])
async def buy_location(session: DBSession, user: GetUserBlock, data: BuyLocation):
    data = await srvc.locations.buy_location(session, data.location_id, user)
    return ResponseSchema(data=data)