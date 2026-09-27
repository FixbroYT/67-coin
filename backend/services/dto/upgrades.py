from pydantic import BaseModel, Field
from services.dto.users import ClaimPendingPassiveIncomeDTO, UpdateUserEnergyDTO


class BuyUpgradeDTO(BaseModel):
    coins: int = Field(..., description="Amount of user's coins.")
    upgrade_count: int = Field(..., description="Count of purchased upgrades.")
    cost: int = Field(..., description="Cost of upgrade.")
    bonus: int = Field(..., description="Upgrade bonus.")
    delta_bonus: int = Field(..., description="The net increase in bonus from this purchase.")
    click_income: int = Field(..., description="Income per click.")
    passive_income: ClaimPendingPassiveIncomeDTO = Field(..., description="Information about claimed passive income before buying.")
    energy: UpdateUserEnergyDTO | None = Field(default=None, description="Information about user energy. Sends only if upgrade changing energy stats.")