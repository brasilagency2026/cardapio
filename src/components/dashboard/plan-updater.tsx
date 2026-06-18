"use client";

import { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { useSearchParams } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

const planMap: Record<string, "DIGITAL_MENU" | "RESTAURANT_SMART"> = {
  digital: "DIGITAL_MENU",
  completo: "RESTAURANT_SMART",
};

export function PlanUpdater({
  restaurantId,
  currentPlan,
}: {
  restaurantId?: string;
  currentPlan?: "DIGITAL_MENU" | "RESTAURANT_SMART";
}) {
  const searchParams = useSearchParams();
  const [planUpdated, setPlanUpdated] = useState(false);
  const updatePlan = useMutation(api.restaurants.updatePlan);

  const planParam = searchParams.get("plano");
  const targetPlan = planParam ? planMap[planParam] : null;

  useEffect(() => {
    if (!restaurantId || !targetPlan || planUpdated) return;
    if (currentPlan === targetPlan) {
      // Plan already correct, just remove the param
      window.history.replaceState({}, "", "/dashboard");
      return;
    }

    const updateRestaurantPlan = async () => {
      try {
        await updatePlan({
          id: restaurantId as any,
          plan: targetPlan,
          planStatus: "TRIAL",
        });
        setPlanUpdated(true);
        toast.success(
          targetPlan === "RESTAURANT_SMART"
            ? "Bem-vindo ao plano Gestão Completa! 🎉"
            : "Plano atualizado para Cardápio Digital"
        );
        // Clean up URL
        window.history.replaceState({}, "", "/dashboard");
      } catch (error) {
        console.error("Erro ao atualizar plano:", error);
        toast.error("Erro ao atualizar plano. Tente novamente.");
      }
    };

    updateRestaurantPlan();
  }, [restaurantId, targetPlan, currentPlan, planUpdated, updatePlan]);

  return null;
}
