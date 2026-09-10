import { Router, type IRouter } from "express";
import {
  ApproveOrderParams,
  GetDealerParams,
  GetOrderParams,
  ListDealersQueryParams,
  ListMemoriesQueryParams,
  ListOrdersQueryParams,
  ListProductsQueryParams,
  ResolveOrderExceptionBody,
  ResolveOrderExceptionParams,
  UpdateMemoryBody,
  UpdateMemoryParams,
  UpdateOrderBody,
  UpdateOrderParams,
} from "@workspace/api-zod";

type Source = "text" | "voice" | "image" | "pdf" | "manual" | "api";
type Status = "new" | "processing" | "attention" | "approved" | "blocked" | "completed";

type Item = {
  id: string;
  rawText: string;
  productName: string;
  sku: string;
  quantity: number;
  unit: string;
  confidence: number;
  price: number;
  discount: number;
  tax: number;
  stock: number;
  stockStatus: "available" | "shortage" | "backorder";
  alternatives?: { productName: string; sku: string; confidence: number }[];
};

type Order = {
  id: string;
  orderNumber: string;
  dealerId: string;
  dealerName: string;
  source: Source;
  receivedAt: string;
  value: number;
  confidence: number;
  status: Status;
  exceptionCount: number;
  itemCount: number;
  preview: string;
  originalMessage: string;
  transcript: string | null;
  items: Item[];
  exceptions: {
    id: string;
    type: "ambiguity" | "credit" | "stock" | "discount" | "duplicate" | "tax" | "unknown";
    title: string;
    detail: string;
    severity: "high" | "medium" | "low";
    resolved: boolean;
  }[];
  audit: { id: string; message: string; actor: string; timestamp: string; tone: "success" | "warning" | "neutral" }[];
  totals: { subtotal: number; discount: number; gst: number; total: number };
};

const now = new Date();
const isoMinutesAgo = (minutes: number) => new Date(now.getTime() - minutes * 60_000).toISOString();

const products = [
  { id: "p1", sku: "ANK-6A-001", name: "Anchor 6A Switch", brand: "Anchor", category: "Switches", unit: "pcs", packaging: "10 pcs box", gstRate: 18, mrp: 92, dealerPrice: 72, stock: 184, aliases: ["anchor 6A", "6 amp switch"], stockStatus: "healthy" as const },
  { id: "p2", sku: "FIN-25-BLU", name: "Finolex 2.5mm Wire — Blue", brand: "Finolex", category: "Wires & Cables", unit: "coil", packaging: "90m", gstRate: 18, mrp: 2480, dealerPrice: 2190, stock: 84, aliases: ["blue 2.5", "blue coil", "2.5 blue wala"], stockStatus: "healthy" as const },
  { id: "p3", sku: "FIN-25-RED", name: "Finolex 2.5mm Wire — Red", brand: "Finolex", category: "Wires & Cables", unit: "coil", packaging: "90m", gstRate: 18, mrp: 2480, dealerPrice: 2190, stock: 18, aliases: ["red wire", "red coil"], stockStatus: "low" as const },
  { id: "p4", sku: "LNT-MCB-32", name: "L&T 32A MCB", brand: "L&T", category: "Protection", unit: "pcs", packaging: "1 pc", gstRate: 18, mrp: 680, dealerPrice: 540, stock: 46, aliases: ["32 wala", "32 amp MCB"], stockStatus: "healthy" as const },
  { id: "p5", sku: "POL-PIPE-20", name: "Polycab 20mm PVC Pipe", brand: "Polycab", category: "Conduits", unit: "length", packaging: "3m", gstRate: 18, mrp: 138, dealerPrice: 104, stock: 18, aliases: ["20mm pipe", "PVC pipe"], stockStatus: "low" as const },
  { id: "p6", sku: "CON-PIPE-20", name: "20mm Conduit Pipe", brand: "AKG", category: "Conduits", unit: "length", packaging: "3m", gstRate: 18, mrp: 124, dealerPrice: 96, stock: 122, aliases: ["conduit 20", "20mm conduit"], stockStatus: "healthy" as const },
];

