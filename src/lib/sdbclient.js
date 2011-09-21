var sdbclient = sdbclient || {};

/** @constant */
sdbclient.API_VERSION = '2009-04-15';

/**
 * @class
 * @param opts
 */
sdbclient.Client = function(opts) {
  this.accessKey = opts.accessKey;
  this.secretKey = opts.secretKey;
  this.endpoint = opts.endpoint || 'https://sdb.amazonaws.com';
  this.version = opts.version || sdbclient.API_VERSION;
};

sdbclient.Client.generateSignedURL = function(actionName, opts, accessKeyId, secretKey, endpoint, version) {
  var host = endpoint.replace(/.*:\/\//, "");
  var params = {};
  var payload = null;
  var displayUri = endpoint;

  opts = opts || {};
  for (var k in opts) {
    if (opts.hasOwnProperty(k)) {
      params[k] = opts[k];
    }
  }

  params.Action = actionName;
  params.Version = version;
  var signer = new AWSV2Signer(accessKeyId, secretKey);
  console.log(params);
  params = signer.sign(params, new Date(), {
    "verb": "GET",
    "host": host,
    "uriPath": "/"
  });

  var encodedParams = [];
  for (var key in params) {
    if (params[key] !== null) {
      encodedParams.push(encodeURIComponent(key) + "=" + encodeURIComponent(params[key]));
    } else {
      encodedParams.push(encodeURIComponent(key));
    }
  }

  payload = encodedParams.join("&");
  displayUri += "?" + payload;

  return displayUri;
};

/**
 * Generate request URL for SimpleDB.
 * URL has signature that is generated using AWS access key and access secret key.
 *
 * @param {String} actionName SimpleDB action name
 * @param {Object} opts Optional parameters to send
 * @return {String} Signed URL for SimpleDB request
 */
sdbclient.Client.prototype.generateSignedURL = function(actionName, opts) {
  var url = sdbclient.Client.generateSignedURL(actionName, opts, this.accessKey, this.secretKey, this.endpoint, this.version);
  return url;
};

/**
 *
 * @param url
 * @param callback
 */
sdbclient.Client.prototype.sendRequest = function(url, callback) {
  chrome.extension.sendRequest({ url: url, debug: this.debug }, function(response) {
    if (response.status !== 200) {
      callback('Status error. Status code is ' + response.status);
    } else {
      callback(null, response.responseText);
    }
  });
};

sdbclient.Client.prototype.listDomains = function(callback) {
  var url = this.generateSignedURL("ListDomains");

  this.sendRequest(url, function(err, data) {
    if (err) {
      console.log(err);
      callback(err);
    } else {
      console.log(data);
      var ret = $(data).find('DomainName').map(function() {
        return $(this).text();
      });
      callback(null, ret.toArray());
    }
  });
};
