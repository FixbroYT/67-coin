from pydantic import BaseModel, Field


class SpinSlotsDTO(BaseModel):
    coins: int = Field(..., description="Amount of user's coins.")
    win: int = Field(..., description="Amount of win.")
    combination: list[str] = Field(..., description="Generated combination, list of 3 symbols.")
    daily_deposit: int = Field(..., description="Total amount of money bet per day.")


class GetUserMinigamesDataDTO(BaseModel):
    min_bet: int = Field(..., description="Minimum bet for user's lvl.")
    max_bet: int = Field(..., description="Maximum bet for user's lvl.")
    daily_deposit: int = Field(..., description="Amount of today's deposited coins.")
    required_daily_deposit: int = Field(..., description="Amount of required coins for spin.")