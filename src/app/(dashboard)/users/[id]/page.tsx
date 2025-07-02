import type { Metadata } from "next";
import UserDetailPageClient from "~/_components/UserDetailPageClient";

type Props = { params: { id: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: `Dashboard | User ${params.id}` };
}

export default function UserDetailPage({ params }: Props) {
  return <UserDetailPageClient userId={params.id} />;
}
