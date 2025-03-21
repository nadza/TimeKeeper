const Project = require("../models/projectModel");
const User = require("../models/userModel");

module.exports = {
    renderReports: async (req, res) => {
        try {
            const jwtPayload = req.user;
            res.locals.username = jwtPayload.username;
            const all_projects = await Project.getAllProjects();

            const role = jwtPayload.role;
            if (role === 'admin')
                res.locals.userRole = 'admin';
            res.render('reports', {role: role, projects: all_projects});
        } catch (error) {
            console.error('Error making a quick task:', error);
            res.render('404');
            //res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    quickTask: async (req, res) => {
        try {
            const insert = req.body.insert;
            console.log(insert);
            const array = insert.split("#");
            const project = array[0];
            const task = array[1];
            const hours = array[2];
            console.log(project, task, hours);
            const project_id = await Project.getProjectID(project);
            console.log(project_id[0].id)
            const result = await Project.quickTask(project_id[0].id, task, hours);

            //return res.json({task: task});
            res.redirect(req.headers.referer || '/');
        } catch (error) {
            console.error('Error making a quick task:', error);
            res.render('404');
            //res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    doneTask: async (req, res) => {
        try {
            const task_id  = req.params.id;
            const task = await Project.makeTaskDone(task_id);

            //return res.json({task: task});
            res.redirect(req.headers.referer || '/');
        } catch (error) {
            console.error('Error deleting task:', error);
            res.render('404');
            //res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    updateTask: async (req, res) => {
        try {
            const { name, description, task_id } = req.body;
            const task = await Project.updateTask(name, description, task_id);

            return res.json({task: task});
        } catch (error) {
            console.error('Error deleting task:', error);
            res.render('404');
            //res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    deleteTask: async (req, res) => {
        try {
            const id = req.params.id;
            await Project.findTaskByIdAndRemove(id);
            res.redirect(req.headers.referer || '/');
        } catch (error) {
            console.error('Error deleting task:', error);
            res.render('404');
            //res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    deleteProjects: async (req, res) => {
        const id = req.params.id;
        Project.findByIdAndRemove(id)
            .then(() => {
                res.redirect(req.headers.referer || '/');
            })
            .catch(error => {
                console.log(`Error deleting project by id: ${error.message}`);
                res.render('404');
                //res.redirect(req.headers.referer || '/');
            })
    },

    deleteProject: async (req, res) => {
        const id = req.params.id;
        Project.findByIdAndRemove(id)
            .then(() => {
                res.redirect("/admin/projects");
            })
            .catch(error => {
                console.log(`Error deleting project by id: ${error.message}`);
                res.render('404');
                //res.redirect("/admin/projects");
            })
        },

    allClients:  async (req, res) => {
        try {
            let clients = await Project.getAllClients();
            return res.json({ clients: clients });
        } catch (error) {
            console.error('Error fetching clients:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }

    },

    createProject: async (req, res) => {
        try {
            var { client_id, name, project_manager, planned_start_date, planned_end_date, actual_start_date,
                actual_end_date, description, price } = req.body;
            actual_start_date = actual_start_date !== '' ? actual_start_date : null;
            actual_end_date = actual_end_date !== '' ? actual_end_date : null;
            description = description !== '' ? description : null;
            const project = await Project.createAProject(client_id, name, project_manager, planned_start_date, planned_end_date, actual_start_date,
                actual_end_date, description, price);
            const user = await Project.assignProject(project, project_manager, 1, 0, null)
            return res.json({ project: project, user: user });
        } catch (error) {
            console.error('Error creating a project:', error);
            res.render('404');
            //res.status(500).json({ error: 'Internal Server Error' });
        }
        },

    allProjects: async (req, res) => {
        try {
                const all_projects = await Project.getAllProjects();
                return res.json({info: all_projects});

        } catch (error) {
            throw error;
        }
    },

    userProjects: async (req, res) => {
        const user_id = req.params.id;
        try {
            const all_projects = await Project.getUserProjects(user_id);
            return res.json({info: all_projects});

        } catch (error) {
            throw error;
        }
    },

    allProjectsBasedOnTeam: async (req, res) => {
        try {
            const id = req.params.id;
            const all_projects = await Project.getAllTeamProjects(id);
            return res.json({info: all_projects});
        } catch (error) {
            throw error;
        }
    },

    assignProject: async (req, res) => {
        try {
            const { project_id, user_id, hierarchy_id, is_in_team, team } = req.body;
            const assign_project = await Project.assignProject(project_id, user_id, hierarchy_id, is_in_team, team);
            return res.json({info: assign_project});
        } catch (error) {
            //throw error;
            res.render('404');
        }
    },

    assignTeam: async (req, res) => {
        try {
            const { project_id, team_name } = req.body;
            const assign_project = await Project.assignTeam(project_id, team_name);
            return res.json({info: assign_project});
        } catch (error) {
            res.render('404');
            // throw error;
        }
    },

    getProject: async (req, res) => {
    try {
        res.locals.userRole = req.user.role;

        const jwtPayload = req.user;
        const username = jwtPayload.username;
        const role = jwtPayload.role;

        res.locals.username = username;

        const project_id = req.params.id;

        const result = await User.getId(username);
        const user_id = result.user_id;


        const is_project_manager = await Project.isProjectManager(project_id, user_id);
        console.log(is_project_manager);
        const is_on_project = await Project.isOnProject(project_id, user_id);
        console.log(is_on_project);

        const projects = await Project.getProjectAdminInfo(project_id);
        if(role === "admin" || is_project_manager) {
            const tasks = await Project.getTasks(project_id);
            //console.log(tasks);
            res.render('admin/project', { projects: projects[0], tasks: tasks });
        }
        else if(is_on_project) {
            const tasks = await Project.getProjectUserInfo(project_id, user_id);
            res.render('users/project', { projects: projects, tasks: tasks });
        }
        else res.redirect('/404');
    } catch (error) {
        console.error('Error fetching users:', error);
        res.render('404');
        //res.status(500).json({ error: 'Internal Server Error' });
    }
    },

    specificProject: async (req, res) => {
        try {
            const id = req.params.id;

            const project = await Project.getProjectAdminInfo(id);
            return res.json({info: project[0]});
        } catch (error) {
            throw error;
        }
    },

    createTask: async (req, res) => {
        try {
            const { user_id, description, name, project_id } = req.body;

            const task = await Project.createTaskUser(user_id, description, name, project_id);
            console.log("Successfully created task")
            return res.json({info: task});

        } catch (error) {
            res.render('404');
            //throw error;
        }
    },

    giveUserProjects: async (req, res) => {
        try {
            const username = req.params.username;
            res.locals.username = req.user.username;

            const user_id = req.user.user_id;

            const user = await User.getId(username);
            const projects = await Project.usersProjects(user[0].user_id);

            res.render('users/projects', { projects: projects, user_id: user[0].user_id });

            //return res.json({projects: projects});
        } catch (error) {
            res.render('404');
            //throw error;
        }
    },

    giveUserTasks: async (req, res) => {
        try {
            const username = req.params.username;
            res.locals.username = req.user.username;

            const user = await User.getId(username);
            const active_tasks = await Project.getActiveUserTasks(user[0].user_id);
            const done_tasks = await Project.getDoneUserTasks(user[0].user_id);

            res.render('users/tasks', { active_tasks: active_tasks, done_tasks: done_tasks, user_id: user[0].user_id  });

            //return res.json({projects: projects});
        } catch (error) {
            res.render('404');
            //throw error;
        }
    },

    updateTaskTime:  async (req, res) => {
        try {
            const { hours, task_id } = req.body;
            const task = await Project.updateTimeTask(hours, task_id);

            return res.json({task: task});
        } catch (error) {
            res.render('404');
            //throw error;
        }
    },

}