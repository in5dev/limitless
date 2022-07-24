import test from 'ava';
import { Category, OrderBy, searchWorks } from './search';

test('search work', async t => {
  const works = await searchWorks({
    complete: true,
    crossovers: false,
    language: 'en',
    categories: [Category.Lesbian],
    relationships: ['Amity Blight/Luz Noceda'],
    orderBy: OrderBy.Kudos
  });
  t.log(works);
  t.truthy(works);
});
