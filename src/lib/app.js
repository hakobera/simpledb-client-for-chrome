$(function() {
  simpledb.ui.init();

  $('#region').change(simpledb.event.listDomains);

  $('#listDomains').click(simpledb.event.listDomains).triggerHandler('click');
  $('#createDomain').click(simpledb.event.createDomain);
  $('#deleteDomain').click(simpledb.event.deleteDomain);

  $('#runQuery').click(simpledb.event.runQuery);
  $('#clearQuery').click(simpledb.event.clearQuery);
  $('#query').keydown(simpledb.event.keydownQuery);
  $('#query').keyup(simpledb.event.keyupQuery);

  $('#itemList').change(simpledb.event.updateItemDetail);
});
