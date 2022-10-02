import { assert } from 'https://deno.land/std@0.158.0/testing/asserts.ts';
import { Category, OrderBy, searchWorks } from './search.ts';

Deno.test(
  'search work',
  { permissions: { net: ['archiveofourown.org'] } },
  async () => {
    const works = await searchWorks({
      complete: true,
      crossovers: false,
      language: 'en',
      categories: [Category.Lesbian],
      relationships: ['Amity Blight/Luz Noceda'],
      orderBy: OrderBy.Kudos
    });
    console.log(works);
    assert(works);
  }
);
