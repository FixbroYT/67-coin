import logging
from fastapi import Request
from fastapi.responses import JSONResponse
from services.core.exceptions import GameServiceException

from logger import get_logger

logger = get_logger(__name__)


async def game_service_exceptions_handler(request: Request, exc: GameServiceException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": {
                "code": exc.__class__.__name__,
                "message": exc.message
            }
        }
    )


async def unknown_error_handler(request: Request, exc: Exception):
    logger.error(f"Unknown error occured with request: {request.url.path}, Exception: {exc}")

    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": {
                "code": exc.__class__.__name__,
                "message": "Unknown exception."
            }
        }
    )