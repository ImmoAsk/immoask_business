import { Icon, type IconName } from "@/components/ui/icon";

const highlights: { icon: IconName; title: string; text: string }[] = [
  {
    icon: "cash",
    title: "Loyers suivis en temps réel",
    text: "Mobile money, virements et espèces réunis au même endroit.",
  },
  {
    icon: "bank",
    title: "Versements transparents",
    text: "Chaque reversement au propriétaire est tracé et justifié.",
  },
  {
    icon: "receipt",
    title: "Fiscalité et comptabilité prêtes",
    text: "Précompte OTR et journal des recettes générés chaque mois.",
  },
];

/** Left side of the sign-in screen (hidden on small screens). */
export function LoginBrandPanel() {
  return (
    <aside className="relative hidden overflow-hidden bg-linear-to-br from-brand-900 via-brand-700 to-brand-500 p-12 text-white lg:flex lg:flex-col lg:justify-between xl:p-16">
      {/* Soft decorative shapes */}
      <div aria-hidden="true" className="absolute -top-32 -right-32 size-96 rounded-full bg-white/10 blur-3xl" />
      <div aria-hidden="true" className="absolute -bottom-40 -left-24 size-[28rem] rounded-full bg-brand-500/40 blur-3xl" />

      <p className="relative text-sm font-semibold tracking-[0.2em] text-white/70 uppercase">ImmoAsk Business</p>

      <div className="relative max-w-lg">
        <h2 className="text-4xl leading-tight font-bold tracking-tight xl:text-5xl">
          Votre patrimoine, géré avec sérénité.
        </h2>
        <p className="mt-5 text-lg text-white/80">
          La gestion locative pensée pour les propriétaires, la diaspora et les professionnels de l&apos;immobilier.
        </p>

        <ul className="mt-10 flex flex-col gap-5">
          {highlights.map((item) => (
            <li key={item.title} className="flex gap-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/20">
                <Icon name={item.icon} className="size-5" />
              </span>
              <span>
                <span className="block font-semibold">{item.title}</span>
                <span className="block text-sm text-white/75">{item.text}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      <p className="relative text-sm text-white/60">© ImmoAsk · Lomé, Togo</p>
    </aside>
  );
}
