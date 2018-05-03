"use strict";

function isNull(element) {
  return element == null || element === false || (typeof element === typeof Object() && element.length === 0);
}

$.validator.addMethod("dateBr", function dateBR(value, element) {
  var regex = /^\d{2}\/\d{2}\/\d{4}$/;
  if(value.match(regex)) {
      var arrDate = value.split("/").map(value => {
          return Number.parseInt(value);
      });
      var date = new Date(arrDate[2], (arrDate[1] - 1), arrDate[0]);
      var _date = new Date();
      _date.setHours(0,0,0,0);
      return (
          date && date.getDate() === arrDate[0]
          && date.getMonth() === (arrDate[1] - 1)
          && date.getFullYear() === arrDate[2]
      );
  }
  return false;
});

$.validator.addMethod("previousDateBr", function prevDateBr(value, element) {
  var regex = /^\d{2}\/\d{2}\/\d{4}$/;
  if(value.match(regex)) {
      var arrDate = value.split("/").map(value => {
          return Number.parseInt(value);
      });
      var date = new Date(arrDate[2], (arrDate[1] - 1), arrDate[0]);
      var _date = new Date();
      _date.setHours(0,0,0,0);
      return (
          date && date < _date
          && date.getDate() === arrDate[0]
          && date.getMonth() === (arrDate[1] - 1)
          && date.getFullYear() === arrDate[2]
      );
  }
  return false;
});

$.validator.addMethod("nextDateBr", function nextDateBr(value, element) {
  var regex = /^\d{2}\/\d{2}\/\d{4}$/;
  if(value.match(regex)) {
      var arrDate = value.split("/").map(value => {
          return Number.parseInt(value);
      });
      var date = new Date(arrDate[2], (arrDate[1] - 1), arrDate[0]);
      var _date = new Date();
      _date.setHours(0,0,0,0);
      return (
          date && date >= _date
          && date.getDate() === arrDate[0]
          && date.getMonth() === (arrDate[1] - 1)
          && date.getFullYear() === arrDate[2]
      );
  }
  return false;
});

Number.prototype.formatBrl = function formatBrl() {
  var value = String(this.toFixed(2)).split('.');
  value[0] = value[0].split(/(?=(?:\d{3})*$)/g).join(".");
  return value.join(",");
}
