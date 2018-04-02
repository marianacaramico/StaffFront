"use strict";

function isNull(element) {
  return element == null || element === false || (typeof element === typeof Object() && element.length === 0);
}

Number.prototype.formatBrl = function formatBrl() {
  var value = String(this.toFixed(2)).split('.');
  value[0] = value[0].split(/(?=(?:\d{3})*$)/g).join(".");
  return value.join(",");
}
