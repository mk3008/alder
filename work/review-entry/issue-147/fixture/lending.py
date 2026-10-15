from dataclasses import dataclass, field
from datetime import datetime, timezone


@dataclass
class Item:
    status: str = "available"
    loans: list = field(default_factory=list)
    reservations: list = field(default_factory=list)


def lend(item, user_id):
    if item.status == "out":
        return "unavailable"
    item.loans.append({"user_id": user_id, "lent_at": datetime.now(timezone.utc), "returned_at": None})
    item.status = "out"
    return "lent"


def return_item(item):
    item.loans[-1]["returned_at"] = datetime.now(timezone.utc)
    item.status = "available"


def reserve(item, user_id):
    item.reservations.append(user_id)
    return "reserved"
