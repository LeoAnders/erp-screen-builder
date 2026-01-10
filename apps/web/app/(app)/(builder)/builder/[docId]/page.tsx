import { BuilderShell } from "../../_components/builder-shell";

type Props = {
  params: Promise<{ docId: string }>;
};

export default async function BuilderPage({ params }: Props) {
  const { docId } = await params;
  return <BuilderShell docId={docId} />;
}
