(function(window, document) {
    "use strict";

    $(document).ready(() => {
        getTasks();
    });

    function getTasks() {
        var openTaskPersonal = $("#openTaskPersonal");

        return $.ajax({
            url: '/task',
            dataType: 'json'
        }).done(result => {
            var { tasks } = result;
            openTaskPersonal.empty();
            tasks.forEach(task => {
                openTaskPersonal.append(getRowPersonalTask(task));
            });
        }).fail(err => {
            openTaskPersonal.empty();
            openTaskPersonal.append(getRowPersonalTask({
                title: "Nenhuma tarefa encontrada",
                value: 0.00,
                description: "Nenhuma tarefa pôde ser encontrada."
            }));
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