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
  // .post('http://localhost:8778/test/pecho', {nome: 'P Paulo', idade: 13})
  .post('http://localhost:8778/test/pecho')
  .params({nome: 'David', idade: 10})
  .charset('UTF-8')
  .contentType('application/json')
  .property('prop', 'value')
  .fetch()

console.log(result)
```

O *bitcode* http-client contém os seguintes métodos, sendo que cada um deles retornam o mesmo *builder* conforme exemplo acima.

```javascript
get(url, params)
post(url, params)
put(url, params)
delete(url, params)
```

## What's new

v1.1.0 - Correções e melhorias do GET e inserção da Suite Teste Case para o bitcode
* Correção do objeto 'header' que estava com todos os valores em formato array de string e deveriam estar em string.
* Correção para o método GET quando o mesmo não recebe parâmetros.
* Correção dos testes de validação do 'Content-Type' de === para indexOf, haja visto que o charset pode ser definido nesta propriedade, o que é bastante comum.
* Adicionado Test Suite Case para o bitcode.

v1.0.0 - Adição de parametro com os headers no retorno da requisição
* Acrescentado o atributo 'headers' ao objeto de retorno do 'fetch'.<br>
De: { code: httpCode, body: body }<br>
Para: { code: httpCode, body: body, header : header }

v0.2.0 - Alterações para retornar o código e mensagem de erro de maneira mais específica
* Adicionado métodos de tratamento de erros (ex: 'get_error_content').
* Melhorado / corrigido a serialização dos parâmetros das requisições.
