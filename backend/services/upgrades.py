import db.requests as db

from services.dto.upgrades import BuyUpgradeDTO
from services.dto.users import ClaimPendingPassiveIncomeDTO

from services.core.exceptions import NotEnoughMoneyException, TooLowLvlException, ObjectNotFoundException
from services.users import get_internal_user, claim_pending_passive_income, update_user_energy

from sqlalchemy.ext.asyncio import AsyncSession

from db.models import User, Upgrade

import time


def _check_buy_conditions(user: User, upgrade: Upgrade, current_cost: int):
    if user.coins < current_cost:
        raise NotEnoughMoneyException()
    if upgrade.unlock_lvl > user.lvl:
        raise TooLowLvlException()


async def _claim_passive_income_if_needed(session: AsyncSession, user: User, upgrade: Upgrade) -> ClaimPendingPassiveIncomeDTO | None:
    if upgrade.type != "passive":
        return

    passive_income_data = None
    if user.last_passive_calculation != 0:
        passive_income_data = await claim_pending_passive_income(session, user.tg_id)

    user.last_passive_calculation = int(time.time())

    return passive_income_data


async def buy_upgrade(session: AsyncSession, user: User, upgrade_id: int) -> BuyUpgradeDTO:
    upgrade = await db.upgrades.get_upgrade(session, upgrade_id)

    if not upgrade:
        raise ObjectNotFoundException("Upgrade not found in database.")

    user_upgrade = await db.upgrades.get_user_upgrade(session, user.id, upgrade_id)

    if not user_upgrade:
        user_upgrade = await db.upgrades.add_upgrade_connection(session, user.id, upgrade_id)

    _check_buy_conditions(user, upgrade, user_upgrade.current_price)

    passive_income_data = await _claim_passive_income_if_needed(session, user, upgrade)

    user.coins -= user_upgrade.current_price
    user_upgrade.count += 1

    if upgrade.type == "max_energy":
        user.max_energy += upgrade.bonus
        user.energy += upgrade.bonus

    energy_data = await update_user_energy(session, user)

    await session.commit()
    
    return BuyUpgradeDTO(
        coins=user.coins,
        upgrade_count=user_upgrade.count,
        cost=user_upgrade.next_price,
        bonus=user_upgrade.bonus,
        passive_income=passive_income_data,
        energy=energy_data
    )