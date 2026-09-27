from sqlalchemy import BigInteger, ForeignKey, String, Integer, Float, Date, Boolean
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncAttrs
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship

from datetime import datetime, timezone, date

from config import settings, balance_config


engine = create_async_engine(settings.DATABASE_URL, echo=False, pool_size=20)
async_session = async_sessionmaker(engine, expire_on_commit=False)


class Base(DeclarativeBase, AsyncAttrs):
    pass


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    tg_id: Mapped[int] = mapped_column(BigInteger, unique=True)
    username: Mapped[str] = mapped_column(String, nullable=True)
    coins: Mapped[int] = mapped_column(BigInteger, default=0, server_default="0")
    xp: Mapped[int] = mapped_column(Integer, default=0, server_default="0")
    location_id: Mapped[int] = mapped_column(ForeignKey("locations.id"), nullable=True)
    total_taps: Mapped[int] = mapped_column(Integer, server_default="0")

    energy: Mapped[int] = mapped_column(Integer, server_default="1000")
    max_energy: Mapped[int] = mapped_column(Integer, server_default="1000")

    last_passive_calculation: Mapped[int] = mapped_column(Integer, server_default="0")
    last_energy_calculation: Mapped[int] = mapped_column(Integer, server_default="0")
    last_click_at: Mapped[int] = mapped_column(BigInteger, server_default="0")

    location = relationship("Location", back_populates="users", lazy="raise")
    upgrades = relationship("UserUpgrade", back_populates="user", cascade="all, delete", lazy="raise")
    owned_locations = relationship("UserLocation", back_populates="user", cascade="all, delete", lazy="raise")

    @property
    def lvl(self):
        return self.xp // balance_config.XP_PER_LVL
    
    @property
    def min_bet(self):
        return self.lvl * balance_config.MIN_BET_LVL_COEFF

    @property
    def max_bet(self):
        return self.lvl * balance_config.MAX_BET_LVL_COEFF
    
    @property
    def required_daily_deposit(self):
        return self.lvl * balance_config.REQUIRED_DAILY_DEPOSIT_COEFF


class Upgrade(Base):
    __tablename__ = "upgrades"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String)
    type: Mapped[str] = mapped_column(String, server_default="click")
    unlock_lvl: Mapped[int] = mapped_column(Integer, server_default="0")
    cost: Mapped[int] = mapped_column(Integer)
    bonus: Mapped[float] = mapped_column(Float)
    icon_name: Mapped[str] = mapped_column(String, server_default="Gamepad2")

    users = relationship("UserUpgrade", back_populates="upgrade", lazy="raise")


class UserUpgrade(Base):
    __tablename__ = "user_upgrades"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    upgrade_id: Mapped[int] = mapped_column(ForeignKey("upgrades.id"))
    count: Mapped[int] = mapped_column(server_default="0")

    user: Mapped["User"] = relationship(back_populates="upgrades", lazy="raise")
    upgrade: Mapped["Upgrade"] = relationship(back_populates="users", lazy="selectin")

    def _calculate_price(self, target_count: int) -> int:
        return int(self.upgrade.cost * (balance_config.UPGRADE_PRICE_MULTIPLIER ** (target_count - 1)))

    @property
    def next_price(self) -> int:
        return self._calculate_price(self.count + 1)
    
    @property
    def current_price(self) -> int:
        return self._calculate_price(self.count)
    
    @property
    def bonus(self) -> int:
        return int(self.count * self.upgrade.bonus)


class Location(Base):
    __tablename__ = "locations"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String)
    desc: Mapped[str] = mapped_column(String, server_default="Location")
    cost: Mapped[int] = mapped_column(Integer)
    bonus_multiplier: Mapped[float] = mapped_column(Float)
    color: Mapped[str] = mapped_column(String, server_default="#b6a0ff")
    img_url: Mapped[str] = mapped_column(String, nullable=True)

    users = relationship("User", back_populates="location", lazy="raise")


class UserLocation(Base):
    __tablename__ = "user_locations"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    location_id: Mapped[int] = mapped_column(ForeignKey("locations.id"))

    user = relationship("User", back_populates="owned_locations", lazy="raise")
    location = relationship("Location")


class Quest(Base):
    __tablename__ = "quests"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String, server_default="name")
    desc: Mapped[str] = mapped_column(String, server_default="desc")
    
    base_reward: Mapped[int] = mapped_column(Integer)
    reward_multiplier: Mapped[float] = mapped_column(Float, server_default="1.5", default=1.5)
    
    base_goal: Mapped[int] = mapped_column(Integer)
    goal_multiplier: Mapped[float] = mapped_column(Float, server_default="2.0", default=2.0)
    
    goal_type: Mapped[str] = mapped_column(String)


class UserQuest(Base):
    __tablename__ = "user_quests"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    quest_id: Mapped[int] = mapped_column(ForeignKey("quests.id"))
    
    progress: Mapped[int] = mapped_column(server_default="0", default=0)
    completions: Mapped[int] = mapped_column(server_default="0", default=0)

    user = relationship("User")
    quest = relationship("Quest")

    @property
    def reward(self) -> int:
        return int(self.quest.base_reward * (self.quest.reward_multiplier ** self.completions))
    
    @property
    def goal(self) -> int:
        return int(self.quest.base_goal * (self.quest.goal_multiplier ** self.completions))


class Referral(Base):
    __tablename__ = "referrals"

    id: Mapped[int] = mapped_column(primary_key=True)
    referrer_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    referred_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    pending_ref_bonus: Mapped[int] = mapped_column(Integer, server_default="0")
    earned_coins: Mapped[int] = mapped_column(BigInteger, server_default="0")

    referrer = relationship("User", foreign_keys=[referrer_id])
    referred = relationship("User", foreign_keys=[referred_id])

    @property
    def calculated_pending_ref_bonus(self):
        return self.pending_ref_bonus // balance_config.PENDING_REF_DIVIDER
    

class LeadMagnet(Base):
    __tablename__ = "leadmagnets"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String)
    icon_name: Mapped[str] = mapped_column(String)
    color: Mapped[str] = mapped_column(String)
    type: Mapped[str] = mapped_column(String)
    reward: Mapped[int] = mapped_column(Integer)
    url: Mapped[str] = mapped_column(String)


class Follower(Base):
    __tablename__ = "followers"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    leadmagnet_id: Mapped[int] = mapped_column(ForeignKey("leadmagnets.id"))

    user = relationship("User")
    leadmagnet = relationship("LeadMagnet")


class DailyStats(Base):
    __tablename__ = "daily_stats"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    date: Mapped[date] = mapped_column(Date,default=lambda: datetime.now(timezone.utc).date(), nullable=False, index=True)
    deposit_amount: Mapped[int] = mapped_column(Integer, server_default="0")
    bonus_claimed: Mapped[bool] = mapped_column(Boolean, server_default="false")