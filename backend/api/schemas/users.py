from pydantic import BaseModel, Field, ConfigDict


class ProcessClick(BaseModel):
    click_amount: int = Field(..., description="Amount of clicks.", examples=[25])


class ProcessClickResponse(BaseModel):
    coins: int = Field(..., description="Amount of user's coins.")
    xp: int = Field(..., description="Amount of user's xp.")
    energy: int = Field(..., description="Amount of user's energy.")
    total_taps: int = Field(..., description="Total user's taps count.")

    model_config = ConfigDict(from_attributes=True)


class GetUserIncomeResponse(BaseModel):
    click_income: int = Field(..., description="Income per click.")
    passive_income: int = Field(..., description="Passive icome per second.")