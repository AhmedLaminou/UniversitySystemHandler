const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const authMiddleware = require('../middleware/authMiddleware');
const { body } = require('express-validator');

// Validation middleware
const validateStudent = [
  body('firstName').notEmpty().trim().withMessage('Prénom requis'),
  body('lastName').notEmpty().trim().withMessage('Nom requis'),
  body('email').isEmail().withMessage('Email invalide'),
  body('dateOfBirth').isISO8601().withMessage('Date de naissance invalide'),
  body('major').isIn(['Informatique', 'Génie Logiciel', 'Réseaux', 'IA', 'Cybersécurité']),
  body('level').isIn(['L1', 'L2', 'L3', 'M1', 'M2'])
];

// Routes publiques (avec auth)
router.use(authMiddleware); // Toutes les routes nécessitent authentification

router.post('/', validateStudent, studentController.createStudent);
router.get('/', studentController.getAllStudents);
router.get('/search', studentController.searchStudents);
router.get('/statistics', studentController.getStatistics);
router.get('/:id', studentController.getStudentById);
router.get('/user/:userId', studentController.getStudentByUserId);
router.put('/:id', studentController.updateStudent);
router.delete('/:id', studentController.deleteStudent);

module.exports = router;
