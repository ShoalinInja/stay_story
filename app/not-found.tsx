import Link from "next/link";
import { getAreas, getCategories } from "@/lib/content";
import { SearchBar } from "@/components/home/SearchBar";
import { UI } from "@/components/layout/copy";
import { areaSearchOptions } from "@/components/layout/search-options";

export default async function NotFound() {
  const [categories, areas] = await Promise.all([getCategories(), getAreas()]);
  const t = UI.notFound;
  return (
    <main id="main" className="container-site section-y flex flex-col items-center gap-8 text-center">
      <div className="flex max-w-xl flex-col gap-3">
        <p className="type-meta font-semibold text-brand-strong">404</p>
        <h1 className="type-h1">{t.title}</h1>
        <p className="type-body text-ink-2">{t.body}</p>
      </div>
      <SearchBar options={areaSearchOptions(areas)} className="w-full max-w-3xl" />
      <section aria-labelledby="nf-categories" className="w-full max-w-3xl">
        <h2 id="nf-categories" className="mb-4 type-h2">{t.categories}</h2>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <li key={c.key}>
              <Link href={`/${c.slug}`} className="flex h-full flex-col gap-1 rounded-card border border-line-soft bg-surface p-4 text-left shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover">
                <span className="type-h3 text-ink">{c.title}</span>
                <span className="type-meta">{c.tagline}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <Link href="/" className="font-semibold text-brand-strong underline-offset-4 hover:underline">{t.home}</Link>
    </main>
  );
}
