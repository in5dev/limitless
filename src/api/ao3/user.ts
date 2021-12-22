import axios from 'axios';
import cheerio from 'cheerio';

import ORIGIN from './origin';

const query = `${ORIGIN}/users/`;
const ao3Regex = new RegExp(`${query}(.+)`);

export function getNameFromURL(url: string): string {
  if (!url.match(ao3Regex)) return '';
  return url.replace(query, '').split(/\/|\?|#/)[0] || '';
}

export interface User {
  name: string;
  url: string;
  iconUrl: string;
}
export async function getUser(name: string): Promise<User> {
  const response = await axios.get(`${query}${name}`);
  const html = response.data as string;
  const $ = cheerio.load(html);

  return {
    name,
    url: `${query}${name}`,
    iconUrl:
      $('#main > div.user.home > div.primary.header.module > p > a > img').attr(
        'src'
      ) || ''
  };
}
