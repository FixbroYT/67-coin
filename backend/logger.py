import logging
import os
import sys
from colorama import Fore, Style, init
from config import settings

init(autoreset=True, strip=not settings.USE_COLOR)


class BaseColorFormatter(logging.Formatter):
    def _format_exception(self, record: logging.LogRecord) -> str:
        parts = []

        if record.exc_info:
            if not record.exc_text:
                record.exc_text = self.formatException(record.exc_info)
            parts.append(record.exc_text)

        if record.stack_info:
            parts.append(self.formatStack(record.stack_info))

        if not parts:
            return ""

        traceback_str = "\n".join(parts)

        if settings.USE_COLOR:
            return f"\n{Fore.RED}{traceback_str}{Style.RESET_ALL}"
        return f"\n{traceback_str}"


class AccessLogFormatter(BaseColorFormatter):
    def format(self, record):
        msg = record.getMessage()

        if not settings.USE_COLOR:
            time_str = self.formatTime(record, "%H:%M:%S")
            return f"{time_str} | {'INFO':<8} | access | {msg}" + self._format_exception(record)

        time_str = f"{Fore.LIGHTBLACK_EX}{self.formatTime(record, '%H:%M:%S')}{Style.RESET_ALL}"
        level_str = f"{Fore.GREEN}{'INFO':<8}{Style.RESET_ALL}"
        name_str = f"{Fore.MAGENTA}access{Style.RESET_ALL}"

        status_color = Fore.WHITE
        try:
            status_code = int(msg.split('"')[-1].strip().split()[0])
            if status_code < 300:
                status_color = Fore.GREEN
            elif status_code < 400:
                status_color = Fore.CYAN
            elif status_code < 500:
                status_color = Fore.YELLOW
            else:
                status_color = Fore.RED

            parts = msg.rsplit(" ", 1)
            msg = f"{parts[0]} {status_color}{parts[1]}{Style.RESET_ALL}"
        except (ValueError, IndexError):
            pass

        return f"{time_str} | {level_str} | {name_str} | {Style.BRIGHT}{msg}{Style.RESET_ALL}" + self._format_exception(record)
    

class ColoredConsoleFormatter(BaseColorFormatter):
    def format(self, record):
        if not settings.USE_COLOR:
            time_str = self.formatTime(record, "%H:%M:%S")
            name = record.name.split(".")[-1]
            return f"{time_str} | {record.levelname:<8} | {name} | {record.getMessage()}" + self._format_exception(record)

        level_color = {
            "INFO": Fore.GREEN,
            "ERROR": Fore.RED,
            "WARNING": Fore.YELLOW,
            "DEBUG": Fore.CYAN,
            "CRITICAL": Fore.RED + Style.BRIGHT,
        }.get(record.levelname, Fore.WHITE)

        time_str = f"{Fore.LIGHTBLACK_EX}{self.formatTime(record, '%H:%M:%S')}{Style.RESET_ALL}"
        level_str = f"{level_color}{record.levelname:<8}{Style.RESET_ALL}"
        name_str = f"{Fore.MAGENTA}{record.name.split('.')[-1]}{Style.RESET_ALL}"
        msg = f"{Style.BRIGHT}{record.getMessage()}{Style.RESET_ALL}"

        return f"{time_str} | {level_str} | {name_str} | {msg}" + self._format_exception(record)


class MaxLevelFilter(logging.Filter):
    def __init__(self, max_level: int):
        super().__init__()
        self.max_level = max_level

    def filter(self, record: logging.LogRecord) -> bool:
        return record.levelno <= self.max_level


class WebSocketConnectFilter(logging.Filter):
    def filter(self, record: logging.LogRecord) -> bool:
        return "WebSocket" not in record.getMessage()


def _make_console_handlers(formatter: logging.Formatter):
    stdout_handler = logging.StreamHandler(sys.stdout)
    stdout_handler.setFormatter(formatter)
    stdout_handler.setLevel(logging.DEBUG)
    stdout_handler.addFilter(MaxLevelFilter(logging.INFO))

    stderr_handler = logging.StreamHandler(sys.stderr)
    stderr_handler.setFormatter(formatter)
    stderr_handler.setLevel(logging.WARNING)

    return stdout_handler, stderr_handler


def setup_logging():
    console_formatter = ColoredConsoleFormatter()
    access_formatter = AccessLogFormatter()

    console_out, console_err = _make_console_handlers(console_formatter)
    access_out, access_err = _make_console_handlers(access_formatter)

    for name in ("uvicorn", "uvicorn.error", "fastapi"):
        uvi_logger = logging.getLogger(name)
        uvi_logger.handlers.clear()
        uvi_logger.propagate = False
        uvi_logger.setLevel(logging.INFO)
        uvi_logger.addHandler(console_out)
        uvi_logger.addHandler(console_err)

    access_logger = logging.getLogger("uvicorn.access")
    access_logger.handlers.clear()
    access_logger.propagate = False
    access_logger.setLevel(logging.INFO)
    access_logger.addHandler(access_out)
    access_logger.addHandler(access_err)

    ws_filter = WebSocketConnectFilter()
    console_out.addFilter(ws_filter)
    console_err.addFilter(ws_filter)

    root = logging.getLogger()
    root.setLevel(logging.INFO)
    root.handlers.clear()
    root.addHandler(console_out)
    root.addHandler(console_err)


def get_logger(name: str) -> logging.Logger:
    return logging.getLogger(name)