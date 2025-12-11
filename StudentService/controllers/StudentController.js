const Student = require('../models/Student');

// Create a new student
exports.createStudent = async (req, res) => {
    try {
        const { studentId, firstName, lastName, email, enrollmentDate } = req.body;

        // Check if student already exists
        const existingStudent = await Student.findOne({ $or: [{ studentId }, { email }] });
        if (existingStudent) {
            return res.status(400).json({ message: 'Student with this ID or Email already exists' });
        }

        const newStudent = new Student({
            studentId,
            firstName,
            lastName,
            email,
            enrollmentDate
        });

        const savedStudent = await newStudent.save();
        res.status(201).json(savedStudent);
    } catch (error) {
        res.status(500).json({ message: 'Error creating student', error: error.message });
    }
};

// Get all active students
exports.getAllStudents = async (req, res) => {
    try {
        const students = await Student.find({ isActive: true });
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching students', error: error.message });
    }
};

// Get a single student by ID (studentId, not _id)
exports.getStudentById = async (req, res) => {
    try {
        const student = await Student.findOne({ studentId: req.params.studentId });
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching student', error: error.message });
    }
};

// Update a student
exports.updateStudent = async (req, res) => {
    try {
        const { firstName, lastName, email, enrollmentDate, isActive } = req.body;
        
        const updatedStudent = await Student.findOneAndUpdate(
            { studentId: req.params.studentId },
            { firstName, lastName, email, enrollmentDate, isActive },
            { new: true, runValidators: true }
        );

        if (!updatedStudent) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.status(200).json(updatedStudent);
    } catch (error) {
        res.status(500).json({ message: 'Error updating student', error: error.message });
    }
};

// Soft delete a student
exports.deleteStudent = async (req, res) => {
    try {
        const deletedStudent = await Student.findOneAndUpdate(
            { studentId: req.params.studentId },
            { isActive: false },
            { new: true }
        );

        if (!deletedStudent) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.status(200).json({ message: 'Student soft-deleted successfully', student: deletedStudent });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting student', error: error.message });
    }
};
