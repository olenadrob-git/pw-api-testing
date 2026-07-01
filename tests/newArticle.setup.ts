import { test as setup, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';


setup('Create new article', async({request, page}) => {
    
    //Create article
     var title = `Likes test acticle ${faker.string.nanoid(5)}`
    const createArticleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles/', {
         data: {"article":{"title": title ,"description":"Description","body":"Body","tagList":["TS"]}
        },
        // headers: {
        //     Authorization: authToken
        // }
     })
     const createArticleResponseJSON = await createArticleResponse.json()
     const slugID = createArticleResponseJSON.article.slug
     expect(createArticleResponse.status()).toEqual(201)

     process.env['SLUGID'] = slugID
})