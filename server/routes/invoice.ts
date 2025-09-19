import { RequestHandler } from "express";
import { v4 as uuid } from "uuid";
import { checkPayment } from "../services/paymentService";

// Fake DB (replace with PostgreSQL / Mongo later)
let invoices: any[] = [];

// Create invoice (in real life, generate unique BTC address here)
export const createInvoice: RequestHandler = (req, res) => {
  const { amountBTC } = req.body;

  const invoice = {
    id: uuid(),
    amountBTC,
    address: "bc1qynk4vkfuvjfwyylta9w6dq9haa5yx3hsrx80m6", // TODO: dynamic per invoice
    status: "Pending",
  };

  invoices.push(invoice);
  res.json(invoice);
};

// List all invoices
export const listInvoices: RequestHandler = (req, res) => {
  res.json(invoices);
};

// Get single invoice & check blockchain
export const getInvoice: RequestHandler = async (req, res) => {
  const invoice = invoices.find((i) => i.id === req.params.id);
  if (!invoice) return res.status(404).json({ error: "Invoice not found" });

  // Check payment via Blockstream API
  const paid = await checkPayment(invoice.address, invoice.amountBTC);
  if (paid) {
    invoice.status = "Paid";
  }

  res.json(invoice);
};