const dealers = [
  { id: "d1", name: "Sharma Electricals", location: "Pune, MH", status: "active" as const, orders: 127, lifetimeValue: 1840000, averageOrder: 14500, lastOrderAt: "4 days ago", openExceptions: 2 },
  { id: "d2", name: "Gupta Electricals", location: "Indore, MP", status: "active" as const, orders: 94, lifetimeValue: 1260000, averageOrder: 13400, lastOrderAt: "Yesterday", openExceptions: 1 },
  { id: "d3", name: "Patel Switchgear", location: "Ahmedabad, GJ", status: "active" as const, orders: 81, lifetimeValue: 980000, averageOrder: 12100, lastOrderAt: "2 days ago", openExceptions: 0 },
  { id: "d4", name: "Mehta Hardware", location: "Nashik, MH", status: "active" as const, orders: 63, lifetimeValue: 710000, averageOrder: 11300, lastOrderAt: "6 days ago", openExceptions: 0 },
];

const orders: Order[] = [
  {
    id: "o4821", orderNumber: "#4821", dealerId: "d1", dealerName: "Sharma Electricals", source: "text", receivedAt: isoMinutesAgo(18), value: 47672, confidence: 0.84, status: "attention", exceptionCount: 1, itemCount: 4, preview: "Bhai 20 anchor 6A, 10 16A socket, 5 2.5 blue wala aur 3 red coil",
    originalMessage: "Bhai 20 anchor 6A, 10 16A socket, 5 2.5 blue wala aur 3 red coil",
    transcript: null,
    items: [
      { id: "i1", rawText: "20 anchor 6A", productName: "Anchor 6A Switch", sku: "ANK-6A-001", quantity: 20, unit: "pcs", confidence: 0.98, price: 72, discount: 0, tax: 259, stock: 184, stockStatus: "available" },
      { id: "i2", rawText: "10 16A socket", productName: "Anchor 16A Socket", sku: "ANK-SKT-16", quantity: 10, unit: "pcs", confidence: 0.79, price: 118, discount: 0, tax: 212, stock: 73, stockStatus: "available", alternatives: [{ productName: "Anchor 16A Socket", sku: "ANK-SKT-16", confidence: 0.79 }, { productName: "GM 16A Socket", sku: "GM-SKT-16", confidence: 0.61 }] },
      { id: "i3", rawText: "5 2.5 blue wala", productName: "Finolex 2.5mm Wire — Blue", sku: "FIN-25-BLU", quantity: 5, unit: "coil", confidence: 0.97, price: 2190, discount: 250, tax: 1971, stock: 84, stockStatus: "available" },
      { id: "i4", rawText: "3 red coil", productName: "Finolex 2.5mm Wire — Red", sku: "FIN-25-RED", quantity: 3, unit: "coil", confidence: 0.91, price: 2190, discount: 150, tax: 1108, stock: 18, stockStatus: "available" },
    ],
    exceptions: [{ id: "ex1", type: "ambiguity", title: "Ambiguous product", detail: "“16A socket” has two plausible catalogue matches.", severity: "medium", resolved: false }],
    audit: [{ id: "a1", message: "AI created order from dealer message", actor: "Demo AI", timestamp: "14:21", tone: "neutral" }, { id: "a2", message: "Flagged 1 item for confirmation", actor: "OrderOS", timestamp: "14:21", tone: "warning" }],
    totals: { subtotal: 42800, discount: 2400, gst: 7272, total: 47672 },
  },
  {
    id: "o4817", orderNumber: "#4817", dealerId: "d2", dealerName: "Gupta Electricals", source: "voice", receivedAt: isoMinutesAgo(42), value: 48200, confidence: 0.96, status: "blocked", exceptionCount: 1, itemCount: 6, preview: "Bhai 10 box 6 amp switch, 5 coils blue, 10 MCB 32 wala...",
    originalMessage: "Bhai 10 box 6 amp switch, 5 coils blue, 10 MCB 32 wala. Jaldi bhejna.",
    transcript: "Bhai 10 box 6 amp switch, 5 coils blue, 10 MCB 32 wala. Jaldi bhejna.",
    items: [{ id: "i5", rawText: "10 MCB 32 wala", productName: "L&T 32A MCB", sku: "LNT-MCB-32", quantity: 10, unit: "pcs", confidence: 0.96, price: 540, discount: 0, tax: 972, stock: 46, stockStatus: "available" }],
    exceptions: [{ id: "ex2", type: "credit", title: "Credit limit exceeded", detail: "Order is ₹48,200 with only ₹31,400 available credit.", severity: "high", resolved: false }],
    audit: [{ id: "a3", message: "Voice note transcribed in Hinglish", actor: "Demo AI", timestamp: "13:57", tone: "neutral" }, { id: "a4", message: "Blocked by credit policy", actor: "OrderOS", timestamp: "13:58", tone: "warning" }],
    totals: { subtotal: 41000, discount: 0, gst: 7200, total: 48200 },
  },
  {
    id: "o4812", orderNumber: "#4812", dealerId: "d3", dealerName: "Patel Switchgear", source: "image", receivedAt: isoMinutesAgo(68), value: 21900, confidence: 0.91, status: "attention", exceptionCount: 1, itemCount: 3, preview: "30 lengths 20mm PVC pipe + 10 conduit",
    originalMessage: "30 lengths 20mm PVC pipe + 10 conduit",
    transcript: null,
    items: [{ id: "i6", rawText: "30 lengths 20mm pipe", productName: "Polycab 20mm PVC Pipe", sku: "POL-PIPE-20", quantity: 30, unit: "length", confidence: 0.91, price: 104, discount: 0, tax: 562, stock: 18, stockStatus: "shortage", alternatives: [{ productName: "Polycab 20mm PVC Pipe", sku: "POL-PIPE-20", confidence: 0.91 }, { productName: "20mm Conduit Pipe", sku: "CON-PIPE-20", confidence: 0.74 }] }],
    exceptions: [{ id: "ex3", type: "stock", title: "Stock shortage", detail: "Requested 30 lengths, 18 available. Short by 12.", severity: "high", resolved: false }],
    audit: [{ id: "a5", message: "Order received as image", actor: "Patel Switchgear", timestamp: "13:31", tone: "neutral" }, { id: "a6", message: "Stock shortage detected", actor: "OrderOS", timestamp: "13:32", tone: "warning" }],
    totals: { subtotal: 18560, discount: 0, gst: 3340, total: 21900 },
  },
  {
    id: "o4809", orderNumber: "#4809", dealerId: "d1", dealerName: "Sharma Electricals", source: "text", receivedAt: isoMinutesAgo(96), value: 18900, confidence: 0.98, status: "approved", exceptionCount: 0, itemCount: 5, preview: "Same last wala + 10 MCB 32 wala",
    originalMessage: "Same last wala + 10 MCB 32 wala",
    transcript: null,
    items: [{ id: "i7", rawText: "10 MCB 32 wala", productName: "L&T 32A MCB", sku: "LNT-MCB-32", quantity: 10, unit: "pcs", confidence: 0.98, price: 540, discount: 0, tax: 972, stock: 46, stockStatus: "available" }],
    exceptions: [], audit: [{ id: "a7", message: "Order approved", actor: "Mohnish", timestamp: "12:58", tone: "success" }],
    totals: { subtotal: 16000, discount: 0, gst: 2900, total: 18900 },
  },
];

