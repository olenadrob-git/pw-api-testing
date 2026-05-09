//import { url } from 'node:inspector';
import { test } from '../utils/fixtures';
import { expect } from '@playwright/test';
import { APILogger } from '../utils/logger';

let authToken: string
let title: string 

test.beforeAll('Get Token', async ({api}, testInfo) =>{
  //console.log('This is executed before ALL test')

  //LOGIN
  const tokenResponce = await api
    .path('/users/login')
    .body({"user":{"email":"olenatest@test.com","password":"!234rota"}})
    .postRequest(200)

    
    authToken = 'Token ' + tokenResponce.user.token
  //const myUuid = crypto.randomUUID();
  const id = testInfo.workerIndex;
  const uniqueId = `${id}-${Date.now()}`;
  title = `Olena-CRUD-article-${uniqueId}`;
   
})


test('Get Articles', async ({api}) =>{
 
    const responce = await api
        //.url('https://random.com/api')
        .path('/articles')
        .params({limit:10, offset:0})
        .getRequest(200)
    
    expect(responce.articles.length).toBeLessThanOrEqual(10)
    expect(responce.articlesCount).toEqual(10)
       

})

test('Get Tags', async ({api}) => {
    const responce = await api
        .path('/tags')
        .getRequest(200)
    console.log(responce)
    expect(responce.tags[0]).toEqual('Test')
    expect(responce.tags.length).toBeLessThanOrEqual(10)
})

test('Create, Update and Delete', async ({api}) =>{
    // CREATE ARTICLE
    const createArticleResponce = await api
        .path('/articles')
        .headers ({Authorization: authToken})
        .body ({
            "article": {
                "title": title,
                "description": `API CRUD whats about olena  ${Date.now()}`,
                "body": `API Main text olena ${Date.now()}`,
                "tagList": ["Olena"], ["Git"]
                },
        })
        .postRequest(201)
    expect(createArticleResponce.article.title).toEqual(title)
    const slugId = createArticleResponce.article.slug
    console.log(createArticleResponce.article.description)
    
        // CHECK THAT ARTICLE IS CREATED
const ArticleResponce = await api
        .path('/articles')
        .headers ({Authorization: authToken})
        .params({limit:10, offset:0})
        .getRequest(200)
    expect(ArticleResponce.articles[0].title).toEqual(title)

        //UPDATE ARTICLE
    const newTitle = title+" edited "+`${Date.now()}`
    const updateArticleResponce = await api
        .path(`/articles/${slugId}`)
        .headers ({Authorization: authToken})
        .body ({
            "article": {
                "title": newTitle,
                "description": `API CRUD edited whats about olena  ${Date.now()}`,
                "body": `API Main text edited olena ${Date.now()}`,
                "tagList": ["Olena, Git"]
                },
        })
        .putRequest(200)
    expect(updateArticleResponce.article.title).toEqual(newTitle)
    const newSlugId = updateArticleResponce.article.slug
    console.log(newSlugId)
    console.log(updateArticleResponce.article.description)

        // CHECK THAT ARTICLE IS UPDATED
const updetedArticleResponce = await api
        .path('/articles')
        .headers ({Authorization: authToken})
        .params({limit:10, offset:0})
        .getRequest(200)
    expect(updetedArticleResponce.articles[0].title).toEqual(newTitle)

    //DELETE
    await api
        .path(`/articles/${newSlugId}`)
        .headers ({Authorization: authToken})
        .deleteRequest(204)

    //CHECK THAT ARTICLE IS ABSENT
const ArticleResponceTwo = await api
        .path('/articles')
        .headers ({Authorization: authToken})
        .params({limit:10, offset:0})
        .getRequest(200)
    expect(ArticleResponceTwo.articles[0].title).not.toEqual(newTitle)        

})