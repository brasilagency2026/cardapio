import { redirect } from "next/navigation";

export default function RestaurantRedirectPage({
  params,
}: {
  params: { slug: string };
}) {
  redirect(`/menu/${params.slug}/1`);
}
