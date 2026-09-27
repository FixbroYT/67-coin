from pydantic import BaseModel, Field, ConfigDict
    

class GetLDBonus(BaseModel):
    leadmagnet_id: int = Field(..., description="Leadmagnet id.", examples=[1])


class GetAllResponse(BaseModel):
    id: int = Field(..., description="Leadmagnet id.")
    name: str = Field(..., description="Leadmagnet name.")
    reward: int = Field(..., description="Leadmagnet reward.")
    url: str = Field(..., description="Leadmagnet url.")
    icon_name: str = Field(..., description="Leadmagnet icon name.")
    color: str = Field(..., description="Leadmagnet color.")

    model_config = ConfigDict(from_attributes=True)


class GetClaimedLeadmagnetsResponse(BaseModel):
    leadmagnet_id: int = Field(..., description="Id of claimed leadmagnet.")