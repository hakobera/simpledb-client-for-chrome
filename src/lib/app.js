var simpledb = simpledb || {};
simpledb.event = simpledb.event || {};

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

simpledb.event.listDomains = function(e) {
  e.preventDefault();

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
      result.forEach(function(item) {
        var opt = $('<option>').text(item.name);
        $.data(opt.get(0), 'item', item);
        items.append(opt);
      });
    }
  });
};

simpledb.event.clearQuery = function(e) {
  e.preventDefault();
  $('#query').val('');
};

$(function() {
  $('#listDomains').click(simpledb.event.listDomains);
  $('#runQuery').click(simpledb.event.runQuery);
  $('#clearQuery').click(simpledb.event.clearQuery);

  var editor = CodeMirror.fromTextArea(document.getElementById('itemDetail'));
  $('#itemList').change(function() {
    var selected = $(':selected', this);
    var item = $.data(selected.get(0), 'item');
    editor.setValue(JSON.stringify(item, null, '  '));
  });
});
