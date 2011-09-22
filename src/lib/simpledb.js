// namespace
var simpledb = simpledb || {};

/**
 * Out debug message to console.
 */
simpledb.debug = function() {
  console.log(arguments);
};

/**
 * Generate request URL for SimpleDB.
 * URL has signature that is generated using AWS access key and access secret key.
 *
 * @param {String} action SimpleDB action name
 * @param {Object} options Optional parameters to send
 * @param {String} accessKeyId AWS access key id
 * @param {String} secretAccessKey AWS secret access key
 * @param {String} host SimpleDB endpoint hostname
 * @param {String} version SimpleDB API version
 * @param {Boolean} consistent Use SimpleDB's consistent mode
 *
 * @return {String} Signed URL for SimpleDB request
 */
simpledb.generateSignedURL = function(action, options, accessKeyId, secretAccessKey, host, version, consistent, debug) {
  options = options || {};

  var params = {};
  var payload = null;
  var displayUri = 'https://' + host;

  for (var k in options) {
    if (options.hasOwnProperty(k)) {
      params[k] = options[k];
    }
  }

  params.Action = action;
  params.Version = version;
  var signer = new AWSV2Signer(accessKeyId, secretAccessKey);

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

  if (debug) {
    simpledb.debug('Signed URL = ', displayUri);
  }

  return displayUri;
};

/**
 * Create Amazon SimpleDB API Client and return it.
 * By default client use default endpont (sdb.amazonaws.com).
 * You can change it with the "host" option
 *
 * Simplest example
 * <pre>
 *  var client = simpledb.createClient({
 *        accessKeyId: 'AWS-AccessKeyId'
 *     ,  secretAccessKey: 'AWS-SecretAccessKey'
 *  });
 * </pre>
 *
 * Change endpoint example
 * <pre>
 *  var client = simpledb.createClient({
 *        accessKeyId: 'AWS-AccessKeyId'
 *     ,  secretAccessKey: 'AWS-SecretAccessKey'
 *     ,  host: 'sdb.ap-northeast-1.amazonaws.com'
 *  });
 * </pre>
 *
 * @param {Object} options Option parameters
 * @return {Object} Amazon SimpleDB API Client
 */
simpledb.createClient = function(options) {
  return new simpledb.Client(options);
};

/**
 * Amazon SimpleDB API Client.
 *
 * @class
 * @param {Object} options Option parameters
 */
simpledb.Client = function(options) {
  options = options || {};

  this.accessKeyId = options.accessKeyId;
  this.secretAccessKey = options.secretAccessKey;
  this.host = options.host || 'sdb.amazonaws.com';
  this.version = options.version || '2009-04-15';
  this.consistent = options.consistent || true;
  this.debug = options.debug || false;
};

/**
 * Generate request URL for SimpleDB.
 * URL has signature that is generated using AWS access key and access secret key.
 *
 * @param {String} actionName SimpleDB action name
 * @param {Object} options Optional parameters to send
 * @return {String} Signed URL for SimpleDB request
 */
simpledb.Client.prototype.generateSignedURL = function(actionName, options) {
  var url = simpledb.generateSignedURL(
      actionName
    , options
    , this.accessKeyId
    , this.secretAccessKey
    , this.host
    , this.version
    , this.consistent
    , this.debug);
  return url;
};

/**
 * Send HTTP GET request to specifieed URL.
 *
 * @param {String} url A URL to send HTTP request
 * @param {Function} callback Callback function when get response. Expected signature is fn(err, data)
 */
simpledb.Client.prototype.sendRequest = function(url, callback) {
  chrome.extension.sendRequest({ url: url, debug: this.debug }, function(response) {
    if (response.status !== 200) {
      callback('Status error. Status code is ' + response.status);
    } else {
      callback(null, response.responseText);
    }
  });
};

/**
 * Call specified Amazon SimpleDB API.
 *
 * @param {String} url A URL to send HTTP request
 * @param {Object} options Optional parameters to send
 * @param {Function} callback Callback function when get response. Expected signature is fn(err, data)
 */
simpledb.Client.prototype.call = function(action, options, callback) {
  var url = this.generateSignedURL(action, options);
  this.sendRequest(url, callback);
};

/**
 * Call listDomains API.
 *
 * @param {Function} callback Callback function when get response
 */
simpledb.Client.prototype.listDomains = function(callback) {
  var url = this.call('ListDomains', null, function(err, data) {
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
