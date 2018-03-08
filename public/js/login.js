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
<<<<<<< HEAD
      $("#helpBlockSenha").hide();
    }
=======
      $("helpBlockSenha").hide();
    }

>>>>>>> 32fdb4aba799522227b43ea7181e06549c4fde26
  });
})();
