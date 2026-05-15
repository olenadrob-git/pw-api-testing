import fs from 'fs/promises'
import path from 'path'
import { Ajv } from "ajv"
import { createSchema } from 'genson-js'
import addFormats from "ajv-formats"

const SCHEMA_BASE_PATH = path.resolve(
    process.cwd(),
    'response-schemas'
)
const ajv = new Ajv({allErrors: true})  // options can be passed, e.g. {allErrors: true}
addFormats(ajv) //https://ajv.js.org/packages/ajv-formats.html 


// change false to true in createSchemaFlag in order to update aal  schemas here and in custom-expext.ts
export async function validateSchema(dirName:string, fileName:string, responseBody: object, createSchemaFlag: boolean = false) {
    const schemaPath = path.join(SCHEMA_BASE_PATH, dirName, `${fileName}_schema.json`)
    
    if(createSchemaFlag) await generateNewSchema(responseBody, schemaPath)
    
    const schema = await loadSchema(schemaPath)
    const validate = ajv.compile(schema)

    const valid = validate(responseBody)
    if (!valid) {
        throw new Error(
            `Schema validation ${fileName}_schema.json failed:\n` +
            `${JSON.stringify(validate.errors, null, 4)}\n\n` +
            `Actual response body: \n` +
            `${JSON.stringify(responseBody, null, 4)}`
        )
        
    }
}

async function loadSchema (schemaPath:string) {
    try {
        const schemaContent = await fs.readFile(schemaPath, 'utf-8')
        return JSON.parse(schemaContent)
    } catch (error: any){
        throw new Error(`Failed to read the schema file: ${error.message}`)
    }    
}

async function generateNewSchema(responseBody:object, schemaPath:string) {
     try {
            const generatedSchema = createSchema(responseBody)
            // Add date-time format to createdAt and updatedAt fields
            addDateTimeFormat(generatedSchema)
            await fs.mkdir(path.dirname(schemaPath), {recursive: true})  // creates folder if itdoesn't exist 
            await fs.writeFile(schemaPath, JSON.stringify(generatedSchema, null, 4))
        } catch (error) {
            throw new Error(`Failed to create schema file: ${error.message}`)
        }
}

function addDateTimeFormat(schema: any): void {
    if (typeof schema !== 'object' || schema === null) {
        return
    }

    // Check if this is a properties object and has createdAt or updatedAt fields
    if (schema.properties) {
        const props = schema.properties
        
        if (props.createdAt && props.createdAt.type === 'string') {
            props.createdAt.format = 'date-time'
        }
        
        if (props.updatedAt && props.updatedAt.type === 'string') {
            props.updatedAt.format = 'date-time'
        }
    }

    // Recursively process nested objects and array items
    for (const key in schema) {
        if (key === 'properties' && typeof schema[key] === 'object') {
            // Process all properties recursively
            for (const propKey in schema[key]) {
                addDateTimeFormat(schema[key][propKey])
            }
        } else if (key === 'items' && typeof schema[key] === 'object') {
            // Process array items
            addDateTimeFormat(schema[key])
        }
    }
}
