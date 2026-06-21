import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ─── Abrir comanda ────────────────────────────────────────────────
export const open = mutation({
  args: {
    restaurantId: v.id("restaurants"),
    tableId: v.id("tables"),
  },
  handler: async (ctx, args) => {
    // Verificar se já existe comanda aberta para esta mesa
    const existing = await ctx.db
      .query("tabs")
      .withIndex("by_table", (q) => q.eq("tableId", args.tableId))
      .filter((q) => q.eq(q.field("status"), "OPEN"))
      .first();

    // Sempre marcar mesa como ocupada
    await ctx.db.patch(args.tableId, { status: "OCCUPIED" });

    if (existing) return existing._id;

    return await ctx.db.insert("tabs", {
      restaurantId: args.restaurantId,
      tableId: args.tableId,
      status: "OPEN",
      openedAt: Date.now(),
      total: 0,
    });
  },
});

// ─── Buscar comanda aberta da mesa ────────────────────────────────
export const getOpenByTable = query({
  args: { tableId: v.id("tables") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("tabs")
      .withIndex("by_table", (q) => q.eq("tableId", args.tableId))
      .filter((q) =>
        q.or(
          q.eq(q.field("status"), "OPEN"),
          q.eq(q.field("status"), "WAITING_PAYMENT")
        )
      )
      .first();
  },
});

// ─── Solicitar conta ──────────────────────────────────────────────
export const requestPayment = mutation({
  args: { id: v.id("tabs"), tableId: v.id("tables") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: "WAITING_PAYMENT" });
    await ctx.db.patch(args.tableId, { status: "WAITING_PAYMENT" });

    const tab = await ctx.db.get(args.id);
    if (tab) {
      await ctx.db.insert("notifications", {
        restaurantId: tab.restaurantId,
        type: "table.waiting_payment",
        message: "Cliente solicitou a conta",
        targetRole: "WAITER",
        relatedId: args.id,
        read: false,
        createdAt: Date.now(),
      });
    }

    return args.id;
  },
});

// ─── Fechar comanda (paga) ────────────────────────────────────────
export const close = mutation({
  args: {
    id: v.id("tabs"),
    tableId: v.id("tables"),
    method: v.union(
      v.literal("PIX"),
      v.literal("CREDIT"),
      v.literal("DEBIT"),
      v.literal("CASH")
    ),
    receivedBy: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const tab = await ctx.db.get(args.id);
    if (!tab) throw new Error("Comanda não encontrada");

    const now = Date.now();

    // Fechar comanda
    await ctx.db.patch(args.id, {
      status: "PAID",
      closedAt: now,
    });

    // Registrar pagamento
    await ctx.db.insert("payments", {
      restaurantId: tab.restaurantId,
      tabId: args.id,
      tableId: args.tableId,
      method: args.method,
      amount: tab.total,
      receivedBy: args.receivedBy,
      paidAt: now,
    });

    // Liberar mesa
    await ctx.db.patch(args.tableId, { status: "FREE" });

    // Notificação
    await ctx.db.insert("notifications", {
      restaurantId: tab.restaurantId,
      type: "table.freed",
      message: "Pagamento recebido. Mesa liberada.",
      targetRole: "ALL",
      relatedId: args.tableId,
      read: false,
      createdAt: now,
    });

    return args.id;
  },
});

// ─── Listar comandas com pedidos ──────────────────────────────────
export const listWithOrders = query({
  args: {
    restaurantId: v.id("restaurants"),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let q = ctx.db
      .query("tabs")
      .withIndex("by_restaurant", (q) =>
        q.eq("restaurantId", args.restaurantId)
      );

    const tabs = await q.collect();

    return await Promise.all(
      tabs.map(async (tab) => {
        const table = await ctx.db.get(tab.tableId);
        const orders = await ctx.db
          .query("orders")
          .withIndex("by_tab", (q) => q.eq("tabId", tab._id))
          .collect();
        return { ...tab, table, orders };
      })
    );
  },
});
