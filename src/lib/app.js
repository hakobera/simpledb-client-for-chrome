$(function() {
  $('.sidebar > .well').resizable({
    minHeight: 500,
    maxHeight: 500,
    minWidth: 180
  });

  $('#connect').click(function(e) {
    e.preventDefault();

    var accessKey = $('#accessKey').val()
      , secretKey = $('#secretKey').val();

    var client = new sdbclient.Client({
      accessKey: accessKey,
      secretKey: secretKey
    });
    
    client.listDomains(function(err, domains) {
      if (err) {
        alert(err);
      } else {
        console.log(domains);
      }
    });
  });

});