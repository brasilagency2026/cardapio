"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

/**
 * Hook para upload de imagens usando Convex File Storage.
 * Retorna uma função uploadImage(file) que:
 *  1. Obtém a URL de upload do Convex
 *  2. Faz POST do arquivo diretamente
 *  3. Retorna o storageId (ex: "kg2abc123...")
 */
export function useConvexUpload() {
  const generateUploadUrl = useMutation(api.restaurants.generateUploadUrl);

  async function uploadImage(file: File): Promise<string> {
    if (file.size > 5 * 1024 * 1024) {
      throw new Error("Arquivo muito grande. Máximo 5MB.");
    }

    // 1. Pedir URL de upload ao Convex
    const uploadUrl = await generateUploadUrl();

    // 2. Fazer upload direto
    const res = await fetch(uploadUrl, {
      method: "POST",
      headers: { "Content-Type": file.type },
      body: file,
    });

    if (!res.ok) {
      throw new Error("Erro ao enviar imagem para o Convex.");
    }

    const { storageId } = await res.json();
    return storageId as string;
  }

  return { uploadImage };
}
