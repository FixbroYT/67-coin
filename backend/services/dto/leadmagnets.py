from pydantic import BaseModel, Field


class GetBonusDTO(BaseModel):
    coins: int = Field(..., description="Amount of user's coins.")
    follow_ids: list[int] = Field(..., description="Ids of leadmagnets that user claimed.")