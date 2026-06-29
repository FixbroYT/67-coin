from pydantic import BaseModel, Field


class Slots(BaseModel):
    stake: int = Field(..., description="Stake amount.", examples=[100])