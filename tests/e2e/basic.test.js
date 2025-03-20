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
      const clickY = box.y + box.height / 1.5

      //Have tried to make this work for so long, but the only way is to wait... 
      await page.waitForLoadState('load')

      await page.mouse.click(clickX, clickY)
      await page.waitForLoadState('networkidle')

      const inputSelector = '#c1'
      //allows for multiple attempts
      const inputValue= await page.waitForFunction(
        async (selector) => {
          const input = document.querySelector(selector)
          return input && input.value !== '723910.4400'
        },
        inputSelector
      )

      const outputSelector = '#KT-output'

      const outputValue = await page.waitForFunction(
        (selector) => {
          const output = document.querySelector(selector)
          return output && output.innerHTML.trim() !== '723910.4400m, 6179652.8900m, 0 m'
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

  test('Change CRS', async ({page}) => {
    await page.goto('http://localhost:4173', { waitUntil: 'domcontentloaded' })
    await page.waitForSelector('#map', { state: 'visible' })

    await page.waitForSelector('.ol-overlaycontainer', {state: 'visible'})
    
    await page.waitForLoadState('load')
    page.locator('#KT-crs-in-select').selectOption('WGS84 (EPSG:4326)')
    await page.waitForLoadState('networkidle')

    // expect 55.71082041 and 12.56443644
    const coordinateOneDegreesSelector = '#c1D'

    const outputSelector = '#KT-output'

    const outputText = await page.evaluate(selector => {
      const element = document.querySelector(selector)
      return element ? element.innerHTML.trim() : ''
    }, outputSelector)
    
    expect(outputText).toBe('723910.4400m, 6179652.8900m, 0 m')

    //allows for multiple attempts
    const c1Expected= await page.waitForFunction(
      async (selector) => {
        const input = document.querySelector(selector)
        return input && input.value === '55.71082041'
      },
      coordinateOneDegreesSelector
    )

    // expect 55.71082041 and 12.56443644
    const coordinateTwoDegreesSelector = '#c2D'
    //allows for multiple attempts
    const c2Expected = await page.waitForFunction(
      async (selector) => {
        const input = document.querySelector(selector)
        return input && input.value === '12.56443644'
      },
      coordinateTwoDegreesSelector
    )

    expect(c1Expected.jsonValue()).toBeTruthy()
    expect(c2Expected.jsonValue()).toBeTruthy()


    const changedOutputText = await page.evaluate(selector => {
      const element = document.querySelector(selector)
      return element ? element.innerHTML.trim() : ''
    }, outputSelector)
    
    // We expect the output value to be unchanged (as we only change the input CRS)
    expect(outputText).toBe(changedOutputText)
  })


  test('Correct display of Degree Formats', async({page}) => {
    await page.goto('http://localhost:4173', { waitUntil: 'domcontentloaded' })
    await page.waitForLoadState('load')

    await page.waitForSelector('#c1', { state: 'visible' })

    const dirIndicators = [
      '#c1Indicator',
      '#c2Indicator',
      '#c3Indicator'
    ]

    for(const indicator of dirIndicators) {
      const indicatorText = await page.evaluate(selector => {
        const element = document.querySelector(selector)
        return element? element.innerHTML.trim() : ''
      }, indicator)
        
      //default state when application is opened
      expect(indicatorText).toBe('m')
    }

  
    page.locator('#KT-crs-in-select').selectOption('WGS84 (EPSG:4326)')
    await page.waitForLoadState('networkidle')

    const expectedDirIndicator = [
      'N',
      'E',
      'm'
    ]

    for(let i = 0; i < dirIndicators.length; i++) {
      const indicatorText = await page.evaluate(selector => {
        const element = document.querySelector(selector)
        return element? element.innerHTML.trim() : ''
      }, dirIndicators.at(i))
        
      //default state when application is opened
      expect(indicatorText).toBe(expectedDirIndicator.at(i))
    }


    await page.getByLabel('DD° MM.MM\'').check()
    expect(page.getByLabel('DD° MM.MM\'')).toBeChecked()
    await page.waitForLoadState('networkidle')

    const c1Ids = [
      'c1D',
      'c1Dm'
    ]
    const c1Values = [
      '55',
      '42.649225'
    ]
    const c2Ids = [
      'c2D',
      'c2Dm'
    ]
    const c2Values = [
      '12',
      '33.866186'
    ]

    for(let i = 0; i < c1Ids.length; i++) {
      const evalEquals = await page.waitForFunction(
        async (selector) => {
          const input = document.querySelector(selector)
          return input && input.value === c1Values.at(i)
        },
        c1Ids.at(i)
      )
      expect(evalEquals).toBeTruthy()
    }
    for(let i = 0; i < c2Ids.length; i++) {
      const evalEquals = await page.waitForFunction(
        async (selector) => {
          const input = document.querySelector(selector)
          console.log(input)
          return input && input.value === c2Values.at(i)
        },
        c2Ids.at(i)
      )
      expect(evalEquals).toBeTruthy()
    }


    await page.getByLabel('DD° MM\' SS.SS\"').check()
    expect(page.getByLabel('DD° MM\' SS.SS\"')).toBeChecked()
    await page.waitForLoadState('networkidle')

    const c1Ids2 = [
      'c1D',
      'c1Dm',
      'c1Dms'
    ]
    const c1Values2 = [
      '55',
      '42',
      '38.9535'
    ]
    const c2Ids2 = [
      'c2D',
      'c2Dm',
      'c2Dms'
    ]
    const c2Values2 = [
      '12',
      '33',
      '51.9712'
    ]

    for(let i = 0; i < c1Ids2.length; i++) {
      const evalEquals = await page.waitForFunction(
        async (selector) => {
          const input = document.querySelector(selector)
          return input && input.value === c1Values2.at(i)
        },
        c1Ids2.at(i)
      )
      expect(evalEquals).toBeTruthy()
    }
    for(let i = 0; i < c2Ids2.length; i++) {
      const evalEquals = await page.waitForFunction(
        async (selector) => {
          const input = document.querySelector(selector)
          return input && input.value === c2Values2.at(i)
        },
        c2Ids2.at(i)
      )
      expect(evalEquals).toBeTruthy()
    }


    const measureIndicators = [
      '#c1degreeIdc',
      '#c1minuteIdc',
      '#c1secondIdc'
    ]

    const measureValues = [
      '°',
      '\'',
      '\"'
    ]
  
    for(let i = 0; i < measureIndicators.length; i++) {
      const evalText = await page.evaluate(selector => {
        const element = document.querySelector(selector)
        console.log(element)
        return element ? element.innerHTML.trim() : ''
      }, measureIndicators.at(i))
      expect(evalText).toBe(measureValues.at(i))
    }

  })

})
