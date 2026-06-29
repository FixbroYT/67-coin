from pydantic import BaseModel, Field, ConfigDict


class BuyUpgrade(BaseModel):
    upgrade_id: int = Field(..., description="Id of upgrade.", examples=[1])


class GetAllUpgradesResponse(BaseModel):
    id: int = Field(..., description="Id of upgrade.")
    name: str = Field(..., description="Name of upgrade.")
    unlock_lvl: int = Field(..., description="The level at which the upgrade is unlocked.")
    type: str = Field(..., description="Type of upgrade, click or passive.")
    icon_name: str = Field(..., description="Icon name for lucide icons.")

    model_config = ConfigDict(from_attributes=True)


class GetUserUpgradesResponse(BaseModel):
    id: int = Field(..., description="Id of upgrade.", alias="upgrade_id")
    count: int = Field(..., description="Count of purchased upgrades.")
    bonus: int = Field(..., description="Income bonus.")
    cost: int = Field(..., description="Cost of the upgrade.", alias="current_price")

    model_config = ConfigDict(from_attributes=True)