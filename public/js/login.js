"use strict";
(function() {
  $("#loginForm").submit((e) => {
    if ($("#inputEmail").val() === "") {
      $("#inputEmail").addClass("textBoxError");
      $("#helpBLockEmail").text("Digite o seu email");
      e.preventDefault();
    } else {
      $("#inputEmail").removeClass("textBoxError");
<<<<<<< HEAD
      $("#helpBLockEmail").text("");
=======
      $("#helpBLockEmail").text();
>>>>>>> fc31cf308cfad86d0ce31651612132577c6d66e3
    }

    if ($("#inputSenha").val() === "") {
      $("#inputSenha").addClass("textBoxError");
      $("#helpBLockSenha").text("Digite a sua senha");
      e.preventDefault();
    } else {
      $("#inputSenha").removeClass("textBoxError");
<<<<<<< HEAD
      $("helpBLockSenha").text("");
=======
      $("helpBLockSenha").text();
>>>>>>> fc31cf308cfad86d0ce31651612132577c6d66e3
    }

  });
})();