const memories = [
  { id: "m1", dealerId: "d1", dealerName: "Sharma Electricals", trigger: "blue 2.5", interpretation: "Finolex 2.5mm Wire — Blue", confidence: 0.99, source: "12 confirmed orders", createdAt: "02 Aug 2026", lastUsedAt: "Today, 14:21", usageCount: 42, state: "confirmed" as const },
  { id: "m2", dealerId: "d1", dealerName: "Sharma Electricals", trigger: "red coil", interpretation: "Finolex 2.5mm Wire — Red", confidence: 0.91, source: "Order #4772 correction", createdAt: "18 Aug 2026", lastUsedAt: "Today, 14:21", usageCount: 8, state: "confirmed" as const },
  { id: "m3", dealerId: "d1", dealerName: "Sharma Electricals", trigger: "same rate", interpretation: "Use previous negotiated dealer price", confidence: 0.87, source: "Suggested from 3 orders", createdAt: "28 Aug 2026", lastUsedAt: "Yesterday", usageCount: 3, state: "suggested" as const },
  { id: "m4", dealerId: "d2", dealerName: "Gupta Electricals", trigger: "32 wala", interpretation: "L&T 32A MCB", confidence: 0.96, source: "6 confirmed orders", createdAt: "12 Jul 2026", lastUsedAt: "Today, 13:57", usageCount: 19, state: "confirmed" as const },
  { id: "m5", dealerId: "d3", dealerName: "Patel Switchgear", trigger: "one box", interpretation: "10 units", confidence: 0.78, source: "Suggested from 2 orders", createdAt: "01 Sep 2026", lastUsedAt: "06 Sep 2026", usageCount: 2, state: "suggested" as const },
];

