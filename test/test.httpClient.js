var majesty = require('majesty')

let httpClient = require('./index')

// let result = httpClient
//   // .post("http://localhost:8080/test/pecho", {params: {nome: "P Paulo", idade: 13}})
//   .post('http://localhost:8080/test/pecho')
//   .params({ params: { nome: 'David', idade: 10 } })
//   // .get("http://example.com")
//   // .get("http://localhost:8080/test/json")
//   // .get("http://localhost:8080/test/echo", {params: {nome: "P Paulo", idade: 13}})
//   // .get("http://localhost:8080/test/echo")
//   // .params({params: {nome: "P Paulo", idade: 13}})
//   .charset('UTF-8')
//   .contentType('application/json')
//   .property('prop', 'value')
//   .fetch()

function exec(describe, it, beforeEach, afterEach, expect, should, assert) {
  var rs
  // afterEach(function() { })
  // beforeEach(function() { })

  describe('Client HTTP e HTTPS para thrust', function () {
    describe('Método [GET]', function () {
      it('GET com retorno 404', function () {
        rs = httpClient.get('https://postman-echo.com/status/404')
          .fetch()

        expect(rs.code).to.equal(404)
      })

      it('GET com retorno 500', function () {
        rs = httpClient.get('https://postman-echo.com/status/500')
          .fetch()

        expect(rs.code).to.equal(500)
      })

      it('Executando método GET retornando um array de objetos json', function () {
        rs = httpClient.get('https://jsonplaceholder.typicode.com/posts')
          .charset('UTF-8')
          .fetch()

        expect(rs.code).to.equal(200)
        expect(rs.body).to.be.an('array')
        expect(rs.body.length).to.equal(100)
      })

      it('Executando método GET retornando um objeto json', function () {
        rs = httpClient.get('https://jsonplaceholder.typicode.com/posts/1')
          .charset('UTF-8')
          .fetch()

        expect(rs.code).to.equal(200)
        expect(rs.body.id).to.equal(1)
      })

      it('Método GET utilizando [.headers]', function () {

        rs = httpClient.get('https://postman-echo.com/headers')
          .headers({
            'app': 'thrust',
            'user-agent': 'thrustBot-http-client/1.3.0',
            'Content-Type': 'application/json; charset=UTF-8'
          })
          .fetch()

        expect(rs.code).to.equal(200)
        expect(rs.body).to.not.equal(undefined)
        expect(rs.body.headers).to.not.equal(undefined)
        expect(rs.body.headers.app).to.equal('thrust')
      })

    })
    describe('Método [POST]', function () {

      it('POST com retorno 404', function () {
        rs = executaEMostraTempo(function () {
          return httpClient.post('https://postman-echo.com/status/404')
            .fetch()

          expect(rs.code).to.equal(404)
        })
      })

      it('Executando método POST inserindo um objeto json', function () {
        rs = executaEMostraTempo(function () {
          return httpClient.post('https://reqres.in/api/users')
            .property('user-agent', 'thrustBot-http-client/1.3.0')
            .contentType('application/json')
            .params({
              'name': 'thrust',
              'job': 'platform'
            })
            .fetch()
        })

        expect(rs.code).to.equal(201)
        expect(rs.body).to.have.own.property('id')
        expect(rs.body.id).to.not.equal(undefined)
        expect(rs.body).to.include({ 'name': 'thrust', 'job': 'platform' })
      })

      it('Executando método POST (site 2) inserindo um objeto json', function () {
        rs = httpClient.post('https://jsonplaceholder.typicode.com/posts')
          .property('user-agent', 'thrustBot-http-client/1.3.0')
          .contentType('application/json; charset=UTF-8')
          .params({
            'title': 'foo',
            'body': 'bar',
            'userId': 1
          })
          .fetch()

        expect(rs.code).to.equal(201)
        expect(rs.body).to.have.own.property('id')
        expect(rs.body).to.have.own.property('userId')
        expect(rs.body.id).to.not.equal(undefined)
        expect(rs.body).to.include({ 'title': 'foo', 'body': 'bar' })
      })

      it('Método POST utilizando [.headers]', function () {
        rs = httpClient.post('https://jsonplaceholder.typicode.com/posts')
          .headers({
            'origin': 'chrome-extension://aejoelaoggembcahagimdiliamlcdmfm',
            // 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.186 Safari/537.36',
            'user-agent': 'thrustBot-http-client/1.3.0',
            'Content-Type': 'application/json; charset=UTF-8'
          })
          .params({
            'title': 'foo',
            'body': 'bar',
            'userId': 1
          })
          .fetch()

        expect(rs.code).to.equal(201)
        expect(rs.body).to.have.own.property('id')
        expect(rs.body).to.have.own.property('userId')
        expect(rs.body.id).to.not.equal(undefined)
        expect(rs.body).to.include({ 'title': 'foo', 'body': 'bar' })
      })

      it('Método POST sem body no retorno', function () {
        rs = executaEMostraTempo(function () {
          return httpClient.post('https://mockbin.org/echo')
            .headers({
              'Accept': 'application/json'
            })
            .fetch()
        })

        expect(rs.code).to.equal(200)
        expect(rs.body).to.equal(undefined)
      })
    })
  })
}

function executaEMostraTempo(fn) {
  var di = new Date().getTime()
  var result = fn();
  var df = new Date().getTime()

  print('\tTempo de execução:', (df - di), 'ms.')

  return result;
}

var res = majesty.run(exec)

print('', res.success.length, ' scenarios executed with success and')
print('', res.failure.length, ' scenarios executed with failure.\n')

res.failure.forEach(function (fail) {
  print("[" + fail.scenario + "] =>", fail.execption)
})

exit(res.failure.length);
