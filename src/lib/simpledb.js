// namespace
var simpledb = simpledb || {};

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
    console.log('Signed URL = ', displayUri);
  }

  return displayUri;
};

/**
 * Create item object from SimpleDB Response XML
 *
 * @param {Element} itemElement XML element include item info.
 * @return {Object} item
 */
simpledb.createItem = function(itemElement) {
  var name = simpledb.xml.findFirstByTagName(itemElement, 'Name').textContent
    , item = { id: name }
    , attrs = simpledb.xml.findByTagName(itemElement, 'Attribute')
    , i, l, attr, attrName, attrValue, prev, arr;

  for (i = 0, l = attrs.length; i <l; ++i) {
    attr = attrs[i];
    attrName = simpledb.xml.findFirstByTagName(attr, 'Name').textContent
    attrValue = simpledb.xml.findFirstByTagName(attr, 'Value').textContent;
    if (item[attrName]) {
      prev = item[attrName];
      if (Array.isArray(prev)) {
        prev.push(attrValue);
      } else {
        arr = [ prev, attrValue ];
        item[attrName] = arr;
      }
    } else {
      item[attrName] = attrValue;
    }
  }

  return item;
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
  var self = this;
  chrome.extension.sendRequest({ url: url, debug: this.debug }, function(response) {
    var dom = new DOMParser().parseFromString(response.responseText, 'text/xml');

    if (self.debug) {
      console.log(dom);
    }

    if (response.status !== 200) {
      var cause = simpledb.xml.findFirstByTagName(dom, 'Error');
      console.log(cause);
      var err = {
          status: response.status
        , code: simpledb.xml.findFirstByTagName(dom, 'Error').textContent
        , message: simpledb.xml.findFirstByTagName(dom, 'Message').textContent
      };

      if (self.debug) {
        console.log(err);
      }

      callback(err);
    } else {
      callback(null, dom);
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
 * Call ListDomains API.
 *
 * @param {Function} callback Callback function when get response
 */
simpledb.Client.prototype.listDomains = function(callback) {
  var url = this.call('ListDomains', null, function(err, response) {
    if (err) {
      callback(err);
    } else {
      var domainNames = simpledb.xml.findByTagName(response, 'DomainName');
      var ret = domainNames.map(function(e) {
        return e.textContent;
      });
      callback(null, ret);
    }
  });
};

/**
 * Call CreateDomain API.
 *
 * @param {String} domainName Domain name to create
 * @param {Function} callback Callback function when get response
 */
simpledb.Client.prototype.createDomain = function(domainName, callback) {
  var url = this.call('CreateDomain', { DomainName: domainName }, function(err, response) {
    if (err) {
      callback(err);
    } else {
      callback(null, response);
    }
  });
};

/**
 * Call DeleteDomain API.
 *
 * @param {String} domainName Domain name to delete
 * @param {Function} callback Callback function when get response
 */
simpledb.Client.prototype.deleteDomain = function(domainName, callback) {
  var url = this.call('DeleteDomain', { DomainName: domainName }, function(err, response) {
    if (err) {
      callback(err);
    } else {
      callback(null, response);
    }
  });
};

/**
 * Call Select API.
 *
 * @param {Function} callback Callback function when get response
 */
simpledb.Client.prototype.select = function(query, callback) {
  var url = this.call('Select', { SelectExpression: query }, function(err, response) {
    if (err) {
      callback(err);
    } else {
      var items = simpledb.xml.findByTagName(response, 'Item');
      var ret = items.map(function(e) {
        return simpledb.createItem(e);
      });
      callback(null, ret);
    }
  });
};
