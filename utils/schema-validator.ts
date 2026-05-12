import fs from 'fs/promises'
import path from 'path'
import { Ajv } from "ajv"
import { createSchema } from 'genson-js';

const SCHEMA_BASE_PATH = path.resolve(
    process.cwd(),
    'response-schemas'
)
const ajv = new Ajv({allErrors: true})  // options can be passed, e.g. {allErrors: true}

// change false to true in createSchemaFlag in order to update aal  schemas here and in custom-expext.ts
export async function validateSchema(dirName:string, fileName:string, responceBody: object, createSchemaFlag: boolean = false) {
    const schemaPath = path.join(SCHEMA_BASE_PATH, dirName, `${fileName}_schema.json`)
    
    if(createSchemaFlag) await genereteNewSchema(responceBody, schemaPath)
    
    const schema = await loadSchema(schemaPath)
    const validate = ajv.compile(schema)

    const valid = validate(responceBody)
    if (!valid) {
        throw new Error(
            `Schema validation ${fileName}_schema.json failed:\n` +
            `${JSON.stringify(validate.errors, null, 4)}\n\n` +
            `Actual response body: \n` +
            `${JSON.stringify(responceBody, null, 4)}`
        )
        
    }
}

async function loadSchema (schemaPath:string) {
    try {
        const schemaContent = await fs.readFile(schemaPath, 'utf-8')
        return JSON.parse(schemaContent)
    } catch (error){
        throw new Error(`Failed to read the schema file: ${error.message}`)
    }    
}

async function genereteNewSchema(responceBody:object, schemaPath:string) {
     try {
            const generatedSchema = createSchema(responceBody)
            await fs.mkdir(path.dirname(schemaPath), {recursive: true})  // creates folder if itdoesn't exist 
            await fs.writeFile(schemaPath, JSON.stringify(generatedSchema, null, 4))
        } catch (error) {
            throw new Error(`Failed to create schema file: ${error.message}`)
        }
}
