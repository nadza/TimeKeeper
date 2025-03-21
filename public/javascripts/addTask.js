let selectedUserEmail = null;

function confirmAndReload() {
    if (confirm('Are you sure you want to delete this record?')) {
        return true;
    }
    return false;
}

function sendEmailNotification(taskName, userEmail) {
    $.ajax({
        url: '/users/send-email',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            to: userEmail,
            subject: 'New Task Assigned! ',
            text: `Task Unleashed! Brace yourself! Your next mission, should you choose to accept it, is to conquer ${taskName}. Ready, set, achieve greatness!`
        }),
        success: function(response) {
            console.log(response);
        },
        error: function(error) {
            console.error('Error sending email:', error);
        },
    });
}


$(document).ready(() => {
        $("#projectInfo").click(function() {
            const currentUrl = new URL(window.location.href);
            const pathParts = currentUrl.pathname.split('/');
            const projectsIndex = pathParts.indexOf('projects');
            var projectId = pathParts[projectsIndex + 1];
            //console.log(projectId);

            let projects;

            let getProjectsData = () => {
                return $.get(`/api/project/${projectId}`)
                    .then((results) => {
                        projects = results.info;

                        // Access project properties here
                        console.log(projects.username);

                        // Update modal content with project properties
                        $(".modal-body").html("");
                        $(".modal-body").append(
                            `
                             <div class="container">
                                <div class="row">
                                    <div class="col-4">
                                        <h6>Client:</h6>
                                    </div>
                                    <div class="col">
                                        <p>${projects.client_name}</p>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-4">
                                        <h6>Project manager:</h6>
                                    </div>
                                    <div class="col">
                                        <p>${projects.username}</p>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-4">
                                        <h6>Planned start date:</h6>
                                    </div>
                                    <div class="col">
                                        <p>${projects.planned_start_date ? new Date(projects.planned_start_date).toLocaleDateString() : ''}</p>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-4">
                                        <h6>Planned end date:</h6>
                                    </div>
                                    <div class="col">
                                        <p>${projects.planned_end_date ? new Date(projects.planned_end_date).toLocaleDateString() : ''}</p>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-4">
                                        <h6>Actual start date:</h6>
                                    </div>
                                    <div class="col">
                                        <p>${projects.actual_start_date ? new Date(projects.actual_start_date).toLocaleDateString() : ''}</p>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-4">
                                        <h6>Actual end date:</h6>
                                    </div>
                                    <div class="col">
                                        <p>${projects.actual_end_date ? new Date(projects.actual_end_date).toLocaleDateString() : ''}</p>

                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-4">
                                        <h6>Description:</h6>
                                    </div>
                                    <div class="col">
                                        <p>${projects.description}</p>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-4">
                                        <h6>Price:</h6>
                                    </div>
                                    <div class="col">
                                        <p>${projects.price}</p>
                                    </div>
                                </div>
                            </div>
                        `
                        );
                    })
                    .catch((error) => {
                        console.error('Error fetching project data:', error);
                    });
            };

            // Call the function to fetch data and update modal content
            getProjectsData();
        });



    $("#addTask").click(function() {
        const currentUrl = new URL(window.location.href);
        const pathParts = currentUrl.pathname.split('/');
        const projectsIndex = pathParts.indexOf('projects');
        var projectId = pathParts[projectsIndex + 1];

        let users;

        let getUsersData = () => {
            return $.get(`/api/all-users`)
                .then((results) => {
                    users = results.users;
                })
                .fail((error) => {
                    console.error('Error fetching users data:', error);
                });
        };

        $.when(getUsersData()).then(() => {
            console.log("Request completed");
            constructForm();
        });

        function constructForm() {
            if (users) {
                $(".modal-title").text("Add Task"); // Set modal title dynamically

                $(".modal-body").html("");
                $(".modal-body").append(`
                <form>
                    <div class="form-group">
                        <label for="user_id">User</label>
                        <select name="user_id" class="input_style form-control" id="user_id" onchange="handleUserChange(this)">
                            ${users.map(user => `<option value="${user.user_id}" data-email="${user.email}">${user.username}</option>`).join('')}
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

                // Remove any previous event handlers for the button
                $("#saveChangesTask").off("click");

                // Add the "Save changes" button with a unique ID
                $(".modal-footer").html(`
                <button id="saveChangesTask" type="button" class="btn btn-outline-dark">Save changes</button>
            `);

                // Handle the click event for the "Save changes" button
                $("#saveChangesTask").click(() => {
                    const formData = {
                        user_id: $("#user_id").val(),
                        name: $("#name").val(),
                        description: $("#description").val(),
                        project_id: projectId
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
                    console.log(formData.name, selectedUserEmail);
                    sendEmailNotification(formData.name, selectedUserEmail);
                });
            }
        }
    });
});

function handleUserChange(select) {
    selectedUserEmail = select.options[select.selectedIndex].getAttribute('data-email');
}