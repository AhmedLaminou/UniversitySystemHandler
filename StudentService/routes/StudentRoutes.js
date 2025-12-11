const express = require('express');
const router = express.Router();
const studentController = require('../controllers/StudentController');
const { authorize, authorizeAdmin } = require('../middleware/authorize');

// Apply authorize middleware to all routes
router.use(authorize);

// GET /students - Retrieve all active students (Any authorized user)
router.get('/', studentController.getAllStudents);

// GET /students/:studentId - Retrieve a single student (Any authorized user)
router.get('/:studentId', studentController.getStudentById);

// POST /students - Create a new student (Admin only)
router.post('/', authorizeAdmin, studentController.createStudent);

// PUT /students/:studentId - Update a student (Admin only)
router.put('/:studentId', authorizeAdmin, studentController.updateStudent);

// DELETE /students/:studentId - Soft delete a student (Admin only)
router.delete('/:studentId', authorizeAdmin, studentController.deleteStudent);

module.exports = router;
