(function(window, document) {
    "use strict";

    $(document).ready(() => {
        getTasks();
        getAssignedTasks();
        getTasksWithYou();

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
                    },
                    taskType: {
                        required: true
                    }
                },
                messages: {
                    inputTitle: "Insira um título para sua tarefa!",
                    inputPrice: "Insira o valor que será pago pela tarefa!",
                    inputDeadline: "Insira o prazo máximo da tarefa!",
                    taskType: "Selecione o tipo da tarefa!"
                },
                errorClass: "text-danger",
                submitHandler: form => {
                    var data = {
                        title: $("#inputTitle").val() || "",
                        description: $("#inputDescription").val() || "",
                        value: Number.parseFloat($("#inputPrice").val().replace(",", ".") || ""),
                        deadline: ($("#inputDeadline").val() || "").split("/").reverse().join("-"),
                        taskType: Number.parseInt($("#taskType").val()) || 0
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

    function getTasksWithYou() {
        var openTasksWithYou = $("#openTasksWithYou");

        if (!isNull(openTasksWithYou)) {
            return $.ajax({
                url: '/task/withyou',
                dataType: 'json'
            }).done(result => {
                var { code, tasks } = result;
                if (Number(code) === 1) {
                    openTasksWithYou.empty();
                    tasks.forEach(task => {
                        openTasksWithYou.append(getRowTasksWithYou(task));
                    });
                    return true;
                }
                openTasksWithYou.empty();
                openTasksWithYou.append(getRowTasksWithYou({
                    title: "Nenhuma tarefa encontrada",
                    value: 0.00,
                    description: "Nenhuma tarefa pôde ser encontrada."
                }));
                return false;
            }).fail(err => {
                console.log('ERRO');
                openTasksWithYou.empty();
                openTasksWithYou.append(getRowTasksWithYou({
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
                    + "<div class='col-sm-12'><p><b>" + (task.title || "") + "</b>"
                    + '<button type="button" class="pull-right" id="btnEdit"><i class="fa fa-pencil" aria-hidden="true"></i></button>'
                    + '<button type="button" class="pull-right" id="btnErase"><i class="fa fa-times" aria-hidden="true"></i></button>'
                    + '</p></div>'
                    + "<div class='col-sm-12'>"
                        + "<div class='row'><div class='col-sm-12'><span class='col-sm-3 task-value'>R$ " + (task.value || 0).formatBrl() + "</span>"
                        + "<span class='col-sm-9'><span class='pull-right'>Para terminar em: " + (task.due_date || "") + "</span></span></div></div><br />"
                        + "<span class='col-sm-10 text-justify'>" + (task.description || "") + "</span>"
                    + "</div>"
                + "</div>"
            + "</div><hr />"
        );
    }

    function getRowTasksWithYou(task = {}) {
        return (
            "<div class='row'>"
            + "<div class='col-sm-1'>"
                +"<div class='text-center'>"
                    + "<span class='service-icon rounded-circle mx-auto text-center'>"
                        + "<i class='fa fa-user' aria-hidden='true'></i>"
                    + "</span>"                
                + "</div>"
            +"</div>"
            + "<div class='col-sm-8'>"
                + "<div class='col-sm-12'>"
                    + "<p><b>" + (task.title || "") + "</b></p>"
                + "</div>"
                + "<div class='col-sm-12'>"
                    + "<span class='col-sm-2 task-value'>" + (task.value || 0).formatBrl() + "</span>"
                    + "<span class='col-sm-10'>" + (task.description || "") + "</span>"
                + "</div>"
            + "</div>"
            + "<div class='col-sm-3'>"
                + "<div class='pull-right'>"
                    + "<div style='margin-bottom:10px'>"
                        + "<a href='#' class='btn btn-success mb-1'>"
                            + "<i class='fa fa-check' aria-hidden='true'></i>"
                            + "Terminei"
                        + "</a>"
                    + "</div>"
                + "</div>"
            + "</div>"
        + "</div>"
            );
    }

    function getRowAssignedTask(task = {}) {
        return (
            "<div class='row'>"
                + "<div class='col-sm-9'>"
                    + "<div class='col-sm-12'><p><b>" + (task.title || "") + "</b></p></div>"
                    + "<div class='col-sm-12'>"
                        + "<span class='col-sm-2 task-value'>R$ " + (task.value || 0).formatBrl() + "</span>"
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