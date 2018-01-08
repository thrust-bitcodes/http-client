# http-client
BitCode que implementa métodos de acesso HTTP e HTTPS do lado do 'client'

## Example HTTP Client
```javascript
print ("\n",
    HTTPClient
        // .post("http://localhost:8080/test/pecho", {params: {nome: "P Paulo", idade: 13}})
        .post("http://localhost:8080/test/pecho")
        .params({params: {nome: "David", idade: 10}})
        // .get("http://example.com")
        // .get("http://localhost:8080/test/json")
        // .get("http://localhost:8080/test/echo", {params: {nome: "P Paulo", idade: 13}})
        // .get("http://localhost:8080/test/echo")
        // .params({params: {nome: "P Paulo", idade: 13}})
        .charset("UTF-8")
        .fetch()
    , "\n"
)
```
