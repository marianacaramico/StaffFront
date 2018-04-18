(function(window, document) {
    "use strict";

    $(document).ready(() => {
        getTasks();

        if ( !isNull($("#createTaskForm")) ) {
            var form = $("#createTaskForm");
            form.submit(e => {
                e.preventDefault();
                var data = {
                    title: $("#inputTitle").val() || "",
                    description: $("#inputDescription").val() || "",
                    value: $("#inputPrice").val() || "",
                    deadline: $("#inputDeadline").val() || ""
                };
                createTask(data);
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

    function createTask(data = {}) {
        return $.ajax({
            url: "/task/create",
            method: "POST",
            dataType: "json",
            data: data
        }).done(response => {
            var { code, result } = response;
            window.alert(result || "Erro!");
        }).fail(error => {
            console.log(error);
            window.alert("Erro!");
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
})(window, document);