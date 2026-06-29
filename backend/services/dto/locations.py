from pydantic import BaseModel, Field


class SetLocationDTO(BaseModel):
    curr_loc_id: int = Field(..., description="Current user location id.")
    click_income: int = Field(..., description="User click income.")


class BuyLocationDTO(BaseModel):
    coins: int = Field(..., description="Amount of user's coins.")
    loc_ids: list[int] = Field(..., description="List of owned by user locations ids.")