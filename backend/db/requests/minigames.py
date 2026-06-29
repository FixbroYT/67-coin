from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from db.models import DailyStats

from datetime import datetime, timezone


async def create_daily_stats(session: AsyncSession, user_id: int) -> DailyStats:
    new_daily_stats = DailyStats(user_id=user_id)
    session.add(new_daily_stats)

    await session.flush()
    await session.refresh(new_daily_stats)

    return new_daily_stats


async def get_daily_stats(session: AsyncSession, user_id: int) -> DailyStats:
    today = datetime.now(timezone.utc).date()
    daily_stats = await session.scalar(select(DailyStats).where(DailyStats.user_id == user_id, DailyStats.date == today))

    if not daily_stats:
        daily_stats = await create_daily_stats(session, user_id)

    return daily_stats