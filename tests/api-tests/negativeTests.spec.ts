import { test } from '../../utils/fixtures';
import { expect } from '../../utils/custom-expect';
import { APILogger } from '../../utils/logger';
import { createToken } from '../../helpers/createToken';
import { validateSchema } from '../../utils/schema-validator';
import articleRequestPayload from '../../request-objects/POST-article.json'
import { faker } from '@faker-js/faker';
import { getNewRandomArticle } from '../../utils/data-generator';

[
    { check: "eva - Blank - invalid", username: '', userErrorMessage: "can't be blank"},
    { check: "bva - 2 char - invalid", username: faker.string.alphanumeric(2), userErrorMessage: 'is too short (minimum is 3 characters)'},
    { check: "bva - 3 char - valid", username: faker.string.alphanumeric(3), userErrorMessage: ''},
    { check: "eva - 3-20 char - valid", username: faker.string.alphanumeric({length: { min: 3, max: 20 }}), userErrorMessage: ''}, // faker.string.alphanumeric({length: { min: 3, max: 20 }})
    { check: "bva - 20 char - valid", username: faker.string.alphanumeric(20), userErrorMessage: ''}, // faker.string.alphanumeric(20)
    { check: "bva - 21 char - invalid", username: faker.string.alphanumeric(21), userErrorMessage: 'is too long (maximum is 20 characters)'} //faker.string.alphanumeric(21)
].forEach(({check, username, userErrorMessage}) =>{

    test(`Error message validations for ${check}`, async ({api}) =>{
        const currentUserName = username
        const newUserResponce = await api
            .path('/users')
            .body({
                "user": {
                    "email": "q",
                    "password": "q",
                    "username": currentUserName
                }
            })
            .clearAuth() // regular call without authorization
            .postRequest(422)
        
        if(currentUserName.length >=3 && currentUserName.length <=20){
            expect(newUserResponce.errors).not.toHaveProperty('username')
        } else {
            expect(newUserResponce.errors.username[0]).shouldEqual(userErrorMessage)
        }       
        // console.log(`${check} \n ${currentUserName} \n ${newUserResponce}`)
        // console.log(newUserResponce)
    })
})