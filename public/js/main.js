"use strict";

function isNull(element) {
  return element == null || element === false || (typeof element === typeof Object() && element.length === 0);
}
