from pydantic import BaseModel, Field, ConfigDict
from typing import Literal, Generic, TypeVar

T = TypeVar("T")


class WSRequest(BaseModel, Generic[T]):
    action: Literal["click"] = Field(..., description="Type of action.", examples=["click"])
    data: T


class ProcessClick(BaseModel):
    click_amount: int = Field(..., description="Amount of clicks.", examples=[25])