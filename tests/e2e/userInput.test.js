import { test, expect } from '@playwright/test'

test.describe('Delete and input coordinates', async () => {
  test('[Meter] Incorrectly formatted coordinate should not trigger change', async({page}) => {
    await page.goto('http://localhost:4173', { waitUntil: 'domcontentloaded' })
    await page.waitForLoadState('load')

    await page.waitForSelector('#c1', { state: 'visible' })
    const output = page.locator('#KT-output')
    

    const toCheckAgainst = await output.textContent()
    const c1 = page.locator('#c1')
    const c2 = page.locator('#c2')

    await c1.fill('')
    await expect(c1).toHaveClass(/KT-input-invalid/, { timeout: 1000 } )

    await c2.fill('')
    await expect(c2).toHaveClass(/KT-input-invalid/, { timeout: 1000 })
    await page.waitForLoadState('networkidle')
    await page.waitForLoadState('domcontentloaded')


    const outputAfterInputChange = await output.textContent()
    expect(outputAfterInputChange).toEqual(toCheckAgainst)
  })
  test('[Degree (DD.DD°)] Incorrectly formatted coordinate should not trigger change', async({page}) => {
    await page.goto('http://localhost:4173', { waitUntil: 'domcontentloaded' })
    await page.waitForLoadState('load')

    await page.waitForSelector('#c1', { state: 'visible' })

    await page.waitForLoadState('load')
    await page.locator('#KT-crs-in-select').selectOption('ED50 (EPSG:4230)')
    await page.waitForLoadState('networkidle')

    const output = page.locator('#KT-output')
    const toCheckAgainst = await output.textContent()
    console.log(toCheckAgainst)
    const c1 = page.locator('#c1D')
    const c2 = page.locator('#c2D')

    await c1.fill('')
    await expect(c1).toHaveClass(/KT-input-invalid/, { timeout: 1000 })

    await c2.fill('')
    await expect(c2).toHaveClass(/KT-input-invalid/, { timeout: 1000 })
    await page.waitForLoadState('networkidle')
    await page.waitForLoadState('domcontentloaded')


    const outputAfterInputChange = await output.textContent()
    expect(outputAfterInputChange).toEqual(toCheckAgainst)
    
  }) 

  test('[Degree (DD° MM\' SS.SS")] Incorrectly formatted coordinate should not trigger change', async({page}) => {
    await page.goto('http://localhost:4173', { waitUntil: 'domcontentloaded' })
    await page.waitForLoadState('load')

    await page.waitForSelector('#c1', { state: 'visible' })

    await page.waitForLoadState('load')
    await page.locator('#KT-crs-in-select').selectOption('ED50 (EPSG:4230)')

    await page.waitForLoadState('networkidle')

    const DMS = await page.locator('#DMS', { timeout: 1000 })

    await DMS.click()

    const output = await page.locator('#KT-output')
    const toCheckAgainst = await output.textContent()
    const c1 = await page.locator('#c1Dms')

    const initialInput = await c1.inputValue()
    await c1.fill(`${initialInput}99`)
    await expect(c1).toHaveClass(/KT-input-invalid/, { timeout: 1000 })

    
    const outputAfterInputChange = await output.textContent()
    expect(outputAfterInputChange).toEqual(toCheckAgainst)
    
  }) 

  test('[Degree (DD° MM\' SS.SS")] Chained inputs should be reflected in output', async({page}) => {
    await page.goto('http://localhost:4173', { waitUntil: 'domcontentloaded' })
    await page.waitForLoadState('load')

    await page.waitForSelector('#c1', { state: 'visible' })

    await page.waitForLoadState('load')
    await page.locator('#KT-crs-in-select').selectOption('ED50 (EPSG:4230)')

    await page.waitForLoadState('networkidle')

    const DMS = await page.locator('#DMS', { timeout: 1000 })

    await DMS.click()

    const output = await page.locator('#KT-output')
    const toCheckAgainst = await output.textContent()
    const c1S = await page.locator('#c1Dms')

    await c1S.fill('')
    await expect(c1S).toHaveClass(/KT-input-invalid/, { timeout: 1000 })

    await c1S.pressSequentially('10.999')
    
    await expect.poll(async () => await output.textContent()).not.toEqual(toCheckAgainst)

    const outputAfterFirstInputChange = await output.textContent()

    const c1M = await page.locator('#c1Dm')

    await c1M.fill('')
    await expect(c1M).toHaveClass(/KT-input-invalid/, { timeout: 1000 })

    await c1M.pressSequentially('10')
    
    await page.waitForLoadState('networkidle')
    await expect.poll(async () => await output.textContent()).not.toEqual(outputAfterFirstInputChange)
  }) 

})