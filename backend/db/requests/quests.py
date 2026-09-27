from sqlalchemy import select
from sqlalchemy.orm import joinedload
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Sequence

from db.models import UserQuest, Quest


async def get_user_quests(session: AsyncSession, user_id: int) -> Sequence[UserQuest]:
    user_quests = await session.scalars(select(UserQuest).where(UserQuest.user_id == user_id).options(joinedload(UserQuest.quest)))
    return user_quests.all()

    
async def add_quest_connections(session: AsyncSession, user_id: int):
    quests = await session.scalars(select(Quest))
    for quest in quests.all():
        session.add(UserQuest(user_id=user_id, quest_id=quest.id))
    

async def get_all_quests(session: AsyncSession) -> Sequence[Quest]:
    quests = await session.scalars(select(Quest))
    return quests.all()


async def get_typed_user_quests(session: AsyncSession, user_id: int, goal_type: str) -> Sequence[UserQuest]:
    user_quests = await session.scalars(select(UserQuest).join(Quest, UserQuest.quest_id == Quest.id).where(UserQuest.user_id == user_id, Quest.goal_type == goal_type).options(joinedload(UserQuest.quest)))
    return user_quests.all()