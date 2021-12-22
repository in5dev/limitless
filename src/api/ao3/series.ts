import axios from 'axios';
import cheerio from 'cheerio';

import ORIGIN from './origin';

const query = `${ORIGIN}/series/`;
const ao3Regex = new RegExp(`${query}(\\d+)`);

export function getSeriesId(url: string): string {
  if (!url.match(ao3Regex)) return '';
  return url.replace(query, '').split(/\/|\?|#/)[0] || '';
}

export interface Series {
  id: string;
  url: string;
  title: string;
  creators: string[];
  begun: Date;
  updated: Date;
  stats: {
    words: number;
    works: string[];
    complete: boolean;
    bookmarks: number;
  };
}
export async function getSeries(id: string): Promise<Series> {
  const response = await axios(`${query}${id}`);
  const html = response.data as string;
  const $ = cheerio.load(html);

  return {
    id,
    url: `${query}${id}`,
    title: $('h2.title').text().trim(),
    creators: $('#main > div.wrapper > dl > dd:nth-child(2) > a')
      .map((_, el) => $(el).text())
      .get(),
    begun: new Date($('#main > div.wrapper > dl > dd:nth-child(4)').text()),
    updated: new Date($('#main > div.wrapper > dl > dd:nth-child(6)').text()),
    stats: {
      words: parseInt(
        $('#main > div.wrapper > dl > dd.stats > dl > dd:nth-child(2)')
          .text()
          .replaceAll(',', '')
      ),
      works: $('#main > ul > div > h4 > a:nth-child(1)')
        .map((_, el) => $(el).text())
        .get(),
      complete:
        $(
          '#main > div.wrapper > dl > dd.stats > dl > dd:nth-child(6)'
        ).text() !== 'No',
      bookmarks: parseInt(
        $(
          '#main > div.wrapper > dl > dd.stats > dl > dd:nth-child(8) > a'
        ).text()
      )
    }
  };
}
