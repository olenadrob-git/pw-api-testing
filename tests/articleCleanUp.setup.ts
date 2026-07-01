import { test as setup, expect } from '@playwright/test';

setup('Delete article', async({request}) => {
    const articleDeleteResponse = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${process.env.SLUGID}`)
    expect(articleDeleteResponse.status()).toEqual(204)
})