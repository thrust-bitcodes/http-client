var Scanner = Java.type("java.util.Scanner")
var URL = Java.type("java.net.URL")
var URLConnection = Java.type('java.net.URLConnection')
var StandardCharsets = Java.type("java.nio.charset.StandardCharsets")

function mount_http_request(method, url, reqParams) {
  var request = this
  var params = reqParams || {}
  var properties = {
    charset: StandardCharsets.UTF_8,
    "Content-Type": "application/x-www-form-urlencoded"
  }

  var fluent = {
    params: (function (pars) {
      if (isObject(params) && isObject(pars)) {
        params = merge(params, pars)
      } else {
        params = pars
      }
      return fluent
    }).bind(request),

    property: (function (property, value) {
      properties[property] = value

      return fluent
    }).bind(request),

    charset: (function (value) {
      properties["Accept-Charset"] = value

      return fluent
    }).bind(request),

    contentType: (function (value) {
      properties["Content-Type"] = value

      return fluent
    }).bind(request),

    get_content: function (http_connection) {
      var inputStream = http_connection.getInputStream()
      var scanner = new Scanner(inputStream, "UTF-8")
      var content = scanner.useDelimiter("\\Z|\\A").next()

      scanner.close()

      return content
    },

    get_error_content: function(http_connection) {
      var inputStream = http_connection.getErrorStream()
      var scanner = new Scanner(inputStream, "UTF-8")
      var content = scanner.useDelimiter("\\Z|\\A").next()
      scanner.close()

      return content
    },

    fetch: (function _fetch() {
      var http_connection

      if (method.toUpperCase() === "POST" || method.toUpperCase() === "PUT") {
        var output;

        http_connection = new URL(url).openConnection()

        http_connection.setDoOutput(true)
        http_connection.setRequestMethod(method)

        for (var prop in properties) {
          http_connection.setRequestProperty(prop, properties[prop])
        }

        if (params && params.constructor.name === 'Object') {
          if (properties['Content-Type'] === 'application/json') {
            params = JSON.stringify(params || {})
          } else if (properties['Content-Type'] === 'application/x-www-form-urlencoded') {
            params = serializeParams(params || {})
          }
        }

        output = http_connection.getOutputStream()
        output.write(params.getBytes(properties.charset))
      } else /* if (method.toUpperCase() == "GET") */ {
        url += "?" + params
        http_connection = new URL(url).openConnection()
      }

      //return fluent.get_content(http_connection)

      var httpCode = http_connection.getResponseCode()
      var body = {}
      var header = {},
        headerFields = http_connection.getHeaderFields()

      for (var key in headerFields) {
        header[key] = Java.from(headerFields[key]);
      }

      if (httpCode >= 400) {
        body = fluent.get_error_content(http_connection)
      }
      else {
        body = fluent.get_content(http_connection)
      }

      return { code: httpCode, body: body, header : header }
    }).bind(request)
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
  var obj3 = {};
  for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
  for (var objAttrName in obj2) { obj3[objAttrName] = obj2[objAttrName]; }
  return obj3;
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
  get: function (url, params) { return mount_http_request("GET", url, params) },
  post: function (url, params) { return mount_http_request("POST", url, params) },
  put: function (url, params) { return mount_http_request("PUT", url, params) },
  delete: function (url, params) { return mount_http_request("DELETE", url, params) },
}

exports = HTTPClient
/*
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
*/
