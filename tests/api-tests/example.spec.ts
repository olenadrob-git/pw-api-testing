import { test, expect, request } from '@playwright/test';


let authToken: string
let title: string 

test.beforeAll('Run before all', async ({request}, testInfo) =>{
  console.log('This is executed before ALL test')

  //LOGIN
  const tokenResponse = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
    data: {"user":{"email":"olenatest@test.com","password":"!234rota"}}
  })
  const tokenResponseJSON = await tokenResponse.json()
  authToken = 'Token ' + tokenResponseJSON.user.token
  //const myUuid = crypto.randomUUID();
  const id = testInfo.workerIndex;
  const uniqueId = `${id}-${Date.now()}`;
  title = `Olena-CRUD-article-${uniqueId}`;
    
  console.log(authToken)
})



test('Get Test Tags', async ({ request }) => {
  const tagsResponse = await request.get('https://conduit-api.bondaracademy.com/api/tags')
  const tagsResponseJSON = await tagsResponse.json()
  
  expect(tagsResponse.status()).toEqual(200)
  expect(tagsResponseJSON.tags[0]).toEqual('Test')
  expect(tagsResponseJSON.tags.length).toBeLessThanOrEqual(10)
  console.log(tagsResponseJSON)
});

test('Get All Articles', async ({request}) => {
  const articlesResponse = await request.get('https://conduit-api.bondaracademy.com/api/articles?limit=4&offset=0')
  const articlesResponseJSON = await articlesResponse.json()
  
  expect(articlesResponse.status()).toEqual(200)
  expect(articlesResponseJSON.articles.length).toBeLessThanOrEqual(10)
  expect(articlesResponseJSON.articlesCount).toEqual(10)
  console.log(articlesResponseJSON)
})

test('Create and delete an Article', async ({request}, testInfo) => {
 

  const newArticleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles/', {
    data: {
            "article": {
                "title": title,
                "description": "API whats about olena",
                "body": "API Main text olena",
                "tagList": [
                    "Olena, Git,"
                ]
            }
    },
    headers: {
      Authorization: authToken
    }
  })

  const newArticleResponseJSON = await newArticleResponse.json()

  console.log(newArticleResponseJSON)
  expect(newArticleResponse.status()).toEqual(201)
  expect(newArticleResponseJSON.article.title).toEqual(title)
  const slugId = newArticleResponseJSON.article.slug

  const articlesResponse = await request.get('https://conduit-api.bondaracademy.com/api/articles?limit=1&offset=0', {
    headers: {
      Authorization: authToken
    }
  })
  const articlesResponseJSON = await articlesResponse.json()
 
  expect(articlesResponse.status()).toEqual(200)
  //expect(articlesResponseJSON.articles[0].title).toEqual(title)
  console.log(articlesResponseJSON)

  const deleteArticleResponse = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${slugId}`, {
    headers: {
      Authorization: authToken
    }
})
  expect (deleteArticleResponse.status()).toEqual(204)
})


test('Create, Update and delete an Article', async ({request}, testInfo) => {
  // CREATE ARTICLE
  const newArticleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles/', {
    data: {
            "article": {
                "title": title,
                "description": `API CRUD whats about olena  ${Date.now()}` ,
                "body": `API Main text olena ${Date.now()}`,
                "tagList": [
                    "Olena, Git"
                ]
            }
    },
    headers: {
      Authorization: authToken
    }
  })

  const newArticleResponseJSON = await newArticleResponse.json()

  console.log(newArticleResponseJSON)
  expect(newArticleResponse.status()).toEqual(201)
  expect(newArticleResponseJSON.article.title).toEqual(title)
  const slugId = newArticleResponseJSON.article.slug

 //CHECK THE created article
  const ceatedArticleResponse = await request.get(`https://conduit-api.bondaracademy.com/api/articles/${slugId}`, {
    headers: {
      Authorization: authToken
    }
  })
  const ceatedArticleResponseJSON = await ceatedArticleResponse.json()
 
  expect(ceatedArticleResponse.status()).toEqual(200)
  expect(ceatedArticleResponseJSON.article.title).toEqual(title)
  console.log(ceatedArticleResponse)


  //UPDATE
  const updateArticleResponse = await request.put(`https://conduit-api.bondaracademy.com/api/articles/${slugId}`, {
    data: {
            "article": {
                "title": `${title}-MODIFIED`,
                "description": `API CRUD - edited whats about olena  ${Date.now()}` ,
                "body": `API CRUD - edited Main text olena ${Date.now()}`,
                "tagList": [
                    "Olena"
                ]
            }
    },
    headers: {
      Authorization: authToken
    }
  })
    const updateArticleResponseJSON = await updateArticleResponse.json()
    
    expect(updateArticleResponse.status()).toEqual(200)
    expect(updateArticleResponseJSON.article.title).toEqual(`${title}-MODIFIED`)

    const newSlugId = updateArticleResponseJSON.article.slug
  
// //CHECK THE LIST2
//   const articlesResponse2 = await request.get('https://conduit-api.bondaracademy.com/api/articles?limit=1&offset=0', {
//     headers: {
//       Authorization: authToken
//     }
//   })
//   const articlesResponse2JSON = await articlesResponse2.json()
 
//   expect(articlesResponse2.status()).toEqual(200)
//   expect(articlesResponse2JSON.articles[0].title).toEqual(`${title}-MODIFIED`)
//   console.log(articlesResponse2JSON)


  //CHECK THE UPDATED ARTICLE
  const getUpdatedArticleResponse = await request.get(`https://conduit-api.bondaracademy.com/api/articles/${newSlugId}`, {
    headers: {
      Authorization: authToken
    }
  })
  const getUpdatedArticleResponseJSON = await getUpdatedArticleResponse.json()
 
  expect(getUpdatedArticleResponse.status()).toEqual(200)
  expect(getUpdatedArticleResponseJSON.article.title).toEqual(`${title}-MODIFIED`)
  console.log(getUpdatedArticleResponseJSON)



  //DELETE
  const deleteArticleResponse = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${newSlugId}`, {
    headers: {
      Authorization: authToken
    }
})
  expect (deleteArticleResponse.status()).toEqual(204)

})



