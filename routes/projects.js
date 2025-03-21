var express = require('express');
var router = express.Router();
const authController = require('../controllers/authController'),
      projectController = require('../controllers/projectController') ;

router.get('/:id', authController.authenticateJWT, projectController.getProject);

router.post('/create-task', authController.authenticateJWT, projectController.createTask);

router.post('/delete-task/:id', authController.authenticateJWT, projectController.deleteTask);

router.post('/update-task-time', authController.authenticateJWT, projectController.updateTaskTime);

router.post('/update-task', authController.authenticateJWT, projectController.updateTask);

router.post('/done-task/:id', authController.authenticateJWT, projectController.doneTask);

router.post('/quick-update', authController.authenticateJWT, projectController.quickTask);

module.exports = router;