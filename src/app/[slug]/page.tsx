import { redirect } from "next/navigation";

export default async function RestaurantRedirectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(`/menu/${slug}/1`);
}
