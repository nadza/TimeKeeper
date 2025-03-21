let selectedProjectName = null;
let selectedUserEmail = null;

function sendEmailNotification(projectName, userEmail) {
    $.ajax({
        url: '/users/send-email',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            to: userEmail,
            subject: 'You have been added to the team!',
            text: `You have been added to the team ${projectName}. Your journey with us begins now. Time to log in, ignite your potential, and let's soar to new heights together!`
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
    $("#addProject").click(function() {
        let clients;

        let getClientsData = () => {
            return $.get(`/api/clients`, (results = {}) => {
                clients = results.clients;
            });
        };

        $.when(getClientsData()).then(() => {
            console.log("Both requests completed");
            constructForm();
        });

        function constructForm() {
            if (clients) {
                console.log("forma napravljena")
                $(".modal-body").html("");
                $(".modal-body").append(
                    `
                <form>
                    <div class="form-group">
                        <label for="client_id">Client</label>
                        <select name="client_id" class="input_style form-control" id="client_id">
                            ${clients.map(client => `<option value="${client.client_id}">${client.name}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="project_name">Project name</label>
                        <input name="name" type="text" class="form-control" id="project_name" placeholder="Project name">
                    </div>
                    <div class="form-group">
                        <label for="planned_start_date">Planned start day</label>
                        <input name="planned_start_date" type="date" class="form-control" id="planned_start_date" placeholder="Planned start day">
                    </div>
                    <div class="form-group">
                        <label for="planned_end_date">Planned end day</label>
                        <input name="planned_end_date" type="date" class="form-control" id="planned_end_date" placeholder="Planned end day">
                    </div>
                    <div class="form-group">
                        <label for="actual_start_date">Actual start day</label>
                        <input name="actual_start_date" type="date" class="form-control" id="actual_start_date" placeholder="Actual start day">
                    </div>
                    <div class="form-group">
                        <label for="actual_end_date">Actual end day</label>
                        <input name="actual_end_date" type="date" class="form-control" id="actual_end_date" placeholder="Actual start day">
                    </div>
                    <div class="form-group">
                        <label for="description">Description</label>
                        <input name="description" type="text" class="form-control" id="description" placeholder="Description">
                    </div>
                    <div class="form-group">
                        <label for="price">Price</label>
                        <input name="price" type="text" class="form-control" id="price" placeholder="Price">
                    </div>
                </form>
                `
                );
            };

            $("#saveChanges").click(() => {
                const formData = {
                    client_id: $("#client_id").val(),
                    name: $("#project_name").val(),
                    project_manager: user_id,
                    planned_start_date: $("#planned_start_date").val(),
                    planned_end_date: $("#planned_end_date").val(),
                    actual_start_date: $("#actual_start_date").val(),
                    actual_end_date: $("#actual_end_date").val(),
                    description: $("#description").val(),
                    price: $("#price").val(),
                };


                $.ajax({
                    url: `/admin/create-project`,
                    method: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(formData),
                    success: function(response) {
                        //console.log(response.message);
                        $('#myModal').modal('hide');
                        window.location.reload();
                    },
                    error: function(error) {
                        console.error('Error creating a project:', error);
                    },
                });
            });
        }
    })

    $("#addProjectToUser").click(function() {
        $(".modal-title").text("Add project to user");
        let projects, users, teams;

        let getProjectsData = () => {
            return $.get(`/api/user-project/${user_id}`, (results = {}) => {
                projects = results.info;
                //console.log(projects);
            });
        };

        let getUsersData = () => {
            return $.get(`/api/all-users`, (results = {}) => {
                users = results.users;
                console.log(users)
            });
        };

        $.when(getProjectsData(), getUsersData()).then(() => {
            console.log("Both requests completed");
            constructForm();
        });

        function constructForm() {
            if (projects && users) {
                $(".modal-body").html("");
                $(".modal-body").append(
                    `
            <form>
                <div class="form-group">
                    <label for="project_id">Project</label>
                    <select name="project_id" class="input_style form-control" id="project_id"  onchange="handleProjectChange(this)">
                        <option value="1" disabled selected>Choose a project</option>
                        ${projects.map(project => `<option value="${project.id}">${project.project_name}</option>`).join('')}    
                    </select>
                </div>
                <div class="form-group">
                    <label for="user_id">User</label>
                    <select name="user_id" class="input_style form-control" id="user_id" onchange="handleUserChange(this)">
                        ${users.map(user => `<option value="${user.user_id}" data-email="${user.email}">${user.username}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label for="hierarchy_id">Hierarchy</label>
                    <select name="hierarchy_id" class="input_style form-control" id="hierarchy_id">
                        <option value="1">Managers</option>
                        <option value="2">Supervisors</option>
                        <option value="3">Employees</option>
                        <option value="4">Others</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="is_in_team">Team player?</label>
                    <select name="is_in_team" class="input_style form-control" id="is_in_team">
                        <option value="0">No</option>
                        <option value="1">Yes</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="team">Team</label>
                    <select name="team" class="input_style form-control" id="team"></select>
                </div>
            </form>
            `
                );

                $("#project_id").change(function () {
                    const selectedProjectId = $(this).val();
                    loadTeams(selectedProjectId);
                });
            }
        }

        function loadTeams(projectId) {
            // Make an AJAX request to fetch teams based on the selected project
            $.get(`/api/teams/${projectId}`, (results = {}) => {
                teams = results.info;
                console.log(teams);
                updateTeamsDropdown();
            });
        }

        function updateTeamsDropdown() {
            const teamsDropdown = $("#team");
            teamsDropdown.empty();
            teamsDropdown.append(teams.map(team => `<option value="${team.id}">${team.name}</option>`).join(''));
        }

        $("#saveChanges").click(() => {
            const formData = {
                project_id: $("#project_id").val(),
                user_id: $("#user_id").val(),
                hierarchy_id: $("#hierarchy_id").val(),
                is_in_team: $("#is_in_team").val(),
                team: $("#team").val()
            };

            //console.log(formData);
            console.log(selectedProjectName, selectedUserEmail);
            sendEmailNotification(selectedProjectName, selectedUserEmail);

            $.ajax({
                url: `/admin/assign-projects`,
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(formData),
                success: function(response) {
                    //console.log(response.message);
                    $('#myModal').modal('hide');
                    //fetchAndRenderProjectData();
                    window.location.reload();
                },
                error: function(error) {
                    console.error('Error creating a project:', error);
                },
            });
        });

    });

    $("#addTeamToProject").click(function() {
        $(".modal-title").text("Add team to project");
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
                $(".modal-body").html("");
                $(".modal-body").append(
                    `
            <form>
                <div class="form-group">
                    <label for="project_id">Project</label>
                    <select name="project_id" class="input_style form-control" id="project_id">
                        <option value="1" disabled selected>Choose a project</option>
                        ${projects.map(project => `<option value="${project.id}">${project.project_name}</option>`).join('')}    
                    </select>
                </div>
                <div class="form-group">
                    <label for="team_name">Team name</label>
                        <input type="text" class="form-control" id="team_name" name="team_name">
                </div>
            </form>
            `
                );
            }
        }

        $("#saveChanges").click(() => {
            const formData = {
                project_id: $("#project_id").val(),
                team_name: $("#team_name").val(),
            };

            console.log(formData);
            $.ajax({
                url: `/admin/assign-team`,
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(formData),
                success: function(response) {
                    //console.log(response.message);
                    $('#myModal').modal('hide');
                    //fetchAndRenderProjectData();
                    window.location.reload();
                },
                error: function(error) {
                    console.error('Error creating a team:', error);
                },
            });
        });

    });

});

function handleProjectChange(select) {
    selectedProjectName = select.options[select.selectedIndex].text;
}

function handleUserChange(select) {
    selectedUserEmail = select.options[select.selectedIndex].getAttribute('data-email');
}