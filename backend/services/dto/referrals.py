from pydantic import BaseModel, Field


class GetReferralsDTO(BaseModel):
    username: str = Field(..., description="Username of referred user.")
    xp: int = Field(..., description="Amount of xp of referred user.")
    tg_id: int = Field(..., description="Referred user tg id.")
    pending_ref_bonus: int = Field(..., description="Earned by referred user amount of coins.")
    earned_coins: int = Field(..., description="Total amount of earned coins from referred user.")


class GetRefBonusDTO(BaseModel):
    coins: int = Field(..., description="Amount of referrer's coins.")
    earned_coins: int = Field(..., description="Total amount of earned coins from referred user.")