import { test } from '../../utils/fixtures';
import { expect } from '../../utils/custom-expect';
import { APILogger } from '../../utils/logger';
import { createToken } from '../../helpers/createToken';
import { validateSchema } from '../../utils/schema-validator';
import articleRequestPayload from '../../request-objects/POST-article.json'
import { faker } from '@faker-js/faker';
import { getNewRandomArticle } from '../../utils/data-generator';



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

test('Create and Delete', async ({api} ) =>{
    //const articleTitle = faker.lorem.sentence(5)
    //const articleRequest = JSON.parse(JSON.stringify(articleRequestPayload)) //clone version of file
    // articleRequest.article.title = articleTitle
    const articleRequest = getNewRandomArticle() //clone version of file
    
    // CREATE ARTICLE
    const createArticleResponce = await api
        .path('/articles')
        .body (articleRequest)
        .postRequest(201)
    await expect(createArticleResponce).shouldMatchSchema('articles','POST_articles')  // provide third parameter true to create or update the schema    
    expect(createArticleResponce.article.title).shouldEqual(articleRequest.article.title)
    const slugId = createArticleResponce.article.slug
    console.log(createArticleResponce.article)
    
    // CHECK THAT ARTICLE IS CREATED
    const ArticleResponce = await api
        .path('/articles')
        .params({limit:10, offset:0})
        .getRequest(200)
    await expect(ArticleResponce).shouldMatchSchema('articles','GET_articles') 
    expect(ArticleResponce.articles[0].title).shouldEqual(articleRequest.article.title)
    

        //CHECK THE created article
      const createdArticleResponse = await api
            .path(`/articles/${slugId}`)
            .getRequest(200)
        await expect(createdArticleResponse).shouldMatchSchema('articles','GET_article')  // provide third parameter true to create or update the schema
        expect(createdArticleResponse.article.title).shouldEqual(articleRequest.article.title)

    
    //DELETE
    await api
        .path(`/articles/${slugId}`)
        .deleteRequest(204)

    //CHECK THAT ARTICLE IS ABSENT
    const ArticleResponceTwo = await api
        .path('/articles')
        .params({limit:10, offset:0})
        .getRequest(200)
    
    expect(ArticleResponceTwo.articles[0].title).not.shouldEqual(articleRequest.article.title)        

})

test('Create, Update and Delete', async ({api}) =>{
    const articleTitle = faker.lorem.sentence(5)
    const articleRequest = JSON.parse(JSON.stringify(articleRequestPayload)) //copy version of file
    articleRequest.article.title = articleTitle  
    
    // CREATE ARTICLE
    const createArticleResponce = await api
        .path('/articles')
        .body (articleRequest)
        .postRequest(201)
    await expect(createArticleResponce).shouldMatchSchema('articles','POST_articles')  // provide third parameter true to create or update the schema    
    expect(createArticleResponce.article.title).shouldEqual(articleTitle)
    const slugId = createArticleResponce.article.slug
    console.log(createArticleResponce.article.title)
    
        // CHECK THAT ARTICLE IS CREATED
const ArticleResponce = await api
        .path('/articles')
        .params({limit:10, offset:0})
        .getRequest(200)
    await expect(ArticleResponce).shouldMatchSchema('articles','GET_articles') 
    expect(ArticleResponce.articles[0].title).shouldEqual(articleTitle)
    

        //CHECK THE created article
      const createdArticleResponse = await api
            .path(`/articles/${slugId}`)
            .getRequest(200)
        await expect(createdArticleResponse).shouldMatchSchema('articles','GET_article')  // provide third parameter true to create or update the schema
        expect(createdArticleResponse.article.title).shouldEqual(articleTitle)


        //UPDATE ARTICLE
    const articleTitleTwo = faker.lorem.sentence(4)
    articleRequestPayload.article.title = articleTitleTwo
    
    const updateArticleResponce = await api
        .path(`/articles/${slugId}`)
        .body (articleRequestPayload)
        .putRequest(200)
        
    await expect(updateArticleResponce).shouldMatchSchema('articles','PUT_articles')  // provide third parameter true to create or update the schema    
    expect(updateArticleResponce.article.title).shouldEqual(articleTitleTwo)
    const newSlugId = updateArticleResponce.article.slug
    console.log(newSlugId)
    console.log(updateArticleResponce.article.title)

        
            //CHECK THE UPDATED ARTICLE
      const updatedTheArticleResponce = await api
            .path(`/articles/${newSlugId}`)
            .getRequest(200)
        await expect(updatedTheArticleResponce).shouldMatchSchema('articles','GET_article')  // provide third parameter true to create or update the schema
        expect(updatedTheArticleResponce.article.title).shouldEqual(articleTitleTwo)
    
    // CHECK THAT ARTICLE IS UPDATED IN LIST OF ARTICLES
const updatedArticleResponce = await api
        .path('/articles')
        .params({limit:10, offset:0})
        .getRequest(200)
    await expect(updatedArticleResponce).shouldMatchSchema('articles','GET_articles')  // provide third parameter true to create or update the schema    
    expect(updatedArticleResponce.articles[0].title).shouldEqual(articleTitleTwo)

      
    
    //DELETE
    await api
        .path(`/articles/${newSlugId}`)
        .deleteRequest(204)

    //CHECK THAT ARTICLE IS ABSENT
const ArticleResponceTwo = await api
        .path('/articles')
        .params({limit:10, offset:0})
        .getRequest(200)
    
    expect(ArticleResponceTwo.articles[0].title).not.shouldEqual(articleTitleTwo)        

})