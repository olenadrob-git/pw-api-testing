import articleRequestPayload from '../request-objects/POST-article.json'
import { faker } from '@faker-js/faker';

export function getNewRandomArticle(){
    const articleRequest = structuredClone(articleRequestPayload)
    articleRequest.article.title = faker.lorem.sentence({ min: 1, max: 5 })
    articleRequest.article.description = faker.lorem.sentence(4)
    articleRequest.article.body = faker.lorem.paragraph({ min: 1, max: 8 })
    articleRequest.article.tagList = faker.helpers.arrayElements(['cat', 'dog', 'mouse'])

    return articleRequest
}