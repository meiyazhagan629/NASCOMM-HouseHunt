const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true
    },
    renter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    bookingType: {
      type: String,
      enum: ['Visit', 'Rent'],
      default: 'Visit'
    },
    visitDate: {
      type: Date,
      required: [true, 'Please select a date']
    },
    preferredTime: {
      type: String,
      default: '10:00 AM'
    },
    durationMonths: {
      type: Number,
      default: 12
    },
    monthlyRent: {
      type: Number,
      required: true
    },
    totalDeposit: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'rejected', 'cancelled'],
      default: 'pending'
    },
    tenantNotes: {
      type: String,
      default: ''
    },
    ownerResponse: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Booking', bookingSchema);
