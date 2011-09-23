var simpledb = simpledb || {};
simpledb.ui = simpledb.ui || {};

/**
 * Item detail editor.
 */
simpledb.ui.itemDetailEditor = null;

/**
 * Initialize UI block.
 */
simpledb.ui.init = function() {
  $('#main .sidebar').resizable({
    minWidth: 100,
    minHeight: 550
  });

  var createDomainDialog = $('#createDomainDialog');

  createDomainDialog.bind('shown', function() {
    $('input', createDomainDialog).val('');
    $('input:first', createDomainDialog).focus();
  });

  $('.cancel', createDomainDialog).click(function() {
    createDomainDialog.modal('hide');
  });

  var createDomainDialogOk = $('.ok', createDomainDialog);
  createDomainDialogOk.click(function() {
    createDomainDialog.modal('hide');
    simpledb.event.createDomain();
  });

};
