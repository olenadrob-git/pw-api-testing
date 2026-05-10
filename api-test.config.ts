const processENV = process.env.TEST_ENV
const env = processENV || 'qa'
console.log('Test environment is: ' + env)


const config = {
    apiUrl: 'https://conduit-api.bondaracademy.com/api',
    userEmail: 'olenatest@test.com',
    userPassword: '!234rota'
}

if(env === 'qa'){
    config.apiUrl = 'https://conduit-api.bondaracademy.com/api',
    config.userEmail = 'olenatest2@test.com',
    config.userPassword = '!234rota2'
}
if(env === 'prod'){
    config.apiUrl = 'https://conduit-api.bondaracademy.com/api',
    config.userEmail = 'olenatest@test.com',
    config.userPassword = '!234rota'
}


export {config}