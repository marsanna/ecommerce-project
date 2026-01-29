import { orderOutputSchema } from "#schemas";
import type { Response } from "express";
import PDFDocument from "pdfkit";
import { z } from "zod/v4";

type OrderOutputDTO = z.infer<typeof orderOutputSchema>;

export function generateOrderPDF(
  orderData: OrderOutputDTO,
  res: Response,
): void {
  const totalPrice = orderData.items.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

  const doc = new PDFDocument({ margin: 50, size: "A4" });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=Order_${orderData.orderId.toString()}.pdf`,
  );

  doc.pipe(res);

  doc.rect(0, 0, doc.page.width, doc.page.height).fill("#cae1ff");

  doc.rect(0, 0, 600, 120).fill("#f3f4f6");

  doc
    .fillColor("#1f2937")
    .fontSize(25)
    .font("Helvetica-Bold")
    .text("Order", 50, 45);

  doc.fontSize(10).font("Helvetica").fillColor("#4b5563");
  doc.text(`Order ID: ${orderData.orderId}`, 50, 80);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 50, 95);

  doc
    .fillColor("#000000")
    .fontSize(12)
    .font("Helvetica-Bold")
    .text("Customer:", 50, 150);
  doc.font("Helvetica").text(orderData.user, 50, 165);
  if (orderData.note) {
    doc
      .fontSize(10)
      .fillColor("#6b7280")
      .text(`Note: ${orderData.note}`, 50, 185);
  }

  const tableTop = 240;
  const col1X = 50; // Pos
  const col2X = 100; // Titel
  const col3X = 350; // Quantity
  const col4X = 420; // Item Price
  const col5X = 500; // Item price total

  doc.rect(50, tableTop, 500, 20).fill("#1e40af");
  doc.fillColor("#ffffff").font("Helvetica-Bold").fontSize(10);
  doc.text("Pos", col1X + 5, tableTop + 5);
  doc.text("Product", col2X, tableTop + 5);
  doc.text("Quality", col3X, tableTop + 5);
  doc.text("Price", col4X, tableTop + 5);
  doc.text("Total", col5X, tableTop + 5);

  let currentY = tableTop + 25;
  doc.fillColor("#000000").font("Helvetica");

  orderData.items.forEach((item, index) => {
    if (index % 2 === 0) {
      doc.rect(50, currentY - 2, 500, 18).fill("#f9fafb");
    }

    doc.fillColor("#000000");
    doc.text((index + 1).toString(), col1X + 5, currentY);
    doc.text(item.title, col2X, currentY, { width: 240 });
    doc.text(item.quantity.toString(), col3X, currentY);
    doc.text(`${item.price.toFixed(2)} €`, col4X, currentY);
    doc.text(`${(item.price * item.quantity).toFixed(2)} €`, col5X, currentY);

    currentY += 20;
  });

  doc
    .moveTo(50, currentY)
    .lineTo(550, currentY)
    .strokeColor("#e5e7eb")
    .stroke();

  currentY += 20;
  doc.fontSize(14).font("Helvetica-Bold").text("Total:", 350, currentY);
  doc
    .fillColor("#1e40af")
    .text(`${totalPrice.toFixed(2)} €`, col5X - 10, currentY);

  doc
    .fontSize(10)
    .fillColor("#9ca3af")
    .text("Thank you for your business!", 50, 775, {
      align: "center",
      width: 500,
    });

  doc.end();
}
