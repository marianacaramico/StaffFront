(function (window, document) {
    "use strict";

    $(document).ready(() => {
        $("#loginForm").submit(e => {
            e.preventDefault();

            if ($("#inputEmail").val() === "") {
                $("#inputEmail").addClass("textBoxError");
                $("#helpBlockEmail").show();
                return false;
            } else {
                $("#inputEmail").removeClass("textBoxError");
                $("#helpBlockEmail").hide();
            }

            if ($("#inputSenha").val() === "") {
                $("#inputSenha").addClass("textBoxError");
                $("#helpBlockSenha").show();
                return false;
            } else {
                $("#inputSenha").removeClass("textBoxError");
                $("#helpBlockSenha").hide();
            }

            $.ajax({
                url: "/login",
                method: "POST",
                data: {
                    inputEmail: $("#inputEmail").val(),
                    inputSenha: $("#inputSenha").val()
                }
            }).done(result => {
                var { code, result } = result;
                if (Number(code) === 1) {
                    window.location.assign('/home');
                } else {
                    window.printErrorMessage(result || "Ops! Não conseguimos fazer seu login");
                }
            }).fail(err => {
                console.log(err);
                var { result } = err.responseJSON || {};
                window.printErrorMessage(result || "Ops! Não conseguimos fazer seu login");
            });
        });
    });
})(window, document);