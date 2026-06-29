from sqlalchemy import select
from sqlalchemy.orm import joinedload
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Sequence

from db.models import Referral


async def get_user_referrals(session: AsyncSession, user_id: int) -> Sequence[Referral]:
    referrals = await session.scalars(select(Referral).where(Referral.referrer_id == user_id).order_by(Referral.pending_ref_bonus).options(joinedload(Referral.referred)))
    return referrals.all()


async def get_referral(session: AsyncSession, referrer_id: int, referred_id: int):
    return await session.scalar(select(Referral).where(Referral.referrer_id == referrer_id, Referral.referred_id == referred_id).options(joinedload(Referral.referrer))) 


async def add_referral(session: AsyncSession, referrer_id: int, referred_id: int):
    new_ref = Referral(referrer_id=referrer_id, referred_id=referred_id)
    session.add(new_ref)