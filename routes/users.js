var express = require('express');
var router = express.Router();
const nodemailer = require('nodemailer');

const authController = require('../controllers/authController'),
      projectController = require('../controllers/projectController'),
      userController = require('../controllers/userController');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/:username/my-projects', authController.authenticateJWT, projectController.giveUserProjects);

router.get('/:username/my-tasks', authController.authenticateJWT, projectController.giveUserTasks);

router.get('/:username/my-profile', authController.authenticateJWT, userController.giveUserProfile);

router.post('/send-email', (req, res) => {
    const { to, subject, text } = req.body;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'dontreply.timekeeper@gmail.com',
        pass: 'cclg rahu fady jjgl '
      }
    });

    const mailOptions = {
      user: 'dontreply.timekeeper@gmail.com',
      to,
      subject,
      text
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        res.render('404');
        //res.status(500).send('Internal Server Error');
      } else {
        console.log('Email sent: ' + info.response);
        res.status(200).send('Email sent successfully');
      }
    });
});

module.exports = router;
