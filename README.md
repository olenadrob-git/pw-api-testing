## Architecture Overview

Your framework is a **Playwright-based API testing automation** with a fluent builder pattern. Here's how the layers work together:

### **1. Core Layers**

```
Test Specifications (smokeTest.spec.ts)
           ↓
Fixtures Layer (fixtures.ts) - Test Setup & Teardown
           ↓
Request Builder (request-handler.ts) - Fluent API
           ↓
Validation Layers - Custom Expectations & Schema Validation
           ↓
Utilities - Logging, Data Generation, Config Management
```

### **2. Key Components**

#### **fixtures.ts** — Test Setup & Dependency Injection
- Extends Playwright's `base` test with custom options
- Provides three fixtures to every test:
  - **`authToken`** (worker-scoped): Created once per test session, generates auth token via `createToken()`
  - **`api`**: Injected `RequestHandler` instance with logger
  - **`config`**: Environment configuration (API URL, credentials)

#### **request-handler.ts** — Fluent HTTP Builder
Implements the **Fluent Interface Pattern** for chainable API calls:
```typescript
api.path('/articles')
   .params({limit:10, offset:0})
   .getRequest(200)
```
- Builds requests step-by-step using method chaining
- Supports: `.url()`, `.path()`, `.params()`, `.headers()`, `.body()`, `.clearAuth()`
- Executes HTTP operations: `.getRequest()`, `.postRequest()`, `.putRequest()`, `.deleteRequest()`
- Automatically logs requests/responses and validates status codes
- Cleans up internal state after each request

#### **custom-expect.ts** — Extended Assertions
Extends Playwright's `expect` with domain-specific matchers:
- **`shouldEqual(expected)`** — Basic equality with contextual logging
- **`shouldBeLessThanOrEqual(value)`** — Numeric comparisons
- **`shouldMatchSchema(dirName, fileName, createSchemaFlag)`** — Schema validation with optional auto-generation

#### **schema-validator.ts** — JSON Schema Validation
Uses **AJV** (Another JSON Schema Validator) for response validation:
- Loads pre-defined schemas from response-schemas directory
- Can **auto-generate** missing schemas from response bodies (via `createSchemaFlag = true`)
- Validates actual responses against stored schemas
- Provides detailed validation error messages with the actual response for debugging

#### **logger.ts** — Request/Response Tracking
- Maintains recent API activity in memory
- Logs all requests (method, URL, headers, body)
- Logs all responses (status code, body)
- Used by custom expectations to include API context in failure messages

#### **data-generator.ts** — Test Data Factory
- Uses **Faker.js** for realistic random data
- `getNewRandomArticle()` generates valid article payloads with random titles, descriptions, bodies, and tags
- Prevents data collisions and enables parameterized testing

#### **api-test.config.ts** — Environment Configuration
- Loads environment variables via `dotenv`
- Supports multiple test environments (dev, qa, prod)
- Centralizes: API URL, credentials, and environment-specific settings

### **3. Request Flow Example**

When you call:
```typescript
const response = await api
    .path('/articles')
    .params({limit:10, offset:0})
    .getRequest(200)
```

1. **Fixture Setup**: Creates logger, injects authToken, builds RequestHandler
2. **Builder Pattern**: `.path()` and `.params()` set internal state
3. **HTTP Call**: `.getRequest()` wraps execution in `test.step()`, sends GET with auth headers
4. **Logging**: Logs request details and response
5. **Status Validation**: Asserts actual status (200) matches expected
6. **Cleanup**: Clears internal fields for next request
7. **Response Return**: Returns parsed JSON for assertions

### **4. Testing Workflow**

```
Test execution
  → Request handler builds request (fluent pattern)
  → Sends HTTP request with logging
  → Validates status code
  → Custom expects perform assertions:
    - Schema validation (JSON Schema via AJV)
    - Equality checks with failure context
  → Logger appends context to failures
```

### **5. Key Design Patterns**

| Pattern | Implementation |
|---------|---|
| **Fluent Builder** | `RequestHandler` — chainable methods returning `this` |
| **Fixture Injection** | Playwright `extend<>` for test setup/teardown |
| **Custom Matchers** | `expect.extend()` for domain-specific assertions |
| **Factory** | `getNewRandomArticle()` for test data |
| **Singleton Logger** | Single APILogger instance per test |

This architecture provides a **clean, maintainable, and declarative** API for writing readable test scenarios.
