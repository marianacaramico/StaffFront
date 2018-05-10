(function(window, document) {
    "use strict";

    $(document).ready(() => {
        getTasks();
        getAssignedTasks();

        if ( !isNull($("#createTaskForm")) ) {
            var form = $("#createTaskForm");
            form.validate({
                rules: {
                    inputTitle: {
                        required: true
                    },
                    inputPrice: {
                        required: true,
                        money: true
                    },
                    inputDeadline: {
                        required: true,
                        nextDateBr: true
                    }
                },
                messages: {
                    inputTitle: "Insira um título para sua tarefa!",
                    inputPrice: "Insira o valor que será pago pela tarefa!",
                    inputDeadline: "Insira o prazo máximo da tarefa!"
                },
                errorClass: "text-danger",
                submitHandler: form => {
                    var _deadline = ($("#inputDeadline").val() || "").split("/").reverse();
                    var data = {
                        title: $("#inputTitle").val() || "",
                        description: $("#inputDescription").val() || "",
                        value: Number.parseFloat($("#inputPrice").val().replace(",", ".") || ""),
                        deadline: _deadline.join("-")
                    };
                    createTask(data);
                }
            });
            $.ajax({
                url: '/task/types',
                dataType: 'json'
            }).done(result => {
                var { code, tasks } = result;
                var taskTypeSelect = $("select#taskType");
                taskTypeSelect.empty().append("<option value='' selected disabled>Selecione...</option>");
                if (Number(code) === 1) {
                    tasks.forEach(value => {
                        var id = Number(value.id_task_type) || 0;
                        if (id) {
                            taskTypeSelect.append("<option value='" + id + "'>" + value.description + "</option>");
                        }
                    });
                }
            });
        }
    });

    function getTasks() {
        var openTaskPersonal = $("#openTaskPersonal");

        if (!isNull(openTaskPersonal)) {
            return $.ajax({
                url: '/task/unassigned',
                dataType: 'json'
            }).done(result => {
                var { code, tasks } = result;
                if (Number(code) === 1) {
                    openTaskPersonal.empty();
                    tasks.forEach(task => {
                        openTaskPersonal.append(getRowPersonalTask(task));
                    });
                    return true;
                }
                openTaskPersonal.empty();
                openTaskPersonal.append(getRowPersonalTask({
                    title: "Nenhuma tarefa encontrada",
                    value: 0.00,
                    description: "Nenhuma tarefa pôde ser encontrada."
                }));
                return false;
            }).fail(err => {
                console.log('ERRO');
                openTaskPersonal.empty();
                openTaskPersonal.append(getRowPersonalTask({
                    title: "Nenhuma tarefa encontrada",
                    value: 0.00,
                    description: "Nenhuma tarefa pôde ser encontrada."
                }));
            });
        }
    }

    function getAssignedTasks() {
        var openTaskTaken = $("#openTaskTaken");

        if (!isNull(openTaskTaken)) {
            return $.ajax({
                url: '/task/assigned',
                dataType: 'json'
            }).done(result => {
                var { code, tasks } = result;
                if (Number(code) === 1) {
                    openTaskTaken.empty();
                    tasks.forEach(task => {
                        openTaskTaken.append(getRowAssignedTask(task));
                    });
                    return true;
                }
                openTaskTaken.empty();
                openTaskTaken.append(getRowAssignedTask({
                    title: "Nenhuma tarefa encontrada",
                    value: 0.00,
                    description: "Nenhuma tarefa pôde ser encontrada."
                }));
                return false;
            }).fail(err => {
                console.log('ERRO');
                openTaskTaken.empty();
                openTaskTaken.append(getRowAssignedTask({
                    title: "Nenhuma tarefa encontrada",
                    value: 0.00,
                    description: "Nenhuma tarefa pôde ser encontrada."
                }));
            });
        }
    }

    function createTask(data = {}) {
        return $.ajax({
            url: "/task/create",
            method: "POST",
            dataType: "json",
            data: data
        }).done(response => {
            var { code, result, id } = response;
            if (id) {
                window.location.assign("/task/" + id);
            } else {
                window.alert(result || "Erro!");
            }
        }).fail(error => {
            console.log(error);
            window.alert("Erro na Requisição!");
        });
    }

    function getRowPersonalTask(task = {}) {
        return (
            "<div class='row'>"
                + "<div class='col-sm-12'>"
                    + "<div class='col-sm-12'><p>" + (task.title || "") + "</p></div>"
                    + "<div class='col-sm-12'>"
                        + "<span class='col-sm-2'>R$ " + (task.value || 0).formatBrl() + "</span>"
                        + "<span class='col-sm-10'>" + (task.description || "") + "</span>"
                    + "</div>"
                + "</div>"
            + "</div><hr />"
        );
    }

    function getRowAssignedTask(task = {}) {
        return (
            "<div class='row'>"
                + "<div class='col-sm-12'>"
                    + "<div class='col-sm-12'><p>" + (task.title || "") + "</p></div>"
                    + "<div class='col-sm-12'>"
                        + "<span class='col-sm-2'>R$ " + (task.value || 0).formatBrl() + "</span>"
                        + "<span class='col-sm-10'>" + (task.description || "") + "</span>"
                    + "</div>"
                + "</div>"
                + "<div class='col-sm-3 text-center'>"
                    + " <div class='rateStars'>"
                        + "<i class='fa fa-lg fa-star-o' aria-hidden='true'></i>"
                        + "<i class='fa fa-lg fa-star-o' aria-hidden='true'></i>"
                        + "<i class='fa fa-lg fa-star-o' aria-hidden='true'></i>"
                        + "<i class='fa fa-lg fa-star-o' aria-hidden='true'></i>"
                        + "<i class='fa fa-lg fa-star-o' aria-hidden='true'></i>"
                    + "</div>"
                    + "<div class='row'>"
                        + "<a class='mx-auto userProfileHyperlink' href='/user/2'>"
                        + "<span class='service-icon rounded-circle text-center'>"
                        + "<i class='fa fa-user' aria-hidden='true'></i>"
                        + "</span>"
                        + "</a>"
                    + " </div>"
                + "</div>"
            + "</div><hr />"
        );
    }
})(window, document);