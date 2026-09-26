from dataclasses import dataclass

@dataclass(frozen=True)
class Booking:
    room: str
    start: int
    end: int


def reserve(existing: list[Booking], candidate: Booking) -> bool:
    if candidate.start >= candidate.end:
        return False
    for booking in existing:
        if booking.room == candidate.room and booking.end == candidate.start:
            return True
    return True
