var express = require('express');
var router = express.Router();
const adminController = require('../controllers/adminController'),
      userController = require('../controllers/userController'),
      authController = require('../controllers/authController'),
      projectController = require('../controllers/projectController');

router.post("/delete-user/:username", authController.authenticateJWT, authController.checkAdminRole, userController.deleteUser);

router.post("/update-user/:username", authController.authenticateJWT, authController.checkAdminRole, userController.updateUser);
router.post('/user-update/:username', authController.authenticateJWT, userController.UserupdateUser);

router.post('/create-user', authController.authenticateJWT, authController.checkAdminRole, userController.insertUser);

router.get('/users', authController.authenticateJWT, authController.checkAdminRole, adminController.renderUsers);

router.post("/create-project", authController.authenticateJWT,  projectController.createProject);

router.post("/delete-project/:id", authController.authenticateJWT,  projectController.deleteProject);
router.post("/delete-projects/:id", authController.authenticateJWT,  projectController.deleteProjects);

router.get('/projects', authController.authenticateJWT, authController.checkAdminRole, adminController.renderProjects);

router.post('/assign-projects', authController.authenticateJWT, projectController.assignProject);

router.post('/assign-team', authController.authenticateJWT, projectController.assignTeam);

module.exports = router;