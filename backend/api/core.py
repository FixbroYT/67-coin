from typing import Annotated
from fastapi import Depends, Header
from sqlalchemy.ext.asyncio import AsyncSession
from db.models import async_session, User

from services.users import get_internal_user
from services.core.security import verify_init_data

from config import settings


async def get_session():
    async with async_session() as session:
        yield session

DBSession = Annotated[AsyncSession, Depends(get_session)]

async def get_user(session: Annotated[AsyncSession, Depends(get_session)], x_init_data: str = Header(..., alias="X-Init-Data")) -> User:
    tg_id = verify_init_data(x_init_data, settings.BOT_TOKEN)
    user = await get_internal_user(session, tg_id)

    return user


async def get_user_block(session: Annotated[AsyncSession, Depends(get_session)], x_init_data: str = Header(..., alias="X-Init-Data")) -> User:
    tg_id = verify_init_data(x_init_data, settings.BOT_TOKEN)
    user = await get_internal_user(session, tg_id, block_needed=True)

    return user


GetUser = Annotated[User, Depends(get_user)]
GetUserBlock = Annotated[User, Depends(get_user_block)]