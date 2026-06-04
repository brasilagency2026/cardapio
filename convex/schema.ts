import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // ─── Restaurantes (tenants) ─────────────────────────────────────
  restaurants: defineTable({
    clerkOrgId: v.string(),         // Clerk Organization ID (= tenantId)
    name: v.string(),
    slug: v.string(),               // URL: foodpronto.com.br/slug
    description: v.optional(v.string()),
    logo: v.optional(v.string()),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    city: v.optional(v.string()),
    state: v.optional(v.string()),
    plan: v.union(
      v.literal("DIGITAL_MENU"),
      v.literal("RESTAURANT_SMART")
    ),
    planStatus: v.union(
      v.literal("ACTIVE"),
      v.literal("TRIAL"),
      v.literal("CANCELLED"),
      v.literal("PAST_DUE")
    ),
    trialEndsAt: v.optional(v.number()),
    mpSubscriptionId: v.optional(v.string()),
    active: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_clerkOrgId", ["clerkOrgId"]),

  // ─── Usuários ────────────────────────────────────────────────────
  users: defineTable({
    clerkUserId: v.string(),
    restaurantId: v.id("restaurants"),
    name: v.string(),
    email: v.string(),
    role: v.union(
      v.literal("OWNER"),
      v.literal("MANAGER"),
      v.literal("WAITER"),
      v.literal("KITCHEN")
    ),
    active: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_clerkUserId", ["clerkUserId"])
    .index("by_restaurant", ["restaurantId"]),

  // ─── Categorias ──────────────────────────────────────────────────
  categories: defineTable({
    restaurantId: v.id("restaurants"),
    name: v.string(),
    description: v.optional(v.string()),
    position: v.number(),
    active: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_restaurant", ["restaurantId"])
    .index("by_restaurant_position", ["restaurantId", "position"]),

  // ─── Produtos ────────────────────────────────────────────────────
  products: defineTable({
    restaurantId: v.id("restaurants"),
    categoryId: v.id("categories"),
    name: v.string(),
    description: v.optional(v.string()),
    price: v.number(),
    image: v.optional(v.string()),
    gallery: v.optional(v.array(v.string())),
    variations: v.optional(v.array(v.object({
      name: v.string(),
      price: v.number(),
    }))),
    available: v.boolean(),
    featured: v.boolean(),
    preparationTime: v.optional(v.number()),  // minutos
    allergens: v.optional(v.array(v.string())),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_restaurant", ["restaurantId"])
    .index("by_category", ["categoryId"])
    .index("by_restaurant_featured", ["restaurantId", "featured"]),

  // ─── Mesas ───────────────────────────────────────────────────────
  tables: defineTable({
    restaurantId: v.id("restaurants"),
    name: v.string(),
    number: v.number(),
    capacity: v.optional(v.number()),
    status: v.union(
      v.literal("FREE"),
      v.literal("OCCUPIED"),
      v.literal("WAITING_PAYMENT"),
      v.literal("RESERVED")
    ),
    qrCodeUrl: v.string(),
    createdAt: v.number(),
  })
    .index("by_restaurant", ["restaurantId"])
    .index("by_restaurant_number", ["restaurantId", "number"])
    .index("by_restaurant_status", ["restaurantId", "status"]),

  // ─── Comandas ────────────────────────────────────────────────────
  tabs: defineTable({
    restaurantId: v.id("restaurants"),
    tableId: v.id("tables"),
    status: v.union(
      v.literal("OPEN"),
      v.literal("WAITING_PAYMENT"),
      v.literal("PAID"),
      v.literal("CLOSED")
    ),
    openedAt: v.number(),
    closedAt: v.optional(v.number()),
    total: v.number(),
  })
    .index("by_restaurant", ["restaurantId"])
    .index("by_table", ["tableId"])
    .index("by_restaurant_status", ["restaurantId", "status"]),

  // ─── Pedidos ─────────────────────────────────────────────────────
  orders: defineTable({
    restaurantId: v.id("restaurants"),
    tableId: v.id("tables"),
    tabId: v.id("tabs"),
    status: v.union(
      v.literal("PENDING"),
      v.literal("ACCEPTED"),
      v.literal("PREPARING"),
      v.literal("READY"),
      v.literal("DELIVERED"),
      v.literal("CANCELLED")
    ),
    total: v.number(),
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_restaurant", ["restaurantId"])
    .index("by_table", ["tableId"])
    .index("by_tab", ["tabId"])
    .index("by_restaurant_status", ["restaurantId", "status"])
    .index("by_restaurant_date", ["restaurantId", "createdAt"]),

  // ─── Itens do pedido ─────────────────────────────────────────────
  orderItems: defineTable({
    orderId: v.id("orders"),
    productId: v.id("products"),
    productName: v.string(),        // snapshot nome
    quantity: v.number(),
    unitPrice: v.number(),
    subtotal: v.number(),
    notes: v.optional(v.string()),
  })
    .index("by_order", ["orderId"])
    .index("by_product", ["productId"]),

  // ─── Pagamentos ──────────────────────────────────────────────────
  payments: defineTable({
    restaurantId: v.id("restaurants"),
    tabId: v.id("tabs"),
    tableId: v.id("tables"),
    method: v.union(
      v.literal("PIX"),
      v.literal("CREDIT"),
      v.literal("DEBIT"),
      v.literal("CASH")
    ),
    amount: v.number(),
    receivedBy: v.optional(v.id("users")),
    paidAt: v.number(),
  })
    .index("by_restaurant", ["restaurantId"])
    .index("by_tab", ["tabId"])
    .index("by_restaurant_date", ["restaurantId", "paidAt"]),

  // ─── Notificações ────────────────────────────────────────────────
  notifications: defineTable({
    restaurantId: v.id("restaurants"),
    type: v.union(
      v.literal("order.created"),
      v.literal("order.accepted"),
      v.literal("order.preparing"),
      v.literal("order.ready"),
      v.literal("order.delivered"),
      v.literal("table.waiting_payment"),
      v.literal("table.freed")
    ),
    message: v.string(),
    targetRole: v.optional(v.string()),   // "KITCHEN" | "WAITER" | "ALL"
    relatedId: v.optional(v.string()),    // orderId ou tableId
    read: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_restaurant", ["restaurantId"])
    .index("by_restaurant_unread", ["restaurantId", "read"])
    .index("by_restaurant_date", ["restaurantId", "createdAt"]),
});
