import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ─── Listar notificações não lidas para garçom ───────────────────
export const listUnread = query({
  args: { restaurantId: v.id("restaurants") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("notifications")
      .withIndex("by_restaurant_unread", (q) =>
        q.eq("restaurantId", args.restaurantId).eq("read", false)
      )
      .order("desc")
      .take(20);
  },
});

// ─── Marcar notificação como lida ─────────────────────────────────
export const markAsRead = mutation({
  args: { id: v.id("notifications") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { read: true });
    return true;
  },
});

// ─── Marcar todas como lidas ──────────────────────────────────────
export const markAllAsRead = mutation({
  args: { restaurantId: v.id("restaurants") },
  handler: async (ctx, args) => {
    const unread = await ctx.db
      .query("notifications")
      .withIndex("by_restaurant_unread", (q) =>
        q.eq("restaurantId", args.restaurantId).eq("read", false)
      )
      .take(50);

    for (const n of unread) {
      await ctx.db.patch(n._id, { read: true });
    }
    return unread.length;
  },
});
