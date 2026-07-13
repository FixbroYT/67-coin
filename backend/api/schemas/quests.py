from pydantic import BaseModel, Field, ConfigDict


class GetAllQuestsResponse(BaseModel):
    id: int = Field(..., description="Id of quest.")
    name: str = Field(..., description="Name of quest.")
    desc: str = Field(..., description="Description of quest.")

    model_config = ConfigDict(from_attributes=True)


class GetUserQuestsResponse(BaseModel):
    quest_id: int = Field(..., description="Id of quest.")
    goal: int = Field(..., description="Quest current goal.")
    reward: int = Field(..., description="Quest reward.")
    progress: int = Field(..., description="Completion progress.")

    model_config = ConfigDict(from_attributes=True)