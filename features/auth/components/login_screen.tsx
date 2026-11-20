import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "@/components/layout/theme_toggle";
import { focusRing } from "@/components/ui/styles";
import { cn } from "@/lib/cn";
import { LoginBrandPanel } from "./login_brand_panel";
import { LoginForm, type LoginFormProps } from "./login_form";

export type LoginScreenProps = LoginFormProps;

/** Full sign-in screen: brand panel on the left (desktop), form on the right. */
export function LoginScreen(props: LoginScreenProps) {
  return (
    <div className="grid min-h-screen w-full bg-white font-sans text-zinc-950 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] dark:bg-zinc-950 dark:text-zinc-50">
      <LoginBrandPanel />

      <main className="flex min-h-screen flex-col px-4 py-6 sm:px-10">
        <div className="flex items-center justify-between">
          <Link href="/" aria-label="ImmoAsk Business — accueil" className={cn("rounded-xl", focusRing)}>
            <Image
              src="/images/immoask_business_logo.png"
              alt=""
              width={1613}
              height={770}
              sizes="150px"
              preload
              className="h-auto w-36 sm:w-40"
            />
          </Link>
          <ThemeToggle />
        </div>

        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-sm">
            <h1 className="text-3xl font-bold tracking-tight">Bon retour 👋</h1>
            <p className="mt-2 text-zinc-500 dark:text-zinc-400">
              Connectez-vous pour suivre vos loyers, vos biens et vos versements.
            </p>

            <div className="mt-8">
              <LoginForm {...props} />
            </div>

            <p className="mt-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
              Pas encore de compte ?{" "}
              <Link
                href="/#formules"
                className={cn("rounded font-semibold text-brand-700 hover:underline dark:text-brand-100", focusRing)}
              >
                Découvrir les formules
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
