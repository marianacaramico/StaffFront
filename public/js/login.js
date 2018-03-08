"use strict";
(function() {
  $("#loginForm").submit((e) => {
    var ret = true;
    if (isNull($("#inputEmail").text())) {
      $("#inputEmail").addClass("textBoxError");
      $("#helpBLockEmail").text("Digite o seu email");
      ret = false;
    } else {
      $("#inputEmail").removeClass("textBoxError");
      $("#helpBLockEmail").text();
      ret = true;
    }

    if (isNull($("#inputSenha").text())) {
      $("#inputSenha").addClass("textBoxError");
      $("#helpBLockSenha").text("Digite a sua senha");
      e.preventDefault();
      ret = false;
    } else {
      $("#inputSenha").removeClass("textBoxError");
      $("helpBLockSenha").text();
      ret = ret && true;
    }

return ret;

  });
})();
