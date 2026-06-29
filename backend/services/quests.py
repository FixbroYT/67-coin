import db.requests as db
from db.models import User

from sqlalchemy.ext.asyncio import AsyncSession


async def update_clicks_quest_progress(session: AsyncSession, user: User, click_amount: int):
    user_quests = await db.quests.get_typed_user_quests(session, user.id, "clicks")

    for uq in user_quests:
        uq.progress += click_amount
        current_goal = uq.goal

        if uq.progress >= current_goal:
            uq.progress = 0
            uq.completions += 1
            user.coins += uq.reward