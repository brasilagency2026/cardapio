import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ─── Listar mesas ─────────────────────────────────────────────────
export const list = query({
  args: { restaurantId: v.id("restaurants") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("tables")
      .withIndex("by_restaurant", (q) =>
        q.eq("restaurantId", args.restaurantId)
      )
      .order("asc")
      .collect();
  },
});

// ─── Buscar mesa por número ───────────────────────────────────────
export const getByNumber = query({
  args: { restaurantId: v.id("restaurants"), number: v.number() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("tables")
      .withIndex("by_restaurant_number", (q) =>
        q.eq("restaurantId", args.restaurantId).eq("number", args.number)
      )
      .first();
  },
});

// ─── Buscar ou criar mesa automaticamente ────────────────────────
export const getOrCreate = mutation({
  args: { restaurantId: v.id("restaurants"), number: v.number() },
  handler: async (ctx, args) => {
    // Verificar se já existe
    const existing = await ctx.db
      .query("tables")
      .withIndex("by_restaurant_number", (q) =>
        q.eq("restaurantId", args.restaurantId).eq("number", args.number)
      )
      .first();

    if (existing) return existing._id;

    // Criar automaticamente
    const tableId = await ctx.db.insert("tables", {
      restaurantId: args.restaurantId,
      name: `Mesa ${args.number}`,
      number: args.number,
      status: "FREE",
      qrCodeUrl: `https://cardapio.foodpronto.com.br/menu/${args.number}`,
      createdAt: Date.now(),
    });

    return tableId;
  },
});

// ─── Criar mesa ───────────────────────────────────────────────────
export const create = mutation({
  args: {
    restaurantId: v.id("restaurants"),
    name: v.string(),
    number: v.number(),
    capacity: v.optional(v.number()),
    restaurantSlug: v.string(),
  },
  handler: async (ctx, args) => {
    const qrCodeUrl = `https://foodpronto.com.br/menu/${args.restaurantSlug}/mesa/${args.number}`;

    return await ctx.db.insert("tables", {
      restaurantId: args.restaurantId,
      name: args.name,
      number: args.number,
      capacity: args.capacity,
      status: "FREE",
      qrCodeUrl,
      createdAt: Date.now(),
    });
  },
});

// ─── Atualizar status da mesa ─────────────────────────────────────
export const updateStatus = mutation({
  args: {
    id: v.id("tables"),
    status: v.union(
      v.literal("FREE"),
      v.literal("OCCUPIED"),
      v.literal("WAITING_PAYMENT"),
      v.literal("RESERVED")
    ),
  },
  handler: async (ctx, args) => {
    const table = await ctx.db.get(args.id);
    if (!table) throw new Error("Mesa não encontrada");

    await ctx.db.patch(args.id, { status: args.status });

    // Notificação quando mesa liberada
    if (args.status === "FREE") {
      await ctx.db.insert("notifications", {
        restaurantId: table.restaurantId,
        type: "table.freed",
        message: `Mesa ${table.number} liberada`,
        targetRole: "WAITER",
        relatedId: args.id,
        read: false,
        createdAt: Date.now(),
      });
    }

    if (args.status === "WAITING_PAYMENT") {
      await ctx.db.insert("notifications", {
        restaurantId: table.restaurantId,
        type: "table.waiting_payment",
        message: `Mesa ${table.number} aguardando pagamento`,
        targetRole: "WAITER",
        relatedId: args.id,
        read: false,
        createdAt: Date.now(),
      });
    }

    return args.id;
  },
});

// ─── Deletar mesa ─────────────────────────────────────────────────
export const remove = mutation({
  args: { id: v.id("tables") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});
