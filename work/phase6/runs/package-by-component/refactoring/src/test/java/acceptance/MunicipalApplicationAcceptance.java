package acceptance;

import study.MunicipalApplication;

public final class MunicipalApplicationAcceptance {
    public static void main(String[] args) {
        MunicipalApplication app = new MunicipalApplication();
        app.setOperatingCap(100);

        app.submitPermit("permit-1", 60, "Asha");
        app.approvePermit("permit-1");
        require("approved".equals(app.permitStatus("permit-1")), "permit approval must remain observable");
        require("Permit permit-1 for Asha approved".equals(app.permitApprovalMessage("permit-1")), "permit message contract");

        app.enterVendorPayment("payment-1", 30, "Northwind");
        app.releaseVendorPayment("payment-1");
        require("released".equals(app.vendorPaymentStatus("payment-1")), "payment release must remain observable");
        require("Payment payment-1 to Northwind released".equals(app.vendorPaymentReleaseMessage("payment-1")), "payment message contract");

        app.enterVendorPayment("payment-2", 20, "Fabrikam");
        expectOperatingCap(() -> app.releaseVendorPayment("payment-2"));
        require("entered".equals(app.vendorPaymentStatus("payment-2")), "rejected release must not change payment state");
    }

    private static void expectOperatingCap(Runnable action) {
        try {
            action.run();
            throw new AssertionError("expected operating cap rejection");
        } catch (IllegalStateException expected) {
            require(expected.getMessage().toLowerCase().contains("cap"), "rejection must mention cap");
        }
    }

    private static void require(boolean condition, String message) {
        if (!condition) throw new AssertionError(message);
    }
}
