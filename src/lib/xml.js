// namespace
var simpledb = simpledb || {};
simpledb.xml = simpledb.xml || {};

simpledb.xml.findByTagName = function(dom, tagName) {
  var result = dom.getElementsByTagName(tagName)
    , r = [];
  for (var i = 0, l = result.length; i < l; ++i) {
    r.push(result.item(i));
  }
  return r;
};

simpledb.xml.findFirstByTagName = function(dom, tagName) {
  var result = dom.getElementsByTagName(tagName);

  if (result.length == 0) {
    return null;
  } else {
    return result.item(0);
  }
};

simpledb.xml.evaluate = function(expression, root) {
  var result = document.evaluate(expression, root, null, 7, null)
    , r = [];

  for (var i = 0, l = result.snapshotLength; i < l; ++i) {
    r.push(result.snapshotItem(i));
  }
  return r;
};
