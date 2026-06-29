class GameServiceException(Exception):
    def __init__(self, message: str, status_code: int = 400):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)

class NotEnoughMoneyException(GameServiceException):
    def __init__(self, message: str = "Not enough money."):
        super().__init__(message)

class TooLowLvlException(GameServiceException):
    def __init__(self, message: str = "Player lvl is too low."):
        super().__init__(message)

class BonusAlreadyClaimedException(GameServiceException):
    def __init__(self, message: str = "Bonus already claimed."):
        super().__init__(message, status_code=409)

class ObjectNotFoundException(GameServiceException):
    def __init__(self, message: str = "Requested object not found in database."):
        super().__init__(message)

class UserNotFoundException(GameServiceException):
    def __init__(self, message: str = "User not found in database."):
        super().__init__(message, status_code=404)

class UserNotSubscribedException(GameServiceException):
    def __init__(self, message: str = "User is not subscribed on tg."):
        super().__init__(message)

class ClaimedBonusException(GameServiceException):
    def __init__(self, message: str = "User already claimed this bonus"):
        super().__init__(message)

class PurchasedObjectException(GameServiceException):
    def __init__(self, message: str = "Object already purchased."):
        super().__init__(message)

class InvalidStakeException(GameServiceException):
    def __init__(self, message: str = "The user's stake is incorrect, either too high or too low for his level."):
        super().__init__(message)

class InvalidAmountOfClicksException(GameServiceException):
    def __init__(self, message: str = "Too much clicks in one request."):
        super().__init__(message)

class UserAlreadyExistsException(GameServiceException):
    def __init__(self, message: str = "The attempt to create the user was unsuccessful because the user already exists."):
        super().__init__(message, status_code=409)    