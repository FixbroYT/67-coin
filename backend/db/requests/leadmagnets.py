from sqlalchemy import select

from db.models import LeadMagnet, Follower
from typing import Sequence
from sqlalchemy.ext.asyncio import AsyncSession

from logger import get_logger

logger = get_logger(__name__)


async def get_all_leadmagnets(session: AsyncSession) -> Sequence[LeadMagnet]:
    result = await session.scalars(select(LeadMagnet).order_by(LeadMagnet.id))
    return result.all()
    

async def get_leadmagnet(session: AsyncSession, leadmagnet_id: int) -> LeadMagnet:
    return await session.scalar(select(LeadMagnet).where(LeadMagnet.id == leadmagnet_id))


async def get_follower(session: AsyncSession, user_id: int, leadmagnet_id: int) -> Follower:
    return await session.scalar(select(Follower).where(Follower.user_id == user_id, Follower.leadmagnet_id == leadmagnet_id))


async def create_new_follower(session: AsyncSession, user_id: int, leadmagnet_id: int):
    new_follower = Follower(
        user_id=user_id,
        leadmagnet_id=leadmagnet_id
    )

    session.add(new_follower)


async def get_claimed_leadmagnets(session: AsyncSession, user_id: int) -> Sequence[Follower]:
    result = await session.scalars(select(Follower).where(Follower.user_id == user_id))
    return result.all()