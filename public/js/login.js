"use strict";
(function() {
  $("#loginForm").submit((e) => {
    var passed = true;
    if ($("#inputEmail").val() === "") {
      $("#inputEmail").addClass("textBoxError");
      $("#helpBLockEmail").text("Digite o seu email");
      e.preventDefault();
    } else {
      $("#inputEmail").removeClass("textBoxError");
      $("#helpBLockEmail").text();
    }

    if ($("#inputSenha").val() === "") {
      $("#inputSenha").addClass("textBoxError");
      $("#helpBLockSenha").text("Digite a sua senha");
      e.preventDefault();
    } else {
      $("#inputSenha").removeClass("textBoxError");
      $("helpBLockSenha").text();
    }

  });
})();
