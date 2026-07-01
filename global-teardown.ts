import { request, expect } from '@playwright/test';

console.log('GLOBAL TEARDOWN FILE LOADED');
async function globalTeardown() {
    console.log('GLOBAL TEARDOWN STARTED');
    const context = await request.newContext()
    
    //console.log('SLUGID:', process.env.SLUGID);
    //console.log('ACCESS_TOKEN:', process.env.ACCESS_TOKEN);

    const articleDeleteResponse = await context.delete(`https://conduit-api.bondaracademy.com/api/articles/${process.env.SLUGID}`, {
        headers: {
            Authorization: `Token ${process.env.ACCESS_TOKEN}`
         }
    })
    expect(articleDeleteResponse.status()).toEqual(204)
    
    //console.log(await articleDeleteResponse.text())
    console.log('GLOBAL TEARDOWN');
}

export default globalTeardown;
console.log('GLOBAL TEARDOWN EXECUTED');