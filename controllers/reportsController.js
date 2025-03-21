const User = require("../models/userModel"),
      Project = require("../models/projectModel");
const nodemailer = require("nodemailer");

module.exports = {
    workingHoursEmployee: async (req, res) => {
        try {
            const jwtPayload = req.user;
            res.locals.username = jwtPayload.username;
            const time = await User.giveWorkingHours();
            //console.log(time);
            res.render('reports/workingHoursEmployee', { time: time });

        } catch (error) {
            console.error('Error fetching time:', error);
            res.render('404');
            //res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    sendTasksProjects: async (req, res) => {
        const {pdfData, pdfFilename} = req.body;

        try {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'dontreply.timekeeper@gmail.com',
                    pass: 'cclg rahu fady jjgl ',
                },
            });

            const info = await transporter.sendMail({
                from: 'dontreply.timekeeper@gmail.com',
                to: 'zahiragicnadza@gmail.com',
                subject: 'Detailed task report on projects',
                text: 'Please find the attached tasks on projects report.',
                attachments: [
                    {
                        filename: pdfFilename,
                        content: Buffer.from(pdfData, 'base64'), ///content: pdfData,
                        //encoding: 'base64',
                    },
                ],
            });

            console.log('Message sent: %s', info.messageId);
            res.json({success: true});
        } catch (error) {
            console.error('Error sending email:', error);
            res.render('404');
            //res.status(500).json({error: 'Failed to send email.'});
        }
    },

    sendHoursProjects: async (req, res) => {
        const {pdfData, pdfFilename} = req.body;

        try {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'dontreply.timekeeper@gmail.com',
                    pass: 'cclg rahu fady jjgl ',
                },
            });

            const info = await transporter.sendMail({
                from: 'dontreply.timekeeper@gmail.com',
                to: 'zahiragicnadza@gmail.com',
                subject: 'Detailed time report on projects',
                text: 'Please find the attached working hours on projects report.',
                attachments: [
                    {
                        filename: pdfFilename,
                        content: Buffer.from(pdfData, 'base64'), ///content: pdfData,
                        //encoding: 'base64',
                    },
                ],
            });

            console.log('Message sent: %s', info.messageId);
            res.json({success: true});
        } catch (error) {
            console.error('Error sending email:', error);
            res.render('404');
            //res.status(500).json({error: 'Failed to send email.'});
        }
    },

    sendWorkingHours: async (req, res) => {
        const { pdfData, pdfFilename } = req.body;

        try {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'dontreply.timekeeper@gmail.com',
                    pass: 'cclg rahu fady jjgl ',
                },
            });

            const info = await transporter.sendMail({
                from: 'dontreply.timekeeper@gmail.com',
                to: 'zahiragicnadza@gmail.com',
                subject: 'Working Hours Report',
                text: 'Please find the attached working hours report.',
                attachments: [
                    {
                        filename: pdfFilename,
                        content: Buffer.from(pdfData, 'base64'), ///content: pdfData,
                        //encoding: 'base64',
                    },
                ],
            });

            console.log('Message sent: %s', info.messageId);
            res.json({ success: true });
        } catch (error) {
            console.error('Error sending email:', error);
            res.render('404');
            //res.status(500).json({ error: 'Failed to send email.' });
        }
    },

    detailedProjectsTime: async (req, res) => {
        try {
            const jwtPayload = req.user;
            res.locals.username = jwtPayload.username;
            const all_times = await Project.giveAllTimes();
            const avg_times = await Project.giveAverageTimes();
            const all_user_times = await Project.giveUserTimes();

            res.render('reports/adminTimeReport', { all_times: all_times, avg_times: avg_times, all_user_times: all_user_times });

        } catch (error) {
            console.error('Error fetching time:', error);
            res.render('404');
            //res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    detailedProjectsTasks: async (req, res) => {
    try {
        const jwtPayload = req.user;
        res.locals.username = jwtPayload.username;

        const number_of_done_tasks = await Project.numberOfDoneProjectsTask();
        const done_tasks = await Project.doneProjectsTask();
        const number_of_undone_tasks = await Project.numberOfUndoneProjectsTask();
        const undone_tasks = await Project.undoneProjectsTask();
        const number_of_late_tasks = await Project.numberOfLateProjectsTask();
        const late_tasks = await Project.lateProjectsTask();

        const number_done = await Project.doneTask();
        const number_undone = await Project.undoneTask();
        const number_late = await Project.lateTask();

        res.render('reports/adminTaskReport', { number_of_done_tasks: number_of_done_tasks, done_tasks: done_tasks,
                                                number_of_undone_tasks: number_of_undone_tasks, undone_tasks: undone_tasks,
                                                number_of_late_tasks: number_of_late_tasks, late_tasks: late_tasks,
                                                number_done: number_done, number_undone:number_undone, number_late: number_late });

        } catch (error) {
            console.error('Error fetching time:', error);
        res.render('404');
            //res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    userDetailedProjectsTime: async (req, res) => {
        try {
            const jwtPayload = req.user;
            res.locals.username = jwtPayload.username;
            const user = await User.getId(jwtPayload.username);
            const user_id = user[0].user_id;
            //console.log(user_id);
            const all_times = await Project.userGiveAllTimes(user_id);
            const avg_times = await Project.userGiveAverageTimes(user_id);
            const all_user_times = await Project.userGiveUserTimes(user_id);

            res.render('reports/adminTimeReport', { all_times: all_times, avg_times: avg_times, all_user_times: all_user_times });

        } catch (error) {
            console.error('Error fetching time:', error);
            res.render('404');
            //res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    userDetailedProjectsTasks: async (req, res) => {
        try {
            const jwtPayload = req.user;
            res.locals.username = jwtPayload.username;
            const user = await User.getId(jwtPayload.username);
            const user_id = user[0].user_id;

            const number_of_done_tasks = await Project.userNumberOfDoneProjectsTask(user_id);
            const done_tasks = await Project.userDoneProjectsTask(user_id);
            const number_of_undone_tasks = await Project.userNumberOfUndoneProjectsTask(user_id);
            const undone_tasks = await Project.userUndoneProjectsTask(user_id);
            const number_of_late_tasks = await Project.userNumberOfLateProjectsTask(user_id);
            const late_tasks = await Project.userLateProjectsTask(user_id);

            const number_done = await Project.userDoneTask(user_id);
            const number_undone = await Project.userUndoneTask(user_id);
            const number_late = await Project.userLateTask(user_id);

            res.render('reports/adminTaskReport', { number_of_done_tasks: number_of_done_tasks, done_tasks: done_tasks,
                number_of_undone_tasks: number_of_undone_tasks, undone_tasks: undone_tasks,
                number_of_late_tasks: number_of_late_tasks, late_tasks: late_tasks,
                number_done: number_done, number_undone:number_undone, number_late: number_late });

        } catch (error) {
            console.error('Error fetching time:', error);
            res.render('404');
            //res.status(500).json({ error: 'Internal Server Error' });
        }
    },
}