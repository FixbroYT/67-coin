from pydantic import BaseModel, Field, ConfigDict


class SetLocation(BaseModel):
    location_id: int = Field(..., description="Location id.", examples=[1])


class GetLocationsResponse(BaseModel):
    id: int = Field(..., description="Location id.")
    name: str = Field(..., description="Location name.")
    desc: str = Field(..., description="Location description.")
    cost: int = Field(..., description="Location cost.")
    multiplier: float = Field(..., description="Location bonus multiplier.", alias="bonus_multiplier")
    color: str = Field(..., description="Location multiplier label color.")
    img_url: str = Field(..., description="Location background image url.")

    model_config = ConfigDict(from_attributes=True)


class GetUserLocationsResponse(BaseModel):
    location_id: int = Field(..., description="Owned by user location id.")

    model_config = ConfigDict(from_attributes=True)


class BuyLocation(BaseModel):
    location_id: int = Field(..., description="Location id.", examples=[1])