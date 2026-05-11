# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: smokeTest.spec.ts >> Get Articles
- Location: tests\smokeTest.spec.ts:9:5

# Error details

```
SyntaxError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON
```

# Test source

```ts
  1   | import { APIRequestContext } from "@playwright/test"
  2   | import { expect } from "@playwright/test"
  3   | import { APILogger } from "./logger"
  4   | 
  5   | export class RequestHandler {
  6   |    
  7   |     private request: APIRequestContext
  8   |     private logger: APILogger
  9   |     private baseUrl: string | undefined
  10  |     private defaultBaseUrl: string 
  11  |     private apiPath: string = ''
  12  |     private queryParams: object = {}
  13  |     private apiHeaders: Record<string, string> = {}
  14  |     private apiBody: object = {}
  15  |     private defaultAuthToken: string
  16  |     private clearAuthFlag: boolean = false
  17  | 
  18  |     constructor(request: APIRequestContext, apiBaseUrl: string, logger: APILogger, authToken: string = ''){
  19  |         this.request = request
  20  |         this.defaultBaseUrl = apiBaseUrl
  21  |         this.logger = logger
  22  |         this.defaultAuthToken = authToken
  23  |     }
  24  |    
  25  |     url(url: string){
  26  |         this.baseUrl = url
  27  |         return this // Fluid interface design
  28  |    }
  29  |    
  30  |    path(path: string){
  31  |         this.apiPath = path
  32  |         return this
  33  |    }
  34  | 
  35  |    params(params: object){
  36  |         this.queryParams = params
  37  |         return this
  38  | 
  39  |    }
  40  | 
  41  |    headers(headers: Record<string, string>){
  42  |         this.apiHeaders = headers
  43  |         console.log(this.apiHeaders)
  44  |         return this
  45  |    }
  46  | 
  47  |    body(body: object){
  48  |         this.apiBody = body
  49  |         return this
  50  |    }
  51  | 
  52  |    clearAuth(){
  53  |     this.clearAuthFlag = true
  54  |     return this
  55  |    }
  56  | 
  57  |    async getRequest(statusCode: number){
  58  |     const url = this.getUrl()
  59  |     this.logger.logRequest('GET', url, this.getHeaders())
  60  |     const responce = await this.request.get(url, {
  61  |         headers: this.getHeaders()
  62  |     })
  63  |     this.cleanupFields()
  64  |     const actualStatus = responce.status()
> 65  |     const responceJSON = await responce.json()
      |                          ^ SyntaxError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON
  66  |     this.logger.logResponce(actualStatus,responceJSON)
  67  |     this.statusCodeValidator(actualStatus, statusCode, this.getRequest)
  68  | 
  69  | 
  70  |     return responceJSON
  71  |    }
  72  | 
  73  |    async postRequest(statusCode: number){
  74  |     const url = this.getUrl()
  75  |     this.logger.logRequest('POST', url, this.getHeaders(), this.apiBody)
  76  |     const responce = await this.request.post(url, {
  77  |         headers: this.getHeaders(),
  78  |         data: this.apiBody
  79  |     })
  80  |     this.cleanupFields()
  81  |     const actualStatus = responce.status()
  82  |     const responceJSON = await responce.json()
  83  | 
  84  |     this.logger.logResponce(actualStatus,responceJSON)
  85  |     this.statusCodeValidator(actualStatus, statusCode, this.postRequest)
  86  | 
  87  |     return responceJSON
  88  |    }
  89  | 
  90  |    async putRequest(statusCode: number){
  91  |     const url = this.getUrl()
  92  |     this.logger.logRequest('PUT', url, this.getHeaders(), this.apiBody)
  93  |     const responce = await this.request.put(url, {
  94  |         headers: this.getHeaders(),
  95  |         data: this.apiBody
  96  |     })
  97  |     this.cleanupFields()
  98  |     const actualStatus = responce.status()
  99  |     const responceJSON = await responce.json()
  100 |     this.logger.logResponce(actualStatus,responceJSON)
  101 |     this.statusCodeValidator(actualStatus, statusCode, this.putRequest)
  102 | 
  103 |     return responceJSON
  104 |    }
  105 | 
  106 |    async deleteRequest(statusCode: number){
  107 |     const url = this.getUrl()
  108 |     this.logger.logRequest('DELETE', url, this.getHeaders())
  109 |     const responce = await this.request.delete(url, {
  110 |         headers: this.getHeaders()
  111 |     })
  112 |     this.cleanupFields()
  113 |     const actualStatus = responce.status()
  114 |     this.logger.logResponce(actualStatus)
  115 |     this.statusCodeValidator(actualStatus, statusCode, this.deleteRequest)   
  116 |    }
  117 | 
  118 |     private getUrl() {
  119 |         const url = new URL(`${this.baseUrl ?? this.defaultBaseUrl}${this.apiPath}`)
  120 |         for( const [key, value] of Object.entries(this.queryParams)){
  121 |             url.searchParams.append(key, value)
  122 |         }
  123 |         return url.toString()
  124 |     }
  125 |    
  126 |     private statusCodeValidator(actualStatus: number, expectStatus: number, callingMethod: Function) {
  127 |         if (actualStatus !== expectStatus){
  128 |             const logs = this.logger.getRecentLogs()
  129 |             const error = new Error(`Expected status ${expectStatus} but got ${actualStatus}\n\n Recent API Activity: \n ${logs}`)
  130 |             Error.captureStackTrace(error, callingMethod)
  131 |             throw error
  132 |             
  133 |         }
  134 |     }
  135 | 
  136 |     private getHeaders(){
  137 |         if(!this.clearAuthFlag){
  138 |             this.apiHeaders['Authorization'] = this.apiHeaders['Authorization'] || this.defaultAuthToken
  139 |         }
  140 |         return this.apiHeaders
  141 |     }
  142 | 
  143 |     private cleanupFields(){
  144 |         this.apiBody = {}
  145 |         this.apiHeaders = {}
  146 |         this.baseUrl = undefined
  147 |         this.apiPath = ''
  148 |         this.queryParams = {}
  149 |         this.clearAuthFlag = false
  150 |     }
  151 | 
  152 | 
  153 | }
```