// namespace
var simpledb = simpledb || {};
simpledb.xml = simpledb.xml || {};

/**
 * Find elements by tag name.
 *
 * @param {Document} dom Document object
 * @param {String} tagName Tag name to find
 * @return {Array} Elements that matched tagName
 */
simpledb.xml.findByTagName = function(dom, tagName) {
  var result = dom.getElementsByTagName(tagName)
    , r = [];
  for (var i = 0, l = result.length; i < l; ++i) {
    r.push(result.item(i));
  }
  return r;
};

/**
 * Find elements by tag name, and return the first element.
 *
 * @param {Document} dom Document object
 * @param {String} tagName Tag name to find
 * @return {Element} First element that matched tagName
 */
simpledb.xml.findFirstByTagName = function(dom, tagName) {
  var result = dom.getElementsByTagName(tagName);

  if (result.length == 0) {
    return null;
  } else {
    return result.item(0);
  }
};

/**
 * Evaluate XPath expression and return matched element as Array.
 *
 * @param {String} expression XPath expression
 * @param {Document} Root document object
 * @return {Array} Elements that matched expression
 */
simpledb.xml.evaluate = function(expression, root) {
  var result = document.evaluate(expression, root, null, 7, null)
    , r = [];

  for (var i = 0, l = result.snapshotLength; i < l; ++i) {
    r.push(result.snapshotItem(i));
  }
  return r;
};
