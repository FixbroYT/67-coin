from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    
    BOT_TOKEN: str
    ADMIN_ID: int

    HOST: str
    PORT: int
    RELOAD: bool

    USE_COLOR: bool

    FRONT_URL: str
    CHAT_ID: str
    
    class Config:
        env_file = ".env", 
        extra="ignore"


class GameBalanceSettings(BaseSettings):
    UPGRADE_PRICE_MULTIPLIER: float = 1.1   

    MAX_CLICK_AMOUNT_PER_REQUEST:  int = 25
    PROCESS_CLICK_RATE_LIMIT: int = 1200

    DEFAULT_MAX_ENERGY: int = 1000
    
    MAX_PASSIVE_INCOME_ACCUMULATION_TIME: int = 3 * 3600

    XP_PER_LVL: int = 1000
    
    MIN_BET_LVL_COEFF: int = 100
    MAX_BET_LVL_COEFF: int = 10000
    REQUIRED_DAILY_DEPOSIT_COEFF: int = 15000

    MAX_PENDING_REF_BONUS: int = 250000
    PENDING_REF_DIVIDER: int = 10

    class Config:
        env_prefix = "GAME_"


settings = Settings()
balance_config = GameBalanceSettings()