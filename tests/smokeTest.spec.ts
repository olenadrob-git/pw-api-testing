//import { url } from 'node:inspector';
import { test } from '../utils/fixtures';
import { expect } from '../utils/custom-expect';
import { APILogger } from '../utils/logger';
import { createToken } from '../helpers/createToken';
import { validateSchema } from '../utils/schema-validator';



test('Get Articles', async ({api}) =>{
 
    const responce = await api
        //.url('https://random.com/api')
        .path('/articles')
        //.headers ({Authorization: authToken})
        .params({limit:10, offset:0})
        //.clearAuth()
        .getRequest(200)
    
    expect(responce.articles.length).shouldBeLessThanOrEqual(10)
    expect(responce.articlesCount).shouldEqual(10)
})

test('Get Tags', async ({api}) => {
    const responce = await api
        .path('/tags')
        .getRequest(200)
    //console.log(responce)

    await validateSchema('/tags', 'GET_tags')
    
    expect(responce.tags[0]).shouldEqual('Test')
    expect(responce.tags.length).shouldBeLessThanOrEqual(10)
})

test('Create, Update and Delete', async ({api}, testInfo) =>{
    let title: string 
    //const myUuid = crypto.randomUUID();
    const id = testInfo.workerIndex;
    const uniqueId = `${id}-${Date.now()}`;
    title = `Olena-CRUD-article-${uniqueId}`;   
    
    // CREATE ARTICLE
    const createArticleResponce = await api
        .path('/articles')
        .body ({
            "article": {
                "title": title,
                "description": `API CRUD whats about olena  ${Date.now()}`,
                "body": `API Main text olena ${Date.now()}`,
                "tagList": ["Olena"]
                }
        })
        .postRequest(201)
    expect(createArticleResponce.article.title).shouldEqual(title)
    const slugId = createArticleResponce.article.slug
    console.log(createArticleResponce.article.description)
    
        // CHECK THAT ARTICLE IS CREATED
const ArticleResponce = await api
        .path('/articles')
        .params({limit:10, offset:0})
        .getRequest(200)
    expect(ArticleResponce.articles[0].title).shouldEqual(title)

        //UPDATE ARTICLE
    const newTitle = title+" edited "+`${Date.now()}`
    const updateArticleResponce = await api
        .path(`/articles/${slugId}`)
        .body ({
            "article": {
                "title": newTitle,
                "description": `API CRUD edited whats about olena  ${Date.now()}`,
                "body": `API Main text edited olena ${Date.now()}`,
                "tagList": ["Olena, Git"]
                },
        })
        .putRequest(200)
    expect(updateArticleResponce.article.title).shouldEqual(newTitle)
    const newSlugId = updateArticleResponce.article.slug
    console.log(newSlugId)
    console.log(updateArticleResponce.article.description)

        // CHECK THAT ARTICLE IS UPDATED
const updetedArticleResponce = await api
        .path('/articles')
        .params({limit:10, offset:0})
        .getRequest(200)
    expect(updetedArticleResponce.articles[0].title).shouldEqual(newTitle)

    //DELETE
    await api
        .path(`/articles/${newSlugId}`)
        .deleteRequest(204)

    //CHECK THAT ARTICLE IS ABSENT
const ArticleResponceTwo = await api
        .path('/articles')
        .params({limit:10, offset:0})
        .getRequest(200)
    expect(ArticleResponceTwo.articles[0].title).not.shouldEqual(newTitle)        

})