"use strict";

function bindDeleteTaskButton(callback = function(){}) {
    $(".btnErase").click(e => {
        e.preventDefault();
        var taskid = $(e.currentTarget).data("taskid");
        var modal = $("#modalExcluirTarefa");
        if (!window.isNull(modal)) {
            modal.modal("show");
        }
        modal.find("#btnExcluirTarefa").off().click(ev => {
            ev.preventDefault();
            $.ajax({
                url: "/task/delete/" + taskid,
                dataType: 'json'
            }).done(response => {
                if (Number(response.code) === 1) {
                    callback();
                } else {
                    modal.on("hidden.bs.modal", function handleModalHidden() {
                        window.printErrorMessage(response.result || "Erro ao deletar a tarefa!");
                    });
                }
                modal.modal("hide");
            }).fail(err => {
                console.error("ERRO!");
                var { result } = err.responseJSON || {};
                window.printErrorMessage(result || "Erro ao deletar a tarefa!"); 
            });
        });
    });
}

function getRowTasksNotFound() {
    return (
        "<div class='row'>"
            + "<div class='col-sm-9'>"
                + "<div class='col-sm-12'><p><b>Nenhuma tarefa encontrada!</b></p></div>"
                + "<div class='col-sm-12'>"
                    + "<div class='row'><span class='col-sm-12 text-justify'>Nenhuma tarefa pôde ser encontrada.</span></div>"
                + "</div>"
            + "</div>"
            + "<div class='col-sm-3 text-center'>"
                + "<div class='row'>"
                    + "<span class='mx-auto'>"
                        + "<img class='service-icon rounded-circle' src='/img/sadface-icon.png' />"
                    + "</span>"
                + "</div>"
            + "</div>"
        + "</div><hr />"
    );
}

function isNull(element) {
    return element == null || element === false || (typeof element === typeof Object() && element.length === 0);
}

function printErrorMessage(message) {
    if ( window.isNull($("#modalError")) ) {
        var modal = '<div class="modal modal-danger fade" id="modalError" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">'
            + '<div class="modal-dialog" role="document">'
                + '<div class="modal-content">'
                    + '<div class="modal-header">'
                    + '<h5 class="modal-title" id="exampleModalLabel">Erro!</h5>'
                    + '<button type="button" class="close" data-dismiss="modal" aria-label="Close">'
                        + '<span aria-hidden="true">&times;</span>'
                    + '</button>'
                    + '</div>'
                    + '<div class="modal-body">'
                        + '<p id="modalErrorMessage">' + message + '</p>'
                    + '</div>'
                    + '<div class="modal-footer">'
                    + '<button type="button" class="btn btn-outline cursor-pointer" data-dismiss="modal">Fechar</button>'
                    + '</div>'
                + '</div>'
            + '</div>'
        + '</div>';
        $("body").prepend(modal);
        $("#modalError").modal("show");
    } else {
        $("#modalErrorMessage").text(message);
        $("#modalError").modal("show");
    }
}

$.validator.addMethod("dateBr", function dateBR(value, element) {
    var regex = /^\d{2}\/\d{2}\/\d{4}$/;
    if(value.match(regex)) {
        var arrDate = value.split("/").map(value => {
            return Number.parseInt(value);
        });
        var date = new Date(arrDate[2], (arrDate[1] - 1), arrDate[0]);
        var _date = new Date();
        _date.setHours(0,0,0,0);
        return (
            date && date.getDate() === arrDate[0]
            && date.getMonth() === (arrDate[1] - 1)
            && date.getFullYear() === arrDate[2]
        );
    }
    return false;
});

$.validator.addMethod("previousDateBr", function prevDateBr(value, element) {
    var regex = /^\d{2}\/\d{2}\/\d{4}$/;
    if(value.match(regex)) {
        var arrDate = value.split("/").map(value => {
            return Number.parseInt(value);
        });
        var date = new Date(arrDate[2], (arrDate[1] - 1), arrDate[0]);
        var _date = new Date();
        _date.setHours(0,0,0,0);
        return (
            date && date < _date
            && date.getDate() === arrDate[0]
            && date.getMonth() === (arrDate[1] - 1)
            && date.getFullYear() === arrDate[2]
        );
    }
    return false;
});

$.validator.addMethod("nextDateBr", function nextDateBr(value, element) {
    var regex = /^\d{2}\/\d{2}\/\d{4}$/;
    if(value.match(regex)) {
        var arrDate = value.split("/").map(value => {
            return Number.parseInt(value);
        });
        var date = new Date(arrDate[2], (arrDate[1] - 1), arrDate[0]);
        var _date = new Date();
        _date.setHours(0,0,0,0);
        return (
            date && date >= _date
            && date.getDate() === arrDate[0]
            && date.getMonth() === (arrDate[1] - 1)
            && date.getFullYear() === arrDate[2]
        );
    }
    return false;
});

$.validator.addMethod("money", function (value, element) {
    return value.match(/^\d+(?:,\d{1,2})?$/);
});

Number.prototype.formatBrl = function formatBrl() {
    var value = String(this.toFixed(2)).split('.');
    value[0] = value[0].split(/(?=(?:\d{3})*$)/g).join(".");
    return value.join(",");
}

Date.formatDate = function formatDate(stringDate) {
    var date = new Date(stringDate || "");
    var fDate = [
        ("0" + (date.getDate() || 0)).slice(-2),
        ("0" + ((date.getMonth() + 1) || 0)).slice(-2),
        (date.getFullYear() || "0000")
    ];
    return fDate[0] + "/" + fDate[1] + "/" + fDate[2];
};

Date.unformatDate = function unformatDate(stringDate) {
    return stringDate.split("/").reverse().join("-") + " 00:00:00";
}