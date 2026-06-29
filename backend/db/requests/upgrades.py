from sqlalchemy import select
from sqlalchemy.orm import joinedload
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Sequence

from db.models import Upgrade, UserUpgrade


async def add_upgrade_connection(session: AsyncSession, user_id: int, upgrade_id: int):
    new_user_upgrade = UserUpgrade(
        user_id=user_id,
        upgrade_id=upgrade_id
    )

    session.add(new_user_upgrade)
    await session.flush()
    await session.refresh(new_user_upgrade)

    return new_user_upgrade


async def get_all_upgrades(session: AsyncSession) -> Sequence[Upgrade]:
    upgrades = await session.scalars(select(Upgrade).order_by(Upgrade.id))
    return upgrades.all()
    

async def get_user_upgrades(session: AsyncSession, user_id: int) -> Sequence[UserUpgrade]:
    user_upgrades = await session.scalars(select(UserUpgrade).where(UserUpgrade.user_id == user_id).options(joinedload(UserUpgrade.upgrade)))
    return user_upgrades.all()
    

async def get_user_upgrade(session: AsyncSession, user_id: int, upgrade_id: int) -> UserUpgrade:
    return await session.scalar(select(UserUpgrade).where(UserUpgrade.user_id == user_id, UserUpgrade.upgrade_id == upgrade_id).options(joinedload(UserUpgrade.upgrade)))


async def get_upgrade(session: AsyncSession, upgrade_id: int) -> Upgrade:
    return await session.scalar(select(Upgrade).where(Upgrade.id == upgrade_id))


async def get_typed_user_upgrades(session: AsyncSession, user_id: int, upgrade_type: str) -> Sequence[UserUpgrade]:
    user_upgrades = await session.scalars(select(UserUpgrade).join(Upgrade, UserUpgrade.upgrade_id == Upgrade.id).where(UserUpgrade.user_id == user_id, Upgrade.type == upgrade_type).options(joinedload(UserUpgrade.upgrade)))
    return user_upgrades.all()