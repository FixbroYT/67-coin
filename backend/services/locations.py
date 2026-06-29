import db.requests as db

from services.dto.locations import SetLocationDTO, BuyLocationDTO
from services.users import get_internal_user, get_user_income

from services.core.exceptions import ObjectNotFoundException, PurchasedObjectException, NotEnoughMoneyException
from sqlalchemy.ext.asyncio import AsyncSession

from db.models import User, UserLocation, Location


async def set_location(session: AsyncSession, location_id: int, user: User) -> SetLocationDTO:
    user_location = await db.locations.get_user_location(session, user.id, location_id)

    if not user_location:
        raise ObjectNotFoundException("Location not purchased.")

    user.location_id = location_id
    await session.flush()
    click_income = await get_user_income(session, user, "click")

    await session.commit()

    return SetLocationDTO(
        curr_loc_id=location_id,
        click_income=click_income
    )


def _check_buy_conditions(user: User, location: Location, user_location: UserLocation):
    if not location:
        raise ObjectNotFoundException("Location not found.")
    if user_location:
        raise PurchasedObjectException("Location already purchased.")
    if user.coins < location.cost:
        raise NotEnoughMoneyException()


async def buy_location(session: AsyncSession, location_id: int, user: User) -> BuyLocationDTO:
    location = await db.locations.get_location(session, location_id)
    user_location = await db.locations.get_user_location(session, user.id, location_id)

    _check_buy_conditions(user, location, user_location)

    user.coins -= location.cost
    await db.locations.add_location_connection(session, user.id, location_id)

    user_locations = await db.locations.get_user_locations(session, user.id)

    await session.commit()

    return BuyLocationDTO(
        coins=user.coins,
        loc_ids=[owned_location.location_id for owned_location in user_locations]
    )