const orderDetail = (order: Order) => order;

const orderRouter: IRouter = Router();

orderRouter.get("/dashboard", (_req, res) => {
  res.json({
    dateLabel: "Thursday, 10 September 2026",
    ordersToday: 187,
    autoProcessed: 161,
    needsAttention: 18,
    blocked: 8,
    orderValue: 1280000,
    timeSavedMinutes: 312,
    attentionItems: [
      { id: "o4821", orderNumber: "#4821", type: "ambiguity", title: "Ambiguous product", dealerName: "Sharma Electricals", detail: "“16A socket” has two plausible matches", severity: "medium", confidence: 0.84 },
      { id: "o4817", orderNumber: "#4817", type: "credit", title: "Credit limit exceeded", dealerName: "Gupta Electricals", detail: "Order ₹48,200 · Available credit ₹31,400", severity: "high", confidence: 0.96 },
      { id: "o4812", orderNumber: "#4812", type: "stock", title: "Stock shortage", dealerName: "Patel Switchgear", detail: "Requested 30 · Available 18 · Short by 12", severity: "high", confidence: 0.91 },
    ],
    recentActivity: [
      { id: "ra1", message: "Order #4809 approved", actor: "Mohnish", timestamp: "2 min ago", tone: "success" },
      { id: "ra2", message: "New voice order from Gupta Electricals", actor: "OrderOS", timestamp: "18 min ago", tone: "neutral" },
      { id: "ra3", message: "3 new dealer memories suggested", actor: "Demo AI", timestamp: "34 min ago", tone: "warning" },
    ],
  });
});

orderRouter.get("/orders", (req, res) => {
  const parsed = ListOrdersQueryParams.safeParse(req.query);
  const { status = "all", search = "", limit = 50 } = parsed.success ? parsed.data : {};
  const normalized = String(search).toLowerCase();
  res.json(orders.filter((order) => (status === "all" || order.status === status) && (!normalized || `${order.orderNumber} ${order.dealerName} ${order.preview}`.toLowerCase().includes(normalized))).slice(0, Number(limit)).map(({ originalMessage, transcript, items, exceptions, audit, totals, ...summary }) => summary));
});

orderRouter.get("/orders/:orderId", (req, res) => {
  const parsed = GetOrderParams.safeParse(req.params);
  const order = parsed.success ? orders.find((item) => item.id === parsed.data.orderId) : undefined;
  if (!order) return res.status(404).json({ error: "Order not found" });
  return res.json(orderDetail(order));
});

orderRouter.patch("/orders/:orderId", (req, res) => {
  const params = UpdateOrderParams.safeParse(req.params);
  const body = UpdateOrderBody.safeParse(req.body);
  const order = params.success ? orders.find((item) => item.id === params.data.orderId) : undefined;
  if (!order || !body.success) return res.status(400).json({ error: "Invalid order update" });
  if (body.data.status) order.status = body.data.status;
  if (body.data.itemId && body.data.quantity !== undefined) {
    const item = order.items.find((line) => line.id === body.data.itemId);
    if (item) item.quantity = body.data.quantity;
  }
  order.audit.unshift({ id: `a${Date.now()}`, message: "Order edited before approval", actor: "Mohnish", timestamp: "Just now", tone: "neutral" });
  return res.json(order);
});

orderRouter.post("/orders/:orderId", (req, res) => {
  const params = ApproveOrderParams.safeParse(req.params);
  const order = params.success ? orders.find((item) => item.id === params.data.orderId) : undefined;
  if (!order) return res.status(404).json({ error: "Order not found" });
  order.status = "approved";
  order.exceptions = order.exceptions.map((exception) => ({ ...exception, resolved: true }));
  order.exceptionCount = 0;
  order.audit.unshift({ id: `a${Date.now()}`, message: "Order approved", actor: "Mohnish", timestamp: "Just now", tone: "success" });
  return res.json(order);
});

