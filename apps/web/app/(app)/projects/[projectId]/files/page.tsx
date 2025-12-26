type Props = {
  params: { projectId: string };
};

export default function ProjectFilesPage({ params }: Props) {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold">Arquivos do Projeto</h1>
      <p className="text-muted-foreground">
        Página de arquivos para o projeto.
      </p>
    </div>
  );
}
