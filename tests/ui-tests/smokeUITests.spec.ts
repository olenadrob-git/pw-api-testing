import { test, expect, request } from '@playwright/test';
import { faker } from '@faker-js/faker';


test('Create - Edit - Delete Article', async ({page, request}) =>{

await page.goto('https://conduit.bondaracademy.com/');
await page.getByRole('link', {name: " New Article "}).click()
await page.getByRole('textbox', { name: 'Article Title' }).fill(faker.lorem.paragraph({ min: 1, max: 3 }));
await page.getByRole('textbox', { name: 'What\'s this article about?' }).fill('Description Olena');
await page.getByRole('textbox', { name: 'Write your article (in Markdown)' }).fill('Body Olena');
await page.getByRole('textbox', { name: 'Enter tags' }).fill('Tag');
await page.getByRole('button', { name: 'Publish Article' }).click();

await page.getByRole('link', { name: ' Edit Article ' }).first().click();
await page.getByRole('textbox', { name: 'Article Title' }).fill('title Olena2');
await page.getByRole('textbox', { name: 'What\'s this article about?' }).fill('Descriptopn Olena3');
await page.getByRole('textbox', { name: 'Write your article (in Markdown)' }).fill('Body Olena 4');
await page.getByRole('textbox', { name: 'Enter tags' }).fill('tag5');
await page.getByRole('button', { name: 'Publish Article' }).click();

await page.getByRole('button', { name: ' Delete Article' }).first().click();

})