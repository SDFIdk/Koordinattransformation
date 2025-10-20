import { test, expect } from '@playwright/test'


test.describe('Input Error Markings', () => {
  test('Incorrect Meter Format Check', async ({ page }) => {
    await page.goto('http://localhost:4173/Denmark', { waitUntil: 'domcontentloaded' })
    await page.waitForSelector('#map', { state: 'visible' })
    await page.waitForSelector('.ol-overlaycontainer', {state: 'visible'})
    await page.waitForLoadState('load')
    
  })

})