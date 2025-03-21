function confirmAndReload() {
    return confirm('Are you sure you want to delete this record?');
}

function confirmAndReload2() {
    return confirm('Are you sure you are done with this task?');
}

$(document).ready(() => {
    $("#addTask").click(function() {
        let projects;

        let getProjectsData = () => {
            return $.get(`/api/user-project/${user_id}`, (results = {}) => {
                projects = results.info;
                //console.log(projects);
            });
        };

        $.when(getProjectsData()).then(() => {
            console.log("Request completed");
            constructForm();
        });

        function constructForm() {
            if (projects) {
                $(".modal-title").text("Add Task");
                $(".modal-body").html("");
                $(".modal-body").append(`
                <form>
                    <div class="form-group">
                        <label for="project_id">Project</label>
                        <select name="project_id" class="input_style form-control" id="project_id">
                            <option value="1" disabled selected>Choose a project</option>
                            ${projects.map(project => `<option value="${project.id}">${project.project_name}</option>`).join('')}    
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="name">Task name</label>
                        <input name="name" type="text" class="form-control" id="name" placeholder="Task name">
                    </div>
                    <div class="form-group">
                        <label for="description">Description</label>
                        <input name="description" type="text" class="form-control" id="description" placeholder="Description">
                    </div>
                </form>
            `);

                $("#saveChangesTask").click(() => {
                    const formData = {
                        user_id: user_id,
                        name: $("#name").val(),
                        description: $("#description").val(),
                        project_id:  $("#project_id").val(),
                    };

                    //console.log(formData);
                    $.ajax({
                        url: `/projects/create-task`,
                        method: 'POST',
                        contentType: 'application/json',
                        data: JSON.stringify(formData),
                        success: function(response) {
                            console.log(response.message);
                            $('#projectModal').modal('hide');
                            window.location.reload();
                        },
                        error: function(error) {
                            console.error('Error creating a task:', error);
                        },
                    });
                });
            }
        }
    });

    $("#addTime").click(function() {
        const task_id = $(this).data('task-id');
        $(".modal-title").text("Add time");
        $(".modal-body").html("");
        $(".modal-body").append(`
        <form>
            <div class="form-group">
                <label for="hours">Description</label>
                <input name="hours" type="text" class="form-control" id="hours" placeholder="Hours">
            </div>
        </form>
    `);

        $("#saveChangesTask").click(() => {
            const formData = {
                hours: $("#hours").val(),
                task_id: task_id
            };

            console.log(formData);
            $.ajax({
                url: `/projects/update-task-time`,
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(formData),
                success: function(response) {
                    console.log(response.message);
                    $('#projectModal').modal('hide');
                    window.location.reload();
                },
                error: function(error) {
                    console.error('Error creating a task:', error);
                },
            });
        });
    });

    $("#editTask").click(function() {
        const task_id = $(this).data('edit-id');
        $(".modal-title").text("Edit task");
        $(".modal-body").html("");
        $(".modal-body").append(`
        <form>
            <div class="form-group">
                <label for="name">Description</label>
                <input name="name" type="text" class="form-control" id="name" placeholder="Task name">
            </div>
            <div class="form-group">
                <label for="description">Description</label>
                <input name="description" type="text" class="form-control" id="description" placeholder="Description">
            </div>
        </form>
    `);

        $("#saveChangesTask").click(() => {
            const formData = {
                name: $("#name").val(),
                description: $("#description").val(),
                task_id: task_id
            };

            console.log(formData);
            $.ajax({
                url: `/projects/update-task`,
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(formData),
                success: function(response) {
                    console.log(response.message);
                    $('#projectModal').modal('hide');
                    window.location.reload();
                },
                error: function(error) {
                    console.error('Error creating a task:', error);
                },
            });
        });
    });

    $("#quickAdd").click(function() {
        $(".modal-title").text("Quick add");
        $(".modal-body").html("");
        $(".modal-body").append(`
        <form>
            <div class="form-group">
                <label for="insert">Description</label>
                <input name="insert" type="text" class="form-control" id="insert" placeholder="project_name#task_name#hours">
            </div>
        </form>
    `);

        $("#saveChangesTask").click(() => {
            const formData = {
                insert: $("#insert").val()
            };

            console.log(formData);
            $.ajax({
                url: `/projects/quick-update`,
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(formData),
                success: function(response) {
                    console.log(response.message);
                    $('#projectModal').modal('hide');
                    window.location.reload();
                },
                error: function(error) {
                    console.error('Error creating a task:', error);
                },
            });
        });
    });

});