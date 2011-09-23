var simpledb = simpledb || {};
simpledb.ui = simpledb.ui || {};

/**
 * Confirm dialog.
 *
 * @class
 */
simpledb.ui.ConfirmDialog = function() {
  var dialog = $('#confirmDialog');
  dialog.modal({
      backdrop: true
    , keyboard: true
  });

  $('.ok', dialog).click(function() {
    $.data(dialog, 'ret', true);
    dialog.modal('hide');
  });

  $('.cancel', dialog).click(function() {
    $.data(dialog, 'ret', false);
    dialog.modal('hide');
  });

  this.dialog = dialog;
};

/**
 * Show confirm dialog.
 *
 * @param {String} title
 * @param {String} message
 * @param {Function} callback
 */
simpledb.ui.ConfirmDialog.prototype.show = function(title, message, callback) {
  var dialog = this.dialog;

  dialog.unbind('shown');
  dialog.unbind('hide');

  dialog.bind('shown', function() {
    $('.title', dialog).text(title);
    $('.content', dialog).text(message);
  });

  dialog.bind('hide', function() {
    callback($.data(dialog, 'ret'));
  });

  dialog.modal('show');
};

/**
 * Create domain dialog.
 *
 * @class
 */
simpledb.ui.CreateDomainDialog = function() {
  var dialog = $('#createDomainDialog');
  dialog.modal({
      backdrop: true
    , keyboard: true
  });

  dialog.bind('shown', function() {
    $('input', dialog).val('');
    $('input:first', dialog).focus();
  });

  $('.cancel', dialog).click(function() {
    $.data(dialog, 'ret', null);
    dialog.modal('hide');
  });

  $('.ok', dialog).click(function() {
    var domainName = $('#domainName').val();
    if (!domainName || domainName.length === 0) {
      $.data(dialog, 'ret', null);
    } else {
      $.data(dialog, 'ret', domainName);
    }
    dialog.modal('hide');
  });

  this.dialog = dialog;
};

/**
 * Show create domain dialog.
 *
 * @param {Function} callback
 */
simpledb.ui.CreateDomainDialog.prototype.show = function(callback) {
  var dialog = this.dialog;

  dialog.unbind('hide');
  this.dialog.bind('hide', function() {
    callback($.data(dialog, 'ret'));
  });

  dialog.modal('show');
};

simpledb.ui.itemDetailEditor = null;
simpledb.ui.confirmDialog = null;
simpledb.ui.createDomainDialog = null;

/**
 * Initialize UI block.
 */
simpledb.ui.init = function() {
  $('#main .sidebar').resizable({
    minWidth: 100,
    minHeight: 550
  });

  simpledb.ui.itemDetailEditor = CodeMirror.fromTextArea(document.getElementById('itemDetail'));

  simpledb.ui.confirmDialog = new simpledb.ui.ConfirmDialog();
  simpledb.ui.createDomainDialog = new simpledb.ui.CreateDomainDialog();
};
