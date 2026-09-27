import db.requests as db 
from services.core.loader import bot
from config import settings
from typing import Sequence

from services.core.exceptions import ObjectNotFoundException, UserNotSubscribedException, BonusAlreadyClaimedException
from services.dto.leadmagnets import GetBonusDTO

from sqlalchemy.ext.asyncio import AsyncSession

from db.models import LeadMagnet, User


async def get_all(session: AsyncSession) -> Sequence[LeadMagnet]:
    leadmagnets = await db.leadmagnets.get_all_leadmagnets(session)
    
    if not leadmagnets:
        raise ObjectNotFoundException("There is no leadmagnets in database.")
    
    return leadmagnets


async def _check_tg_subscription(leadmagnet: LeadMagnet, user: User):
    if leadmagnet.type == "telegram":
        member = await bot.get_chat_member(chat_id=settings.CHAT_ID, user_id=user.tg_id)
        if not member.status in ["member", "administrator", "creator"]:
            raise UserNotSubscribedException()


async def get_bonus(session: AsyncSession, user: User, leadmagnet_id: int):
    leadmagnet = await db.leadmagnets.get_leadmagnet(session, leadmagnet_id)

    if not leadmagnet:
        raise ObjectNotFoundException("Not found leadmagnet in database.")
    
    follower = await db.leadmagnets.get_follower(session, user.id, leadmagnet_id)

    if follower:
        raise BonusAlreadyClaimedException("User already claimed this reward.")
    
    await _check_tg_subscription(leadmagnet, user)
    
    user.coins += leadmagnet.reward
    await db.leadmagnets.create_new_follower(session, user.id, leadmagnet_id)
    await session.commit()
    
    return GetBonusDTO(
        coins=user.coins,
        leadmagnet_id=leadmagnet_id
    )

