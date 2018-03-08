"use strict";
(function() {
  $("#loginForm").submit((e) => {
    if ($("#inputEmail").val() === "") {
      e.preventDefault();
      $("#inputEmail").addClass("textBoxError");
      $("#helpBlockEmail").show();
    } else {
      $("#inputEmail").removeClass("textBoxError");
      $("#helpBlockEmail").hide();
    }

    if ($("#inputSenha").val() === "") {
      e.preventDefault();
      $("#inputSenha").addClass("textBoxError");
      $("#helpBlockSenha").show();
    } else {
      $("#inputSenha").removeClass("textBoxError");
      $("#helpBlockSenha").hide();
    }
  });
})();
