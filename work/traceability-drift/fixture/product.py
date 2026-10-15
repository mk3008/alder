def accepts(count):
    return 1 <= count <= 10


def cancel(occupied):
    return False


def can_change(owner, requester):
    return owner == requester
