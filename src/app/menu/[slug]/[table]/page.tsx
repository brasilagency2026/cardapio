"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { useParams } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import {
  ShoppingCartIcon,
  PlusIcon,
  MinusIcon,
  SearchIcon,
  StarIcon,
  ClockIcon,
  XIcon,
  SendIcon,
} from "lucide-react";

type CartItem = {
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  notes?: string;
};

export default function MenuPage() {
  const params = useParams();
  const slug = params.slug as string;
  const tableNumber = parseInt(params.table as string);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [ordering, setOrdering] = useState(false);

  // Queries
  const restaurant = useQuery(api.restaurants.getBySlug, { slug });
  const categories = useQuery(
    api.products.listCategories,
    restaurant?._id ? { restaurantId: restaurant._id } : "skip"
  );
  const products = useQuery(
    api.products.listProducts,
    restaurant?._id ? { restaurantId: restaurant._id } : "skip"
  );
  const table = useQuery(
    api.tables.getByNumber,
    restaurant?._id ? { restaurantId: restaurant._id, number: tableNumber } : "skip"
  );
  const logoUrl = useQuery(
    api.restaurants.getLogoUrl,
    restaurant?.logo ? { storageId: restaurant.logo } : "skip"
  );

  const openTab = useMutation(api.tabs.open);
  const createOrder = useMutation(api.orders.create);

  const filteredProducts = products?.filter((p) => {
    if (!p.available) return false;
    if (activeCategory && p.categoryId !== activeCategory) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const featuredProducts = products?.filter((p) => p.featured && p.available);

  function addToCart(product: any) {
    const unitPrice = product.price / 100;

    setCart((prev) => {
      const existing = prev.find((i) => i.productId === product._id);
      if (existing) {
        return prev.map((i) =>
          i.productId === product._id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [
        ...prev,
        {
          productId: product._id,
          productName: product.name,
          unitPrice,
          quantity: 1,
        },
      ];
    });
    toast.success(`${product.name} adicionado!`, { duration: 1500 });
  }

  function removeFromCart(productId: string) {
    setCart((prev) =>
      prev
        .map((i) =>
          i.productId === productId
            ? { ...i, quantity: i.quantity - 1 }
            : i
        )
        .filter((i) => i.quantity > 0)
    );
  }

  const cartTotal = cart.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  async function handleOrder() {
    if (!restaurant?._id || !table?._id || cart.length === 0) return;
    setOrdering(true);
    try {
      // Abrir/obter comanda
      const tabId = await openTab({
        restaurantId: restaurant._id,
        tableId: table._id,
      });

      // Criar pedido
      await createOrder({
        restaurantId: restaurant._id,
        tableId: table._id,
        tabId,
        items: cart.map((i) => ({
          productId: i.productId as any,
          productName: i.productName,
          quantity: i.quantity,
          unitPrice: Math.round(i.unitPrice * 100),
          notes: i.notes,
        })),
      });

      setCart([]);
      setCartOpen(false);
      toast.success("Pedido enviado para a cozinha! 🎉");
    } catch (e) {
      toast.error("Erro ao enviar pedido. Tente novamente.");
    } finally {
      setOrdering(false);
    }
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Carregando cardápio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header restaurante */}
      <div className="bg-white border-b border-gray-100 px-4 py-4 sticky top-0 z-20">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            {restaurant.logo ? (
              <img
                src={logoUrl ?? restaurant.logo}
                alt={restaurant.name}
                className="w-10 h-10 rounded-lg object-cover"
              />
            ) : (
              <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                {restaurant.name.charAt(0)}
              </div>
            )}
            <div>
              <h1 className="font-semibold text-gray-900">{restaurant.name}</h1>
              {restaurant.plan === "RESTAURANT_SMART" && tableNumber > 0 && (
                <p className="text-xs text-gray-400">Mesa {tableNumber}</p>
              )}
            </div>
          </div>
          {/* Busca */}
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar no cardápio..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-200"
            />
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4">
        {/* Categorias */}
        {categories && categories.length > 0 && (
          <div className="flex gap-2 overflow-x-auto py-4 scrollbar-hide">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap font-medium transition-colors ${
                !activeCategory
                  ? "bg-red-500 text-white"
                  : "bg-white border border-gray-200 text-gray-600"
              }`}
            >
              Todos
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => setActiveCategory(cat._id)}
                className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap font-medium transition-colors ${
                  activeCategory === cat._id
                    ? "bg-red-500 text-white"
                    : "bg-white border border-gray-200 text-gray-600"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {/* Destaques */}
        {!activeCategory && !search && featuredProducts && featuredProducts.length > 0 && (
          <section className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <StarIcon className="w-4 h-4 text-amber-400 fill-amber-400" />
              <h2 className="font-semibold text-gray-900">Destaques</h2>
            </div>
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
              {featuredProducts.map((p) => (
                <FeaturedCard key={p._id} product={p} onAdd={addToCart} />
              ))}
            </div>
          </section>
        )}

        {/* Produtos */}
        {categories?.map((cat) => {
          const catProducts = filteredProducts?.filter(
            (p) => p.categoryId === cat._id
          );
          if (!catProducts || catProducts.length === 0) return null;
          return (
            <section key={cat._id} className="mb-6">
              <h2 className="font-semibold text-gray-900 mb-3">{cat.name}</h2>
              <div className="space-y-3">
                {catProducts.map((p) => (
                  <ProductRow key={p._id} product={p} onAdd={addToCart} />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {/* Botão carrinho flutuante */}
      {cartCount > 0 && (
        <div className="fixed bottom-6 left-0 right-0 px-4 z-30">
          <button
            onClick={() => setCartOpen(true)}
            className="w-full max-w-2xl mx-auto block bg-red-500 text-white rounded-2xl py-4 px-5 flex items-center justify-between shadow-xl shadow-red-200"
          >
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-xs font-bold">
                {cartCount}
              </div>
              <span className="font-medium">Ver pedido</span>
            </div>
            <span className="font-semibold">{formatCurrency(cartTotal)}</span>
          </button>
        </div>
      )}

      {/* Modal carrinho */}
      {cartOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-end">
          <div className="bg-white w-full max-w-2xl mx-auto rounded-t-3xl p-5 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900 text-lg">Seu pedido</h2>
              <button
                onClick={() => setCartOpen(false)}
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
              >
                <XIcon className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 mb-6">
              {cart.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center justify-between"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">
                      {item.productName}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatCurrency(item.unitPrice)} cada
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => removeFromCart(item.productId)}
                      className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center"
                    >
                      <MinusIcon className="w-3 h-3" />
                    </button>
                    <span className="text-sm font-medium w-4 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        addToCart({
                          _id: item.productId,
                          name: item.productName,
                          price: item.unitPrice * 100,
                        })
                      }
                      className="w-7 h-7 bg-red-500 rounded-full flex items-center justify-center"
                    >
                      <PlusIcon className="w-3 h-3 text-white" />
                    </button>
                    <span className="text-sm font-semibold text-gray-900 min-w-[60px] text-right">
                      {formatCurrency(item.unitPrice * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-4 mb-4">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">Total</span>
                <span className="font-bold text-xl text-gray-900">
                  {formatCurrency(cartTotal)}
                </span>
              </div>
            </div>

            <button
              onClick={handleOrder}
              disabled={ordering}
              className="w-full bg-red-500 text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {ordering ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <SendIcon className="w-5 h-5" />
              )}
              {ordering ? "Enviando..." : "Enviar pedido para a cozinha"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function FeaturedCard({ product, onAdd }: { product: any; onAdd: (p: any) => void }) {
  return (
    <div className="min-w-[160px] bg-white rounded-2xl border border-gray-100 overflow-hidden">
      {product.image ? (
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-24 object-cover"
        />
      ) : (
        <div className="w-full h-24 bg-gray-100 flex items-center justify-center text-4xl">
          🍽️
        </div>
      )}
      <div className="p-3">
        <p className="text-sm font-medium text-gray-800 line-clamp-1">{product.name}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-red-500 font-semibold text-sm">
            {formatCurrency(product.price / 100)}
          </span>
          <button
            onClick={() => onAdd(product)}
            className="w-7 h-7 bg-red-500 rounded-full flex items-center justify-center"
          >
            <PlusIcon className="w-3.5 h-3.5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}

function ProductRow({ product, onAdd }: { product: any; onAdd: (p: any) => void }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-4">
      {product.image ? (
        <img
          src={product.image}
          alt={product.name}
          className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
        />
      ) : (
        <div className="w-20 h-20 rounded-xl bg-gray-100 flex items-center justify-center text-3xl flex-shrink-0">
          🍽️
        </div>
      )}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-gray-900">{product.name}</h3>
        {product.description && (
          <p className="text-sm text-gray-400 mt-0.5 line-clamp-2">
            {product.description}
          </p>
        )}
        {product.preparationTime && (
          <div className="flex items-center gap-1 mt-1">
            <ClockIcon className="w-3 h-3 text-gray-400" />
            <span className="text-xs text-gray-400">{product.preparationTime} min</span>
          </div>
        )}
        <div className="flex items-center justify-between mt-2">
          <span className="font-bold text-red-500">{formatCurrency(product.price / 100)}</span>
          <button
            onClick={() => onAdd(product)}
            className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center"
          >
            <PlusIcon className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
