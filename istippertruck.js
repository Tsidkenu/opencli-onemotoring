import { cli, Strategy } from '@jackwener/opencli/registry';

cli({
  site: 'onemotoring',
  name: 'istippertruck',
  description: 'Check whether a vehicle make/model is likely to be a tipper truck',
  access: 'read',
  example: 'opencli onemotoring istippertruck "Mercedes-Benz Arocs" -f json',
  domain: 'google.com',
  strategy: Strategy.UI,
  browser: true,

  args: [
    {
      name: 'model',
      type: 'string',
      required: true,
      positional: true,
      help: 'Vehicle make and model, e.g. Mercedes-Benz Arocs',
    },
  ],

  columns: [
    'model',
    'is_tipper_truck',
    'confidence',
    'reason',
    'search_query',
    'checked_at',
  ],

  func: async (page, kwargs) => {
    const model = String(kwargs.model || '').trim();

    if (!model) {
      throw new Error('Please provide a vehicle make/model');
    }

    const query = `${model} tipper truck dump truck lorry`;

    await page.goto(`https://www.google.com/search?q=${encodeURIComponent(query)}`);

    const result = await page.evaluate(`
      (async () => {
        const sleep = ms => new Promise(r => setTimeout(r, ms));
        await sleep(3000);

        const bodyText = document.body.innerText || '';
        return bodyText.slice(0, 10000);
      })()
    `);

    const text = String(result || '').toLowerCase();

    const strongMatches = [
      'tipper truck',
      'tipper',
      'dump truck',
      'construction truck',
      'heavy-duty truck',
      'rigid tipper',
      'tipper body',
      'dump body',
    ];

    const negativeMatches = [
      'sedan',
      'hatchback',
      'suv',
      'coupe',
      'motorcycle',
      'mpv',
    ];

    const strongScore = strongMatches.filter(k => text.includes(k)).length;
    const negativeScore = negativeMatches.filter(k => text.includes(k)).length;

    let isTipperTruck = false;
    let confidence = 'low';
    let reason = 'Insufficient evidence from search results';

    if (strongScore >= 2 && negativeScore === 0) {
      isTipperTruck = true;
      confidence = 'high';
      reason = 'Search results contain multiple truck/tipper-related terms';
    } else if (strongScore >= 1 && negativeScore === 0) {
      isTipperTruck = true;
      confidence = 'medium';
      reason = 'Search results contain tipper or heavy truck-related terms';
    } else if (negativeScore > 0 && strongScore === 0) {
      isTipperTruck = false;
      confidence = 'medium';
      reason = 'Search results suggest a non-truck vehicle type';
    }

    return [
      {
        model,
        is_tipper_truck: isTipperTruck,
        confidence,
        reason,
        search_query: query,
        checked_at: new Date().toISOString(),
      },
    ];
  },
});