import { redirect } from "next/navigation";

export default async function RestaurantRedirectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  // 0 = lien général (consultation uniquement, sans commande)
  redirect(`/menu/${slug}/0`);
}
