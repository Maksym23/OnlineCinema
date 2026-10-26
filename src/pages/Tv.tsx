import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAppSelector } from '../app/hooks'
import Art from '../components/Art'
import Breadcrumbs from '../components/Breadcrumbs'
import { HeartIcon } from '../components/Icons'
import VideoPlayer from '../components/VideoPlayer'
import { getChannels, guideFor, minutesLeft, showsFor } from '../data/tv'
import type { Channel } from '../data/tv'
import { useT } from '../i18n'
import { sampleVideoFor } from '../lib/catalog'
import { artStyle, hash } from '../lib/format'
import { useChannelLogo } from '../lib/images'
import { load, save } from '../lib/storage'

type Tab = 'channels' | 'guide'
type Filter = 'all' | 'free' | 'news'

const FAV_KEY = 'starlicht_tv_favs'
// година «зараз» для підсвічування поточної передачі в програмі (фіксується при завантаженні)
const START_HOUR = new Date().getHours()

function Logo({ channel, size = 'sm' }: { channel: Channel; size?: 'sm' | 'lg' }) {
  const remote = useChannelLogo(channel.wiki)
  const logo = channel.logo ?? remote
  return (
    <span className={`tv-logo tv-logo-${size}${logo ? ' has-img' : ''}`} style={logo ? undefined : artStyle(channel.hue)} aria-hidden="true">
      <Art src={logo} fallback={channel.badge} />
    </span>
  )
}

export default function Tv() {
  const t = useT()
  const lang = useAppSelector((s) => s.ui.lang)
  const [params, setParams] = useSearchParams()
  const [tab, setTab] = useState<Tab>('channels')
  const [filter, setFilter] = useState<Filter>('all')
  const [favOnly, setFavOnly] = useState(false)
  const [favs, setFavs] = useState<string[]>(() => load<string[]>(FAV_KEY, []))

  const channels = useMemo(() => getChannels(lang), [lang])
  const current = channels.find((c) => c.id === params.get('channel')) ?? channels[0]

  const visible = channels.filter(
    (c) =>
      (filter === 'all' || (filter === 'free' ? c.free : c.category === 'news')) && (!favOnly || favs.includes(c.id)),
  )

  const toggleFav = (id: string) => {
    const next = favs.includes(id) ? favs.filter((x) => x !== id) : [...favs, id]
    setFavs(next)
    save(FAV_KEY, next)
  }
  const select = (id: string) => setParams({ channel: id }, { replace: true })

  const shows = showsFor(current, lang)
  const guide = guideFor(current, lang, START_HOUR)
  const filters: { key: Filter; label: string }[] = [
    { key: 'all', label: t('common.all') },
    { key: 'free', label: t('tv.free') },
    { key: 'news', label: t('tv.news') },
  ]

  return (
    <>
      <Breadcrumbs items={[{ label: t('crumb.home'), to: '/' }, { label: t('tv.title') }]} />
      <h1 className="sr-only">{t('tv.title')}</h1>

      <section className="tv-stage">
        <div className="tv-player">
          <VideoPlayer key={current.id} src={sampleVideoFor(hash(current.id))} title={current.name} />
          <p className="muted small tv-note">{t('tv.demoNote')}</p>
        </div>

        <aside className="tv-side" aria-label={t('tv.channelList')}>
          <div className="tv-tabs">
            <button type="button" className={tab === 'channels' ? 'chip chip-white on' : 'chip chip-white'} aria-pressed={tab === 'channels'} onClick={() => setTab('channels')}>
              {t('tv.tabChannels')}
            </button>
            <button type="button" className={tab === 'guide' ? 'chip chip-white on' : 'chip chip-white'} aria-pressed={tab === 'guide'} onClick={() => setTab('guide')}>
              {t('tv.tabGuide')}
            </button>
            <button
              type="button"
              className={favOnly ? 'round-btn on' : 'round-btn'}
              aria-pressed={favOnly}
              aria-label={t('tv.favOnly')}
              title={t('tv.favOnly')}
              onClick={() => setFavOnly((v) => !v)}
            >
              <HeartIcon size={16} filled={favOnly} />
            </button>
          </div>

          {tab === 'channels' ? (
            <>
              <div className="tv-filters" role="group">
                {filters.map((f) => (
                  <button key={f.key} type="button" className={filter === f.key ? 'chip chip-white on' : 'chip chip-white'} aria-pressed={filter === f.key} onClick={() => setFilter(f.key)}>
                    {f.label}
                  </button>
                ))}
              </div>
              <ul className="tv-list">
                {visible.length === 0 && <li className="muted small tv-empty">{t('tv.empty')}</li>}
                {visible.map((c) => {
                  const isFav = favs.includes(c.id)
                  return (
                    <li key={c.id} className={c.id === current.id ? 'tv-item on' : 'tv-item'}>
                      <button type="button" className="tv-pick" aria-current={c.id === current.id} onClick={() => select(c.id)}>
                        <Logo channel={c} />
                        <span className="tv-meta">
                          <strong>{c.name}</strong>
                          <span className="muted small">
                            {t('tv.onAir', { title: showsFor(c, lang)[0].title, n: minutesLeft(c) })}
                          </span>
                        </span>
                      </button>
                      <button
                        type="button"
                        className={isFav ? 'round-btn sm on' : 'round-btn sm'}
                        aria-pressed={isFav}
                        aria-label={isFav ? t('tv.removeFav') : t('tv.addFav')}
                        title={isFav ? t('tv.removeFav') : t('tv.addFav')}
                        onClick={() => toggleFav(c.id)}
                      >
                        <HeartIcon size={14} filled={isFav} />
                      </button>
                    </li>
                  )
                })}
              </ul>
            </>
          ) : (
            <>
              <h2 className="tv-guide-title">{t('tv.guideFor', { name: current.name })}</h2>
              <ol className="tv-guide">
                {guide.map((g) => (
                  <li key={g.time} className={g.live ? 'live' : ''}>
                    <time>{g.time}</time>
                    <span>{g.title}</span>
                    {g.live && <em>{t('tv.now')}</em>}
                  </li>
                ))}
              </ol>
            </>
          )}
        </aside>
      </section>

      <div className="tv-info">
        <article>
          <header className="tv-head">
            <Logo channel={current} size="lg" />
            <div>
              <h2>{current.name}</h2>
              <p className="muted small">{current.genre}</p>
            </div>
          </header>
          <p>{current.about}</p>
          <ul className="tv-bullets">
            <li>{t('tv.watchOnline', { name: current.name })}</li>
            <li>{t('tv.popular', { name: current.name })}</li>
          </ul>
          <h3>{t('tv.howTo', { name: current.name })}</h3>
          <p>{t('tv.howToText', { name: current.name })}</p>
        </article>

        <section aria-label={t('tv.shows')}>
          <h2>{t('tv.shows')}</h2>
          <ul className="tv-shows">
            {shows.map((s, i) => (
              <li key={s.title}>
                {s.img ? (
                  <img className="show-art" src={`${import.meta.env.BASE_URL}shows/${s.img}`} alt="" loading="lazy" />
                ) : (
                  <span className="show-art" style={artStyle((current.hue + i * 47) % 360)} aria-hidden="true" />
                )}
                <div>
                  <strong>{s.title}</strong>
                  <p className="muted small">{s.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  )
}
