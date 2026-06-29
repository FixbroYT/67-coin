from pydantic import BaseModel, Field
from typing import Generic, TypeVar

T = TypeVar("T")

class ResponseSchema(BaseModel, Generic[T]):
    success: bool = Field(default=True)
    data: T