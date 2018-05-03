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
