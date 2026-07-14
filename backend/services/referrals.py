import db.requests as db

from services.dto.referrals import GetReferralsDTO, GetRefBonusDTO
from services.core.exceptions import ObjectNotFoundException

from sqlalchemy.ext.asyncio import AsyncSession


async def get_referrals(session: AsyncSession, user_id: int) -> list[GetReferralsDTO]:
    referrals = await db.referrals.get_user_referrals(session, user_id)
    
    return [
        GetReferralsDTO(
            username=referral.referred.username,
            xp=referral.referred.xp,
            lvl=referral.referred.lvl,
            tg_id=referral.referred.tg_id,
            pending_ref_bonus=referral.calculated_pending_ref_bonus,
            earned_coins=referral.earned_coins
        )
        for referral in referrals
    ]


async def get_ref_bonus(session: AsyncSession, referrer_id: int, referred_id: int):
    referral = await db.referrals.get_referral(session, referrer_id, referred_id)

    if not referral:
        raise ObjectNotFoundException("Referral object not found.")
    
    referral.referrer.coins += referral.calculated_pending_ref_bonus
    referral.earned_coins += referral.calculated_pending_ref_bonus
    referral.pending_ref_bonus = referral.pending_ref_bonus % 10
    
    await session.commit()
    
    return GetRefBonusDTO(
        coins=referral.referrer.coins,
        earned_coins=referral.earned_coins
    )