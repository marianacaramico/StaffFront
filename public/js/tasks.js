(function(window, document) {
    "use strict";

    $(document).ready(() => {
        getUnassignedTasks();
        getAssignedTasks();
        getTasksWithYou();
        getMyFinishedTasks();
        getTasksFinishedByMe();

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
                    $(form).submit(e => e.preventDefault());
                    var data = {
                        title: $("#inputTitle").val() || "",
                        description: $("#inputDescription").val() || "",
                        value: Number.parseFloat($("#inputPrice").val().replace(",", ".") || ""),
                        deadline: ($("#inputDeadline").val() || "").split("/").reverse().join("-"),
                        taskType: Number.parseInt($("#taskType").val()) || 0
                    };
                    submitTask(data, form);
                }
            });

            (function () {
                var taskTypeSelect = $("select#taskType");

                $.ajax({
                    url: '/task/types',
                    dataType: 'json',
                    beforeSend: () => {
                        taskTypeSelect.empty().append('<option value="" selected disabled>Carregando...</option>');
                    }
                }).done(result => {
                    var { code, tasks } = result;
                    taskTypeSelect.empty().append("<option value='' selected disabled>Selecione...</option>");
                    if (Number(code) === 1) {
                        tasks.forEach(value => {
                            var id = Number(value.id_task_type) || 0;
                            if (id) {
                                taskTypeSelect.append("<option value='" + id + "'>" + value.description + "</option>");
                            }
                        });
                        if (form.data("taskid")) {
                            var task_type_id = Number(taskTypeSelect.data("value")) || "";
                            taskTypeSelect.val(task_type_id);
                        }
                    }
                }).fail(err => {
                    console.error('ERRO');
                    taskTypeSelect.empty().append("<option value='' selected disabled>Selecione...</option>");
                });
            })();

            (function () {
                var inputValue = form.find("#inputPrice");
                var inputDeadline = form.find("#inputDeadline");
                if (form.data("taskid")) {
                    var value = window.parseFloat(inputValue.data("value")).formatBrl();
                    var deadline = Date.formatDate(inputDeadline.data("value"));
                    inputValue.val(value);
                    inputDeadline.val(deadline);
                }
            })();
        }
    });

    function getUnassignedTasks() {
        var openTaskPersonal = $("#openTaskPersonal");

        if (!isNull(openTaskPersonal)) {
            return $.ajax({
                url: '/task/unassigned',
                dataType: 'json',
                beforeSend: () => {
                    openTaskPersonal.empty().append('<div class="text-center"><i class="fa fa-cog fa-spin fa-3x fa-fw"></i></div>');
                }
            }).done(result => {
                var { code, tasks } = result;
                if (Number(code) === 1) {
                    openTaskPersonal.empty();
                    tasks.forEach(task => {
                        openTaskPersonal.append(getRowPersonalTask(task));
                    });
                    return true;
                }
                openTaskPersonal.empty().append(getRowPersonalTask({
                    title: "Nenhuma tarefa encontrada",
                    value: 0,
                    description: "Nenhuma tarefa pôde ser encontrada."
                }));
                return false;
            }).fail(err => {
                console.log('ERRO');
                openTaskPersonal.empty().append(getRowPersonalTask({
                    title: "Nenhuma tarefa encontrada",
                    value: 0,
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
                dataType: 'json',
                beforeSend: () => {
                    openTaskTaken.empty().append('<div class="text-center"><i class="fa fa-cog fa-spin fa-3x fa-fw"></i></div>');
                }
            }).done(result => {
                var { code, tasks } = result;
                if (Number(code) === 1) {
                    openTaskTaken.empty();
                    tasks.forEach(task => {
                        openTaskTaken.append(getRowAssignedTask(task));
                    });
                    return true;
                }
                openTaskTaken.empty().append(getRowAssignedTask({
                    title: "Nenhuma tarefa encontrada",
                    value: 0,
                    description: "Nenhuma tarefa pôde ser encontrada."
                }));
                return false;
            }).fail(err => {
                console.log('ERRO');
                openTaskTaken.empty().append(getRowAssignedTask({
                    title: "Nenhuma tarefa encontrada",
                    value: 0,
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
                dataType: 'json',
                beforeSend: () => {
                    openTasksWithYou.empty().append('<div class="text-center"><i class="fa fa-cog fa-spin fa-3x fa-fw"></i></div>');
                }
            }).done(result => {
                var { code, tasks } = result;
                if (Number(code) === 1) {
                    openTasksWithYou.empty();
                    tasks.forEach(task => {
                        openTasksWithYou.append(getRowTasksWithYou(task));
                        $(".btnCloseTask").off().click(e => {
                            e.preventDefault();
                            var taskid = window.parseInt($(e.currentTarget).data("taskid")) || 0;
                            closeTask(taskid);
                        });
                    });
                    return true;
                }
                openTasksWithYou.empty().append(getRowTasksWithYou({
                    title: "Nenhuma tarefa encontrada",
                    value: 0.00,
                    description: "Nenhuma tarefa pôde ser encontrada."
                }));
                return false;
            }).fail(err => {
                console.log('ERRO');
                openTasksWithYou.empty().append(getRowTasksWithYou({
                    title: "Nenhuma tarefa encontrada",
                    value: 0.00,
                    description: "Nenhuma tarefa pôde ser encontrada."
                }));
            });
        }
    }

    function getMyFinishedTasks() {
        var finishedTaskTaken = $("#finishedTaskTaken");

        if (!isNull(finishedTaskTaken)) {
            return $.ajax({
                url: '/task/myfinishedtasks',
                dataType: 'json',
                beforeSend: () => {
                    finishedTaskTaken.empty().append('<div class="text-center"><i class="fa fa-cog fa-spin fa-3x fa-fw"></i></div>');
                }
            }).done(result => {
                var { code, tasks } = result;
                if (Number(code) === 1) {
                    finishedTaskTaken.empty();
                    tasks.forEach(task => {
                        finishedTaskTaken.append(getRowAssignedTask(task));
                    });
                    return true;
                }
                finishedTaskTaken.empty().append(getRowAssignedTask({
                    title: "Nenhuma tarefa encontrada",
                    value: 0,
                    description: "Nenhuma tarefa pôde ser encontrada."
                }));
                return false;
            }).fail(err => {
                console.log('ERRO');
                finishedTaskTaken.empty().append(getRowAssignedTask({
                    title: "Nenhuma tarefa encontrada",
                    value: 0,
                    description: "Nenhuma tarefa pôde ser encontrada."
                }));
            });
        }
    }

    function getTasksFinishedByMe() {
        var finishedTaskPersonal = $("#finishedTaskPersonal");

        if (!isNull(finishedTaskPersonal)) {
            return $.ajax({
                url: '/task/tasksfinishedbyme',
                dataType: 'json',
                beforeSend: () => {
                    finishedTaskPersonal.empty().append('<div class="text-center"><i class="fa fa-cog fa-spin fa-3x fa-fw"></i></div>');
                }
            }).done(result => {
                var { code, tasks } = result;
                if (Number(code) === 1) {
                    finishedTaskPersonal.empty();
                    tasks.forEach(task => {
                        finishedTaskPersonal.append(getRowAssignedTask(task));
                    });
                    return true;
                }
                finishedTaskPersonal.empty().append(getRowAssignedTask({
                    title: "Nenhuma tarefa encontrada",
                    value: 0,
                    description: "Nenhuma tarefa pôde ser encontrada."
                }));
                return false;
            }).fail(err => {
                console.log('ERRO');
                finishedTaskPersonal.empty().append(getRowAssignedTask({
                    title: "Nenhuma tarefa encontrada",
                    value: 0,
                    description: "Nenhuma tarefa pôde ser encontrada."
                }));
            });
        }
    }

    function getRowPersonalTask(task = {}) {
        return (
            "<div class='row'>"
                + "<div class='col-sm-12'>"
                    + "<div class='col-sm-12'><p>"
                        + "<b>" + (task.title || "") + "</b>"
                        + "<span class='btn-group pull-right'>"
                            + '<a href="/task/edit/' + (task.id_task || 0) + '" class="btn button btnEdit"><i class="fa fa-pencil" aria-hidden="true"></i></a>'
                            + '<a href="javascript:void(0)" class="btn button btnErase"><i class="fa fa-times" aria-hidden="true"></i></a>'
                        + "</span>"
                    + '</p></div>'
                    + "<div class='col-sm-12'>"
                        + "<div class='row'><div class='col-sm-12'>"
                            + "<span class='col-sm-3 task-value'>R$ " + (task.value || 0).formatBrl() + "</span>"
                            + "<span class='col-sm-9'><span class='pull-right'>Para terminar em: " + Date.formatDate(task.due_date || "") + "</span></span>"
                        + "</div></div><br />"
                        + "<div class='row'><span class='col-sm-12 text-justify'>" + (task.description || "") + "</span></div>"
                    + "</div>"
                + "</div>"
            + "</div><hr />"
        );
    }

    function getRowAssignedTask(task = {}) {
        return (
            "<div class='row'>"
                + "<div class='col-sm-9'>"
                    + "<div class='col-sm-12'><p><b>" + (task.title || "") + "</b></p></div>"
                    + "<div class='col-sm-12'>"
                        + "<div class='row'><div class='col-sm-12'><span class='col-sm-2 task-value'>R$ " + (task.value || 0).formatBrl() + "</span></div></div>"
                        + "<div class='row'><span class='col-sm-12 text-justify'>" + (task.description || "") + "</span></div>"
                    + "</div>"
                + "</div>"
                + "<div class='col-sm-3 text-center'>"
                    + " <!-- <div class='rateStars'>"
                        + "<i class='fa fa-lg fa-star-o' aria-hidden='true'></i>"
                        + "<i class='fa fa-lg fa-star-o' aria-hidden='true'></i>"
                        + "<i class='fa fa-lg fa-star-o' aria-hidden='true'></i>"
                        + "<i class='fa fa-lg fa-star-o' aria-hidden='true'></i>"
                        + "<i class='fa fa-lg fa-star-o' aria-hidden='true'></i>"
                    + "</div> -->"
                    + "<div class='row'>"
                        + "<a class='mx-auto userProfileHyperlink' href='/user/" + (task.id_user || task.id_user_owner || 0) + "'>"
                            + "<!-- <span class='service-icon rounded-circle text-center'>"
                                + "<i class='fa fa-user' aria-hidden='true'></i>"
                            + "</span> -->"
                            + "<img class='service-icon rounded-circle' src='/img/baby-groot.jpg' />"
                        + "</a>"
                    + "</div>"
                + "</div>"
            + "</div><hr />"
        );
    }

    function getRowTasksWithYou(task = {}) {
        return (
            "<div class='row'>"
                + "<div class='col-sm-1 text-center'>"
                    + "<div class='col-sm-12'>"
                        +"<div class='row'>"
                            + "<a class='mx-auto userProfileHyperlink' href='/user/" + (task.id_user_owner || 0) + "'>"
                                + "<span class='service-icon rounded-circle text-center'>"
                                    + "<i class='fa fa-user' aria-hidden='true'></i>"
                                + "</span>"
                            + "</a>"
                        + "</div>"
                    + "</div>"
                +"</div>"
                + "<div class='col-sm-8'>"
                    + "<div class='col-sm-12'>"
                        + "<p><b>" + (task.title || "") + "</b></p>"
                    + "</div>"
                    + "<div class='col-sm-12'>"
                        + "<span class='col-sm-2 task-value'>R$ " + (task.value || 0).formatBrl() + "</span>"
                        + "<span class='col-sm-10'>" + (task.description || "") + "</span>"
                    + "</div>"
                + "</div>"
                + "<div class='col-sm-3'>"
                    + "<div class='pull-right'>"
                        + "<div style='margin-bottom:10px'>"
                            + "<button class='btn btn-success mb-1 cursor-pointer btnCloseTask' data-taskid='" + (task.id_task || 0) + "'>"
                                + "<i class='fa fa-check' aria-hidden='true'></i>"
                                + "Terminei"
                            + "</button>"
                        + "</div>"
                    + "</div>"
                + "</div>"
            + "</div>"
        );
    }

    function closeTask(taskid) {
        return $.ajax({
            url: "/task/finish/" + taskid,
            dataType: 'json'
        }).done(response => {
            var { code, result } = response;
            if (Number(code) === 1) {
                window.location.assign("/task/finished");
            } else {
                window.printErrorMessage(result || "Ops! Não pudemos finalizar essa tarefa!");
            }
        }).fail(err => {
            console.log(err);
            var { result } = err.responseJSON || {};
            window.printErrorMessage(result || "Ops! Não pudemos finalizar essa tarefa!");
        });
    }

    function submitTask(data = {}, form) {
        var verb = "";

        var ajaxUrl = "/task";
        var taskid = $(form).data("taskid");

        if (taskid) {
            verb = "editar";
            ajaxUrl += "/edit/" + taskid;
        } else {
            verb = "cadastrar";
            ajaxUrl += "/create";
        }

        return $.ajax({
            url: ajaxUrl,
            method: "POST",
            dataType: "json",
            data: data
        }).done(response => {
            var { code, result } = response;
            if (Number(code) === 1) {
                window.location.assign("/task/open");
            } else {
                window.printErrorMessage(result || "Ops! Não pudemos " + verb + " sua tarefa.");
            }
        }).fail(error => {
            console.log(error);
            var { result } = error.responseJSON || {};
            window.printErrorMessage(result || "Ops! Não pudemos " + verb + " sua tarefa.");
        });
    }
})(window, document);