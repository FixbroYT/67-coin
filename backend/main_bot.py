import asyncio

from services.core.loader import dp, bot

from bot.handlers.main import rt as main_rt
from logger import setup_logging, get_logger


setup_logging()
logger = get_logger(__name__)


async def start_bot():
    logger.info("Bot started!")

    dp.include_router(main_rt)

    await dp.start_polling(bot)

if __name__ == "__main__":
    try:
        asyncio.run(start_bot())
    except KeyboardInterrupt:
        logger.info("Exit.")