from sqlalchemy import select, func
from sqlalchemy.orm import joinedload
from sqlalchemy.ext.asyncio import AsyncSession

from db.models import User, Referral


async def get_user(session: AsyncSession, tg_id: int, block_needed: bool = False) -> User:
    query = select(User).where(User.tg_id == tg_id).options(joinedload(User.location))

    if block_needed:
        query = query.with_for_update(of=User)

    return await session.scalar(query)


async def get_user_with_queue(session: AsyncSession, tg_id: int) -> User:
    return await session.scalar(select(User).where(User.tg_id == tg_id).with_for_update())


async def get_referral(session: AsyncSession, user_id: int) -> tuple[User, Referral | None]:
    return await session.scalar(select(Referral).where(Referral.referred_id == user_id))
    
 
async def get_user_rank(session: AsyncSession, user_coins: int) -> int:
    query = select(func.count(User.id)).where(User.coins > user_coins)
    result = await session.execute(query)
    count = result.scalar()
    
    return count + 1