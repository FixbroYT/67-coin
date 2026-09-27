from pydantic import BaseModel, Field


class ClaimPendingPassiveIncomeDTO(BaseModel):
    coins: int = Field(..., description="Amount of user's coins.")
    claimed_coins: int = Field(..., description="Amount of claimed coins.")
    delta_time: int = Field(..., description="Amount of time elapsed since the last passive income claim.")


class GetUserInfoDTO(BaseModel):
    coins: int = Field(..., description="Amount of user's coins.")
    xp: int = Field(..., description="Amount of user's xp.")
    lvl: int = Field(..., description="Current user lvl.")
    current_loc_id: int = Field(..., description="Id of location which user currently on.")
    click_income: int = Field(..., description="Income per click.")
    passive_income: int = Field(..., description="Passive income per second.")
    total_taps: int = Field(..., description="Total amount of taps.")
    energy: int = Field(..., description="Current amount of energy.")
    energy_restoration: int = Field(..., description="Energy restoration per second.")
    max_energy: int = Field(..., description="Max amount of energy.")
    rank: int = Field(..., description="Place in top.")


class GetPassiveIncomeDataDTO(BaseModel):
    predicted_coins: int = Field(..., description="Amount of PREDICTED user's coins.")
    pending_coins: int = Field(..., description="Amount of accumulated passive income coins.")
    delta_time: int = Field(..., description="Amount of time elapsed since the last passive income claim.")


class UpdateUserEnergyDTO(BaseModel):
    energy: int = Field(..., description="Current amount of energy.")
    energy_restoration: int = Field(..., description="Energy restoration per second.")
    max_energy: int = Field(..., description="Max amount of energy.")