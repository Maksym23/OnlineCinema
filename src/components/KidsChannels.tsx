import { Link } from 'react-router-dom'
import { useAppSelector } from '../app/hooks'
import { getKidsChannels } from '../data/tv'
import { useT } from '../i18n'
import { useChannelLogo } from '../lib/images'
import type { Channel } from '../data/tv'
import Art from './Art'
import { ChevronRightIcon } from './Icons'

/** Фон плитки — фірмовий колір каналу, як на макеті. */
const BRAND: Record<string, { bg: string; fg: string }> = {
  plusplus: { bg: '#ffd21a', fg: '#1a1b3a' },
  nickelodeon: { bg: '#5b2a86', fg: '#fff' },
  disney: { bg: '#ffffff', fg: '#113ccf' },
  cbeebies: { bg: '#0a58c9', fg: '#ffe14d' },
}

function Tile({ channel }: { channel: Channel }) {
  const remote = useChannelLogo(channel.wiki)
  const logo = channel.logo ?? remote
  const brand = BRAND[channel.id] ?? { bg: '#2a2b55', fg: '#fff' }
  return (
    <Link to={`/tv?channel=${channel.id}`} className="kids-tile">
      <span className="kids-logo" style={{ background: brand.bg, color: brand.fg }}>
        <Art src={logo} fallback={channel.badge} />
      </span>
      <span className="kids-name">{channel.name}</span>
    </Link>
  )
}

export default function KidsChannels() {
  const t = useT()
  const lang = useAppSelector((s) => s.ui.lang)
  return (
    <section className="section" aria-label={t('kids.title')}>
      <div className="section-head">
        <h2>{t('kids.title')}</h2>
        <Link to="/tv" className="pill">
          {t('common.all')}
          <ChevronRightIcon size={14} strokeWidth={2.4} />
        </Link>
      </div>
      <div className="kids-grid">
        {getKidsChannels(lang).map((c) => (
          <Tile key={c.id} channel={c} />
        ))}
      </div>
    </section>
  )
}
