# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: smokeTest.spec.ts >> Get Tags
- Location: tests\smokeTest.spec.ts:24:5

# Error details

```
Error: Schema validation GET_tags_schema.json failed:
[
    {
        "instancePath": "/tags",
        "schemaPath": "#/properties/tags/type",
        "keyword": "type",
        "params": {
            "type": "object"
        },
        "message": "must be object"
    }
]

Actual response body: 
{
    "tags": [
        "Test",
        "Blog",
        "Git",
        "YouTube",
        "Slack",
        "Bondar Academy",
        "GitHub",
        "Zoom",
        "Value-Focused",
        "Start for Free"
    ]
}
```

# Test source

```ts
  1  | import fs from 'fs/promises'
  2  | import path from 'path'
  3  | import { Ajv } from "ajv"
  4  | 
  5  | const SCHEMA_BASE_PATH = path.resolve(
  6  |     process.cwd(),
  7  |     'response-schemas'
  8  | )
  9  | const ajv = new Ajv({allErrors: true})  // options can be passed, e.g. {allErrors: true}
  10 | 
  11 | export async function validateSchema(dirName:string, fileName:string, responceBody: object) {
  12 |     const schemaPath = path.join(SCHEMA_BASE_PATH, dirName, `${fileName}_schema.json`)
  13 |     const schema = await loadSchema(schemaPath)
  14 |     const validate = ajv.compile(schema)
  15 | 
  16 |     const valid = validate(responceBody)
  17 |     if (!valid) {
> 18 |         throw new Error(
     |               ^ Error: Schema validation GET_tags_schema.json failed:
  19 |             `Schema validation ${fileName}_schema.json failed:\n` +
  20 |             `${JSON.stringify(validate.errors, null, 4)}\n\n` +
  21 |             `Actual response body: \n` +
  22 |             `${JSON.stringify(responceBody, null, 4)}`
  23 |         )
  24 |         
  25 |     }
  26 | }
  27 | 
  28 | async function loadSchema (schemaPath:string) {
  29 |     try {
  30 |         const schemaContent = await fs.readFile(schemaPath, 'utf-8')
  31 |         return JSON.parse(schemaContent)
  32 |     } catch (error){
  33 |         throw new Error(`Failed to read the schema file: ${error.message}`)
  34 |     }    
  35 | }
  36 | 
```