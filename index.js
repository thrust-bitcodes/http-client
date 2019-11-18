var Scanner = Java.type('java.util.Scanner')
var URL = Java.type('java.net.URL')
var Byte = Java.type('byte[]')

var HttpsURLConnection = Java.type('javax.net.ssl.HttpsURLConnection')
var SSLContext = Java.type('javax.net.ssl.SSLContext')
var X509TrustManager = Java.type('javax.net.ssl.X509TrustManager')
var SecureRandom = Java.type('java.security.SecureRandom')

function getBytes(str, charset) {
    str = str || ''
    charset = charset || 'utf-8'
    if (!str.getBytes) {
        let StringHelper = Java.type('br.com.softbox.thrust.api.ThrustStringHelper')
        return StringHelper.getBytes(str, charset)
    }
    return str.getBytes(charset)
}

function mountHttpRequest(method, url, reqParams) {
    var params = reqParams
    var properties = {
        'charset': 'utf-8',
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
            var inputStream
            var scanner

            try {
                inputStream = httpConnection.getErrorStream()

                if (!inputStream) {
                    inputStream = httpConnection.getInputStream()
                }

                scanner = new Scanner(inputStream, 'utf-8').useDelimiter('\\Z|\\A')

                if (scanner.hasNext()) {
                    return scanner.next()
                }
            } finally {
                scanner && scanner.close()
                inputStream && inputStream.close()
            }
        },

        disableCertificateValidation: function() {
            var trustAllCerts = new X509TrustManager({
                getAcceptedIssuers: function() {
                    return null
                },
                checkClientTrusted: function(certs, authType) {
                },
                checkServerTrusted: function(certs, authType) {
                }
            })

            HttpsURLConnection.setDefaultHostnameVerifier(function(hostname, sslSession) {
                return true
            })

            var sc = SSLContext.getInstance('SSL')
            sc.init(null, [trustAllCerts], new SecureRandom())
            HttpsURLConnection.setDefaultSSLSocketFactory(sc.getSocketFactory())

            return fluent
        },

        fetch: function _fetch() {
            var httpConnection

            if (method.toUpperCase() === 'POST' || method.toUpperCase() === 'PUT') {
                var output

                httpConnection = new URL(url).openConnection()

                httpConnection.setDoOutput(true)
                httpConnection.setRequestMethod(method)

                for (var prop in properties) {
                    httpConnection.setRequestProperty(prop, properties[prop])
                }

                if (params && params.constructor && params.constructor.name === 'Object') {
                    if (properties['Content-Type'].indexOf('application/json') >= 0) {
                        params = JSON.stringify(params)
                    } else if (properties['Content-Type'] === 'application/x-www-form-urlencoded') {
                        params = serializeParams(params)
                    } else {
                        params = JSON.stringify(params)
                    }
                }

                output = httpConnection.getOutputStream()

                let isBinary = properties['Content-Type'].indexOf('application/zip') > -1 || properties['Content-Type'].indexOf('application/octet-stream') > -1

                if (!params || typeof params === 'string') {
                    var outBuffer = getBytes(params, properties.charset)
                    output.write(outBuffer)
                } else if (isBinary) {
                    copyStreams(params, output)
                }
            } else {
                if (params && params.constructor && params.constructor.name === 'Object') {
                    url += '?' + serializeParams(params)
                } else if (params !== undefined) {
                    url += '?' + params
                }
                httpConnection = new URL(url).openConnection()

                for (var prp in properties) {
                    httpConnection.setRequestProperty(prp, properties[prp])
                }
            }

            var httpCode = 500
            var header = {}
            var body = {}
            var exc

            try {
                httpCode = httpConnection.getResponseCode()
                httpConnection.getHeaderFields().forEach(function(key, list) {
                    if (list) {
                        if (key === null) {
                            key = 'null'
                        }
                        header[key] = list.size() === 1 ? list.get(0) : list.toArray()
                    }
                })
                var data = fluent.getContent(httpConnection)
                var isJSON = data && (header['Content-Type'] && header['Content-Type'].indexOf('application/json') >= 0)
                body = isJSON ? JSON.parse(data) : data
            } catch (e) {
                exc = e
            }
            return { code: httpCode, body: body, headers: header, exc: exc }
        }
    }
    return fluent
}

function copyStreams(inStream, outStream) {
    let len
    let buffer = new Byte(1024)
    while ((len = inStream.read(buffer)) !== -1) {
        outStream.write(buffer, 0, len)
    }
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
HTTPClient.version = '1.4.1'
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
