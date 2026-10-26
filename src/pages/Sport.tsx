import { useState } from 'react'
import { useAppSelector } from '../app/hooks'
import Art from '../components/Art'
import CartoonHero from '../components/CartoonHero'
import { ChevronRightIcon } from '../components/Icons'
import { SPORT_CHANNELS, mainEvents, sportSections, weekEvents } from '../data/sport'
import type { SportEvent } from '../data/sport'
import { useT } from '../i18n'
import type { TKey } from '../i18n'
import { artStyle } from '../lib/format'
import { useSportImage } from '../lib/images'

function EventCard({ event, tall = false }: { event: SportEvent; tall?: boolean }) {
  const t = useT()
  const photo = useSportImage(event.sport, event.id)
  return (
    <article className={tall ? 'event event-tall' : 'event'}>
      <div className="event-art" style={artStyle(event.hue)} role="img" aria-label={t(`sport.${artKey(event.sport)}` as TKey)}>
        <Art src={photo} className="event-photo" fallback={<span>{SPORT_EMOJI[event.sport]}</span>} />
      </div>
      <h3>{event.title}</h3>
      <p className="muted small">{event.when}</p>
    </article>
  )
}

const SPORT_EMOJI: Record<SportEvent['sport'], string> = {
  football: '⚽',
  basketball: '🏀',
  tennis: '🎾',
  volleyball: '🏐',
  racing: '🏎️',
  combat: '🥊',
}
const artKey = (s: SportEvent['sport']) => (s === 'volleyball' || s === 'racing' ? 'title' : s)

function EventRow({ title, events, expandable = false, tall = false, cols = 4 }: {
  title: string
  events: SportEvent[]
  expandable?: boolean
  tall?: boolean
  cols?: 3 | 4
}) {
  const t = useT()
  const [all, setAll] = useState(false)
  const canExpand = expandable && events.length > cols
  const shown = all ? events : events.slice(0, expandable ? cols : events.length)

  return (
    <section className="section" aria-label={title}>
      <div className="section-head">
        <h2>{title}</h2>
        {canExpand && (
          <button type="button" className="pill" aria-expanded={all} onClick={() => setAll((v) => !v)}>
            {all ? t('sport.showLess') : t('common.all')}
            <ChevronRightIcon size={14} strokeWidth={2.4} />
          </button>
        )}
      </div>
      <div className={all ? 'events events-wrap' : `events events-${cols}`}>
        {shown.map((e) => (
          <EventCard key={e.id} event={e} tall={tall} />
        ))}
      </div>
    </section>
  )
}

export default function Sport() {
  const t = useT()
  const lang = useAppSelector((s) => s.ui.lang)
  const sections = sportSections(lang)

  return (
    <>
      <h1 className="sr-only">{t('sport.title')}</h1>
      <CartoonHero image="sport.webp" />
      <EventRow title={t('sport.mainEvents')} events={mainEvents(lang)} />
      <EventRow title={t('sport.weekEvents')} events={weekEvents(lang)} tall />

      <section className="section" aria-label={t('sport.channels')}>
        <div className="section-head">
          <h2>{t('sport.channels')}</h2>
        </div>
        <ul className="sport-channels">
          {SPORT_CHANNELS.map((c) => (
            <li key={c.id} className={`sport-channel ${c.cls}`}>
              <img src={`${import.meta.env.BASE_URL}sport/ch/${c.id}.webp`} alt={c.name} loading="lazy" />
            </li>
          ))}
        </ul>
      </section>

      {sections.map((s) => (
        <EventRow
          key={s.key}
          title={t(`sport.${s.key}` as TKey)}
          events={s.events}
          expandable
          cols={s.key === 'tennis' ? 3 : 4}
        />
      ))}
    </>
  )
}
