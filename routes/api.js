var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController'),
      projectController = require('../controllers/projectController'),
      authController = require('../controllers/authController');

router.get('/all-users', authController.authenticateJWT, userController.allUsers);

router.get('/user/:username', authController.authenticateJWT, userController.getUser);

router.get('/job-titles', authController.authenticateJWT, userController.getJobTitles);

router.get('/update/:username', authController.authenticateJWT, userController.updateUser);

router.get('/clients', authController.authenticateJWT, projectController.allClients);

router.get('/all-project', authController.authenticateJWT, authController.checkAdminRole, projectController.allProjects);

router.get('/user-project/:id', authController.authenticateJWT, projectController.userProjects);

router.get('/teams/:id', authController.authenticateJWT, projectController.allProjectsBasedOnTeam);

router.get('/project/:id', authController.authenticateJWT, projectController.specificProject);


module.exports = router;
