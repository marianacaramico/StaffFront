(function(window, document) {
    "use strict";

    $(document).ready(() => {
        (function () {
            $(".task-value").each((key, value) => {
                var $value = $(value);
                var task_value = window.parseFloat($value.data("value")) || 0;
                $value.text("R$ " + task_value.formatBrl());
            });
            $(".task-duedate").each((key, value) => {
                var $value = $(value);
                var task_duedate = Date.formatDate($value.data("value") || "");
                $value.text(task_duedate);
            });
            window.bindDeleteTaskButton();
        })();

        $("body").on("click", ".btnAcceptTask", e => {
            e.preventDefault();
            var taskid = $(e.currentTarget).data("taskid");

            if ($.active) {
                return false;
            }

            $.ajax({
                url: "/task/accept/" + taskid,
                dataType: "json"
            }).done(response => {
                console.log(response);
                var { code, result } = response;
                if (Number(code) === 1) {
                    window.location.replace("/task/open");
                } else {
                    window.printErrorMessage(result || "Ops! Não pudemos vincular esta tarefa a você.");
                }
            }).fail(err => {
                console.log(err);
                var { result } = err.responseJSON || {};
                window.printErrorMessage(result || "Ops! Não pudemos vincular esta tarefa a você.");
            });
        });

        $("#filterTasks").submit(e => {
            e.preventDefault();
            filterTasks($("#search-text").val());
        });
    });

    function filterTasks(description) {
        var tasksSearch = $("#tasksSearch");
        return $.ajax({
            url: "/search/filter",
            dataType: "JSON",
            data: {
                description
            },
            beforeSend: () => {
                tasksSearch.empty().append("<div class='text-center'><i class='fa fa-spin fa-cog fa-3x'></i></div>");
            }
        }).done(response => {
            console.log(response);
            var { code, tasks } = response;
            if (Number(code) === 1 && Array.isArray(tasks) && tasks.length > 0) {
                tasksSearch.empty();
                tasks.forEach(task => {
                    tasksSearch.append(getTasksSearchRow(task));
                });
            } else {
                tasksSearch.empty().append(getRowTasksNotFound());
            }
        }).fail(err => {
            console.log(err);
            tasksSearch.empty().append(getRowTasksNotFound());
        });
    }

    function getTasksSearchRow(task) {
        return ('<div class="row">'
            + '<div class="col-sm-1 text-center">'
                + '<div class="col-sm-12">'
                    + '<div class="row">'
                        + '<a class="mx-auto userProfileHyperlink" href="/user/' + (task.id_user_owner || 0) + '">'
                            + '<span class="service-icon rounded-circle text-center">'
                                + '<i class="fa fa-user" aria-hidden="true"></i>'
                            + '</span>'
                        + '</a>'
                    + '</div>'
                + '</div>'
            + '</div>'
            + '<div class="col-sm-8">'
                + '<div class="col-sm-12">'
                    + '<div><b>' + (task.title || "") + '</b></div>'
                    + '<div><p>Para terminar em: ' + Date.formatDate(task.due_date || "") + '</p></div>'
                + '</div>'
                + '<div class="col-sm-12">'
                    + '<span class="col-sm-2 task-value">R$ ' + window.parseFloat(task.value || 0).formatBrl() + '</span>'
                    + '<span class="col-sm-10">' + (task.description || "") + '</span>'
                + '</div>'
            + '</div>'
            + '<div class="col-sm-3">'
                + '<div class="pull-right">'
                    + '<div style="margin-bottom:10px;">'
                        + '<button type="button" data-taskid="' + (task.id_task || 0) + '" class="btn btn-success cursor-pointer btnAcceptTask"><i class="fa fa-check" aria-hidden="true"></i> Eu faço!</button>'
                    + '</div>'
                + '</div>'
            + '</div>'
        + '</div>'
        + '<hr />');
    }
    
})(window, document);



