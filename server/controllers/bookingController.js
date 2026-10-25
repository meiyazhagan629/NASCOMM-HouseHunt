const Booking = require('../models/Booking');
const Property = require('../models/Property');

// @desc    Create a new booking / schedule visit
// @route   POST /api/bookings
// @access  Private (Renter / User)
const createBooking = async (req, res, next) => {
  try {
    const {
      propertyId,
      bookingType,
      visitDate,
      preferredTime,
      durationMonths,
      tenantNotes
    } = req.body;

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    if (property.status !== 'approved') {
      return res.status(400).json({
        success: false,
        message: 'This property is not currently open for bookings'
      });
    }

    // Prevent owner from booking their own property
    if (property.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot book your own property'
      });
    }

    const booking = await Booking.create({
      property: property._id,
      renter: req.user._id,
      owner: property.owner,
      bookingType: bookingType || 'Visit',
      visitDate,
      preferredTime: preferredTime || '10:00 AM',
      durationMonths: durationMonths || 12,
      monthlyRent: property.price,
      totalDeposit: property.securityDeposit || 0,
      tenantNotes: tenantNotes || '',
      status: 'pending'
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('property', 'title location price images bedrooms bathrooms')
      .populate('owner', 'name email phone avatar');

    res.status(201).json({
      success: true,
      message: 'Booking request submitted successfully! Landlord has been notified.',
      booking: populatedBooking
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get current user's bookings (as Renter)
// @route   GET /api/bookings/my-bookings
// @access  Private
const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ renter: req.user._id })
      .populate('property', 'title location price images bedrooms bathrooms availability')
      .populate('owner', 'name email phone avatar')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get bookings received for owner's properties
// @route   GET /api/bookings/owner-requests
// @access  Private (Owner / Admin)
const getOwnerBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ owner: req.user._id })
      .populate('property', 'title location price images bedrooms bathrooms')
      .populate('renter', 'name email phone avatar')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update booking status (Confirm / Reject)
// @route   PUT /api/bookings/:id/status
// @access  Private (Owner / Admin)
const updateBookingStatus = async (req, res, next) => {
  try {
    const { status, ownerResponse } = req.body;

    if (!['confirmed', 'rejected', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking status'
      });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check permission: must be owner or admin
    if (
      booking.owner.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this booking'
      });
    }

    booking.status = status;
    if (ownerResponse) {
      booking.ownerResponse = ownerResponse;
    }

    await booking.save();

    res.json({
      success: true,
      message: `Booking has been ${status}`,
      booking
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Cancel booking (Renter)
// @route   PUT /api/bookings/:id/cancel
// @access  Private (Renter)
const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.renter.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking'
      });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      booking
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getOwnerBookings,
  updateBookingStatus,
  cancelBooking
};
