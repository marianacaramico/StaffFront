"use strict";
(function() {
  $("#loginForm").submit((e) => {
    if ($("#inputEmail").val() === "") {
      e.preventDefault();
      $("#inputEmail").addClass("textBoxError");
      $("#helpBLockEmail").show();
    } else {
      $("#inputEmail").removeClass("textBoxError");
      $("#helpBLockEmail").hide();
    }

    if ($("#inputSenha").val() === "") {
      e.preventDefault();
      $("#inputSenha").addClass("textBoxError");
      $("#helpBLockSenha").show();
    } else {
      $("#inputSenha").removeClass("textBoxError");
      $("helpBLockSenha").hide();
    }

    $document.ready(() => {
      $("#helpBLockEmail").hide();
      $("#helpBLockSenha").hide();
    });

  });
})();
