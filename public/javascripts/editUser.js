function fetchAndRenderUserData() {
    $.get('/api/all-users', (response) => {
        const users = response.users;
        updateTable(users);
    });
};

function updateTable(users) {
    const tbody = $('#my_table tbody');
    tbody.empty();
    users.forEach(user => {
        const rowHtml = `
            <tr>
                <td>${user.username}</td>
                <td>${user.first_name}</td>
                <td>${user.last_name}</td>
                <td>${user.email}</td>
                <td>${user.job_title}</td>
                <td>
                    <button type="button" class="edit-button btn-sm btn-outline-dark" data-toggle="modal"
                                data-target="#myModal" data-username="${user.username}">Edit</button>
                </td>
                <td>
                    <form action="/admin/${user.username}/delete" method="POST">
                        <button type="submit" class="btn-sm btn-outline-dark"
                                onclick="return confirm('Are you sure you want to delete this record?')">
                                Delete
                        </button>
                    </form>
                </td>
            </tr>
        `;
        tbody.append(rowHtml);
    });
};

$(document).ready(() => {
    $(".edit-button").click(function() {
        var user_username = $(this).data("username");
        $("#saveChanges").text("Save changes");
        $(".modal-title").text("Edit user");
        $(".modal-body").html("");
        let userData, jobTitles;

        let getUserData = () => {
            return $.get(`/api/user/${user_username}`, (results = {}) => {
                userData = results.user;
                if (userData) {
                    console.log(userData.user_id);
                }
            });
        };

        let getJobTitles = () => {
            return $.get(`/api/job-titles`, (results = {}) => {
                jobTitles = results.jobTitles;
                if (jobTitles) {
                    console.log(jobTitles[0].title);
                }
            });
        };

        $.when(getUserData(), getJobTitles()).then(() => {
            console.log("Both requests completed");
            constructForm();
        });

        function constructForm() {
            if (userData && jobTitles) {
                $(".modal-body").append(
                    `
                    <form>
                        <div class="form-group">
                            <label for="username">Username</label>
                            <input type="text" class="form-control" id="username" value="${userData.username || ''}">
                        </div>
                        <div class="form-group">
                            <label for="first_name">First name</label>
                            <input type="text" class="form-control" id="first_name" value="${userData.first_name || ''}" 
                                   name="first_name" pattern="[A-Z][a-z]*" title="Start with a capital letter, followed by lowercase letters">
                        </div>
                        <div class="form-group">
                            <label for="last_name">Last name</label>
                            <input type="text" class="form-control" id="last_name" value="${userData.last_name || ''}" 
                                   name="last_name" pattern="[A-Z][a-z]*" title="Start with a capital letter, followed by lowercase letters">
                        </div>
                        <div class="form-group">
                            <label for="email">Email address</label>
                            <input type="email" class="form-control" id="email" value="${userData.email || ''}" 
                                   aria-describedby="emailHelp" name="email">
                        </div>
                        <div class="form-group">
                            <label for="job_title">Job titles</label>
                                <select name="job_title" class="input_style form-control" id="job_title">
                                    ${jobTitles.map(job => `<option value="${job.title}">${job.title}</option>`).join('')}
                                </select>
                        </div>
                        <div class="form-group">
                            <label for="password">Password</label>
                            <input type="password" class="form-control" id="password" placeholder="Password" name="password" 
                            pattern=".{6,20}" title="Password must be 6 to 20 characters">
                        </div>
                    </form>
                    `
                );
            }
        };

        $("#saveChanges").click(() => {
            const formData = {
                username: $("#username").val(),
                first_name: $("#first_name").val(),
                last_name: $("#last_name").val(),
                email: $("#email").val(),
                job_title: $("#job_title").val(),
                password: $("#password").val(),
            };
            console.log(formData);
            $.ajax({
                url: `/admin/update-user/${user_username}`,
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(formData),
                success: function(response) {
                    console.log(response.message);
                    //fetchAndRenderUserData();
                    $('#myModal').modal('hide');
                    window.location.reload();
                },
                error: function(error) {
                    console.error('Error updating user:', error);
                },
            });
        });


    });

    $("#addUser").click(function() {
        $(".modal-body").html("");
        $("#saveChanges").text("Add user");
        $(".modal-title").text("Add user");
        let jobTitles;
        let getJobTitles = () => {
            return $.get(`/api/job-titles`, (results = {}) => {
                jobTitles = results.jobTitles;
                if (jobTitles) {
                    console.log(jobTitles[0].title);
                }
            });
        };
        $.when(getJobTitles()).then(() => {
            console.log("Request completed");
            constructForm();
        });

        function constructForm() {
            if (jobTitles) {
                $(".modal-body").append(
                    `
                    <form method="POST" action="/register" autocomplete="off">
                        <div class="form-group">
                            <input type="text" name="first_name" class="input_style form-control" id="first_name"
                                   placeholder="First name" pattern="[A-Z][a-z]*" title="Start with a capital letter, followed by lowercase letters" required>
                        </div>
                        <div class="form-group">
                            <input type="text" name="last_name" class="input_style form-control" id="last_name"
                                   placeholder="Last name" pattern="[A-Z][a-z]*" title="Start with a capital letter, followed by lowercase letters" required>
                        </div>
                        <div class="form-group">
                            <input type="text" name="username" class="input_style form-control" id="username"
                                   placeholder="Username" required>
                        </div>
                        <div class="form-group">
                            <input type="email" name="email" class="input_style form-control" id="email" placeholder="Email" required>
                        </div>
                        <div class="form-group">
                            <label for="job_title">Job titles</label>
                                <select name="job_title" class="input_style form-control" id="job_title">
                                    ${jobTitles.map(job => `<option value="${job.title}">${job.title}</option>`).join('')}
                                </select>
                        </div>
                        <div class="form-group">
                            <label for="password">Password</label>
                            <input type="password" class="form-control" id="password" placeholder="Password" name="password" 
                            pattern=".{6,20}" title="Password must be 6 to 20 characters">
                        </div>
                    </form>
                    `
                );
            }
        };

        $("#saveChanges").click(() => {
            const formData = {
                username: $("#username").val(),
                first_name: $("#first_name").val(),
                last_name: $("#last_name").val(),
                email: $("#email").val(),
                job_title: $("#job_title").val(),
                password: $("#password").val(),
            };
        console.log(formData);
            $.ajax({
                url: `/admin/create-user`,
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(formData),
                success: function(response) {
                    console.log(response.message);
                    $('#myModal').modal('hide');
                    window.location.reload();
                },
                error: function(error) {
                    console.error('Error updating user:', error);
                    // Handle error and provide user feedback
                },
            });
        });


    });

});
