const Student = require('../models/Student');
const { validationResult } = require('express-validator');

// CREATE - Créer un étudiant
exports.createStudent = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Générer un studentId unique
    const studentId = await Student.generateStudentId();

    const student = new Student({
      ...req.body,
      studentId,
      userId: req.user.id // Vient du JWT
    });

    await student.save();

    res.status(201).json({
      success: true,
      message: 'Étudiant créé avec succès',
      data: student
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email ou userId déjà utilisé'
      });
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// READ - Liste avec pagination et recherche
exports.getAllStudents = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search = '', 
      major = '', 
      level = '',
      status = 'ACTIVE'
    } = req.query;

    const query = { status };

    // Recherche textuelle
    if (search) {
      query.$text = { $search: search };
    }

    if (major) query.major = major;
    if (level) query.level = level;

    const students = await Student.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })
      .exec();

    const count = await Student.countDocuments(query);

    res.json({
      success: true,
      data: students,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// READ - Un étudiant par ID
exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Étudiant non trouvé'
      });
    }

    res.json({
      success: true,
      data: student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// READ - Étudiant par userId (depuis auth-service)
exports.getStudentByUserId = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.params.userId });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Étudiant non trouvé'
      });
    }

    res.json({
      success: true,
      data: student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// UPDATE - Modifier un étudiant
exports.updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Étudiant non trouvé'
      });
    }

    res.json({
      success: true,
      message: 'Étudiant mis à jour',
      data: student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// DELETE - Supprimer (soft delete)
exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { status: 'DROPPED' },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Étudiant non trouvé'
      });
    }

    res.json({
      success: true,
      message: 'Étudiant supprimé (désactivé)',
      data: student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// SEARCH - Recherche avancée
exports.searchStudents = async (req, res) => {
  try {
    const { query } = req.query;

    const students = await Student.find({
      $text: { $search: query }
    }).limit(20);

    res.json({
      success: true,
      data: students,
      count: students.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// STATS - Statistiques
exports.getStatistics = async (req, res) => {
  try {
    const stats = await Student.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          active: {
            $sum: { $cond: [{ $eq: ['$status', 'ACTIVE'] }, 1, 0] }
          },
          graduated: {
            $sum: { $cond: [{ $eq: ['$status', 'GRADUATED'] }, 1, 0] }
          },
          avgGpa: { $avg: '$gpa' }
        }
      }
    ]);

    const byMajor = await Student.aggregate([
      { $match: { status: 'ACTIVE' } },
      { $group: { _id: '$major', count: { $sum: 1 } } }
    ]);

    const byLevel = await Student.aggregate([
      { $match: { status: 'ACTIVE' } },
      { $group: { _id: '$level', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      data: {
        overview: stats[0] || {},
        byMajor,
        byLevel
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
