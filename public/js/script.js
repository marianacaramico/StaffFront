$(document).ready(() => {
	if ( !isNull($("#btnShowPassword")) && !isNull($("#inputSenha")) ) {
		$("#btnShowPassword").click(() => {
			$("#btnShowPassword").toggleClass("fa-eye");
			$("#btnShowPassword").toggleClass("fa-eye-slash");
			toggleViewPassword($("#inputSenha"));
		});
	}
});

function isNull(element) {
	return element == null || element === false || (typeof element == "object" && element.length === 0);
}

function toggleViewPassword(element) {
	if (!isNull(element) && !isNull(element.attr("type"))) {
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