import { LayoutTemplate } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  onGoogleSignIn: () => Promise<void>;
};

export function LoginForm({ onGoogleSignIn }: Props) {
  return (
    <div className="relative z-10 flex w-full max-w-sm flex-col items-center gap-10 p-8 animate-login-in">
      <div className="flex flex-col items-center gap-6">
        <div className="group relative flex size-16 items-center justify-center">
          <div className="absolute inset-0 rounded-2xl bg-white/5 blur-xl transition-all duration-500 group-hover:bg-white/10" />
          <div className="relative flex size-16 items-center justify-center rounded-2xl border border-white/10 bg-linear-to-b from-white/10 to-transparent shadow-2xl backdrop-blur-md transition-transform duration-500 group-hover:scale-105 group-hover:rotate-3 group-hover:border-white/20">
            <LayoutTemplate
              className="size-7 text-white/90"
              strokeWidth={1.5}
            />
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-3xl font-medium tracking-tighter text-white">
            ERP <span className="text-zinc-500">Builder</span>
          </h1>
          <p className="text-xs font-mono uppercase tracking-wide text-zinc-500">
            Ambiente de Desenvolvimento
          </p>
        </div>
      </div>

      <form action={onGoogleSignIn} className="w-full space-y-5">
        <Button
          type="submit"
          className="group relative h-14 w-full justify-center gap-4 overflow-hidden rounded-xl bg-white text-base font-medium text-black transition-all duration-300 hover:-translate-y-0.5 hover:bg-zinc-200 hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.15)]"
        >
          <div className="relative z-10 flex items-center gap-3">
            <svg
              viewBox="0 0 24 24"
              className="size-5 transition-transform duration-300 group-hover:scale-110"
              aria-hidden="true"
              focusable="false"
            >
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span>Entrar com Google</span>
          </div>

          <div className="absolute inset-0 z-0 -translate-x-full bg-linear-to-r from-transparent via-white/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-hover:animate-shimmer" />
        </Button>

        <div className="flex items-center justify-center border-t border-zinc-900 pt-4 text-[10px] font-mono text-zinc-600">
          <span>v1.0.0-alpha</span>
        </div>
      </form>
    </div>
  );
}
