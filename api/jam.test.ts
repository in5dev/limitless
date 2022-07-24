import test from 'ava';

import { getEpisode, getURL } from './jam';

test('get E1S1', async t => {
  const url = getURL('Prologue');
  const episode = await getEpisode(url);
  t.assert(episode.title === 'Prologue');
  t.assert(typeof episode.words === 'number');
});