orderRouter.post("/orders/:orderId/resolve", (req, res) => {
  const params = ResolveOrderExceptionParams.safeParse(req.params);
  const body = ResolveOrderExceptionBody.safeParse(req.body);
  const order = params.success ? orders.find((item) => item.id === params.data.orderId) : undefined;
  if (!order || !body.success) return res.status(400).json({ error: "Invalid exception resolution" });
  order.exceptions = order.exceptions.map((exception) => exception.id === body.data.exceptionId ? { ...exception, resolved: true } : exception);
  order.exceptionCount = order.exceptions.filter((exception) => !exception.resolved).length;
  order.status = order.exceptionCount ? "attention" : "processing";
  order.audit.unshift({ id: `a${Date.now()}`, message: `Exception resolved via ${body.data.action}`, actor: "Mohnish", timestamp: "Just now", tone: "success" });
  return res.json(order);
});

orderRouter.get("/dealers", (req, res) => {
  const parsed = ListDealersQueryParams.safeParse(req.query);
  const search = parsed.success ? String(parsed.data.search ?? "").toLowerCase() : "";
  res.json(dealers.filter((dealer) => !search || `${dealer.name} ${dealer.location}`.toLowerCase().includes(search)));
});

orderRouter.get("/dealers/:dealerId", (req, res) => {
  const parsed = GetDealerParams.safeParse(req.params);
  const dealer = parsed.success ? dealers.find((item) => item.id === parsed.data.dealerId) : undefined;
  if (!dealer) return res.status(404).json({ error: "Dealer not found" });
  return res.json({ ...dealer, topProducts: products.slice(0, 3), memories: memories.filter((memory) => memory.dealerId === dealer.id), recentOrders: orders.filter((order) => order.dealerId === dealer.id).map(({ originalMessage, transcript, items, exceptions, audit, totals, ...summary }) => summary) });
});

orderRouter.get("/products", (req, res) => {
  const parsed = ListProductsQueryParams.safeParse(req.query);
  const search = parsed.success ? String(parsed.data.search ?? "").toLowerCase() : "";
  const limit = parsed.success ? Number(parsed.data.limit ?? 50) : 50;
  res.json(products.filter((product) => !search || `${product.name} ${product.sku} ${product.aliases.join(" ")}`.toLowerCase().includes(search)).slice(0, limit));
});

orderRouter.get("/memories", (req, res) => {
  const parsed = ListMemoriesQueryParams.safeParse(req.query);
  const dealerId = parsed.success ? parsed.data.dealerId : undefined;
  res.json(memories.filter((memory) => !dealerId || memory.dealerId === dealerId));
});

orderRouter.patch("/memories/:memoryId", (req, res) => {
  const params = UpdateMemoryParams.safeParse(req.params);
  const body = UpdateMemoryBody.safeParse(req.body);
  const memory = params.success ? memories.find((item) => item.id === params.data.memoryId) : undefined;
  if (!memory || !body.success) return res.status(400).json({ error: "Invalid memory update" });
  if (body.data.interpretation) memory.interpretation = body.data.interpretation;
  if (body.data.state) memory.state = body.data.state;
  if (memory.state === "confirmed") memory.confidence = Math.max(memory.confidence, 0.95);
  return res.json(memory);
});

orderRouter.delete("/memories/:memoryId", (req, res) => {
  const index = memories.findIndex((memory) => memory.id === req.params.memoryId);
  if (index === -1) return res.status(404).json({ error: "Memory not found" });
  memories.splice(index, 1);
  return res.status(204).send();
});

orderRouter.get("/analytics", (_req, res) => {
  res.json({
    processing: { autoProcessingRate: 0.861, averageProcessingMinutes: 2.4, exceptionRate: 0.096, accuracy: 0.942 },
    dealer: { active: 18, inactive: 4, averageOrderValue: 13600, repeatRate: 0.78 },
    product: { fastMoving: 24, decliningDemand: 7, stockOutFrequency: 3.2 },
    ai: { ambiguousProducts: 12, commonAliases: 68, correctionRate: 0.058, highConfidenceShare: 0.81 },
    weeklyVolume: [{ label: "Mon", orders: 142, value: 940000 }, { label: "Tue", orders: 168, value: 1120000 }, { label: "Wed", orders: 155, value: 1010000 }, { label: "Thu", orders: 187, value: 1280000 }, { label: "Fri", orders: 176, value: 1170000 }, { label: "Sat", orders: 98, value: 620000 }, { label: "Sun", orders: 40, value: 210000 }],
  });
});

export default orderRouter;