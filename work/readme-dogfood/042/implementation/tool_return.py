"""A bounded, synthetic in-memory tool-return example.

The caller selects an existing loan for a registered resident. Accessory strings
are opaque, distinct tokens already assigned by the fixture, not a real-world
identity or substitution policy. Only matching tokens or a pure shortage are in
scope. Unsupported inputs raise a technical boundary error, not a reception
result. This module has no persistence, authorization, notifications, or lending.
"""

from dataclasses import dataclass
from datetime import datetime, timezone
from enum import Enum
from typing import MutableMapping


class OutsideExampleScope(ValueError):
    """The synthetic example cannot assign this input a business outcome."""


class ReceptionStatus(Enum):
    CONFIRMED = "受領確定"
    NEEDS_REVIEW = "要確認"


@dataclass
class LoanRecord:
    """An existing loan plus its borrowed group's in-memory return state."""

    tool_number: str
    issued_accessories: tuple[str, ...]
    returned_at: datetime | None = None
    inspection_pending: bool = False
    available_for_loan: bool = False

    @property
    def receipt_confirmed(self) -> bool:
        return self.returned_at is not None


@dataclass(frozen=True)
class ReceptionResult:
    status: ReceptionStatus
    recipient: str


def _fixture_tokens(items: tuple[str, ...]) -> frozenset[str]:
    if not isinstance(items, tuple):
        raise OutsideExampleScope("This fixture requires a tuple of accessory tokens.")
    if any(not isinstance(item, str) or not item for item in items):
        raise OutsideExampleScope("Accessory tokens must be nonempty fixture strings.")
    if len(set(items)) != len(items):
        raise OutsideExampleScope("Repeated labels and quantity semantics are outside this example.")
    return frozenset(items)


def receive_return(
    records: MutableMapping[str, LoanRecord],
    loan_id: str,
    *,
    tool_number: str,
    accessories: tuple[str, ...],
    received_at: datetime,
) -> ReceptionResult:
    """Process one in-scope return and update only the selected loan record.

    A pure shortage means that all supplied accessory tokens belong to this
    loan's known fixture list, but at least one is absent. Extra or substituted
    tokens are excluded before any business result or mutation, even if another
    condition would otherwise fail. The first recorded return time is preserved.
    ``OutsideExampleScope`` is a harness boundary, not an exception-reception
    workflow or an answer to the unresolved business questions.
    """
    if not isinstance(received_at, datetime):
        raise TypeError("received_at must be a datetime")
    if received_at.tzinfo is None or received_at.utcoffset() is None:
        raise ValueError("received_at must include a timezone")
    normalized_time = received_at.astimezone(timezone.utc)

    if loan_id not in records:
        raise OutsideExampleScope("The example requires an existing selected loan.")
    record = records[loan_id]
    expected = _fixture_tokens(record.issued_accessories)
    supplied = _fixture_tokens(accessories)
    if not expected:
        raise OutsideExampleScope("The example uses loans with a known, nonempty accessory list.")
    if not isinstance(record.tool_number, str) or not record.tool_number:
        raise OutsideExampleScope("The loan requires a known fixture tool number.")
    if not isinstance(tool_number, str) or not tool_number:
        raise OutsideExampleScope("The return requires a known fixture tool number.")
    if supplied - expected:
        raise OutsideExampleScope("Accessory extras and substitutions remain unresolved.")

    if tool_number != record.tool_number or supplied != expected:
        return ReceptionResult(ReceptionStatus.NEEDS_REVIEW, "窓口")

    if record.returned_at is None:
        record.returned_at = normalized_time
    record.inspection_pending = True
    record.available_for_loan = False
    return ReceptionResult(ReceptionStatus.CONFIRMED, "窓口")
