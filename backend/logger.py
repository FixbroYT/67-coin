import logging
import os
from colorama import Fore, Style, init
from logging.handlers import TimedRotatingFileHandler

init(autoreset=True)

LOGS_DIR = "logs"
os.makedirs(LOGS_DIR, exist_ok=True)


class AccessLogFormatter(logging.Formatter):
    def format(self, record):
        msg = record.getMessage()
        
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

        return f"{time_str} | {level_str} | {name_str} | {Style.BRIGHT}{msg}{Style.RESET_ALL}"


class ColoredConsoleFormatter(logging.Formatter):
    def format(self, record):
        level_color = {
            'INFO': Fore.GREEN,
            'ERROR': Fore.RED,
            'WARNING': Fore.YELLOW,
            'DEBUG': Fore.CYAN,
            'CRITICAL': Fore.RED + Style.BRIGHT
        }.get(record.levelname, Fore.WHITE)

        time_str = f"{Fore.LIGHTBLACK_EX}{self.formatTime(record, '%H:%M:%S')}{Style.RESET_ALL}"
        level_str = f"{level_color}{record.levelname:<8}{Style.RESET_ALL}"
        name_str = f"{Fore.MAGENTA}{record.name.split('.')[-1]}{Style.RESET_ALL}"
        msg = f"{Style.BRIGHT}{record.getMessage()}{Style.RESET_ALL}"

        return f"{time_str} | {level_str} | {name_str} | {msg}"


class PlainFileFormatter(logging.Formatter):
    def format(self, record):
        time_str = self.formatTime(record, '%Y-%m-%d %H:%M:%S')
        result = f"{time_str} | {record.levelname:<8} | {record.name} | {record.getMessage()}"
        if record.exc_info:
            result += "\n" + self.formatException(record.exc_info)
        return result


def setup_logging():
    file_handler = TimedRotatingFileHandler(
        os.path.join(LOGS_DIR, "app.log"),
        when="midnight",
        backupCount=5,
        encoding="utf-8"
    )
    file_handler.setFormatter(PlainFileFormatter())
    file_handler.setLevel(logging.INFO)

    console_handler = logging.StreamHandler()
    console_handler.setFormatter(ColoredConsoleFormatter())
    console_handler.setLevel(logging.INFO)

    access_console_handler = logging.StreamHandler()
    access_console_handler.setFormatter(AccessLogFormatter())
    access_console_handler.setLevel(logging.INFO)

    for name in ("uvicorn", "uvicorn.error", "fastapi"):
        uvi_logger = logging.getLogger(name)
        uvi_logger.handlers.clear()
        uvi_logger.propagate = False
        uvi_logger.setLevel(logging.INFO)
        uvi_logger.addHandler(console_handler)
        uvi_logger.addHandler(file_handler)

    access_logger = logging.getLogger("uvicorn.access")
    access_logger.handlers.clear()
    access_logger.propagate = False
    access_logger.setLevel(logging.INFO)
    access_logger.addHandler(access_console_handler)
    access_logger.addHandler(file_handler)

    root = logging.getLogger()
    root.setLevel(logging.INFO)
    root.handlers.clear()
    root.addHandler(console_handler)
    root.addHandler(file_handler)


def get_logger(name: str) -> logging.Logger:
    return logging.getLogger(name)
    