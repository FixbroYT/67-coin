from pydantic import BaseModel, Field


class SetLocationDTO(BaseModel):
    current_loc_id: int = Field(..., description="Current user location id.")
    click_income: int = Field(..., description="User click income.")


class BuyLocationDTO(BaseModel):
    coins: int = Field(..., description="Amount of user's coins.")
    location_id: int = Field(..., description="New owned by user location id.")