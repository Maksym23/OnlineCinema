import { useT } from '../i18n'

/** Банер каталогу мультфільмів: готове зображення з макета (текст у картинці). */
export default function CartoonHero({ image = 'cartoons.webp' }: { image?: string }) {
  const t = useT()
  return (
    <section className="cartoon-hero" aria-label={t('hero.line2')}>
      <img
        src={`${import.meta.env.BASE_URL}hero/${image}`}
        alt={`${t('hero.line1')} ${t('hero.line2')}`}
        fetchPriority="high"
      />
    </section>
  )
}
