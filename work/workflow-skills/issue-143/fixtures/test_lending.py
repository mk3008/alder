# Synthetic assertions for evidence inspection, not a runnable product.
def test_lend_available(item, lend):
    lend(item, user_id="U-7")
    assert item.status == "out"


def test_refuse_busy(item, lend):
    item.status = "out"
    before = list(item.loans)
    result = lend(item, user_id="U-8")
    assert result == "unavailable"
    assert item.loans == before
