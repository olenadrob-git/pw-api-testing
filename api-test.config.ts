import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '.env') });


const processENV = process.env.TEST_ENV
const env = processENV || 'dev'
console.log(`Test environment is: ${env}`)


const config = {
    apiUrl: 'https://conduit-api.bondaracademy.com/api',
    userEmail: process.env.DEV_USERNAME as string,
    userPassword: process.env.DEV_PASSWORD as string
}

if(env === 'qa') {
    console.log(`config qa`)
    config.apiUrl = 'https://conduit-api.bondaracademy.com/api',
    config.userEmail =  process.env.QA_USERNAME as string,
    config.userPassword = process.env.QA_PASSWORD as string
}

if(env === 'prod'){
    // if(! process.env.PROD_USERNAME || ! process.env.PROD_PASSWORD){
    //     throw Error('Missing required environment variable')
    // }
    config.apiUrl = 'https://conduit-api.bondaracademy.com/api',
    config.userEmail = process.env.PROD_USERNAME as string,
    config.userPassword = process.env.PROD_PASSWORD as string
    }

export {config}