import { redirect } from "next/navigation";

type PageProps = {
  params: {
    slug: string;
  };
};

export default function RestaurantRedirectPage({ params }: PageProps) {
  const { slug } = params;
  redirect(`/menu/${slug}/1`);
}
