import { test } from '../../utils/fixtures';
import { expect } from '../../utils/custom-expect';
import { APILogger } from '../../utils/logger';
import { createToken } from '../../helpers/createToken';
import { validateSchema } from '../../utils/schema-validator';
import articleRequestPayload from '../../request-objects/POST-article.json'
import { faker } from '@faker-js/faker';
import { getNewRandomArticle } from '../../utils/data-generator';



test('Get Articles', async ({api}) =>{
    const response = await api
        //.url('https://random.com/api')
        .path('/articles')
        //.headers ({Authorization: authToken})
        .params({limit:10, offset:0})
        //.clearAuth()
        .getRequest(200)
    console.log(response)
    await expect(response).shouldMatchSchema('articles','GET_articles')  // provide third parameter true to create or update the schema    
    
    // Response structure validations
    //expect(response.articles.length).shouldBeLessThanOrEqual(10)
    expect(response.articlesCount).shouldBeGreaterThanOrEqual(response.articles.length)
    expect(response.articles.length).shouldBeGreaterThan(0)
    
    // Article data validations
    response.articles.forEach((article: any) => {
        expect(article.title).toBeTruthy()
        expect(article.title.length).shouldBeGreaterThan(0)
        expect(article.description).toBeTruthy()
        expect(article.slug).toMatch(/^[a-zA-Z0-9\-:.'"]+$/)  // URL-friendly slug (allows hyphens and colons)
        expect(article.favoritesCount).shouldBeGreaterThanOrEqual(0)
        expect(Array.isArray(article.tagList)).toBeTruthy()
        
        // Verify slug matches the title format
        const normalize = (value: string) => {
            return value
                .toLowerCase()
                .replace(/[^\w\s-:.]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
            }
        const normalizedTitle = normalize(article.title)
        const normalizedSlug = normalize(
            article.slug.replace(/-\d+$/, '')
        )
        expect(normalizedSlug).toContain(normalizedTitle)
    })
    
    // Date validations
    response.articles.forEach((article: any) => {
        const createdDate = new Date(article.createdAt)
        const updatedDate = new Date(article.updatedAt)
        expect(createdDate.getTime()).shouldBeLessThanOrEqual(updatedDate.getTime())
    })
    
    // Author validations
    response.articles.forEach((article: any) => {
        expect(article.author).toBeTruthy()
        expect(article.author.username).toBeTruthy()
        expect(article.author.username.length).shouldBeGreaterThan(0)
    })
    
    // Business logic validations
    response.articles.forEach((article: any) => {
        if (article.favorited === true) {
            expect(article.favoritesCount).shouldBeGreaterThan(0)
        }
    })
    
    // Articles should be sorted by createdAt in descending order (newest first)
    for (let i = 0; i < response.articles.length - 1; i++) {
        const currentDate = new Date(response.articles[i].createdAt).getTime()
        const nextDate = new Date(response.articles[i + 1].createdAt).getTime()
        expect(currentDate).shouldBeGreaterThanOrEqual(nextDate)
    }
    
    // All slugs should be unique
    const slugs = response.articles.map((article: any) => article.slug)
    const uniqueSlugs = new Set(slugs)
    expect(slugs.length).shouldEqual(uniqueSlugs.size)
})


test('Get Tags', async ({api}) => {
    const response = await api
        .path('/tags')
        .getRequest(200)
    //console.log(response)
    await expect(response).shouldMatchSchema('tags','GET_tags')  // provide third parameter true to create or update the schema
    expect(response.tags[0]).shouldEqual('Test')
    expect(response.tags.length).shouldBeLessThanOrEqual(10)
})

test('Create and Delete', async ({api} ) =>{
    //const articleTitle = faker.lorem.sentence(5)
    //const articleRequest = JSON.parse(JSON.stringify(articleRequestPayload)) //clone version of file
    // articleRequest.article.title = articleTitle
    const articleRequest = getNewRandomArticle() //clone version of file
    
    // CREATE ARTICLE
    const createArticleResponse = await api
        .path('/articles')
        .body (articleRequest)
        .postRequest(201)
    await expect(createArticleResponse).shouldMatchSchema('articles','POST_articles')  // provide third parameter true to create or update the schema    
    expect(createArticleResponse.article.title).shouldEqual(articleRequest.article.title)
    const slugId = createArticleResponse.article.slug
    console.log(createArticleResponse.article)
    
    // CHECK THAT ARTICLE IS CREATED
    const ArticleResponse = await api
        .path('/articles')
        .params({limit:10, offset:0})
        .getRequest(200)
    await expect(ArticleResponse).shouldMatchSchema('articles','GET_articles') 
    expect(ArticleResponse.articles[0].title).shouldEqual(articleRequest.article.title)
    

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

    //CHECK THAT ARTICLE IS ABSENT  IN THE LIST OF ARTICLES
    const ArticleResponseTwo = await api
        .path('/articles')
        .params({limit:10, offset:0})
        .getRequest(200)
    await expect(ArticleResponseTwo).shouldMatchSchema('articles','GET_articles')
    expect(ArticleResponseTwo.articles[0].title).not.shouldEqual(articleRequest.article.title)        

})

test('Create, Update and Delete', async ({api}) =>{
    const articleTitle = faker.lorem.sentence(5)
    const articleRequest = JSON.parse(JSON.stringify(articleRequestPayload)) //copy version of file
    articleRequest.article.title = articleTitle  
    
    // CREATE ARTICLE
    const createArticleResponse = await api
        .path('/articles')
        .body (articleRequest)
        .postRequest(201)
    await expect(createArticleResponse).shouldMatchSchema('articles','POST_articles')  // provide third parameter true to create or update the schema    
    expect(createArticleResponse.article.title).shouldEqual(articleTitle)
    const slugId = createArticleResponse.article.slug
    console.log(createArticleResponse.article.title)
    
        // CHECK THAT ARTICLE IS CREATED
const ArticleResponse = await api
        .path('/articles')
        .params({limit:10, offset:0})
        .getRequest(200)
    await expect(ArticleResponse).shouldMatchSchema('articles','GET_articles') 
    expect(ArticleResponse.articles[0].title).shouldEqual(articleTitle)
    

        //CHECK THE created article
      const createdArticleResponse = await api
            .path(`/articles/${slugId}`)
            .getRequest(200)
        await expect(createdArticleResponse).shouldMatchSchema('articles','GET_article')  // provide third parameter true to create or update the schema
        expect(createdArticleResponse.article.title).shouldEqual(articleTitle)


        //UPDATE ARTICLE
    const articleTitleTwo = faker.lorem.sentence(4)
    articleRequestPayload.article.title = articleTitleTwo
    
    const updateArticleResponse = await api
        .path(`/articles/${slugId}`)
        .body (articleRequestPayload)
        .putRequest(200)
        
    await expect(updateArticleResponse).shouldMatchSchema('articles','PUT_articles')  // provide third parameter true to create or update the schema    
    expect(updateArticleResponse.article.title).shouldEqual(articleTitleTwo)
    const newSlugId = updateArticleResponse.article.slug
    console.log(newSlugId)
    console.log(updateArticleResponse.article.title)

        
            //CHECK THE UPDATED ARTICLE
      const updatedTheArticleResponse = await api
            .path(`/articles/${newSlugId}`)
            .getRequest(200)
        await expect(updatedTheArticleResponse).shouldMatchSchema('articles','GET_article')  // provide third parameter true to create or update the schema
        expect(updatedTheArticleResponse.article.title).shouldEqual(articleTitleTwo)
    
    // CHECK THAT ARTICLE IS UPDATED IN THE LIST OF ARTICLES
const updatedArticleResponse = await api
        .path('/articles')
        .params({limit:10, offset:0})
        .getRequest(200)
    await expect(updatedArticleResponse).shouldMatchSchema('articles','GET_articles')  // provide third parameter true to create or update the schema
    expect(updatedArticleResponse.articles[0].title).shouldEqual(articleTitleTwo)

      
    
    //DELETE
    await api
        .path(`/articles/${newSlugId}`)
        .deleteRequest(204)

    //CHECK THAT ARTICLE IS ABSENT  IN THE LIST OF ARTICLES
const ArticleResponseTwo = await api
        .path('/articles')
        .params({limit:10, offset:0})
        .getRequest(200)
    await expect(ArticleResponseTwo).shouldMatchSchema('articles','GET_articles')
    expect(ArticleResponseTwo.articles[0].title).not.shouldEqual(articleTitleTwo)        

})