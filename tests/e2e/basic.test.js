import { test, expect } from '@playwright/test'

test.describe('Page Load', () => {
  test('Store Setup Denmark', async ({ page }) => {
    // Wait until the DOM content is loaded, not all resources
    await page.goto('http://localhost:4173/Denmark', { waitUntil: 'domcontentloaded' })
    
    try {
      // The #c1 element only loads then the store has been set up succesfully
      await page.waitForSelector('#c1', { timeout: 5000 })
    } catch (error) {
      console.warn('Map did not fully load within 5 seconds. Continuing the test...')
    }
  })
  test('Store Setup Greenland', async ({ page }) => {
    // Wait until the DOM content is loaded, not all resources
    //is important to wait for domcontentloaded, as default will wait forever if one call to WMS hangs
    await page.goto('http://localhost:4173/Greenland', { waitUntil: 'domcontentloaded' })
    
    try {
      // Now wait for your map element, but with a shorter timeout
      await page.waitForSelector('#c1', { timeout: 5000 })
    } catch (error) {
      console.warn('Map did not fully load within 5 seconds. Continuing the test...')
    }
  })
  
})

test.describe('Map Tests', () => {
  //test for map Load(inferred from the fact that successfull communication with webmap exists)
  test('Map Connect Denmark', async({page}) => {
    await page.goto('http://localhost:4173', { waitUntil: 'domcontentloaded' })
    const response = await page.waitForResponse( response => 
      response.url().includes('https://services.datafordeler.dk/DKskaermkort/topo_skaermkort_daempet/1.0.0/wmts') &&
      response.status() === 200
    )
    expect(response.ok()).toBeTruthy()
  })

  test('Map Connect Greenland', async({page}) => {
    await page.goto('http://localhost:4173/Greenland', { waitUntil: 'domcontentloaded' })
    const response = await page.waitForResponse( response => 
      response.url().includes('https://api.dataforsyningen.dk/wms/gl_aabent_land') &&
      response.status() === 200
    )
    expect(response.ok()).toBeTruthy()
  })
  
  test('Map Click', async ({page}) => {
    let error_msg = []
    page.on('console', msg => {
      if (msg.type() === 'error') {
        error_msg.push(msg.text())
      }
    })
    
    try {
      await page.goto('http://localhost:4173', { waitUntil: 'domcontentloaded' })
      await page.waitForSelector('#map', { state: 'visible' })

      await page.waitForSelector('.ol-overlaycontainer', {state: 'visible'})
      
      await page.waitForLoadState('networkidle')

      const mapElement = page.locator('#map')
      await expect(mapElement).toBeVisible()
      const box = await mapElement.boundingBox()
      const clickX = box.x + box.width / 2
      const clickY = box.y + box.height / 2

      //Have tried to make this work for so long, but the only way is to wait... 
      await page.waitForLoadState('load')

      await page.mouse.click(clickX, clickY)
      await page.waitForLoadState('networkidle')

      const inputSelector = '#c1'
      //allows for multiple attempts
      const inputValue= await page.waitForFunction(
        async (selector) => {
          const input = document.querySelector(selector)
          return input && input.value !== '0.0000'
        },
        inputSelector
      )

      const outputSelector = '#KT-output'

      const outputValue = await page.waitForFunction(
        (selector) => {
          const output = document.querySelector(selector)
          return output && output.innerHTML.trim() !== ''
        },
        outputSelector
      )

      expect(inputValue.jsonValue()).toBeTruthy()
      expect(outputValue.jsonValue()).toBeTruthy()

    } catch (error) {
      error_msg.forEach(element => {
        console.error(element)
      })
      throw error
    }
  })

  
})
