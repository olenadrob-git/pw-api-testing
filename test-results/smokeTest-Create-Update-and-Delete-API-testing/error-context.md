# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: smokeTest.spec.ts >> Create, Update and Delete
- Location: tests\smokeTest.spec.ts:51:5

# Error details

```
Error: expect(received).shouldEqual(expected)

Expected:  "Olena-CRUD-article-0-17784380777451"
Received: "Olena-CRUD-article-0-1778438077745"

Recent API Activity: 
===Request Details===
{
    "method": "POST",
    "url": "https://conduit-api.bondaracademy.com/api/articles",
    "headers": {
        "Authorization": "Token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjo1MzY0OH0sImlhdCI6MTc3ODQzODA3OCwiZXhwIjoxNzgzNjIyMDc4fQ.lsQupPFc_wu5yZzn179YyU_-HJ9Cm8PNqtMm552eoas"
    },
    "body": {
        "article": {
            "title": "Olena-CRUD-article-0-1778438077745",
            "description": "API CRUD whats about olena  1778438078479",
            "body": "API Main text olena 1778438078479",
            "tagList": [
                "Olena"
            ]
        }
    }
}

===Responce Details===
{
    "statusCode": 201,
    "body": {
        "article": {
            "slug": "Olena-CRUD-article-0-1778438077745-53648",
            "title": "Olena-CRUD-article-0-1778438077745",
            "description": "API CRUD whats about olena  1778438078479",
            "body": "API Main text olena 1778438078479",
            "tagList": [
                "Olena"
            ],
            "createdAt": "2026-05-10T18:34:39.050Z",
            "updatedAt": "2026-05-10T18:34:39.050Z",
            "favorited": false,
            "favoritesCount": 0,
            "author": {
                "username": "OlenaQA",
                "bio": null,
                "image": "https://conduit-api.bondaracademy.com/images/smiley-cyrus.jpeg",
                "following": false
            }
        }
    }
}
```

# Test source

```ts
  1   | //import { url } from 'node:inspector';
  2   | import { test } from '../utils/fixtures';
  3   | import { expect } from '../utils/custom-expect';
  4   | import { APILogger } from '../utils/logger';
  5   | import { createToken } from '../helpers/createToken';
  6   | 
  7   | let authToken: string
  8   | let title: string 
  9   | 
  10  | test.beforeAll('Get Token', async ({api, config}, testInfo) =>{
  11  |   //console.log('This is executed before ALL test')
  12  | 
  13  |   //LOGIN
  14  |   const tokenResponce = await api
  15  |     // .path('/users/login')
  16  |     // .body({"user":{"email": config.userEmail,"password": config.userPassword}})
  17  |     // .postRequest(200);
  18  |     authToken = await createToken(config.userEmail, config.userPassword)
  19  |     
  20  | 
  21  |   
  22  |     //const myUuid = crypto.randomUUID();
  23  |   const id = testInfo.workerIndex;
  24  |   const uniqueId = `${id}-${Date.now()}`;
  25  |   title = `Olena-CRUD-article-${uniqueId}`;
  26  |    
  27  | })
  28  | 
  29  | 
  30  | test('Get Articles', async ({api}) =>{
  31  |  
  32  |     const responce = await api
  33  |         //.url('https://random.com/api')
  34  |         .path('/articles')
  35  |         .params({limit:10, offset:0})
  36  |         .getRequest(200)
  37  |     
  38  |     expect(responce.articles.length).shouldBeLessThanOrEqual(10)
  39  |     expect(responce.articlesCount).shouldEqual(10)
  40  | })
  41  | 
  42  | test('Get Tags', async ({api}) => {
  43  |     const responce = await api
  44  |         .path('/tags')
  45  |         .getRequest(200)
  46  |     console.log(responce)
  47  |     expect(responce.tags[0]).shouldEqual('Test')
  48  |     expect(responce.tags.length).shouldBeLessThanOrEqual(10)
  49  | })
  50  | 
  51  | test('Create, Update and Delete', async ({api}) =>{
  52  |     // CREATE ARTICLE
  53  |     const createArticleResponce = await api
  54  |         .path('/articles')
  55  |         .headers ({Authorization: authToken})
  56  |         .body ({
  57  |             "article": {
  58  |                 "title": title,
  59  |                 "description": `API CRUD whats about olena  ${Date.now()}`,
  60  |                 "body": `API Main text olena ${Date.now()}`,
  61  |                 "tagList": ["Olena"]
  62  |                 }
  63  |         })
  64  |         .postRequest(201)
> 65  |     expect(createArticleResponce.article.title).shouldEqual(title + '1')
      |                                                 ^ Error: expect(received).shouldEqual(expected)
  66  |     const slugId = createArticleResponce.article.slug
  67  |     console.log(createArticleResponce.article.description)
  68  |     
  69  |         // CHECK THAT ARTICLE IS CREATED
  70  | const ArticleResponce = await api
  71  |         .path('/articles')
  72  |         .headers ({Authorization: authToken})
  73  |         .params({limit:10, offset:0})
  74  |         .getRequest(200)
  75  |     expect(ArticleResponce.articles[0].title).shouldEqual(title)
  76  | 
  77  |         //UPDATE ARTICLE
  78  |     const newTitle = title+" edited "+`${Date.now()}`
  79  |     const updateArticleResponce = await api
  80  |         .path(`/articles/${slugId}`)
  81  |         .headers ({Authorization: authToken})
  82  |         .body ({
  83  |             "article": {
  84  |                 "title": newTitle,
  85  |                 "description": `API CRUD edited whats about olena  ${Date.now()}`,
  86  |                 "body": `API Main text edited olena ${Date.now()}`,
  87  |                 "tagList": ["Olena, Git"]
  88  |                 },
  89  |         })
  90  |         .putRequest(200)
  91  |     expect(updateArticleResponce.article.title).shouldEqual(newTitle)
  92  |     const newSlugId = updateArticleResponce.article.slug
  93  |     console.log(newSlugId)
  94  |     console.log(updateArticleResponce.article.description)
  95  | 
  96  |         // CHECK THAT ARTICLE IS UPDATED
  97  | const updetedArticleResponce = await api
  98  |         .path('/articles')
  99  |         .headers ({Authorization: authToken})
  100 |         .params({limit:10, offset:0})
  101 |         .getRequest(200)
  102 |     expect(updetedArticleResponce.articles[0].title).shouldEqual(newTitle)
  103 | 
  104 |     //DELETE
  105 |     await api
  106 |         .path(`/articles/${newSlugId}`)
  107 |         .headers ({Authorization: authToken})
  108 |         .deleteRequest(204)
  109 | 
  110 |     //CHECK THAT ARTICLE IS ABSENT
  111 | const ArticleResponceTwo = await api
  112 |         .path('/articles')
  113 |         .headers ({Authorization: authToken})
  114 |         .params({limit:10, offset:0})
  115 |         .getRequest(200)
  116 |     expect(ArticleResponceTwo.articles[0].title).not.shouldEqual(newTitle)        
  117 | 
  118 | })
```