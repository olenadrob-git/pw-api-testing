import { test, expect, request } from '@playwright/test';
import tags from '../../test-data/tags.json'
import { faker } from '@faker-js/faker';


test.beforeEach('Run before each', async ({page} ) =>{
    
    //mocking API - before going to page
    await page.route('https://conduit-api.bondaracademy.com/api/tags', async route =>{
        await route.fulfill({
            body: JSON.stringify(tags)
        })
    })

    
        
    await page.goto('https://conduit.bondaracademy.com/')
    
    //Login
    await page.getByRole('link', {name: " Sign in "}).click()
    await page.getByPlaceholder("Email").fill("olenatest@test.com")
    await page.getByPlaceholder("Password").fill("!234rota")
    await page.getByRole('button', {name: "Sign in"}).click()
    
    
    
    console.log('This is executed before each test')
})


test('Has title and Mocking Tags', async ({ page }) => {

    //mocking API - before going to page - setting first article with different name
    await page.route('https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0', async route =>{
        const response = await route.fetch()
        const responseBody = await response.json()
        responseBody.articles[0].title = "This is a MOCK test title"
        responseBody.articles[0].description = "This is a MOCK test description"

        await route.fulfill({
            body: JSON.stringify(responseBody)
        })
    })

    await page.getByText('Global Feed').click()
    await expect(page.locator('.navbar-brand')).toHaveText('conduit')

    await expect(page.locator('.tag-list')).toContainText('automation');
    await expect(page.locator('.tag-list')).toContainText('PLAYwRIGHT');

    await expect(page.locator('app-article-preview h1').first()).toContainText('This is a MOCK test title');
    await expect(page.locator('app-article-preview p').first()).toContainText('This is a MOCK test description');
})


test('Delete Article', async ({ page, request }) => {
    //Get token
    let authToken: string
     const response = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
         data: {"user":{"email":"olenatest@test.com","password":"!234rota"}}
     })
     const responseJSON = await response.json()
    authToken = 'Token ' + responseJSON.user.token
     
    //Create article
     var title = `Title ${faker.string.nanoid(5)}}`
    const createArticleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles/', {
         data: {"article":{"title": title ,"description":"Description","body":"Body","tagList":["TS"]}
        },
        headers: {
            Authorization: authToken
        }
     })
     const createArticleResponseJSON = await createArticleResponse.json()
     expect(createArticleResponse.status()).toEqual(201)

     await page.getByText('Global Feed').click()
     //await page.getByText('Your Feed').click()
     //await page.goto('https://conduit.bondaracademy.com/')
     await page.getByText(title).click()
     await page.getByRole('button', {name: " Delete Article "}).first().click()
     await page.getByText('Your Feed').click()

    await expect(page.locator('app-article-preview h1').first()).not.toContainText(title);
    await expect(page.locator('app-article-preview p').first()).not.toContainText('description');
})