import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ projectId: string; fileId: string }>;
};

export default async function ProjectFileRedirectPage({ params }: Props) {
  const { fileId } = await params;
  redirect(`/builder/${fileId}`);
}
