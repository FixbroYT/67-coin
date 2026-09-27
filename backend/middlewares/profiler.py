from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import Request
from pyinstrument import Profiler

from config import settings

class PyinstrumentProfilerMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        if settings.PROFILER and request.query_params.get("profiler"):
            profiler = Profiler(async_mode="enabled")
            profiler.start()
            
            response = await call_next(request)
            
            profiler.stop()
            profiler.print() 
            return response
        
        return await call_next(request)