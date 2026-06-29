from pydantic import BaseModel, Field


class GetRefBonus(BaseModel):
    referred_tg_id: int = Field(..., description="Referred user tg id.", examples=[5338124452])