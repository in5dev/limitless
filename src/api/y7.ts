import { load } from 'cheerio';
import fetch from 'cross-fetch';

import { random } from '../math/index.js';

export const FILES_ORIGIN = 'https://files.yyyyyyy.info';

const nsfw = new Set([`${FILES_ORIGIN}/images/0071-1.gif`]);

export async function getText(): Promise<string> {
  const response = await fetch('https://www.yyyyyyy.info/');
  const html = await response.text();
  const $ = await load(html);
  const spans = $('span');
  const span = random(spans.get());
  const src = $(span).text();
  console.log(`Text: ${src}`);
  return src;
}

export async function getImg(): Promise<string> {
  const response = await fetch('https://www.yyyyyyy.info/');
  const html = await response.text();
  const $ = await load(html);
  const imgs = $('img');
  const images = imgs.filter((_, img) => {
    const src = $(img).attr('src') || '';
    return src.startsWith(FILES_ORIGIN) && !src.endsWith('.gif');
  });
  const image = random(images.get());
  const src = $(image).attr('src') || '';
  console.log(`Img: ${src}`);
  return src;
}

export async function getGIF(): Promise<string> {
  const response = await fetch('https://www.yyyyyyy.info/');
  const html = await response.text();
  const $ = await load(html);
  const imgs = $('img');
  const images = imgs.filter((_, img) => {
    const src = $(img).attr('src') || '';
    return (
      src.startsWith(FILES_ORIGIN) && src.endsWith('.gif') && !nsfw.has(src)
    );
  });
  const image = random(images.get());
  const src = $(image).attr('src') || '';
  console.log(`GIF: ${src}`);
  return src;
}
