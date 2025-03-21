var express = require('express');
var router = express.Router();
const authController = require('../controllers/authController'),
      reportsController = require('../controllers/reportsController'),
      projectController = require("../controllers/projectController");



router.get('/', authController.authenticateJWT, projectController.renderReports);

router.get('/working-hours-of-employees', authController.authenticateJWT, reportsController.workingHoursEmployee);

router.post('/send-working-hours-pdf', reportsController.sendWorkingHours);

router.get('/hours-projects', authController.authenticateJWT, reportsController.detailedProjectsTime);

router.post('/send-hours-project-pdf', reportsController.sendHoursProjects);

router.get('/tasks-projects', authController.authenticateJWT, reportsController.detailedProjectsTasks);

router.post('/send-tasks-project-pdf', reportsController.sendTasksProjects);

router.get('/user-time-projects', authController.authenticateJWT, reportsController.userDetailedProjectsTime);

router.get('/user-task-projects', authController.authenticateJWT, reportsController.userDetailedProjectsTasks);

module.exports = router;
