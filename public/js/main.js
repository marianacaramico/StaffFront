"use strict";

function isNull(element) {
  return element == null || element === false || (typeof element === typeof Object() && element.length === 0);
}

Number.prototype.formatBrl = function () {
  var value = String(this.toFixed(2)).replace(/\./, ",");
  var _tmp = value.split(',');
  _tmp[0] = _tmp[0].split(/(?=(?:\d{3})*$)/g).join(".");
  return _tmp.join(",");
}
