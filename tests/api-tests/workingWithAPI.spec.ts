import { test, expect } from '@playwright/test';
import tags from '../../test-data/tags.json'

test.beforeEach('Run before each', async ({page} ) =>{
    
    //mocking API - before going to page
    await page.route('https://conduit-api.bondaracademy.com/api/tags', async route =>{
        await route.fulfill({
            body: JSON.stringify(tags)
        })
    })
        
    await page.goto('https://conduit.bondaracademy.com/')
    console.log('This is executed before each test')
})

test('Has title and Mocking Tags', async ({ page }) => {
    await expect(page.locator('.navbar-brand')).toHaveText('conduit')

    await expect(page.locator('.tag-list')).toContainText('automation');
    await expect(page.locator('.tag-list')).toContainText('PLAYwRIGHT');
})