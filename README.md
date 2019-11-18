# HttpClient 1.4.1

[![Build Status](https://travis-ci.org/thrust-bitcodes/http-client.svg?branch=master)](https://travis-ci.org/thrust-bitcodes/http-client) [![GitHub release](https://img.shields.io/github/release/thrust-bitcodes/http-client.svg)](https://github.com/thrust-bitcodes/http-client/releases)

HttpClient é um *bitcode* de acesso HTTP e HTTPS para [ThrustJS](https://github.com/thrustjs/thrust).

## Instalação

Dentro do diretório de um projeto [ThrustJS](https://github.com/thrustjs/thrust), digite em seu terminal:

```bash
tpm install http-client
```

## Tutorial

```javascript
const httpClient = require('http-client')

const result = httpClient
  // .post('http://localhost:8778/test/pecho', {nome: 'P Paulo', idade: 13})
  .post('http://localhost:8778/test/pecho')
  .headers({
    'Authorization': 'Basic YWxhZGRpbjpvcGVuc2VzYW1l',
    'Proxy-Authenticate': 'Basic realm="Access to the internal site"'
  })
  //Use o caso abaixo quando o endpoint é acessado via https certificado e não temos o certificado para validação
  .disableCertificateValidation()
  .params({nome: 'David', idade: 10})
  // Este já é o padrão!
  .charset('UTF-8')
  .contentType('application/json')
  .property('prop', 'value')
  .fetch()

console.log(JSON.stringify(result))
```

O *bitcode* http-client contém os seguintes métodos, sendo que cada um deles retornam o mesmo *builder* conforme exemplo acima.

```javascript
get(url, params)
post(url, params)
put(url, params)
delete(url, params)
```

## What's new

v1.4.1

- Fix: Correção de *bug* de leitura do Header: Há casos em que *header* retorna o valor `null` e ao montar o objeto de
resposta o JS não aceita este valor como atributo do objeto `header`.
- O objeto `HttpClient` informa a versão através do atributo `version` .

v1.4.0

- ?

v1.3.3

- Fix: Ajustando leitura do retorno e tratando requisições sem retorno.

v1.3.2

- Fix: Quando uma requisição retorna com erro, o atributo "body" no objeto de retorno fica com o valor _undefined_.

v1.3.1

- Fix: Método GET chamado com query-string na URL estava com erro
- Método GET quando iniciado com query-string e sem parâmetros estava com erro.

v1.3.0

- Fix: os _headers_ configurados pelos métodos [headers] e [property] não estão sendo aplicados para o método GET
- Correção para que os _headers_ sejam aplicados para o método GET
- Definição do _user-agent_ a ser utilizado pelo thrust no cabeçalho HTTP

  'user-agent': 'thrustBot-http-client/1.3.0'

**OBSERVAÇÃO:** neste release o retonro do [fetch] está sendo alterado

  De: { code: httpCode, body: body, **header**: header }

  Para: { code: httpCode, body: body, **headers**: header }

v1.2.0

- Implementação do método 'headers'
- Melhoria: adicionado o método 'headers' utilizado para configurar os atributos do HTTP Header através de um único objeto JSON
- Aumento dos cenários de teste do bitcode

v1.1.0

- Correções e melhorias do GET e inserção da Suite Teste Case para o bitcode
- Correção do objeto 'header' que estava com todos os valores em formato array de string e deveriam estar em string.
- Correção para o método GET quando o mesmo não recebe parâmetros.
- Correção dos testes de validação do 'Content-Type' de === para indexOf, haja visto que o charset pode ser definido nesta propriedade, o que é bastante comum.
- Adicionado Test Suite Case para o bitcode.

v1.0.0

- Adição de parametro com os headers no retorno da requisição
- Acrescentado o atributo 'headers' ao objeto de retorno do 'fetch'.

  De: { code: httpCode, body: body }

  Para: { code: httpCode, body: body, header : header }

v0.2.0

- Alterações para retornar o código e mensagem de erro de maneira mais específica
- Adicionado métodos de tratamento de erros (ex: 'get_error_content').
- Melhorado / corrigido a serialização dos parâmetros das requisições.
