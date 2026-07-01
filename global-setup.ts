import { request, expect } from '@playwright/test';
import user from './.auth/user.json'
import fs from 'fs';
import { faker } from '@faker-js/faker';

console.log('GLOBAL SETUP STARTED');
async function globalSetup() {

     console.log('INSIDE GLOBAL SETUP');
    const authFile = '.auth/user.json'
    const context = await request.newContext()
    
    //Get token
    const responseToken = await context.post('https://conduit-api.bondaracademy.com/api/users/login', {
    data: {"user":{"email":"olenatest@test.com","password":"!234rota"}}
    })
    const responseJSON = await responseToken.json()
    const accessToken = responseJSON.user.token

    user.origins[0].localStorage[0].value = accessToken
    fs.writeFileSync(authFile, JSON.stringify(user))

    process.env['ACCESS_TOKEN'] = accessToken
    
    //Create article
     var title = `GLOBAL Likes test acticle ${faker.string.nanoid(5)}`
    const createArticleResponse = await context.post('https://conduit-api.bondaracademy.com/api/articles/', {
         data: {"article":{"title": title ,"description":"Description","body":"Body","tagList":["TS"]}
        },
        headers: {
            Authorization: `Token ${accessToken}`
         }
     })
     const createArticleResponseJSON = await createArticleResponse.json()
     const slugID = createArticleResponseJSON.article.slug
     expect(createArticleResponse.status()).toEqual(201)
     //console.log('Created slug:', slugID);

     process.env['SLUGID'] = slugID

console.log('Running global setup...');
}


  


export default globalSetup;