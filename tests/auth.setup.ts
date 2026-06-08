import { test as setup } from '@playwright/test';
import fs from 'fs';

const authFile = '.auth/user.json'

setup('authentification', async({page}) => {
    fs.mkdirSync('.auth', { recursive: true });

    await page.goto('https://conduit.bondaracademy.com/');
    await page.getByRole('link', { name: 'Sign in' }).click();
    await page.getByRole('textbox', { name: 'Email' }).fill('olenatest@test.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('!234rota');
    await page.getByRole('button', { name: 'Sign in' }).click();

    await page.waitForResponse('https://conduit-api.bondaracademy.com/api/tags')


    await page.context().storageState({path: authFile})
})