from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Sequence

from db.models import Location, UserLocation
    

async def get_location(session: AsyncSession, location_id: int) -> Location:
    return await session.scalar(select(Location).where(Location.id == location_id))


async def add_location_connection(session: AsyncSession, user_id: int, location_id: int):
    new_connection = UserLocation(user_id=user_id, location_id=location_id)
    session.add(new_connection)


async def get_user_locations(session: AsyncSession, user_id: int) -> Sequence[UserLocation]:
    result = await session.scalars(select(UserLocation).where(UserLocation.user_id == user_id))
    return result.all()


async def get_all_locations(session: AsyncSession) -> Sequence[Location]:
    result = await session.scalars(select(Location).order_by(Location.id))
    return result.all()


async def get_user_location(session: AsyncSession, user_id: int, location_id: int) -> UserLocation:
    return await session.scalar(select(UserLocation).where(UserLocation.user_id == user_id, UserLocation.location_id == location_id))