var Scanner = Java.type('java.util.Scanner')
var URL = Java.type('java.net.URL')
var StandardCharsets = Java.type('java.nio.charset.StandardCharsets')

function mountHttpRequest(method, url, reqParams) {
  var params = reqParams
  var properties = {
    'charset': StandardCharsets.UTF_8,
    'Content-Type': 'application/x-www-form-urlencoded'
  }

  var fluent = {
    params: function(pars) {
      if ((isObject(params) || params === undefined) && isObject(pars)) {
        params = merge((params || {}), pars)
      } else {
        params = pars
      }
      return fluent
    },

    property: function(property, value) {
      properties[property] = value

      return fluent
    },

    headers: function(headers) {
      properties = Object.assign({}, properties, headers)

      return fluent
    },

    charset: function(value) {
      properties['Accept-Charset'] = value

      return fluent
    },

    contentType: function(value) {
      properties['Content-Type'] = value

      return fluent
    },

    getContent: function(httpConnection) {
      var inputStream = httpConnection.getInputStream()
      var scanner = new Scanner(inputStream, 'UTF-8')
      var content = scanner.useDelimiter('\\Z|\\A').next()

      scanner.close()
      inputStream.close()

      return content
    },

    getErrorContent: function(httpConnection) {
      var inputStream = httpConnection.getErrorStream()

      if(!inputStream) {
        return undefined
      }

      var scanner = new Scanner(inputStream, 'UTF-8')
      var content = scanner.useDelimiter('\\Z|\\A').next()

      scanner.close()
      inputStream.close()

      return content
    },

    fetch: function _fetch() {
      var httpConnection
      var header = {}
      var body = {}

      if (method.toUpperCase() === 'POST' || method.toUpperCase() === 'PUT') {
        var output

        httpConnection = new URL(url).openConnection()

        httpConnection.setDoOutput(true)
        httpConnection.setRequestMethod(method)

        for (var prop in properties) {
          httpConnection.setRequestProperty(prop, properties[prop])
        }

        if (params && params.constructor.name === 'Object') {
          if (properties['Content-Type'].indexOf('application/json') >= 0) {
            params = JSON.stringify(params)
          } else if (properties['Content-Type'] === 'application/x-www-form-urlencoded') {
            params = serializeParams(params)
          } else {
            params = JSON.stringify(params)
          }
        }

        output = httpConnection.getOutputStream()
        output.write((params || '').getBytes(properties.charset))
      } else /* if (method.toUpperCase() == "GET") */ {
        if (params && params.constructor.name === 'Object') {
          url += '?' + serializeParams(params)
        } else if (params !== undefined) {
          url += '?' + params
        }
        httpConnection = new URL(url).openConnection()

        for (var prp in properties) {
          httpConnection.setRequestProperty(prp, properties[prp])
        }
      }

      var httpCode = httpConnection.getResponseCode()
      var headerFields = httpConnection.getHeaderFields()

      for (var key in headerFields) {
        // header[key] = Java.from(headerFields[key])
        header[key] = headerFields[key][0]
      }

      if (httpCode >= 400) {
        body = fluent.getErrorContent(httpConnection)
      } else {
        var data = fluent.getContent(httpConnection)

        body = (header['Content-Type'] && header['Content-Type'].indexOf('application/json') >= 0)
          ? JSON.parse(data)
          : data
      }

      return { code: httpCode, body: body, headers: header }
    }
  }

  return fluent
}

function serializeParams(obj, prefix) {
  var str = []
  var p

  for (p in obj) {
    if (obj.hasOwnProperty(p)) {
      var k = prefix ? prefix + '[' + p + ']' : p
      var v = obj[p]

      str.push((v !== null && typeof v === 'object')
        ? serializeParams(v, k)
        : encodeURIComponent(k) + '=' + encodeURIComponent(v))
    }
  }

  return str.join('&')
}

function merge(obj1, obj2) {
  var obj3 = {}
  for (var attrname in obj1) { obj3[attrname] = obj1[attrname] }
  for (var objAttrName in obj2) { obj3[objAttrName] = obj2[objAttrName] }
  return obj3
}

function isObject(val) {
  return val && typeof val === 'object'
}

/**
  * Busca informações em uma api REST
  * @example
  * // returns {nome: "David", idade: 10}
  * HTTPClient.post("http://localhost:8080/test/pecho").charset("UTF-8").fetch()
  * @example
  * // returns "Hello World!"
  * HTTPClient.post("http://localhost:8080/test/hello").fetch()
  */
var HTTPClient = {
  get: function(url, params) { return mountHttpRequest('GET', url, params) },
  post: function(url, params) { return mountHttpRequest('POST', url, params) },
  put: function(url, params) { return mountHttpRequest('PUT', url, params) },
  delete: function(url, params) { return mountHttpRequest('DELETE', url, params) }
}

exports = HTTPClient
/*
print ("\n",
    HTTPClient
        // .post("http://localhost:8080/test/pecho", {nome: "P Paulo", idade: 13})
        .post("http://localhost:8080/test/pecho")
        .params({nome: "David", idade: 10})
        // .get("http://example.com")
        // .get("http://localhost:8080/test/json")
        // .get("http://localhost:8080/test/echo", {nome: "P Paulo", idade: 13})
        // .get("http://localhost:8080/test/echo")
        // .params({nome: "P Paulo", idade: 13})
        .charset("UTF-8")
        .fetch()
    , "\n"
)
*/
