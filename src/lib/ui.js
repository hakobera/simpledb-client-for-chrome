var simpledb = simpledb || {};
simpledb.ui = simpledb.ui || {};

simpledb.ui.resizable = function() {
  $('#main .sidebar').resizable({
    minWidth: 100,
    minHeight: 550
  });
};

$(function() {
  simpledb.ui.resizable();
});
