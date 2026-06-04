import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ─── Criar restaurante ────────────────────────────────────────────
export const create = mutation({
  args: {
    clerkOrgId: v.string(),
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    city: v.optional(v.string()),
    state: v.optional(v.string()),
    plan: v.union(v.literal("DIGITAL_MENU"), v.literal("RESTAURANT_SMART")),
  },
  handler: async (ctx, args) => {
    // Verifica slug único
    const existing = await ctx.db
      .query("restaurants")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
    if (existing) throw new Error("Esse endereço já está em uso.");

    const now = Date.now();
    const trialEndsAt = now + 14 * 24 * 60 * 60 * 1000; // 14 dias

    return await ctx.db.insert("restaurants", {
      ...args,
      planStatus: "TRIAL",
      trialEndsAt,
      active: true,
      createdAt: now,
    });
  },
});

// ─── Buscar por slug (público - cardápio) ─────────────────────────
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("restaurants")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

// ─── Buscar pelo Clerk Org ────────────────────────────────────────
export const getByClerkOrg = query({
  args: { clerkOrgId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("restaurants")
      .withIndex("by_clerkOrgId", (q) => q.eq("clerkOrgId", args.clerkOrgId))
      .first();
  },
});

// ─── Atualizar restaurante ────────────────────────────────────────
export const update = mutation({
  args: {
    id: v.id("restaurants"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    city: v.optional(v.string()),
    logo: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    return await ctx.db.patch(id, fields);
  },
});

// ─── Atualizar plano ──────────────────────────────────────────────
export const updatePlan = mutation({
  args: {
    id: v.id("restaurants"),
    plan: v.union(v.literal("DIGITAL_MENU"), v.literal("RESTAURANT_SMART")),
    planStatus: v.union(
      v.literal("ACTIVE"),
      v.literal("TRIAL"),
      v.literal("CANCELLED"),
      v.literal("PAST_DUE")
    ),
    mpSubscriptionId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    return await ctx.db.patch(id, fields);
  },
});
