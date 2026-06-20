import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ═══════════════════════════════════════════════════════
// CATEGORIAS
// ═══════════════════════════════════════════════════════

export const listCategories = query({
  args: { restaurantId: v.id("restaurants") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("categories")
      .withIndex("by_restaurant_position", (q) =>
        q.eq("restaurantId", args.restaurantId)
      )
      .filter((q) => q.eq(q.field("active"), true))
      .collect();
  },
});

export const listAllCategories = query({
  args: { restaurantId: v.id("restaurants") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("categories")
      .withIndex("by_restaurant", (q) =>
        q.eq("restaurantId", args.restaurantId)
      )
      .collect();
  },
});

export const createCategory = mutation({
  args: {
    restaurantId: v.id("restaurants"),
    name: v.string(),
    description: v.optional(v.string()),
    position: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("categories", {
      ...args,
      active: true,
      createdAt: Date.now(),
    });
  },
});

export const updateCategory = mutation({
  args: {
    id: v.id("categories"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    position: v.optional(v.number()),
    active: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    return await ctx.db.patch(id, fields);
  },
});

export const deleteCategory = mutation({
  args: { id: v.id("categories") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});

// ═══════════════════════════════════════════════════════
// PRODUTOS
// ═══════════════════════════════════════════════════════

export const listProducts = query({
  args: { restaurantId: v.id("restaurants") },
  handler: async (ctx, args) => {
    const products = await ctx.db
      .query("products")
      .withIndex("by_restaurant", (q) =>
        q.eq("restaurantId", args.restaurantId)
      )
      .collect();

    // Enriquecer com categoria e URL da imagem
    return await Promise.all(
      products.map(async (p) => {
        const category = await ctx.db.get(p.categoryId);
        let imageUrl = p.image ?? null;
        // Se a imagem for um storageId do Convex (não começa com http/data)
        if (p.image && !p.image.startsWith("http") && !p.image.startsWith("data:")) {
          imageUrl = await ctx.storage.getUrl(p.image as any) ?? null;
        }
        return { ...p, image: imageUrl, category };
      })
    );
  },
});

export const listProductsByCategory = query({
  args: { categoryId: v.id("categories") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("products")
      .withIndex("by_category", (q) => q.eq("categoryId", args.categoryId))
      .filter((q) => q.eq(q.field("available"), true))
      .collect();
  },
});

export const listFeatured = query({
  args: { restaurantId: v.id("restaurants") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("products")
      .withIndex("by_restaurant_featured", (q) =>
        q.eq("restaurantId", args.restaurantId).eq("featured", true)
      )
      .filter((q) => q.eq(q.field("available"), true))
      .collect();
  },
});

export const createProduct = mutation({
  args: {
    restaurantId: v.id("restaurants"),
    categoryId: v.id("categories"),
    name: v.string(),
    description: v.optional(v.string()),
    price: v.number(),
    image: v.optional(v.string()),
    preparationTime: v.optional(v.number()),
    allergens: v.optional(v.array(v.string())),
    variations: v.optional(v.array(v.object({
      name: v.string(),
      price: v.number(),
    }))),
    featured: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("products", {
      ...args,
      available: true,
      featured: args.featured ?? false,
      variations: args.variations ?? [],
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateProduct = mutation({
  args: {
    id: v.id("products"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    price: v.optional(v.number()),
    image: v.optional(v.string()),
    available: v.optional(v.boolean()),
    featured: v.optional(v.boolean()),
    preparationTime: v.optional(v.number()),
    allergens: v.optional(v.array(v.string())),
    variations: v.optional(v.array(v.object({
      name: v.string(),
      price: v.number(),
    }))),
    categoryId: v.optional(v.id("categories")),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    return await ctx.db.patch(id, { ...fields, updatedAt: Date.now() });
  },
});

export const deleteProduct = mutation({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});
