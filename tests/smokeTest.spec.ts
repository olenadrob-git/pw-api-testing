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
    
    await expect(responce).shouldMatchSchema('articles','GET_articles')  // provide third parameter true to create or update the schema    
    expect(responce.articles.length).shouldBeLessThanOrEqual(10)
    expect(responce.articlesCount).shouldEqual(10)
})

test('Get Tags', async ({api}) => {
    const responce = await api
        .path('/tags')
        .getRequest(200)
    //console.log(responce)
    await expect(responce).shouldMatchSchema('tags','GET_tags')  // provide third parameter true to create or update the schema
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
    await expect(createArticleResponce).shouldMatchSchema('articles','POST_articles')  // provide third parameter true to create or update the schema    
    expect(createArticleResponce.article.title).shouldEqual(title)
    const slugId = createArticleResponce.article.slug
    console.log(createArticleResponce.article.description)
    
        // CHECK THAT ARTICLE IS CREATED
const ArticleResponce = await api
        .path('/articles')
        .params({limit:10, offset:0})
        .getRequest(200)
    await expect(ArticleResponce).shouldMatchSchema('articles','GET_articles') 
    expect(ArticleResponce.articles[0].title).shouldEqual(title)


        //CHECK THE created article
      const ceatedArticleResponse = await api
            .path(`/articles/${slugId}`)
            .getRequest(200)
        await expect(ceatedArticleResponse).shouldMatchSchema('articles','GET_article')  // provide third parameter true to create or update the schema
        expect(ceatedArticleResponse.article.title).shouldEqual(title)


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
        
    await expect(updateArticleResponce).shouldMatchSchema('articles','PUT_articles')  // provide third parameter true to create or update the schema    
    expect(updateArticleResponce.article.title).shouldEqual(newTitle)
    const newSlugId = updateArticleResponce.article.slug
    console.log(newSlugId)
    console.log(updateArticleResponce.article.description)

        
            //CHECK THE UPDATED ARTICLE
      const updatedTheArticleResponce = await api
            .path(`/articles/${newSlugId}`)
            .getRequest(200)
        await expect(updatedTheArticleResponce).shouldMatchSchema('articles','GET_article')  // provide third parameter true to create or update the schema
        expect(updatedTheArticleResponce.article.title).shouldEqual(newTitle)
    
    // CHECK THAT ARTICLE IS UPDATED IN LIST OF ARTICLES
const updatedArticleResponce = await api
        .path('/articles')
        .params({limit:10, offset:0})
        .getRequest(200)
    await expect(updatedArticleResponce).shouldMatchSchema('articles','GET_articles')  // provide third parameter true to create or update the schema    
    expect(updatedArticleResponce.articles[0].title).shouldEqual(newTitle)

      
    
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