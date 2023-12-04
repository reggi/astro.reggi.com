export const REVERSE_CHRONO = 'reverse-chrono'
export const CHRONO = 'chrono'

export type Order = typeof REVERSE_CHRONO | typeof CHRONO

export type GoogleCloudBrushworkFile = {
  href: string;
  text: string;
  alt: string;
  name: any;
  date: any;
  year: any;
  month: any;
  day: any;
  number: any;
  volume: number;
  source: any;
}

export type ArtworkProps = {
  files: GoogleCloudBrushworkFile[]
}

export type StatementProps = {
  listOfMonths: { href: string, text: string }[],
  listOfVolumes: { href: string, text: string }[],
}

export type LinkProps = { href: string, text: string }

export type KeyedLinks = {
  [key: string]: LinkProps
}

export type KeyedLinksArray = LinkProps[]