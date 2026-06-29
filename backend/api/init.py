from api.handlers.users import router as users_router
from api.handlers.upgrades import router as upgrades_router
from api.handlers.quests import router as quests_router
from api.handlers.locations import router as locations_router
from api.handlers.referrals import router as referrals_router
from api.handlers.leadmagnets import router as leadmagnets_router
from api.handlers.minigames import router as minigames_router

from fastapi import APIRouter

from logger import get_logger

logger = get_logger(__name__)
main_router = APIRouter()

main_router.include_router(
    users_router, 
    prefix="/users", 
    tags=["Users"]
)

main_router.include_router(
    upgrades_router, 
    prefix="/upgrades", 
    tags=["Upgrades"]
)

main_router.include_router(
    quests_router, 
    prefix="/quests", 
    tags=["Quests"]
)

main_router.include_router(
    locations_router, 
    prefix="/locations", 
    tags=["Locations"]
)

main_router.include_router(
    referrals_router, 
    prefix="/referrals", 
    tags=["Referrals"]
)

main_router.include_router(
    leadmagnets_router, 
    prefix="/leadmagnets", 
    tags=["Leadmagnets"]
)

main_router.include_router(
    minigames_router, 
    prefix="/minigames", 
    tags=["Minigames"]
)