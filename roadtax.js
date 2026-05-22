import { cli, Strategy } from '@jackwener/opencli/registry';

cli({
  site: 'onemotoring',
  name: 'roadtax',
  description: 'Enquire OneMotoring road tax expiry date by vehicle number',
  access: 'read',
  example: 'opencli onemotoring roadtax SXX1234A -f json',
  domain: 'onemotoring.lta.gov.sg',
  strategy: Strategy.UI,
  browser: true,

  args: [
    {
      name: 'vrn',
      type: 'string',
      positional: true,
      required: true,
      help: 'Singapore vehicle registration number, e.g. SXX1234A',
    },
  ],

  columns: [
    'vehicle_no',
    'road_tax_expiry_date',
    'vehicle_make_model'
  ],

  func: async (page, kwargs) => {
    const vehicleNo = String(kwargs.vrn || '')
      .toUpperCase()
      .replace(/\s+/g, '');

    if (!/^[A-Z]{1,3}\d{1,4}[A-Z]$/.test(vehicleNo)) {
      throw new Error(`Invalid Singapore vehicle number format: ${vehicleNo}`);
    }

    await page.goto(
      'https://vrl.lta.gov.sg/vrls/app/ao/enq-rtx-exp-dt-proxy'
    );

    await page.evaluate(`
      (async () => {
        const sleep = ms => new Promise(r => setTimeout(r, ms));

        async function waitForSelector(selector, timeout = 30000) {
          const start = Date.now();
          while (Date.now() - start < timeout) {
            const el = document.querySelector(selector);
            if (el) return el;
            await sleep(300);
          }
          throw new Error('Timeout waiting for ' + selector);
        }

        const input = await waitForSelector('#vehicleNo');
        input.value = ${JSON.stringify(vehicleNo)};
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));

        const checkbox = await waitForSelector('#checkboxId_agreeTC_true');
        if (!checkbox.checked) checkbox.click();

        const submit = await waitForSelector('#submitWithRecaptchaBtn');
        submit.click();
      })()
    `);

    const result = await page.evaluate(`
      (async () => {
        const sleep = ms => new Promise(r => setTimeout(r, ms));

        async function waitForText(selector, timeout = 120000) {
          const start = Date.now();
          while (Date.now() - start < timeout) {
            const el = document.querySelector(selector);
            const text = el?.innerText || el?.textContent || '';
            if (text.trim()) return text.trim();
            await sleep(500);
          }
          throw new Error('Timeout waiting for result: ' + selector);
        }

        const vehicleNo = await waitForText('#vehicleNoFieldDisplay');
        const expiryDate = await waitForText('#expiryDateFieldDisplay');
        const makeModel = await waitForText('#vehicleMakeModelFieldDisplay');

        return {
          vehicle_no: vehicleNo,
          road_tax_expiry_date: expiryDate,
          vehicle_make_model: makeModel
        };
      })()
    `);

    return [{
      ...result,
      source: 'OneMotoring',
      checked_at: new Date().toISOString(),
    }];
  },
});