$(function() {

  $('#listDomains').click(function(e) {
    e.preventDefault();

    var accessKey = $('#accessKey').val()
      , secretKey = $('#secretKey').val()
      , host = $('#region').val();

    var client = simpledb.createClient({
        accessKeyId: accessKey
      , secretAccessKey: secretKey
      , host: host
      , debug: true
    });

    var domain = $('#domain');
    client.listDomains(function(err, domains) {
      if (err) {
        alert(err);
      } else {
        console.log(domains);
        domain.html('');
        domains.forEach(function(e) {
          $('<option>').text(e).appendTo(domain);
        });
      }
    });
  });

});