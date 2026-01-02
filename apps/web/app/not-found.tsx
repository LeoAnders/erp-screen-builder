import { NotFoundScreen } from "@/components/ui/not-found-screen";

/**
 * Not Found page global da aplicação.
 * Renderiza quando nenhuma rota corresponde ao caminho solicitado.
 *
 * Esta página é independente de qualquer layout e ocupa full screen.
 */
export default function GlobalNotFound() {
  return <NotFoundScreen />;
}
