import { test as setup } from '@playwright/test';
import user from '../.auth/user.json'
import fs from 'fs';

const authFile = '.auth/user.json'

setup('authentification', async({request}) => {
    fs.mkdirSync('.auth', { recursive: true });

//UA authentification
    // await page.goto('https://conduit.bondaracademy.com/');
    // await page.getByRole('link', { name: 'Sign in' }).click();
    // await page.getByRole('textbox', { name: 'Email' }).fill('olenatest@test.com');
    // await page.getByRole('textbox', { name: 'Password' }).fill('!234rota');
    // await page.getByRole('button', { name: 'Sign in' }).click();

    // await page.waitForResponse('https://conduit-api.bondaracademy.com/api/tags')
    //await page.context().storageState({path: authFile})




//Get token
         const response = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
         data: {"user":{"email":"olenatest@test.com","password":"!234rota"}}
     })
    const responseJSON = await response.json()
    const accessToken = responseJSON.user.token

    user.origins[0].localStorage[0].value = accessToken
    user.origins[0].localStorage[0].value = accessToken
    fs.writeFileSync[authFile, JSON.stringify()]

    process.env['ACCESS_TOKEN'] = accessToken
})