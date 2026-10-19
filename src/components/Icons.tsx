import type { SVGProps } from 'react'

type P = SVGProps<SVGSVGElement> & { size?: number }

function Svg({ size = 20, children, ...rest }: P) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  )
}

export const SearchIcon = (p: P) => (
  <Svg {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </Svg>
)

export const BookmarkIcon = ({ filled, ...p }: P & { filled?: boolean }) => (
  <Svg {...p} fill={filled ? 'currentColor' : 'none'}>
    <path d="M6 3h12v18l-6-4-6 4z" />
  </Svg>
)

export const UserIcon = (p: P) => (
  <Svg {...p}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21a8 8 0 0 1 16 0" />
  </Svg>
)

export const HeartIcon = ({ filled, ...p }: P & { filled?: boolean }) => (
  <Svg {...p} fill={filled ? 'currentColor' : 'none'}>
    <path d="M12 20.5s-8-4.8-8-10.6A4.4 4.4 0 0 1 12 7.4a4.4 4.4 0 0 1 8 2.5c0 5.8-8 10.6-8 10.6z" />
  </Svg>
)

export const ChevronRightIcon = (p: P) => (
  <Svg {...p}>
    <path d="m9 6 6 6-6 6" />
  </Svg>
)
export const ChevronLeftIcon = (p: P) => (
  <Svg {...p}>
    <path d="m15 6-6 6 6 6" />
  </Svg>
)
export const ChevronDownIcon = (p: P) => (
  <Svg {...p}>
    <path d="m6 9 6 6 6-6" />
  </Svg>
)
export const ArrowLeftIcon = (p: P) => (
  <Svg {...p}>
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </Svg>
)

export const PlayIcon = (p: P) => (
  <Svg {...p} fill="currentColor" stroke="none">
    <path d="M8 5v14l11-7z" />
  </Svg>
)
export const PauseIcon = (p: P) => (
  <Svg {...p} fill="currentColor" stroke="none">
    <rect x="6" y="5" width="4" height="14" rx="1" />
    <rect x="14" y="5" width="4" height="14" rx="1" />
  </Svg>
)
export const VolumeIcon = (p: P) => (
  <Svg {...p}>
    <path d="M11 5 6 9H3v6h3l5 4V5z" />
    <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" />
  </Svg>
)
export const VolumeMuteIcon = (p: P) => (
  <Svg {...p}>
    <path d="M11 5 6 9H3v6h3l5 4V5z" />
    <path d="m16 9 5 6M21 9l-5 6" />
  </Svg>
)
export const FullscreenIcon = (p: P) => (
  <Svg {...p}>
    <path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3M16 21h3a2 2 0 0 0 2-2v-3" />
  </Svg>
)
export const FullscreenExitIcon = (p: P) => (
  <Svg {...p}>
    <path d="M8 3v3a2 2 0 0 1-2 2H3M16 3v3a2 2 0 0 0 2 2h3M8 21v-3a2 2 0 0 0-2-2H3M16 21v-3a2 2 0 0 1 2-2h3" />
  </Svg>
)
export const PipIcon = (p: P) => (
  <Svg {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <rect x="12" y="12" width="7" height="5" rx="1" fill="currentColor" />
  </Svg>
)
export const Replay10Icon = (p: P) => (
  <Svg {...p}>
    <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
    <path d="M3 3v5h5" />
  </Svg>
)
export const Forward10Icon = (p: P) => (
  <Svg {...p}>
    <path d="M21 12a9 9 0 1 1-3-6.7L21 8" />
    <path d="M21 3v5h-5" />
  </Svg>
)

export const SunIcon = (p: P) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </Svg>
)
export const MoonIcon = (p: P) => (
  <Svg {...p}>
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
  </Svg>
)
export const EyeIcon = (p: P) => (
  <Svg {...p}>
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
    <circle cx="12" cy="12" r="3" />
  </Svg>
)
export const EyeOffIcon = (p: P) => (
  <Svg {...p}>
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
    <circle cx="12" cy="12" r="3" />
    <path d="m3 3 18 18" />
  </Svg>
)
export const StarIcon = (p: P) => (
  <Svg {...p} fill="currentColor" stroke="none">
    <path d="m12 2.8 2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2 6.3 20.3l1.2-6.4L2.8 9.5l6.4-.8z" />
  </Svg>
)
export const CloseIcon = (p: P) => (
  <Svg {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Svg>
)
export const MenuIcon = (p: P) => (
  <Svg {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Svg>
)
export const TrashIcon = (p: P) => (
  <Svg {...p}>
    <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />
  </Svg>
)
export const PhoneIcon = (p: P) => (
  <Svg {...p}>
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
  </Svg>
)
export const MailIcon = (p: P) => (
  <Svg {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </Svg>
)
export const HelpIcon = (p: P) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 1-1 1.7M12 17h.01" />
  </Svg>
)
export const SparkleIcon = (p: P) => (
  <Svg {...p} fill="currentColor" stroke="none">
    <path d="M12 2c.6 5.4 4.6 9.4 10 10-5.4.6-9.4 4.6-10 10-.6-5.4-4.6-9.4-10-10C7.4 11.4 11.4 7.4 12 2z" />
  </Svg>
)
export const SparkleOutlineIcon = (p: P) => (
  <Svg {...p}>
    <path d="M12 2c.6 5.4 4.6 9.4 10 10-5.4.6-9.4 4.6-10 10-.6-5.4-4.6-9.4-10-10C7.4 11.4 11.4 7.4 12 2z" />
  </Svg>
)

export const FacebookIcon = (p: P) => (
  <Svg {...p} fill="currentColor" stroke="none">
    <path d="M14 8h3V4h-3a4 4 0 0 0-4 4v2H7v4h3v6h4v-6h3l1-4h-4V8z" />
  </Svg>
)
export const InstagramIcon = (p: P) => (
  <Svg {...p}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17" cy="7" r=".6" fill="currentColor" />
  </Svg>
)
export const ThreadsIcon = (p: P) => (
  <Svg {...p}>
    <path d="M17.5 9.5C16.8 6.8 14.8 5 12 5c-3.3 0-5.5 2.6-5.5 7s2.2 7 5.5 7c2.6 0 4.5-1.4 4.5-3.5S14.6 12 12.2 12c-1.7 0-2.7.8-2.7 1.9 0 1 .9 1.7 2.1 1.7 1.8 0 3-1.3 3-3.6" />
  </Svg>
)
export const TikTokIcon = (p: P) => (
  <Svg {...p}>
    <path d="M14 4v10.5a3.5 3.5 0 1 1-3-3.46M14 4c.5 2.5 2 4 4.5 4.2" />
  </Svg>
)
export const AppleIcon = (p: P) => (
  <Svg {...p} fill="currentColor" stroke="none">
    <path d="M16.4 12.6c0-2.4 2-3.5 2-3.6-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.2-2.8.9-3.5.9-.7 0-1.8-.8-3-.8-1.5 0-3 .9-3.800 2.300-1.600 2.800-.4 7 1.200 9.300.8 1.100 1.700 2.400 2.900 2.300 1.200 0 1.600-.7 3-.7s1.800.7 3 .7c1.300 0 2.100-1.100 2.800-2.200.9-1.300 1.300-2.500 1.300-2.600-.1 0-2.500-1-2.500-3.800zM14.200 5.500c.6-.8 1.100-1.800.9-2.900-.9 0-2 .6-2.700 1.400-.6.700-1.100 1.800-1 2.800 1 .1 2.100-.5 2.800-1.300z" />
  </Svg>
)
export const GoogleIcon = (p: P) => (
  <Svg {...p}>
    <path d="M20.5 12.2c0-.6-.1-1.100-.2-1.700H12v3.300h4.800a4.100 4.100 0 0 1-1.800 2.700v2.200h2.900c1.700-1.600 2.600-3.900 2.600-6.500z" fill="currentColor" stroke="none" />
    <path d="M12 21c2.400 0 4.500-.8 5.900-2.200L15 16.600c-.8.500-1.800.9-3 .9-2.300 0-4.300-1.600-5-3.700H4v2.300A9 9 0 0 0 12 21z" fill="currentColor" stroke="none" opacity=".8" />
    <path d="M7 13.800a5.400 5.400 0 0 1 0-3.600V7.900H4a9 9 0 0 0 0 8.200l3-2.300z" fill="currentColor" stroke="none" opacity=".6" />
    <path d="M12 6.600c1.300 0 2.500.5 3.400 1.300l2.600-2.500A9 9 0 0 0 4 7.900l3 2.300c.7-2.100 2.700-3.600 5-3.600z" fill="currentColor" stroke="none" opacity=".9" />
  </Svg>
)
