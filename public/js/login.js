"use strict";
(function() {
  $("#loginForm").submit((e) => {
    if (isNull($("#inputEmail"))) {
      $("#inputEmail").addClass("textBoxError");
      $("#helpBLockEmail").text("Digite o seu email");
      e.preventDefault();
    } else {
      $("#inputEmail").removeClass("textBoxError");
      $("#helpBLockEmail").text();
    }

    if (isNull($("#inputSenha"))) {
      $("#inputSenha").addClass("textBoxError");
      $("#helpBLockSenha").text("Digite a sua senha");
      e.preventDefault();
    } else {
      $("#inputSenha").removeClass("textBoxError");
      $("helpBLockSenha").text();
    }
  });
})();
