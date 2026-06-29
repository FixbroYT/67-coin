import db.requests as db

from services.dto.minigames import SpinSlotsDTO, GetUserMinigamesDataDTO

from services.core.exceptions import InvalidStakeException, NotEnoughMoneyException
from sqlalchemy.ext.asyncio import AsyncSession

from typing import Counter
from db.models import User
from services.core.slots_config import FRUITS

import random


def _generate_spin_result() -> list[str]:
    """Randomly chooses 3 fruits including weights."""
    fruit_list = list(FRUITS.keys())
    weight_list = [fruit["weight"] for fruit in FRUITS.values()]

    return list(random.choices(fruit_list, weights=weight_list, k=3))


def _calculate_win(combination: list, stake: int) -> int:
    """Checks whether the combination is winning, returns win amount."""
    combination = tuple(combination)
    counts = Counter(combination)
    most_common_fruit, max_count = counts.most_common()[0]
    
    match max_count:
        case 2:
            return int(stake * FRUITS[most_common_fruit]["pair_multiplier"])
        case 3:
            return int(stake * FRUITS[most_common_fruit]["triple_multiplier"])

    return 0


def _check_is_stake_not_ok(user: User, stake: int):
    if stake < user.min_bet or stake > user.max_bet:
        raise InvalidStakeException()
    if user.coins < stake:
        raise NotEnoughMoneyException("Not enough money for spin.")


async def spin_slots(session: AsyncSession, user: User, stake: int) -> SpinSlotsDTO:
    daily_stats = await db.minigames.get_daily_stats(session, user.id)

    _check_is_stake_not_ok(user, stake)

    user.coins -= stake
    daily_stats.deposit_amount += stake

    combination = _generate_spin_result()
    win = _calculate_win(combination, stake) 
    user.coins += win

    await session.commit()
    
    return SpinSlotsDTO(
        coins=user.coins,
        win=win,
        combination=combination,
        daily_deposit=daily_stats.deposit_amount
    )


async def get_user_minigames_data(session: AsyncSession, user: User) -> GetUserMinigamesDataDTO:
    daily_stats = await db.minigames.get_daily_stats(session, user.id)

    return GetUserMinigamesDataDTO(
        min_bet=user.min_bet,
        max_bet=user.max_bet,
        daily_deposit=daily_stats.deposit_amount,
        required_daily_deposit=user.required_daily_deposit
    )