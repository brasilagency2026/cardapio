"use client";

import { useQuery } from "convex/react";
import { useOrganization } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import { PlusIcon, EditIcon, Trash2Icon } from "lucide-react";

export default function MenuPage() {
  const { organization } = useOrganization();

  const restaurant = useQuery(
    api.restaurants.getByClerkOrg,
    organization?.id ? { clerkOrgId: organization.id } : "skip"
  );

  const categories = useQuery(
    api.products.listCategories,
    restaurant?._id ? { restaurantId: restaurant._id } : "skip"
  );

  const products = useQuery(
    api.products.listProducts,
    restaurant?._id ? { restaurantId: restaurant._id } : "skip"
  );

  if (!restaurant) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-6 bg-gray-100 rounded w-1/4 mb-8"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cardápio</h1>
          <p className="text-gray-500 mt-2">Gerencie as categorias e produtos do seu menu</p>
        </div>
        <button className="bg-red-500 text-white px-6 py-3 rounded-full font-medium hover:bg-red-600 transition-colors flex items-center gap-2">
          <PlusIcon className="w-5 h-5" />
          Novo Produto
        </button>
      </div>

      {/* Categorias */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Categorias</h2>
          <button className="text-red-500 hover:text-red-600 transition-colors flex items-center gap-1 text-sm">
            <PlusIcon className="w-4 h-4" />
            Adicionar Categoria
          </button>
        </div>

        {categories && categories.length > 0 ? (
          <div className="space-y-2">
            {categories.map((cat: any) => (
              <div
                key={cat._id}
                className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div>
                  <p className="font-medium text-gray-900">{cat.name}</p>
                  {cat.description && <p className="text-sm text-gray-500">{cat.description}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-400 hover:text-blue-500 transition-colors">
                    <EditIcon className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2Icon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">Nenhuma categoria criada ainda</p>
        )}
      </div>

      {/* Produtos */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Produtos</h2>

        {products && products.length > 0 ? (
          <div className="space-y-4">
            {products.map((product: any) => (
              <div
                key={product._id}
                className="flex items-start justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{product.name}</p>
                  {product.description && (
                    <p className="text-sm text-gray-500 mt-1">{product.description}</p>
                  )}
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-sm text-gray-600">
                      R$ {(product.price / 100).toFixed(2)}
                    </span>
                    {product.category && (
                      <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                        {product.category}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-400 hover:text-blue-500 transition-colors">
                    <EditIcon className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2Icon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">Nenhum produto criado ainda</p>
        )}
      </div>
    </div>
  );
}
