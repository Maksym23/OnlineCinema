import type { GenreKey, MediaType } from '../types'

export const SLUG_TO_TYPE: Record<string, MediaType> = {
  movies: 'movie',
  series: 'series',
  cartoons: 'cartoon',
}

export const TYPE_TO_SLUG: Record<MediaType, string> = {
  movie: 'movies',
  series: 'series',
  cartoon: 'cartoons',
}

export const ALL_GENRES: GenreKey[] = [
  'drama',
  'action',
  'thriller',
  'scifi',
  'comedy',
  'romance',
  'horror',
  'adventure',
  'documentary',
  'fantasy',
  'family',
  'crime',
  'animation',
]

/** Відео-приклади для демонстрації плеєра (публічні тестові файли Google). */
const SAMPLE_BASE = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/'
const SAMPLES = ['BigBuckBunny.mp4', 'ElephantsDream.mp4', 'Sintel.mp4', 'TearsOfSteel.mp4']

export function sampleVideoFor(index: number): string {
  return SAMPLE_BASE + SAMPLES[index % SAMPLES.length]
}
