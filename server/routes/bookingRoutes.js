const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getOwnerBookings,
  updateBookingStatus,
  cancelBooking
} = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');

// Renter routes
router.post('/', protect, createBooking);
router.get('/my-bookings', protect, getMyBookings);
router.put('/:id/cancel', protect, cancelBooking);

// Landlord / Owner routes
router.get('/owner-requests', protect, authorize('owner', 'admin'), getOwnerBookings);
router.put('/:id/status', protect, authorize('owner', 'admin'), updateBookingStatus);

module.exports = router;
