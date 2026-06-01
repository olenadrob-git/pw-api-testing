import { test, expect } from '@playwright/test';
import tags from '../../test-data/tags.json'

test.beforeEach('Run before each', async ({page} ) =>{
    
    //mocking API - before going to page
    await page.route('https://conduit-api.bondaracademy.com/api/tags', async route =>{
        await route.fulfill({
            body: JSON.stringify(tags)
        })
    })

    await page.route('https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0', async route =>{
        const response = await route.fetch()
        const responseBody = await response.json()
        responseBody.articles[0].title = "This is a test title"
        responseBody.articles[0].description = "This is a test description"

        await route.fulfill({
            body: JSON.stringify(responseBody)
        })
    })
        
    await page.goto('https://conduit.bondaracademy.com/')
    console.log('This is executed before each test')
})


test('Has title and Mocking Tags', async ({ page }) => {
    await expect(page.locator('.navbar-brand')).toHaveText('conduit')

    await expect(page.locator('.tag-list')).toContainText('automation');
    await expect(page.locator('.tag-list')).toContainText('PLAYwRIGHT');

    await expect(page.locator('app-article-preview h1').first()).toContainText('This is a test title');
    await expect(page.locator('app-article-preview p').first()).toContainText('This is a test description');
})