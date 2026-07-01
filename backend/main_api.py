import uvicorn
import asyncio

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.init import main_router
from services.core.exceptions import GameServiceException, AuthorizationException
from services.core.exceptions_handlers import game_service_exceptions_handler, unknown_error_handler

from config import settings
from logger import setup_logging, get_logger

setup_logging()
logger = get_logger(__name__)

app = FastAPI()
app.include_router(main_router)

app.add_exception_handler(GameServiceException, game_service_exceptions_handler)
app.add_exception_handler(AuthorizationException, game_service_exceptions_handler)
app.add_exception_handler(Exception, unknown_error_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


async def start_all():
    config = uvicorn.Config(
        app, 
        host=settings.HOST,
        port=settings.PORT, 
        reload=settings.RELOAD,
        log_config=None
    )
    server = uvicorn.Server(config)
    await server.serve()


if __name__ == "__main__":
    try:
        asyncio.run(start_all())
    except KeyboardInterrupt:
        logger.info("Exit.")