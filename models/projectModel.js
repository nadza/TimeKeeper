const db = require('../dbConfig');

module.exports = {
    quickTask: async(project_id, task, hours) => {
        console.log(project_id, task, hours);
        const query = {
            text: `
                UPDATE tasks 
                SET hours = hours + $3
                WHERE project_id = $1 AND name = $2
                 `,
            values: [project_id, task, hours],
        };

        try {
            const result = await db.query(query.text, query.values);
            return result.rows;
        } catch (error) {
            throw error;
        }
    },

    getProjectID: async(name) => {
        const query = {
            text: `
                SELECT project_id as id FROM projects WHERE name = $1;
                 `,
            values: [name],
        };

        try {
            const result = await db.query(query.text, query.values);
            return result.rows;
        } catch (error) {
            throw error;
        }
    },

    makeTaskDone: async (task_id) => {
        const query = {
            text: `
                UPDATE tasks 
                SET status = 1
                WHERE task_id = $1
                ;
                 `,
            values: [task_id]
        };

        try {
            const result = await db.query(query.text, query.values);
            return result.rows;
        } catch (error) {
            throw error;
        }
    },

    updateTask: async ( name, description, task_id) => {
        const query = {
            text: `
                UPDATE tasks 
                SET name = $1, description = $2
                WHERE task_id = $3;
                 `,
            values: [name, description, task_id]
        };

        try {
            const result = await db.query(query.text, query.values);
            return result.rows;
        } catch (error) {
            throw error;
        }
    },

    updateTimeTask: async (hours, task_id) => {
        const query = {
            text: `
                UPDATE tasks 
                SET hours = hours + $1
                WHERE task_id = $2;
                 `,
            values: [hours, task_id]
        };

        try {
            const result = await db.query(query.text, query.values);
            return result.rows;
        } catch (error) {
            throw error;
        }
    },

    getUserProjects: async (user_id) => {
        const query = {
            text: `
                SELECT
                p.project_id as id, p.name as project_name 
                FROM projects AS p
                WHERE p.project_manager = $1;
                 `,
            values: [user_id]
        };

        try {
            const result = await db.query(query.text, query.values);
            return result.rows;
        } catch (error) {
            throw error;
        }
    },

    usersProjects: async (user_id) => {
        const query = {
            text: `
                SELECT
                c.name as client_name, u.username as project_manager,
                p.project_id as id, p.name as project_name, p.description,
                p.planned_start_date, p.planned_end_date, p.actual_start_date, p.actual_end_date
                FROM working_on_project AS wop
                INNER JOIN projects AS p ON p.project_id = wop.project_id
                LEFT JOIN clients AS c ON p.client_id = c.client_id
                LEFT JOIN users as u ON p.project_manager = u.user_id
                WHERE wop.user_id = $1;
                 `,
            values: [user_id]
        };

        try {
            const result = await db.query(query.text, query.values);
            return result.rows;
        } catch (error) {
            throw error;
        }
    },

    getAllProjects: async () => {
        const query = {
            text: `
                SELECT p.project_id as id, c.name as client_name, p.name as project_name, u.username as username, 
                planned_start_date, planned_end_date, actual_start_date, actual_end_date, p.description, price
                FROM projects AS p
                LEFT JOIN clients AS c ON p.client_id = c.client_id
                LEFT JOIN users as u ON p.project_manager = u.user_id;
                 `,
        };
        try {
            const result = await db.query(query.text, query.values);
            return result.rows;
        } catch (error) {
            throw error;
        }
    },

    getAllTeamProjects: async (id) => {
        const query = {
            text: `  
                SELECT team_name as name, team_id as id
                FROM teams
                WHERE project_id = $1;
                 `,
            values: [id],
        };

        try {
            const result = await db.query(query.text, query.values);
            return result.rows;
        } catch (error) {
            throw error;
        }
    },

    async findTaskByIdAndRemove(id) {
        const query = {
            text: `
                DELETE FROM tasks
                WHERE task_id = $1
                 `,
            values: [id],
        };

        try {
            await db.query(query.text, query.values);
            console.log("Task deleted successfully");
        } catch (error) {
            throw error;
        }
    },

    async findByIdAndRemove(id) {
        const query = {
            text: `
                DELETE FROM projects
                WHERE project_id = $1
                 `,
            values: [id],
        };

        try {
            await db.query(query.text, query.values);
            console.log("Project deleted successfully");
        } catch (error) {
            throw error;
        }
    },

    getAllClients: async () => {
        const query = {
            text: `
                SELECT client_id, name
                FROM clients
                `,
        };

        try {
            const result = await db.query(query.text);
            return result.rows;
        } catch (error) {
            throw error;
        }
    },

    createAProject: async (client_id, name, project_manager, planned_start_date, planned_end_date, actual_start_date,
                           actual_end_date, description, price) => {
        const query = {
            text: `
                INSERT INTO projects (client_id, name, project_manager, planned_start_date, planned_end_date, actual_start_date, 
                                      actual_end_date, description, price)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                RETURNING project_id;
                 `,
            values: [client_id, name, project_manager, planned_start_date, planned_end_date, actual_start_date, actual_end_date,
                     description, price],
        };

        try {
            const result = await db.query(query.text, query.values);
            const project_id = result.rows[0].project_id;
            console.log("Project created successfully. Project ID:", project_id);
            return project_id;
        } catch (error) {
            throw error;
        }
    },

    assignProject: async (project_id, user_id, hierarchy_id, is_in_team, team) => {
        let query;
        if (is_in_team == 0) {
            query = {
                text: `
                    INSERT INTO working_on_project (project_id, user_id, hierarchy_id, is_in_team, team_id)
                    VALUES ($1, $2, $3, $4, $5)
                      `,
                values: [project_id, user_id, hierarchy_id, is_in_team, null],
            };
        } else {
            query = {
                text: `
                    INSERT INTO working_on_project (project_id, user_id, hierarchy_id, is_in_team, team_id)
                    VALUES ($1, $2, $3, $4, $5)
                      `,
                values: [project_id, user_id, hierarchy_id, is_in_team, team],
            };
        }
console.log(query);
        try {
            await db.query(query.text, query.values);
            console.log("Project created successfully");
        } catch (error) {
            throw error;
        }
    },

    assignTeam: async (project_id, team_name) => {
        let query = {
                text: `
                    INSERT INTO teams (project_id, team_name)
                    VALUES ($1, $2)
                      `,
                values: [project_id, team_name],
            };

        try {
            await db.query(query.text, query.values);
            console.log("Team assigned successfully");
        } catch (error) {
            throw error;
        }
    },

    getProjectAdminInfo: async (id) => {
        let query = {
            text: `
                SELECT p.project_id as id, c.name as client_name, p.name as project_name, u.username as username, 
                planned_start_date, planned_end_date, actual_start_date, actual_end_date, p.description, price
                FROM projects AS p
                LEFT JOIN clients AS c ON p.client_id = c.client_id
                LEFT JOIN users as u ON p.project_manager = u.user_id
                WHERE project_id = $1;
                  `,
            values: [id],
        };

        try {
            const result = await db.query(query.text, query.values);
            return result.rows;

        } catch (error) {
            throw error;
        }
    },

    getProjectUserInfo: async (project_id, user_id) => {
        let query = {
            text: `
                SELECT * FROM tasks WHERE project_id = $1 AND user_id = $2;    
                  `,
            values: [project_id, user_id],
        };

        try {
            const result = await db.query(query.text, query.values);
            return result.rows;
        } catch (error) {
            throw error;
        }
    },

    getActiveUserTasks: async (user_id) => {
        let query = {
            text: `
                SELECT t.task_id as id, t.name as task_name, t.description, t.hours, p.name as project_name
                FROM tasks as t
                LEFT JOIN projects AS p ON t.project_id = p.project_id
                WHERE user_id = $1 AND status = 0;    
                  `,
            values: [user_id],
        };

        try {
            const result = await db.query(query.text, query.values);
            return result.rows;
        } catch (error) {
            throw error;
        }
    },

    getDoneUserTasks: async (user_id) => {
        let query = {
            text: `
                SELECT t.task_id as id, t.name as task_name, t.description, t.hours, p.name as project_name
                FROM tasks as t
                LEFT JOIN projects AS p ON t.project_id = p.project_id
                WHERE user_id = $1 AND status = 1;    
                  `,
            values: [user_id],
        };

        try {
            const result = await db.query(query.text, query.values);
            return result.rows;
        } catch (error) {
            throw error;
        }
    },

    getTasks: async (project_id) => {
        let query = {
            text: `
                SELECT t.task_id as id, u.username as username, t.name, t.description, t.hours, t.status
                FROM tasks as t
                LEFT JOIN users AS u ON u.user_id = t.user_id
                WHERE project_id = $1;    
                  `,
            values: [project_id],
        };

        try {
            const result = await db.query(query.text, query.values);
            return result.rows;
        } catch (error) {
            throw error;
        }
    },

    isProjectManager: async (project_id, user_id) => {
        let query = {
            text: `
                SELECT * FROM projects WHERE project_id = $1 AND project_manager = $2;    
                  `,
            values: [project_id, user_id],
        };

        try {
            const result = await db.query(query.text, query.values);
            return result.rows;
        } catch (error) {
            throw error;
        }
    },

    isOnProject: async (project_id, user_id) => {
        let query = {
            text: `
                SELECT * FROM working_on_project WHERE project_id = $1 AND user_id = $2;    
                  `,
            values: [project_id, user_id],
        };

        try {
            const result = await db.query(query.text, query.values);
            return result.rows;
        } catch (error) {
            throw error;
        }
    },

    createTaskUser: async (user_id, description, name, project_id ) => {
        const query = {
            text: `
                INSERT INTO tasks (user_id, description, name, hours, status, project_id)
                VALUES ($1, $2, $3, $4, $5, $6)
                 `,
            values: [user_id, description, name, 0, 0, project_id],
        };

        try {
            await db.query(query.text, query.values);
            console.log("Task created successfully");
        } catch (error) {
            throw error;
        }
    },

     giveAllTimes: async () => {
         const query = {
             text: `
                    select sum(hours) as project_hours, p.name as project_name
                    from tasks as t
                    left join projects as p on t.project_id = p.project_id
                    group by p.name;
                `,
         };

         try {
             const result = await db.query(query.text);
             return result.rows;
         } catch (error) {
             throw error;
         }
     },

    giveAverageTimes: async () => {
        const query = {
            text: `
                    select round(avg(hours),2) as project_hours, p.name as project_name
                    from tasks as t
                    left join projects as p on t.project_id = p.project_id
                    group by p.name;
                `,
        };

        try {
            const result = await db.query(query.text);
            return result.rows;
        } catch (error) {
            throw error;
        }
    },

    giveUserTimes: async () => {
        const query = {
            text: `
                    select sum(hours) as project_hours, p.name as project_name, u.username as username
                    from tasks as t
                    left join projects as p on t.project_id = p.project_id
                    left join users as u on t.user_id = u.user_id
                    group by p.name, u.username;
                `,
        };

        try {
            const result = await db.query(query.text);
            return result.rows;
        } catch (error) {
            throw error;
        }
    },

    doneTask: async () => {
        const query = {
            text: `
                    select count(*) as number_of_done_tasks
                    from tasks as t
                    where status = 1;
                    `,
        };

        try {
            const result = await db.query(query.text);
            return result.rows;
        } catch (error) {
            throw error;
        }
    },

    undoneTask: async () => {
        const query = {
            text: `
                    select count(*) as number_of_undone_tasks
                    from tasks as t
                    where status = 0;
                    `,
        };

        try {
            const result = await db.query(query.text);
            return result.rows;
        } catch (error) {
            throw error;
        }
    },

    lateTask: async () => {
        const query = {
            text: `
                    select count(*) as number_of_late_tasks
                    from tasks as t
                    left join projects as p on t.project_id = p.project_id
                    where status = 0 and now() > p.planned_end_date
                    `,
        };

        try {
            const result = await db.query(query.text);
            return result.rows;
        } catch (error) {
            throw error;
        }
    },

    numberOfDoneProjectsTask: async () => {
        const query = {
            text: `
                    select count(*) as number_of_done_tasks, p.name as project_name
                    from tasks as t
                    left join projects as p on t.project_id = p.project_id
                    where status = 1
                    group by p.name;
                `,
        };

        try {
            const result = await db.query(query.text);
            return result.rows;
        } catch (error) {
            throw error;
        }
    },

    doneProjectsTask: async () => {
        const query = {
            text: `
                select t.name as task_name, p.name as project_name
                from tasks as t
                left join projects as p on t.project_id = p.project_id
                where status = 1
                group by p.name, t.name;
                `,
        };

        try {
            const result = await db.query(query.text);
            return result.rows;
        } catch (error) {
            throw error;
        }
    },

    numberOfUndoneProjectsTask: async () => {
        const query = {
            text: `
                select count(*) as number_of_undone_tasks, p.name as project_name
                from tasks as t
                left join projects as p on t.project_id = p.project_id
                where status = 0
                group by p.name;
                `,
        };

        try {
            const result = await db.query(query.text);
            return result.rows;
        } catch (error) {
            throw error;
        }
    },

    undoneProjectsTask: async () => {
        const query = {
            text: `
                select t.name as task_name, p.name as project_name
                from tasks as t
                left join projects as p on t.project_id = p.project_id
                where status = 0
                group by p.name, t.name;
                `,
        };

        try {
            const result = await db.query(query.text);
            return result.rows;
        } catch (error) {
            throw error;
        }
    },

    numberOfLateProjectsTask: async () => {
        const query = {
            text: `
                select count(*) as number_of_undone_on_time_tasks, p.name as project_name
                from tasks as t
                left join projects as p on t.project_id = p.project_id
                where status = 0 and now() > p.planned_end_date
                group by p.name;
                `,
        };

        try {
            const result = await db.query(query.text);
            return result.rows;
        } catch (error) {
            throw error;
        }
    },

    lateProjectsTask: async () => {
        const query = {
            text: `
                select t.name as task_name, p.name as project_name
                from tasks as t
                left join projects as p on t.project_id = p.project_id
                where status = 0 and now() > p.planned_end_date
                group by p.name, t.name;
                `,
        };

        try {
            const result = await db.query(query.text);
            return result.rows;
        } catch (error) {
            throw error;
        }
    },

    userGiveAllTimes: async (user_id) => {
        console.log(user_id);
        const query = {
            text: `
                    select sum(hours) as project_hours, p.name as project_name
                    from tasks as t
                    left join projects as p on t.project_id = p.project_id
                    where p.project_manager = $1
                    group by p.name;
                `,
            values: [user_id]
        };

        try {
            const result = await db.query(query.text, query.values);
            return result.rows;
        } catch (error) {
            throw error;
        }
    },

    userGiveAverageTimes: async (user_id) => {
        const query = {
            text: `
                    select round(avg(hours),2) as project_hours, p.name as project_name
                    from tasks as t
                    left join projects as p on t.project_id = p.project_id
                    where p.project_manager = $1
                    group by p.name;
                `,
            values: [user_id]
        };

        try {
            const result = await db.query(query.text, query.values);
            return result.rows;
        } catch (error) {
            throw error;
        }
    },

    userGiveUserTimes: async (user_id) => {
        const query = {
            text: `
                    select sum(hours) as project_hours, p.name as project_name, u.username as username
                    from tasks as t
                    left join projects as p on t.project_id = p.project_id
                    left join users as u on t.user_id = u.user_id
                    where p.project_manager = $1
                    group by p.name, u.username;
                `,
            values: [user_id]
        };

        try {
            const result = await db.query(query.text, query.values);
            return result.rows;
        } catch (error) {
            throw error;
        }
    },

    /* -- */

    userDoneTask: async (user_id) => {
        const query = {
            text: `
                    select count(*) as number_of_done_tasks
                    from tasks as t
                    left join projects as p on t.project_id = p.project_id
                    where status = 1 and p.project_manager = $1 ;
                    `,
            values: [user_id]
        };

        try {
            const result = await db.query(query.text, query.values);
            return result.rows;
        } catch (error) {
            throw error;
        }
    },

    userUndoneTask: async (user_id) => {
        const query = {
            text: `
                    select count(*) as number_of_undone_tasks
                    from tasks as t
                    left join projects as p on t.project_id = p.project_id
                    where p.project_manager = $1 and status = 0;
                    `,
            values: [user_id]
        };

        try {
            const result = await db.query(query.text, query.values);
            return result.rows;
        } catch (error) {
            throw error;
        }
    },

    userLateTask: async (user_id) => {
        const query = {
            text: `
                    select count(*) as number_of_late_tasks
                    from tasks as t
                    left join projects as p on t.project_id = p.project_id
                    where status = 0 and now() > p.planned_end_date and p.project_manager = $1;
                    `,
            values: [user_id]
        };

        try {
            const result = await db.query(query.text, query.values);
            return result.rows;
        } catch (error) {
            throw error;
        }
    },

    userNumberOfDoneProjectsTask: async (user_id) => {
        const query = {
            text: `
                    select count(*) as number_of_done_tasks, p.name as project_name
                    from tasks as t
                    left join projects as p on t.project_id = p.project_id
                    where status = 1 and p.project_manager = $1
                    group by p.name;
                `,
            values: [user_id]
        };

        try {
            const result = await db.query(query.text, query.values);
            return result.rows;
        } catch (error) {
            throw error;
        }
    },

    userDoneProjectsTask: async (user_id) => {
        const query = {
            text: `
                select t.name as task_name, p.name as project_name
                from tasks as t
                left join projects as p on t.project_id = p.project_id
                where status = 1 and p.project_manager = $1
                group by p.name, t.name;
                `,
            values: [user_id]
        };

        try {
            const result = await db.query(query.text, query.values);
            return result.rows;
        } catch (error) {
            throw error;
        }
    },

    userNumberOfUndoneProjectsTask: async (user_id) => {
        const query = {
            text: `
                select count(*) as number_of_undone_tasks, p.name as project_name
                from tasks as t
                left join projects as p on t.project_id = p.project_id
                where status = 0 and p.project_manager = $1
                group by p.name;
                `,
            values: [user_id]
        };

        try {
            const result = await db.query(query.text, query.values);
            return result.rows;
        } catch (error) {
            throw error;
        }
    },

    userUndoneProjectsTask: async (user_id) => {
        const query = {
            text: `
                select t.name as task_name, p.name as project_name
                from tasks as t
                left join projects as p on t.project_id = p.project_id
                where status = 0 and p.project_manager = $1
                group by p.name, t.name;
                `,
            values: [user_id]
        };

        try {
            const result = await db.query(query.text, query.values);
            return result.rows;
        } catch (error) {
            throw error;
        }
    },

    userNumberOfLateProjectsTask: async (user_id) => {
        const query = {
            text: `
                select count(*) as number_of_undone_on_time_tasks, p.name as project_name
                from tasks as t
                left join projects as p on t.project_id = p.project_id
                where status = 0 and now() > p.planned_end_date and p.project_manager = $1
                group by p.name;
                `,
            values: [user_id]
        };

        try {
            const result = await db.query(query.text, query.values);
            return result.rows;
        } catch (error) {
            throw error;
        }
    },

    userLateProjectsTask: async (user_id) => {
        const query = {
            text: `
                select t.name as task_name, p.name as project_name
                from tasks as t
                left join projects as p on t.project_id = p.project_id
                where status = 0 and now() > p.planned_end_date and p.project_manager = $1
                group by p.name, t.name;
                `,
            values: [user_id]
        };

        try {
            const result = await db.query(query.text, query.values);
            return result.rows;
        } catch (error) {
            throw error;
        }
    },

    /*

    userGiveAllTimes: async (user_id) => {
        console.log(user_id);
        const query = {
            text: `
                    select sum(hours) as project_hours, p.name as project_name
                    from tasks as t
                    left join projects as p on t.project_id = p.project_id
                    where p.project_manager = $1
                    group by p.name;
                `,
            values: [user_id]
        };

        try {
            const result = await db.query(query.text, query.values);
            return result.rows;
        } catch (error) {
            throw error;
        }
    },

    userGiveAverageTimes: async (user_id) => {
        const query = {
            text: `
                    select round(avg(hours),2) as project_hours, p.name as project_name
                    from tasks as t
                    left join projects as p on t.project_id = p.project_id
                    where p.project_manager = $1
                    group by p.name;
                `,
            values: [user_id]
        };

        try {
            const result = await db.query(query.text, query.values);
            return result.rows;
        } catch (error) {
            throw error;
        }
    },

    userGiveUserTimes: async (user_id) => {
        const query = {
            text: `
                    select sum(hours) as project_hours, p.name as project_name, u.username as username
                    from tasks as t
                    left join projects as p on t.project_id = p.project_id
                    left join users as u on t.user_id = u.user_id
                    where p.project_manager = $1
                    group by p.name, u.username;
                `,
            values: [user_id]
        };

        try {
            const result = await db.query(query.text, query.values);
            return result.rows;
        } catch (error) {
            throw error;
        }
    },
    */
}