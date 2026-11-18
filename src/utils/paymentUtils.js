
import * as XLSX from "xlsx";
import jsPDF from "jspdf";

// Format Indian currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

// Export payments to Excel
export const exportPaymentsToExcel = (payments) => {
  const rows = payments.map((payment) => ({
    "Transaction ID": payment.transactionId,
    "Customer Name": payment.customer,
    Email: payment.email,
    Plan: payment.plan,
    Amount: payment.amount,
    "Payment Method": payment.method,
    Date: payment.date,
    Time: payment.time,
    Status: payment.status,
    "Refund Status": payment.refundStatus,
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Payments"
  );

  XLSX.writeFile(workbook, "Lifesprout_Payments.xlsx");
};

// Generate invoice PDF
export const downloadInvoice = (payment) => {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(22);
  doc.setTextColor(36, 107, 250);
  doc.text("Lifesprout Care", 20, 25);

  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text("PAYMENT INVOICE", 20, 35);

  doc.setDrawColor(220);
  doc.line(20, 42, 190, 42);

  // Invoice Information
  doc.setFontSize(11);
  doc.setTextColor(30);

  doc.text(`Invoice No: INV-${payment.id}`, 20, 55);
  doc.text(`Transaction ID: ${payment.transactionId}`, 20, 65);
  doc.text(`Date: ${payment.date}`, 20, 75);

  doc.line(20, 85, 190, 85);

  // Customer Details
  doc.setFontSize(12);
  doc.text("Customer Details", 20, 100);

  doc.setFontSize(10);
  doc.text(`Name: ${payment.customer}`, 20, 112);
  doc.text(`Email: ${payment.email}`, 20, 122);

  doc.line(20, 132, 190, 132);

  // Payment Details
  doc.setFontSize(12);
  doc.text("Payment Details", 20, 147);

  doc.setFontSize(10);
  doc.text(`Plan: ${payment.plan}`, 20, 160);
  doc.text(`Payment Method: ${payment.method}`, 20, 170);
  doc.text(`Payment Status: ${payment.status}`, 20, 180);
  doc.text(`Refund Status: ${payment.refundStatus}`, 20, 190);

  doc.line(20, 202, 190, 202);

  // Total Amount
  doc.setFontSize(14);
  doc.setTextColor(36, 107, 250);

  const amount = Number(payment.amount).toLocaleString("en-IN");

  doc.text("Total Amount:", 20, 218);
  doc.text("INR", 65, 218);
  doc.text(amount, 85, 218);

  // Footer
  doc.setFontSize(9);
  doc.setTextColor(120);

  doc.text(
    "Thank you for choosing Lifesprout Care.",
    20,
    245
  );

  // Download PDF
  doc.save(`Invoice_INV-${payment.id}.pdf`);
};
