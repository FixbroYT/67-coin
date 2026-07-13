from aiogram import Router
from aiogram.filters import CommandStart
from aiogram.types import Message, InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo

from config import settings

import services as srvc

from logger import get_logger


logger = get_logger(__name__)
rt = Router()


@rt.message(CommandStart())
async def cmd_start(message: Message):
    tg_id = message.from_user.id
    splited_message = message.text.split()
    referrer_id = None

    if len(splited_message) > 1:
        referrer_id = int(splited_message[1])

    try:
        await srvc.users.add_user(
            tg_id=tg_id, 
            username=message.from_user.username,
            referrer_id=referrer_id
        )
    except Exception as exc:
        logger.error(exc)
        await message.answer("Something went wrong. Please try again later.")

    await message.answer(f"Welcome to 67 coin, {message.from_user.username}!", reply_markup=InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(text="PLAY!", web_app=WebAppInfo(url=settings.FRONT_URL))]
    ]))