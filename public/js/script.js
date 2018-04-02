(function(window, document) {
	"use strict";
	
	$(document).ready(() => {
		$("#anoPadrao").text(new Date().getFullYear());
		
		if ( !isNull($(":input")) ) {
			$(":input").inputmask();
		}
		
		if ( !isNull($("#btnShowPassword")) && !isNull($("#inputSenha")) ) {
			$("#btnShowPassword").click(() => {
				$("#btnShowPassword").toggleClass("fa-eye");
				$("#btnShowPassword").toggleClass("fa-eye-slash");
				toggleViewPassword($("#inputSenha"));
			});
		}
		
		if ( !isNull($("#inputAgree")) ) {
			$("#inputAgree").change(() => {
				toggleEnability($("#sign-up-form").find("button[type='submit']"));
			});
		}
		
		if ( !isNull($("#sign-up-form")) ) {
			$("#sign-up-form").submit(e => {
				e.preventDefault();
				signup();
			});
		}
	});
	
	function signup() {
		var user = {
			name: $("#inputNome").val() || "",
			email: $("#inputEmail").val() || "",
			password: $("#inputSenha").val() || "",
			cpf: $("#inputCPF").val() || "",
			cep: $("#inputCEP").val() || "",
			rua: $("#inputRua").val() || "",
			numero: window.parseInt($("#inputNumero").val()) || 0,
			bairro: $("#inputBairro").val() || "",
			cidade: $("#inputCidade").val() || "",
			estado: $("#selectEstado").val() || ""
		};
		
		$.ajax({
			url: '/signup',
			method: 'post',
			data: user,
			dataType: 'json',
			beforeSend: () => {
				$("#sign-up-form").find("button[type='submit']").css('background-color', '#aaa');
				$("#sign-up-form").find("button[type='submit']").prop('disabled', true);
			}
		}).done(result => {
			$("#sign-up-form").find("button[type='submit']").removeAttr('style');
			$("#sign-up-form").find("button[type='submit']").prop('disabled', false);
		}).always(res => {
			console.log(res);
		});
	}
	
	function toggleViewPassword(element) {
		if ( !isNull(element) && !isNull(element.attr("type")) ) {
			switch (element.attr("type")) {
				case "text":
					element.attr("type", "password");
					break;
				case "password":
					element.attr("type", "text");
					break;
			}
		}
	}
	
	function toggleEnability(element) {
		if (!isNull(element)) {
			isNull(element.attr('disabled')) ? element.attr('disabled', 'disabled') : element.removeAttr('disabled');
		}
	}
})(window, document);
