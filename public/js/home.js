(function(window, document) {
    "use strict";

    if ( !isNull($("#painel-home")) ) {
        $("#painel-home").on("mouseover", ".serviceIconRoute", e => {
            $(e.currentTarget).find("i").addClass("fa-lg");
        }).on("mouseout", ".serviceIconRoute", e => {
            $(e.currentTarget).find("i").removeClass("fa-lg");
        });
    }
})(window, document);