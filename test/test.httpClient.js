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

  describe('Client HTTP e HTTPS para thrust', function() {
    describe('Método [GET] Firebase Functions', function() {
      it('Executando método GET retornando um objeto JSON', function() {
        var token = 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjMwNDZhMTU2MzczNjZiNGQ2NGQ5YTVhYmIzMzczMTgyYmE0ZDdjZmIifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vZmlyZWZpcnN0LTg3NzgiLCJhdWQiOiJmaXJlZmlyc3QtODc3OCIsImF1dGhfdGltZSI6MTUyNTAwNTEzMSwidXNlcl9pZCI6IjU2eVIwZGRMRW9Ua2FYWmRnTTY0cmVScnBadzEiLCJzdWIiOiI1NnlSMGRkTEVvVGthWFpkZ002NHJlUnJwWncxIiwiaWF0IjoxNTI1MDA5MjIyLCJleHAiOjE1MjUwMTI4MjIsImVtYWlsIjoibmVyeUBzb2Z0Ym94LmNvbS5iciIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJuZXJ5QHNvZnRib3guY29tLmJyIl19LCJzaWduX2luX3Byb3ZpZGVyIjoicGFzc3dvcmQifX0.t_Q0ZbMTPUxJTjpzIV9fylMuv0s0kRmHd3nUfMQ86z668iY4kf95-S6_5y-JUN2vb71kBaSmBCzakKnP8aYgcLTRw40OZPN_v7zR0GaQF_i3CqYDWIFxd6nYpH_hK5Ma69ukLzk9-8O5JL9stOrZpp_eBwtAu67SZUnrsvVTZ_jse7EGspNkQqZOFQP_A-tgcGVTOlww16PzMKW83DMUGXxANehAZdpfVNcGCG7_eI12bzbP14eCnmnp3ljtYI2iEXg7mhw3anVop4THaaGvwjj3y3z7mCI9CFkrxTjs_PeOcK7B4-0q0_3qpKlH2pmtJG6dqDvSqBCkt381WzTxig'
        rs = httpClient.get('https://us-central1-firefirst-8778.cloudfunctions.net/crud/777')
          .headers({
            'user-agent': 'thrustBot-http-client/1.3.0',
            'Content-Type': 'application/json; charset=UTF-8',
            'Authorization': 'Bearer ' + token
          })
          .fetch()

        expect(rs.code).to.equal(200)
        expect(rs.body).to.be.an('object')
        expect(rs.body).to.have.own.property('id')
        expect(rs.body.id).to.equal('777')
      })
    })
    describe('Método [GET]', function() {
      it('Executando método GET retornando um array de objetos json', function() {
        rs = httpClient.get('https://jsonplaceholder.typicode.com/posts')
          .charset('UTF-8')
          .fetch()

        expect(rs.code).to.equal(200)
        expect(rs.body).to.be.an('array')
        expect(rs.body.length).to.equal(100)
      })
      it('Executando método GET retornando um objeto json', function() {
        rs = httpClient.get('https://jsonplaceholder.typicode.com/posts/1')
          .charset('UTF-8')
          .fetch()

        expect(rs.code).to.equal(200)
        expect(rs.body.id).to.equal(1)
      })

      it('Método GET utilizando [.headers]', function() {

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

      it('Executando método POST inserindo um objeto json', function() {
        var di = new Date().getTime()

        rs = httpClient.post('https://reqres.in/api/users')
          .property('user-agent', 'thrustBot-http-client/1.3.0')
          .contentType('application/json')
          .params({
            'name': 'thrust',
            'job': 'platform'
          })
          .fetch()

        var df = new Date().getTime()

        expect(rs.code).to.equal(201)
        expect(rs.body).to.have.own.property('id')
        expect(rs.body.id).to.not.equal(undefined)
        expect(rs.body).to.include({ 'name': 'thrust', 'job': 'platform' })

        print('\tTempo de execução:', (df - di), 'ms.')
      })

      it('Executando método POST (site 2) inserindo um objeto json', function() {
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

      it('Método POST utilizando [.headers]', function() {
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
    })
  })
}

var res = majesty.run(exec)

print('', res.success.length, ' scenarios executed with success and')
print('', res.failure.length, ' scenarios executed with failure.\n')

res.failure.forEach(function(fail) {
  print('[' + fail.scenario + '] =>', fail.execption)
  var i = 0
  if (fail.execption.printStackTrace && i === 0) {
    fail.execption.printStackTrace()
    i++
  }
})

// java.lang.Runtime.getRuntime().exec("cmd /k chcp 65001");
