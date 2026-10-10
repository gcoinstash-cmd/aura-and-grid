"""
T3-NEXUS-ORDERBOOK: Core Domain Models
Clean-Room Standard: Strict Type Validation & Decimal Financial Precision
"""
from __future__ import annotations
from decimal import Decimal
from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field, field_validator, ConfigDict
import uuid
import time


class OrderSide(str, Enum):
    BUY = "BUY"
    SELL = "SELL"


class OrderType(str, Enum):
    LIMIT = "LIMIT"
    MARKET = "MARKET"


class TimeInForce(str, Enum):
    GTC = "GTC"  # Good 'Til Cancelled
    IOC = "IOC"  # Immediate Or Cancel
    FOK = "FOK"  # Fill Or Kill


class OrderStatus(str, Enum):
    PENDING = "PENDING"
    ACCEPTED = "ACCEPTED"
    PARTIALLY_FILLED = "PARTIALLY_FILLED"
    FILLED = "FILLED"
    CANCELLED = "CANCELLED"
    REJECTED = "REJECTED"


class SelfTradePrevention(str, Enum):
    CANCEL_MAKER = "CANCEL_MAKER"
    CANCEL_TAKER = "CANCEL_TAKER"
    DECREMENT_AND_CANCEL = "DECREMENT_AND_CANCEL"


class OrderCreateRequest(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)

    client_order_id: str = Field(
        default_factory=lambda: str(uuid.uuid4()),
        description="Idempotent client reference UUID",
        min_length=8,
        max_length=64,
    )
    symbol: str = Field(..., example="BTC-USDT", min_length=3, max_length=16)
    side: OrderSide = Field(..., description="BUY or SELL")
    order_type: OrderType = Field(..., description="LIMIT or MARKET")
    price: Optional[Decimal] = Field(
        default=None,
        description="Required for LIMIT orders. Must be positive with max 8 decimals.",
    )
    quantity: Decimal = Field(
        ..., gt=Decimal("0"), description="Target quantity in base units"
    )
    time_in_force: TimeInForce = Field(default=TimeInForce.GTC)
    trader_id: str = Field(..., min_length=1, max_length=64)
    stp_mode: SelfTradePrevention = Field(default=SelfTradePrevention.CANCEL_TAKER)

    @field_validator("price")
    @classmethod
    def validate_price(cls, v: Optional[Decimal], info) -> Optional[Decimal]:
        values = info.data
        order_type = values.get("order_type")
        if order_type == OrderType.LIMIT:
            if v is None or v <= Decimal("0"):
                raise ValueError("Price must be strictly positive for LIMIT orders")
            if v.as_tuple().exponent < -8:
                raise ValueError("Price precision cannot exceed 8 decimal places")
        return v


class OrderRecord(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    order_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_order_id: str
    symbol: str
    side: OrderSide
    order_type: OrderType
    price: Optional[Decimal]
    original_quantity: Decimal
    remaining_quantity: Decimal
    filled_quantity: Decimal = Decimal("0")
    status: OrderStatus = OrderStatus.PENDING
    time_in_force: TimeInForce
    trader_id: str
    stp_mode: SelfTradePrevention
    created_at_ns: int = Field(default_factory=lambda: time.time_ns())
    updated_at_ns: int = Field(default_factory=lambda: time.time_ns())


class TradeExecution(BaseModel):
    model_config = ConfigDict(frozen=True)

    trade_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    sequence_id: int
    symbol: str
    taker_order_id: str
    maker_order_id: str
    maker_trader_id: str
    taker_trader_id: str
    side: OrderSide  # Side of the taker (the aggressor)
    price: Decimal
    quantity: Decimal
    quote_volume: Decimal
    maker_fee_rebate: Decimal  # Positive = fee paid, Negative = rebate credited
    taker_fee_paid: Decimal
    executed_at_ns: int = Field(default_factory=lambda: time.time_ns())


class OrderBookLevel(BaseModel):
    model_config = ConfigDict(frozen=True)

    price: Decimal
    quantity: Decimal
    order_count: int


class MarketDepthSnapshot(BaseModel):
    model_config = ConfigDict(frozen=True)

    symbol: str
    sequence_id: int
    timestamp_ns: int
    bids: List[OrderBookLevel]
    asks: List[OrderBookLevel]


class MarketDepthDiff(BaseModel):
    model_config = ConfigDict(frozen=True)

    symbol: str
    sequence_id: int
    prev_sequence_id: int
    timestamp_ns: int
    bids: List[OrderBookLevel]  # Quantity 0 indicates price level deleted
    asks: List[OrderBookLevel]
