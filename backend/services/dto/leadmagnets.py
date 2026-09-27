from pydantic import BaseModel, Field


class GetBonusDTO(BaseModel):
    coins: int = Field(..., description="Amount of user's coins.")
    leadmagnet_id: int = Field(..., description="Id of claimed leadmagnet.")