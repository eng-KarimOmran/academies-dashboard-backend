import { PaymentTransaction } from "../../generated/prisma/client";

interface PaymentSummary {
  totalPaid: number;
  totalDue: number;
  remaining: number;
  status: "PAID" | "UNPAID" | "PARTIALLY_PAID";
}

export function calculatePaymentSummary(
  transactions: PaymentTransaction[],
  totalAmountDue: number,
): PaymentSummary {
  const totalPaid = transactions.reduce((sum, transaction) => {
    if (transaction.type === "PAYMENT" && transaction.status === "COMPLETED") {
      return sum + transaction.amount;
    }

    if (transaction.type === "REFUND") {
      return sum - transaction.amount;
    }

    return sum;
  }, 0);

  const remaining = Math.max(0, totalAmountDue - totalPaid);

  let status: PaymentSummary["status"];

  if (totalPaid >= totalAmountDue) {
    status = "PAID";
  } else if (totalPaid < totalAmountDue) {
    status = "PARTIALLY_PAID";
  } else {
    status = "UNPAID";
  }

  return {
    totalDue: totalAmountDue,
    totalPaid,
    remaining,
    status,
  };
}
