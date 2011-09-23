var simpledb = simpledb || {};
simpledb.event = simpledb.event || {};

/**
 * Ctrl key is down in query textarea.
 */
simpledb.event.ctrlDownInQuery = false;

/**
 * Helper method to create SimpleDB client.
 *
 * @return {simpledb.Client} SimpleDB Client
 */
simpledb.event.createClient = function() {
  var accessKey = $('#accessKey').val()
    , secretKey = $('#secretKey').val()
    , host = $('#region').val();

  var client = simpledb.createClient({
      accessKeyId: accessKey
    , secretAccessKey: secretKey
    , host: host
    , debug: true
  });

  return client;
};

/**
 * Call ListDomains API and view it.
 */
simpledb.event.listDomains = function(e) {
  if (e) {
    e.preventDefault();
  }
  
  var loaders = $('#domainLoader')
    , domainList = $('#domain');

  domainList.html('');
  loaders.show();

  var client = simpledb.event.createClient();

  client.listDomains(function(err, domains) {
    loaders.hide();

    if (err) {
      alert(err.message);
    } else {
      console.log(domains);
      domains.forEach(function(item) {
        $('<option>').text(item).appendTo(domainList);
      });
    }
  });
};

/**
 * Call CreateDomain API and refresh domain list.
 */
simpledb.event.createDomain = function(e) {
  e.preventDefault();
    
  simpledb.ui.createDomainDialog.show(function(domainName) {
    if (!domainName) {
      return false;
    }

    var client = simpledb.event.createClient();
    client.createDomain(domainName, function(err, result) {
      if (err) {
        alert(err.message);
      } else {
        simpledb.event.listDomains();
      }
    });
  });
};

/**
 * Call DeleteDomain API and refresh domain list.
 */
simpledb.event.deleteDomain = function(e) {
  e.preventDefault();

  var domainName = $('option:selected:first', '#domain').val();
  console.log(domainName);
  if (!domainName || domainName.length === 0) {
    return false;
  }

  simpledb.ui.confirmDialog.show('Delete Domain', 'Are you ok to delete "' + domainName + '"?', function(ret) {
    if (ret) {
      var client = simpledb.event.createClient();
      client.deleteDomain(domainName, function(err, result) {
        if (err) {
          alert(err.message);
        } else {
          simpledb.event.listDomains();
        }
      });
    }
  });
};

/**
 * Call Select API and view result.
 */
simpledb.event.runQuery = function(e) {
  e.preventDefault();

  var query = $('#query').val()
    , items = $('#itemList');

  items.html('');

  var client = simpledb.event.createClient();
  client.select(query, function(err, result) {
    if (err) {
      alert(err.message);
    } else {
      console.log(result);
      result.forEach(function(item) {
        var opt = $('<option>');
        opt.text(item._id);
        $.data(opt.get(0), 'item', item);
        items.append(opt);
      });
    }
  });
};

/**
 * Clear query textarea.
 */
simpledb.event.clearQuery = function(e) {
  e.preventDefault();
  $('#query').val('');
};

/**
 * Event handler for onkeydown in query textarea.
 */
simpledb.event.keydownQuery = function(e) {
  if (e.which === 17) {
    simpledb.event.ctrlDownInQuery = true;
  } else if (e.which === 13/*enter*/ && simpledb.event.ctrlDownInQuery) {
    simpledb.event.runQuery(e);
    return false;
  }
};

/**
 * Event handler for onkeyup in query textarea.
 */
simpledb.event.keyupQuery = function(e) {
  if (e.which === 17) {
    simpledb.event.ctrlDownInQuery = false;
  }
};

/**
 * Update item detail view.
 */
simpledb.event.updateItemDetail = function() {
  var selected = $(':selected', this);
  var item = $.data(selected.get(0), 'item');
  simpledb.ui.itemDetailEditor.setValue(JSON.stringify(item, null, '  '));
};
