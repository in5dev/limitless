import { assert } from 'https://deno.land/std@0.158.0/testing/asserts.ts';
import { getEpisode, getURL } from './eam.ts';

Deno.test(
  'get E1S1',
  { permissions: { net: ['evieandmya.fandom.com'] } },
  async () => {
    const url = getURL('Prologue');
    const episode = await getEpisode(url);
    assert(episode.title === 'Prologue');
    assert(typeof episode.words === 'number');
  }
);
