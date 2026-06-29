from pydantic import BaseModel, Field
from services.dto.users import ClaimPendingPassiveIncomeDTO, UpdateUserEnergyDTO


class BuyUpgradeDTO(BaseModel):
    coins: int = Field(..., description="Amount of user's coins.")
    upgrade_count: int = Field(..., description="Count of purchased upgrades.")
    cost: int = Field(..., description="Cost of upgrade.")
    bonus: int = Field(..., description="Upgrade bonus.")
    passive_income: ClaimPendingPassiveIncomeDTO | None = Field(None)
    energy: UpdateUserEnergyDTO | None = Field(None)