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

		if ( !isNull($(".rateStars")) ) {
			$(".rateStars").on("mouseover", "i", e => {
				var _this = $(e.currentTarget);
				_this.parent().children().each((index, value) => {
					var element = $(value);
					element.css("color", "yellow");
					element.removeClass("fa-star-o");
					element.addClass("fa-star");
					if (_this[0] == value) {
						return false;
					}
				});
			}).on("mouseout", "i", e => {
				var _this = $(e.currentTarget);
				_this.parent().children().each((index, value) => {
					var element = $(value);
					element.css("color", "");
					element.removeClass("fa-star");
					element.addClass("fa-star-o");
					if (_this[0] == value) {
						return false;
					}
				});
			}).on("click", e => {
				e.preventDefault();
				$(e.currentTarget).off("mouseout").off("mouseover").off("click");
			});
		}
	});
	
	function signup() {
		if ($("#inputAgree").is(":checked")) {
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

			var buttonSubmit = $("#sign-up-form").find("button[type='submit']");
			
			$.ajax({
				url: '/signup',
				method: 'post',
				data: user,
				dataType: 'json',
				beforeSend: () => {
					buttonSubmit.css('background-color', '#aaa');
					buttonSubmit.prop('disabled', true);
				}
			}).done(response => {
				var { code, result } = response;
				buttonSubmit.removeAttr('style');
				buttonSubmit.prop('disabled', false);
				if (Number(code) === 1) {
					window.location.assign("/login");
				}
			});
		}
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
