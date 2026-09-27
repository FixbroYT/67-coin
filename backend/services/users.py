import db.requests as db
from db.models import User, Referral, async_session

from sqlalchemy.ext.asyncio import AsyncSession

from services.core.exceptions import UserNotFoundException, InvalidAmountOfClicksException, UserAlreadyExistsException
from services.dto.users import GetUserInfoDTO, ClaimPendingPassiveIncomeDTO, GetPassiveIncomeDataDTO, UpdateUserEnergyDTO
from services.quests import update_clicks_quest_progress

from config import balance_config

import time


async def get_internal_user(session: AsyncSession, tg_id: int, block_needed: bool = False) -> User:
    user = await db.users.get_user(session, tg_id, block_needed=block_needed)
    
    if not user:
        raise UserNotFoundException()

    return user


async def get_user_income(session: AsyncSession, user: User, upgrade_type: str) -> int:
    user_upgrades = await db.upgrades.get_typed_user_upgrades(session, user.id, upgrade_type)

    min_amount = 1
    if upgrade_type == "passive":
        min_amount = 0

    amount = max(sum([user_upgrade.bonus for user_upgrade in user_upgrades]), min_amount)

    return int(amount * user.location.bonus_multiplier)


async def get_energy_restoration(session: AsyncSession, user: User) -> int:
    energy_upgrades = await db.upgrades.get_typed_user_upgrades(session, user.id, "energy_restoration")
    energy_per_sec = max(sum([energy_upgrade.bonus for energy_upgrade in energy_upgrades]), 1)

    return energy_per_sec


async def update_user_energy(session: AsyncSession, user: User) -> UpdateUserEnergyDTO:
    current_timestamp = int(time.time())
    delta_time = current_timestamp - user.last_energy_calculation

    energy_per_sec = await get_energy_restoration(session, user)

    restored_energy = delta_time * energy_per_sec
    total_energy_amount = min(user.energy + restored_energy, user.max_energy)
    user.energy = total_energy_amount
    user.last_energy_calculation = int(time.time())

    await session.flush()

    return UpdateUserEnergyDTO(
        energy=user.energy,
        energy_restoration=energy_per_sec,
        max_energy=user.max_energy
    )


def _credit_money_to_referrer(referral: Referral, income: int):
    if referral and referral.pending_ref_bonus <= balance_config.MAX_PENDING_REF_BONUS - income:
        referral.pending_ref_bonus += income


async def process_click(session: AsyncSession, user: User, click_amount: int) -> User:
    if click_amount > balance_config.MAX_CLICK_AMOUNT_PER_REQUEST:
        raise InvalidAmountOfClicksException()

    referral = await db.users.get_referral(session, user.id)

    current_time_ms = int(time.time() * 1000)

    if current_time_ms - user.last_click_at < balance_config.PROCESS_CLICK_RATE_LIMIT:
        raise InvalidAmountOfClicksException("Too much clicks.")

    await update_user_energy(session, user)
        
    if user.energy < click_amount: 
        click_amount = max(user.energy, 0)

    click_income = await get_user_income(session, user, "click")
    user.coins += click_income * click_amount
    user.xp += click_amount
    user.energy -= click_amount
    user.total_taps += click_amount
    user.last_click_at = current_time_ms
    
    _credit_money_to_referrer(referral, click_income)

    await update_clicks_quest_progress(session, user, click_amount)
    await session.commit()

    return user


async def get_user_info(session: AsyncSession, user: User) -> GetUserInfoDTO:
    click_income = await get_user_income(session, user, "click")
    passive_income = await get_user_income(session, user, "passive")
    rank = await db.users.get_user_rank(session, user.coins)

    energy_data = await update_user_energy(session, user)
    energy_restoration = energy_data.energy_restoration

    await session.commit()

    return GetUserInfoDTO(
        coins=user.coins,
        xp=user.xp,
        lvl=user.lvl,
        current_loc_id=user.location_id,
        click_income=click_income,
        passive_income=passive_income,
        total_taps=user.total_taps,
        energy=user.energy,
        energy_restoration=energy_restoration,
        max_energy=user.max_energy,
        rank=rank
    )


async def _check_if_user_referred(session: AsyncSession, tg_id: int, user: User, referrer_id: int):
    if referrer_id and referrer_id != tg_id:
        await db.referrals.add_referral(session, referrer_id, user.id)
        await session.flush()


async def add_user(tg_id: int, username: str, referrer_tg_id: int | None) -> int:
    async with async_session() as session:
        user = await db.users.get_user(session, tg_id)

        if user:
            raise UserAlreadyExistsException()

        new_user = User(
            tg_id=tg_id, 
            username=username,
            location_id=1
        )

        session.add(new_user)
        
        await session.flush()
        await session.refresh(new_user)

        if referrer_tg_id:
            referrer = await get_internal_user(session, referrer_tg_id)
            await _check_if_user_referred(session, tg_id, new_user, referrer.id)

        await db.locations.add_location_connection(session, new_user.id, 1)
        await db.quests.add_quest_connections(session, new_user.id)
        await db.upgrades.add_all_upgrade_connections(session, new_user.id)

        await session.commit()

        return new_user.id


async def get_passive_income_data(session: AsyncSession, user: User) -> GetPassiveIncomeDataDTO:
    current_timestamp = int(time.time())
    delta_seconds = current_timestamp - user.last_passive_calculation

    if delta_seconds > balance_config.MAX_PASSIVE_INCOME_ACCUMULATION_TIME:
        delta_seconds = balance_config.MAX_PASSIVE_INCOME_ACCUMULATION_TIME
    
    passive_income = await get_user_income(session, user, "passive")
    pending_coins = delta_seconds * passive_income

    return GetPassiveIncomeDataDTO(
        predicted_coins=user.coins + pending_coins,
        pending_coins=pending_coins,
        delta_time=delta_seconds
    )
    

async def claim_pending_passive_income(session: AsyncSession, user: User) -> ClaimPendingPassiveIncomeDTO:
    data = await get_passive_income_data(session, user)
    user.coins += data.pending_coins
    user.last_passive_calculation = int(time.time())

    await session.flush()

    return ClaimPendingPassiveIncomeDTO(
        coins=user.coins,
        claimed_coins=data.pending_coins,
        delta_time=data.delta_time
    )