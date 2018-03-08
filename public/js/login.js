"use strict";
(function() {
  $("#loginForm").submit((e) => {
    var passed = true;
    if ($("#inputEmail").val() === "") {
      $("#inputEmail").addClass("textBoxError");
      $("#helpBLockEmail").text("Digite o seu email");
      ret = false;
    } else {
      $("#inputEmail").removeClass("textBoxError");
      $("#helpBLockEmail").text();
      ret = ret && true;
    }

    if ($("#inputSenha").val() === "") {
      $("#inputSenha").addClass("textBoxError");
      $("#helpBLockSenha").text("Digite a sua senha");
      e.preventDefault();
      ret = false;
    } else {
      $("#inputSenha").removeClass("textBoxError");
      $("helpBLockSenha").text();
      ret = ret && true;
    }

    if (!passed) {
       e.preventDefault()
    }

  });
})();
