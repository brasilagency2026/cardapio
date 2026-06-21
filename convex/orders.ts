import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ─── Criar pedido ─────────────────────────────────────────────────
export const create = mutation({
  args: {
    restaurantId: v.id("restaurants"),
    tableId: v.id("tables"),
    tabId: v.id("tabs"),
    items: v.array(
      v.object({
        productId: v.id("products"),
        productName: v.string(),
        quantity: v.number(),
        unitPrice: v.number(),
        notes: v.optional(v.string()),
      })
    ),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const total = args.items.reduce(
      (sum, i) => sum + i.unitPrice * i.quantity,
      0
    );

    const orderId = await ctx.db.insert("orders", {
      restaurantId: args.restaurantId,
      tableId: args.tableId,
      tabId: args.tabId,
      status: "PENDING",
      total,
      notes: args.notes,
      createdAt: now,
      updatedAt: now,
    });

    // Inserir itens
    for (const item of args.items) {
      await ctx.db.insert("orderItems", {
        orderId,
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        subtotal: item.unitPrice * item.quantity,
        notes: item.notes,
      });
    }

    // Atualizar total da comanda
    const tab = await ctx.db.get(args.tabId);
    if (tab) {
      await ctx.db.patch(args.tabId, { total: tab.total + total });
    }

    // Notificação para cozinha
    await ctx.db.insert("notifications", {
      restaurantId: args.restaurantId,
      type: "order.created",
      message: `Novo pedido recebido`,
      targetRole: "KITCHEN",
      relatedId: orderId,
      read: false,
      createdAt: now,
    });

    return orderId;
  },
});

// ─── Atualizar status ─────────────────────────────────────────────
export const updateStatus = mutation({
  args: {
    id: v.id("orders"),
    status: v.union(
      v.literal("PENDING"),
      v.literal("ACCEPTED"),
      v.literal("PREPARING"),
      v.literal("READY"),
      v.literal("DELIVERED"),
      v.literal("CANCELLED")
    ),
  },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.id);
    if (!order) throw new Error("Pedido não encontrado");

    await ctx.db.patch(args.id, {
      status: args.status,
      updatedAt: Date.now(),
    });

    // Notificações por status
    const notifMap: Record<string, { type: any; target: string; msg: string }> = {
      ACCEPTED:  { type: "order.accepted",  target: "WAITER",  msg: "Pedido aceito pela cozinha" },
      PREPARING: { type: "order.preparing", target: "WAITER",  msg: "Pedido em preparo" },
      READY:     { type: "order.ready",     target: "WAITER",  msg: "🔔 Pedido pronto para entrega!" },
      DELIVERED: { type: "order.delivered", target: "ALL",     msg: "Pedido entregue na mesa" },
    };

    const notif = notifMap[args.status];
    if (notif) {
      await ctx.db.insert("notifications", {
        restaurantId: order.restaurantId,
        type: notif.type,
        message: notif.msg,
        targetRole: notif.target,
        relatedId: args.id,
        read: false,
        createdAt: Date.now(),
      });
    }

    return args.id;
  },
});

// ─── Listar pedidos ativos (cozinha) ──────────────────────────────
export const listActive = query({
  args: { restaurantId: v.id("restaurants") },
  handler: async (ctx, args) => {
    const orders = await ctx.db
      .query("orders")
      .withIndex("by_restaurant", (q) =>
        q.eq("restaurantId", args.restaurantId)
      )
      .filter((q) =>
        q.or(
          q.eq(q.field("status"), "PENDING"),
          q.eq(q.field("status"), "ACCEPTED"),
          q.eq(q.field("status"), "PREPARING"),
          q.eq(q.field("status"), "READY")
        )
      )
      .order("asc")
      .collect();

    // Buscar itens para cada pedido
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const items = await ctx.db
          .query("orderItems")
          .withIndex("by_order", (q) => q.eq("orderId", order._id))
          .collect();
        const table = await ctx.db.get(order.tableId);
        return { ...order, items, table };
      })
    );

    return ordersWithItems;
  },
});

// ─── Listar pedidos por mesa ──────────────────────────────────────
export const listByTable = query({
  args: { tableId: v.id("tables") },
  handler: async (ctx, args) => {
    const orders = await ctx.db
      .query("orders")
      .withIndex("by_table", (q) => q.eq("tableId", args.tableId))
      .order("desc")
      .collect();

    return await Promise.all(
      orders.map(async (order) => {
        const items = await ctx.db
          .query("orderItems")
          .withIndex("by_order", (q) => q.eq("orderId", order._id))
          .collect();
        return { ...order, items };
      })
    );
  },
});

// ─── Relatório diário ─────────────────────────────────────────────
export const dailyReport = query({
  args: {
    restaurantId: v.id("restaurants"),
    date: v.number(), // timestamp início do dia
  },
  handler: async (ctx, args) => {
    const endOfDay = args.date + 24 * 60 * 60 * 1000;

    const orders = await ctx.db
      .query("orders")
      .withIndex("by_restaurant_date", (q) =>
        q.eq("restaurantId", args.restaurantId).gte("createdAt", args.date)
      )
      .filter((q) =>
        q.and(
          q.lt(q.field("createdAt"), endOfDay),
          q.neq(q.field("status"), "CANCELLED")
        )
      )
      .collect();

    const total = orders.reduce((sum, o) => sum + o.total, 0);
    const ticketMedio = orders.length > 0 ? total / orders.length : 0;

    // Enriquecer avec le mode de paiement via la comanda
    const ordersWithPayment = await Promise.all(
      orders.map(async (order) => {
        const payment = await ctx.db
          .query("payments")
          .withIndex("by_tab", (q) => q.eq("tabId", order.tabId))
          .first();
        return { ...order, paymentMethod: payment?.method ?? null };
      })
    );

    return {
      orders: ordersWithPayment,
      total,
      count: orders.length,
      ticketMedio,
    };
  },
});

// ─── Relatório de pagamentos por método ───────────────────────────
export const dailyPayments = query({
  args: {
    restaurantId: v.id("restaurants"),
    date: v.number(),
  },
  handler: async (ctx, args) => {
    const endOfDay = args.date + 24 * 60 * 60 * 1000;

    const payments = await ctx.db
      .query("payments")
      .withIndex("by_restaurant_date", (q) =>
        q.eq("restaurantId", args.restaurantId).gte("paidAt", args.date)
      )
      .filter((q) => q.lt(q.field("paidAt"), endOfDay))
      .collect();

    const byMethod: Record<string, { count: number; total: number }> = {
      PIX: { count: 0, total: 0 },
      CREDIT: { count: 0, total: 0 },
      DEBIT: { count: 0, total: 0 },
      CASH: { count: 0, total: 0 },
    };

    for (const p of payments) {
      if (byMethod[p.method]) {
        byMethod[p.method].count += 1;
        byMethod[p.method].total += p.amount;
      }
    }

    const totalPayments = payments.reduce((sum, p) => sum + p.amount, 0);

    return {
      byMethod,
      totalPayments,
      totalCount: payments.length,
    };
  },
});
