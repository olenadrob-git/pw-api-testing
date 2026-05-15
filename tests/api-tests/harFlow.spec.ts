import { test } from '../../utils/fixtures';
import { expect } from '../../utils/custom-expect';
import { faker } from '@faker-js/faker';
import articleRequestPayload from '../../request-objects/POST-article.json'


test('HAR Flow - Create Article with Comments', async ({api}) => {
    // Step 1: Get initial articles list
    const initialArticlesResponse = await api
        .path('/articles')
        .params({limit: 10, offset: 0})
        .getRequest(200)
    await expect(initialArticlesResponse).shouldMatchSchema('articles', 'GET_articles')
    expect(initialArticlesResponse.articles).toBeTruthy()
    expect(initialArticlesResponse.articlesCount).shouldBeGreaterThanOrEqual(0)

    // Step 2: Get tags list
    const tagsResponse = await api
        .path('/tags')
        .getRequest(200)
    await expect(tagsResponse).shouldMatchSchema('tags', 'GET_tags')
    expect(tagsResponse.tags).toBeTruthy()
    expect(tagsResponse.tags.length).shouldBeGreaterThan(0)

    // Step 3: Create new article with random data
    const randomTitle = faker.lorem.sentence(5)
    const randomDescription = faker.lorem.sentences(2)
    const randomBody = faker.lorem.paragraphs(2)
    
    const articleRequest = structuredClone(articleRequestPayload)
    articleRequest.article.title = randomTitle
    articleRequest.article.description = randomDescription
    articleRequest.article.body = randomBody
    articleRequest.article.tagList = [tagsResponse.tags[0]] // Use first available tag
    
    const createArticleResponse = await api
        .path('/articles')
        .body(articleRequest)
        .postRequest(201)
    await expect(createArticleResponse).shouldMatchSchema('articles', 'POST_articles')
    expect(createArticleResponse.article.title).shouldEqual(randomTitle)
    expect(createArticleResponse.article.slug).toBeTruthy()
    const articleSlug = createArticleResponse.article.slug

    // Step 4: Get the created article by slug
    const getArticleResponse = await api
        .path(`/articles/${articleSlug}`)
        .getRequest(200)
    await expect(getArticleResponse).shouldMatchSchema('articles', 'GET_article')
    expect(getArticleResponse.article.title).shouldEqual(randomTitle)
    expect(getArticleResponse.article.slug).shouldEqual(articleSlug)

    // Step 5: Get comments for the article (should be empty)
    const getCommentsResponse = await api
        .path(`/articles/${articleSlug}/comments`)
        .getRequest(200)
    await expect(getCommentsResponse).shouldMatchSchema('articles', 'GET_article_comments')
    expect(getCommentsResponse.comments).toBeTruthy()
    expect(Array.isArray(getCommentsResponse.comments)).toBeTruthy()
    const initialCommentsCount = getCommentsResponse.comments.length

    // Step 6: Create a comment on the article
    const commentBody = faker.lorem.sentences(1)
    const createCommentResponse = await api
        .path(`/articles/${articleSlug}/comments`)
        .body({comment: {body: commentBody}})
        .postRequest(200)
    await expect(createCommentResponse).shouldMatchSchema('articles', 'POST_article_comments')
    expect(createCommentResponse.comment.body).shouldEqual(commentBody)
    expect(createCommentResponse.comment.id).toBeTruthy()
    const commentId = createCommentResponse.comment.id

    // Step 7: Verify comment was added to the article
    const verifyCommentsResponse = await api
        .path(`/articles/${articleSlug}/comments`)
        .getRequest(200)
    await expect(verifyCommentsResponse).shouldMatchSchema('articles', 'GET_article_comments')
    expect(verifyCommentsResponse.comments.length).shouldEqual(initialCommentsCount + 1)
    
    const addedComment = verifyCommentsResponse.comments.find((c: any) => c.id === commentId)
    expect(addedComment).toBeTruthy()
    expect(addedComment.body).shouldEqual(commentBody)

    // Step 8: Verify article still appears in articles list with updated data
    const updatedArticlesResponse = await api
        .path('/articles')
        .params({limit: 10, offset: 0})
        .getRequest(200)
    await expect(updatedArticlesResponse).shouldMatchSchema('articles', 'GET_articles')
    expect(updatedArticlesResponse.articlesCount).shouldEqual(initialArticlesResponse.articlesCount + 1)
    
    const createdArticle = updatedArticlesResponse.articles.find((a: any) => a.slug === articleSlug)
    expect(createdArticle).toBeTruthy()
    expect(createdArticle.title).shouldEqual(randomTitle)
})
