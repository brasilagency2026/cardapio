"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { useOrganization } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import { PlusIcon, EditIcon, Trash2Icon, XIcon } from "lucide-react";

export default function MenuPage() {
  const { organization } = useOrganization();
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [categoryForm, setCategoryForm] = useState({ name: "", description: "" });
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    image: null as File | null,
    imagePreview: "",
    variations: [] as { name: string; price: string }[],
    variationName: "",
    variationPrice: "",
  });

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

  const createCategory = useMutation(api.products.createCategory);
  const createProduct = useMutation(api.products.createProduct);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!restaurant?._id || !categoryForm.name) return;

    try {
      const maxPosition = categories?.length ?? 0;
      await createCategory({
        restaurantId: restaurant._id,
        name: categoryForm.name,
        description: categoryForm.description || undefined,
        position: maxPosition,
      });
      setCategoryForm({ name: "", description: "" });
      setShowCategoryModal(false);
    } catch (error) {
      console.error("Erro ao criar categoria:", error);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!restaurant?._id || !productForm.name || !productForm.categoryId || !productForm.price) return;

    try {
      let imageUrl = undefined;
      
      // Upload image if provided
      if (productForm.image) {
        const formData = new FormData();
        formData.append('file', productForm.image);
        
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (uploadRes.ok) {
          const { url } = await uploadRes.json();
          imageUrl = url;
        }
      }

      // Convert variations to API format
      const variationsData = productForm.variations.map((v) => ({
        name: v.name,
        price: Math.round(parseFloat(v.price) * 100),
      }));

      await createProduct({
        restaurantId: restaurant._id,
        categoryId: productForm.categoryId as any,
        name: productForm.name,
        description: productForm.description || undefined,
        price: Math.round(parseFloat(productForm.price) * 100),
        image: imageUrl,
        variations: variationsData.length > 0 ? variationsData : undefined,
      });
      
      setProductForm({
        name: "",
        description: "",
        price: "",
        categoryId: "",
        image: null,
        imagePreview: "",
        variations: [],
        variationName: "",
        variationPrice: "",
      });
      setShowProductModal(false);
    } catch (error) {
      console.error("Erro ao criar produto:", error);
    }
  };

  const handleAddVariation = () => {
    if (!productForm.variationName || !productForm.variationPrice) return;
    
    const newVariations = [
      ...productForm.variations,
      {
        name: productForm.variationName,
        price: productForm.variationPrice,
      },
    ];
    
    setProductForm({
      ...productForm,
      variations: newVariations,
      variationName: "",
      variationPrice: "",
    });
  };

  const handleRemoveVariation = (index: number) => {
    setProductForm({
      ...productForm,
      variations: productForm.variations.filter((_, i) => i !== index),
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProductForm({
        ...productForm,
        image: file,
        imagePreview: URL.createObjectURL(file),
      });
    }
  };

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
        <button
          onClick={() => setShowProductModal(true)}
          className="bg-red-500 text-white px-6 py-3 rounded-full font-medium hover:bg-red-600 transition-colors flex items-center gap-2"
        >
          <PlusIcon className="w-5 h-5" />
          Novo Produto
        </button>
      </div>

      {/* Categorias */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Categorias</h2>
          <button
            onClick={() => setShowCategoryModal(true)}
            className="text-red-500 hover:text-red-600 transition-colors flex items-center gap-1 text-sm"
          >
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
                <div className="flex gap-4 flex-1">
                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                    />
                  )}
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
                          {product.category.name}
                        </span>
                      )}
                    </div>
                    {product.variations && product.variations.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {product.variations.map((v: any, idx: number) => (
                          <span
                            key={idx}
                            className="inline-block px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs"
                          >
                            {v.name} - R$ {(v.price / 100).toFixed(2)}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
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

      {/* Modal Adicionar Categoria */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Adicionar Categoria</h3>
              <button
                onClick={() => setShowCategoryModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome *</label>
                <input
                  type="text"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Ex: Pizzas"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
                <textarea
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Ex: Nossas deliciosas pizzas"
                  rows={3}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                >
                  Adicionar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Adicionar Produto */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Novo Produto</h3>
              <button
                onClick={() => setShowProductModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Categoria *</label>
                <select
                  value={productForm.categoryId}
                  onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                >
                  <option value="">Selecione uma categoria</option>
                  {categories?.map((cat: any) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome *</label>
                <input
                  type="text"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Ex: Pizza Margherita"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
                <textarea
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Descreva seu produto..."
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preço Padrão (R$) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={productForm.price}
                  onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Ex: 25.90"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Foto do Produto</label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  {productForm.imagePreview && (
                    <div className="mt-3 relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={productForm.imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Variações */}
              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-3">Tamanhos/Variações</h4>
                
                {productForm.variations.length > 0 && (
                  <div className="space-y-2 mb-4">
                    {productForm.variations.map((variation, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{variation.name}</p>
                          <p className="text-xs text-gray-500">R$ {parseFloat(variation.price).toFixed(2)}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveVariation(index)}
                          className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2Icon className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Ex: Pequena"
                    value={productForm.variationName}
                    onChange={(e) => setProductForm({ ...productForm, variationName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Preço (R$)"
                    value={productForm.variationPrice}
                    onChange={(e) => setProductForm({ ...productForm, variationPrice: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={handleAddVariation}
                    className="w-full px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                  >
                    Adicionar Variação
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                >
                  Criar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
