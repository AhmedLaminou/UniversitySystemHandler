const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  userId: {
    type: Number,
    required: true,
    unique: true,
    ref: 'User' // Référence logique à auth-service
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    street: String,
    city: String,
    zipCode: String,
    country: { type: String, default: 'Tunisie' }
  },
  enrollmentDate: {
    type: Date,
    default: Date.now
  },
  major: {
    type: String,
    required: true,
    enum: ['Informatique', 'Génie Logiciel', 'Réseaux', 'IA', 'Cybersécurité']
  },
  level: {
    type: String,
    required: true,
    enum: ['L1', 'L2', 'L3', 'M1', 'M2']
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'SUSPENDED', 'GRADUATED', 'DROPPED'],
    default: 'ACTIVE'
  },
  gpa: {
    type: Number,
    min: 0,
    max: 20,
    default: 0
  }
}, {
  timestamps: true
});

// Index pour les recherches
studentSchema.index({ firstName: 'text', lastName: 'text', email: 'text' });

// Méthode pour générer un studentId
studentSchema.statics.generateStudentId = async function() {
  const year = new Date().getFullYear();
  const count = await this.countDocuments();
  return `STU${year}${String(count + 1).padStart(5, '0')}`;
};

// Virtuel pour le nom complet
studentSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

module.exports = mongoose.model('Student', studentSchema);
