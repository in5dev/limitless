import axios from 'axios';
import cheerio from 'cheerio';

import ORIGIN from './origin';

const query = `${ORIGIN}/works/`;
const ao3Regex = new RegExp(`${query}(\\d+)`);

export function getWorkId(url: string): string {
  if (!url.match(ao3Regex)) return '';
  return url.replace(query, '').split(/\/|\?|#/)[0] || '';
}

export const ratings = {
  general: 'General Audiences',
  teen: 'Teen And Up Audiences',
  mature: 'Mature',
  explicit: 'Explicit'
} as const;
export type Rating = keyof typeof ratings;

export const contentWarnings = {
  violence: 'Graphic Depictions of Violence',
  death: 'Major Character Death',
  rape: 'Rape/Non-Con',
  underage: 'Underage Sex'
} as const;
export type Warning = keyof typeof contentWarnings;

export const relationshipOrientations = {
  lesbian: 'F/F',
  straight: 'F/M',
  gen: 'Gen',
  gay: 'M/M',
  multi: 'Multi',
  other: 'Other'
} as const;
export type RelationshipOrientation = keyof typeof relationshipOrientations;

const symbolsOrigin =
  'https://archiveofourown.org/images/skins/iconsets/default/';
const symbols = {
  rating: {
    general: 'rating-general-audience',
    teen: 'rating-teen',
    mature: 'rating-mature',
    explicit: 'rating-explicit',
    none: 'rating-notrated'
  },
  orientation: {
    lesbian: 'category-femslash',
    straight: 'category-het',
    gen: 'category-gen',
    gay: 'category-slash',
    multi: 'category-multi',
    other: 'category-other',
    none: 'category-none'
  },
  warning: {
    undefined: 'warning-choosenotto',
    yes: 'warning-yes',
    no: 'warning-no',
    external: 'warning-external'
  },
  complete: {
    yes: 'complete-yes',
    no: 'complete-no',
    unknown: 'category-none'
  }
};

export interface Work {
  id: string;
  title: string;
  author: string;
  rating?: Rating;
  warnings?: Warning[];
  categories: RelationshipOrientation[];
  fandoms: string[];
  relationships: string[];
  characters: string[];
  tags: string[];
  language: string;
  series?: {
    id: string;
    title: string;
  };
  stats: {
    published: Date;
    updated: Date;
    words: number;
    chapters: [current: number, total: number];
    kudos: number;
    bookmarks: number;
    hits: number;
  };
  symbols: {
    rating: string;
    orientation: string;
    warning: string;
    complete: string;
  };
}
export async function getWork(id: string): Promise<Work> {
  const response = await axios(`${query}${id}`);
  const html = response.data as string;
  const $ = cheerio.load(html);

  const rating = $(
    '#main > div.work > div.wrapper > dl > dd.rating.tags > ul > li > a'
  ).text();
  const warnings = $('#main > div.work > div.wrapper > dl > dd.warning.tags a')
    .map((_, el) => $(el).text())
    .get();
  const categories = $(
    '#main > div.work > div.wrapper > dl > dd.category.tags > ul a'
  )
    .map((_, el) => $(el).text())
    .get();
  const series = $(
    '#main > div.work > div.wrapper > dl > dd.series > span > span.position > a'
  );
  const stats = $('#main > div.work > div.wrapper > dl > dd.stats > dl');

  const work = {
    id,
    title: $('h2.title').text().trim(),
    author: $('#workskin > div.preface.group > h3 > a').text(),
    rating: Object.entries(ratings).find(([, x]) => rating === x)?.[0] as
      | Rating
      | undefined,
    warnings:
      warnings[0] === 'No Archive Warnings Apply'
        ? []
        : warnings[0] === 'Creator Chose Not To Use Archive Warnings'
        ? undefined
        : (warnings.map(
            warning =>
              Object.entries(contentWarnings).find(
                ([, x]) => warning === x
              )?.[0]
          ) as Warning[]),
    categories: categories.map(
      category =>
        Object.entries(relationshipOrientations).find(
          ([, x]) => category === x
        )?.[0] || 'other'
    ) as RelationshipOrientation[],
    fandoms: $(
      '#main > div.work > div.wrapper > dl > dd.fandom.tags > ul > li > a'
    )
      .map((_, el) => $(el).text())
      .get(),
    relationships: $(
      '#main > div.work > div.wrapper > dl > dd.relationship.tags > ul a'
    )
      .map((_, el) => $(el).text() as RelationshipOrientation)
      .get(),
    characters: $(
      '#main > div.work > div.wrapper > dl > dd.character.tags > ul a'
    )
      .map((_, el) => $(el).text())
      .get(),
    tags: $('#main > div.work > div.wrapper > dl > dd.freeform.tags > ul a')
      .map((_, el) => $(el).text())
      .get(),
    language: $('#main > div.work > div.wrapper > dl > dd.language')
      .text()
      .trim(),
    series: series.length
      ? {
          id: series.attr('href')?.replace('/series/', '') || '',
          title: series.text()
        }
      : undefined,
    stats: {
      published: new Date(`${stats.find('dd.published').text()} `),
      updated: new Date(`${stats.find('dd.status').text()} `),
      words: parseInt(stats.find('dd.words').text()),
      chapters: stats
        .find('dd.chapters')
        .text()
        .split('/')
        .map(x => parseInt(x)) as [number, number],
      kudos: parseInt(stats.find('dd.kudos').text()),
      bookmarks: parseInt(stats.find('dd.bookmarks a').text()),
      hits: parseInt(stats.find('dd.hits').text())
    }
  };
  return {
    ...work,
    symbols: {
      rating: `${symbolsOrigin + symbols.rating[work.rating || 'none']}.png`,
      orientation:
        work.categories.length > 1
          ? `${symbolsOrigin + symbols.orientation.multi}.png`
          : `${
              symbolsOrigin + symbols.orientation[work.categories[0] || 'none']
            }.png`,
      warning: `${
        symbolsOrigin +
        symbols.warning[
          work.warnings ? (work.warnings.length ? 'yes' : 'no') : 'undefined'
        ]
      }.png`,
      complete: `${
        symbolsOrigin +
        symbols.complete[
          work.stats.chapters[0] >= work.stats.chapters[1] ? 'yes' : 'no'
        ]
      }.png`
    }
  };
}
export async function getWorks(ids: string[]): Promise<Work[]> {
  const works: Work[] = [];
  for (const id of ids) {
    works.push(await getWork(id));
  }
  return works;
}
