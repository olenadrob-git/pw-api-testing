import { APIRequestContext } from "@playwright/test"
import { expect } from "@playwright/test"
import { APILogger } from "./logger"

export class RequestHandler {
   
    private request: APIRequestContext
    private logger: APILogger
    private baseUrl: string | undefined
    private defaultBaseUrl: string 
    private apiPath: string = ''
    private queryParams: object = {}
    private apiHeaders: Record<string, string> = {}
    private apiBody: object = {}

    constructor(request: APIRequestContext, apiBaseUrl: string, logger: APILogger){
        this.request = request
        this.defaultBaseUrl = apiBaseUrl
        this.logger = logger
    }
   
    url(url: string){
        this.baseUrl = url
        return this // Fluid interface design
   }
   
   path(path: string){
        this.apiPath = path
        return this
   }

   params(params: object){
        this.queryParams = params
        return this

   }

   headers(headers: Record<string, string>){
        this.apiHeaders = headers
        console.log(this.apiHeaders)
        return this
   }

   body(body: object){
        this.apiBody = body
        return this
   }

   async getRequest(statusCode: number){
    const url = this.getUrl()
    this.logger.logRequest('GET', url, this.apiHeaders)
    const responce = await this.request.get(url, {
        headers: this.apiHeaders
    })
    this.cleanupFields()
    const actualStatus = responce.status()
    const responceJSON = await responce.json()
    this.logger.logResponce(actualStatus,responceJSON)
    this.statusCodeValidator(actualStatus, statusCode, this.getRequest)


    return responceJSON
   }

   async postRequest(statusCode: number){
    const url = this.getUrl()
    this.logger.logRequest('POST', url, this.apiHeaders, this.apiBody)
    const responce = await this.request.post(url, {
        headers: this.apiHeaders,
        data: this.apiBody
    })
    this.cleanupFields()
    const actualStatus = responce.status()
    const responceJSON = await responce.json()

    this.logger.logResponce(actualStatus,responceJSON)
    this.statusCodeValidator(actualStatus, statusCode, this.postRequest)

    return responceJSON
   }

   async putRequest(statusCode: number){
    const url = this.getUrl()
    this.logger.logRequest('PUT', url, this.apiHeaders, this.apiBody)
    const responce = await this.request.put(url, {
        headers: this.apiHeaders,
        data: this.apiBody
    })
    this.cleanupFields()
    const actualStatus = responce.status()
    const responceJSON = await responce.json()
    this.logger.logResponce(actualStatus,responceJSON)
    this.statusCodeValidator(actualStatus, statusCode, this.putRequest)

    return responceJSON
   }

   async deleteRequest(statusCode: number){
    const url = this.getUrl()
    this.logger.logRequest('DELETE', url, this.apiHeaders)
    const responce = await this.request.delete(url, {
        headers: this.apiHeaders
    })
    this.cleanupFields()
    const actualStatus = responce.status()
    this.logger.logResponce(actualStatus)
    this.statusCodeValidator(actualStatus, statusCode, this.deleteRequest)   
   }

   private getUrl(){
    const url = new URL(`${this.baseUrl ?? this.defaultBaseUrl}${this.apiPath}`)
    for( const [key, value] of Object.entries(this.queryParams)){
        url.searchParams.append(key, value)
    }
    return url.toString()
    }
   
    private statusCodeValidator(actualStatus: number, expectStatus: number, callingMethod: Function) {
        if (actualStatus !== expectStatus){
            const logs = this.logger.getRecentLogs()
            const error = new Error(`Expected status ${expectStatus} but got ${actualStatus}\n\n Recent API Activity: \n ${logs}`)
            Error.captureStackTrace(error, callingMethod)
            throw error
            
        }
    }

    private cleanupFields(){
        this.apiBody = {}
        this.apiHeaders = {}
        this.baseUrl = undefined
        this.apiPath = ''
        this.queryParams = {}
    }


}