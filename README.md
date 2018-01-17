HttpClient
===============

HttpClient é um *bitcode* de acesso HTTP e HTTPS para [ThrustJS](https://github.com/thrustjs/thrust).

# Instalação

Posicionado em um app [ThrustJS](https://github.com/thrustjs/thrust), no seu terminal:

```bash
thrust install http-client
```

## Tutorial

```javascript
let httpClient = require('http-client')

let result = httpClient
  // .post("http://localhost:8080/test/pecho", {params: {nome: "P Paulo", idade: 13}})
  .post("http://localhost:8080/test/pecho")
  .params({params: {nome: "David", idade: 10}})
  // .get("http://example.com")
  // .get("http://localhost:8080/test/json")
  // .get("http://localhost:8080/test/echo", {params: {nome: "P Paulo", idade: 13}})
  // .get("http://localhost:8080/test/echo")
  // .params({params: {nome: "P Paulo", idade: 13}})
  .charset("UTF-8")
  .contentType('application/json')
  .property('prop', 'value')
  .fetch()

show(result)
```

O *bitcode* http-client contém os seguintes métodos, sendo que cada um deles retornam o mesmo *builder* conforme exemplo acima.

```javascript
get(url, params)
post(url, params)
put(url, params)
delete(url, params)
```
