(function (window, document) {
    "use strict";

    $("#sign-up-form").validate({
        rules: {
            inputNome: {
                required: true,
                nomeValido: true
            },
            inputEmail: {
                required: true,
                email: true
            },
            inputSenha: {
                required: true
            },
            inputCPF: {
                required: true,
                cpfValido: true
            },
            inputCEP: {
                required: true,
                cepValido: true
            },
            inputRua: {
                required: true
            },
            inputNumero: {
                required: true,
                number: true
            },
            inputBairro: {
                required: true
            },
            inputCidade: {
                required: true
            },
            selectEstado: {
                required: true
            }
        },
        messages: {
            inputNome: {
                required: "Por favor, digite um nome",
                nomeValido: "Por favor, digite um nome válido"
            },
            inputEmail: {
                required: "Por favor, digite um e-mail",
                email: "Por favor, digite um e-mail válido"
            },
            inputSenha: {
                required: "Por favor, digite uma senha"
            },
            inputCPF: {
                required: "Por favor, digite um CPF",
                cpfValido: "Por favor, digite um CPF válido"
            },
            inputCEP: {
                required: "Por favor, digite um CEP",
                cepValido: "Por favor, digite um CEP válido"
            },
            inputRua: {
                required: "Por favor, digite uma rua"
            },
            inputNumero: {
                required: "Por favor, digite um número",
                number: "Por favor, digite um número válido"
            },
            inputBairro: {
                required: "Por favor, digite um bairro"
            },
            inputCidade: {
                required: "Por favor, digite uma cidade"
            },
            selectEstado: {
                required: "Por favor, selecione um estado"
            }
        },
        errorElement: "div",
        errorClass: "text-danger",
        submitHandler: function (e) {
            console.log(e);
            var user = {
                name: $("#inputNome").val(),
                username: $("#inputEmail").val(),
                password: $("#inputSenha").val(),
                cpf: $("#inputCPF").val(),
                cep: $("#inputCEP").val(),
                rua: $("#inputRua").val(),
                numero: $("#inputNumero").val(),
                cidade: $("#inputCidade").val(),
                bairro: $("#inputBairro").val(),
                estado: $("#selectEstado").val()
            };
            $.ajax({
                url: '/signup',
                method: 'POST',
                data: user,
                dataType: 'json',
                beforeSend: () => {
                    $("#buttonSubmit").css('background-color', '#aaa');
                    $("#buttonSubmit").prop('disabled', true);
                }
            }).done(response => {
                console.log(response);
                var { code, result } = response;
                $("#buttonSubmit").removeAttr('style');
                $("#buttonSubmit").prop('disabled', false);
                if (Number(code) === 1) {
                    window.location.assign("/login");
                } else {
                    window.printErrorMessage(result || "Ops! Não pudemos realizar seu cadastro.");
                }
            }).fail(err => {
                console.log(err);
                var { result } = err.responseJSON || {};
                window.printErrorMessage(result || "Ops! Não pudemos realizar seu cadastro.");
            });
        }
    });

    $.validator.addMethod("nomeValido", function (value, element) {
        return !!value.trim();
    });

    $.validator.addMethod("cpfValido", function (value, element) {
        return value.match(/[0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2}/);
    });

    $.validator.addMethod("cepValido", function (value, element) {
        return true;
    });

})(window, document);
