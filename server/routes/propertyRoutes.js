const express = require('express');
const router = express.Router();
const {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getMyProperties,
  updateApprovalStatus,
  addReview
} = require('../controllers/propertyController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');

// Public listing browsing
router.get('/', getProperties);

// Specific routes before :id
router.get('/my-listings', protect, authorize('owner', 'admin'), getMyProperties);

// Single property details
router.get('/:id', getPropertyById);

// Owner / Admin creation
router.post('/', protect, authorize('owner', 'admin'), createProperty);

// Update / Delete property
router.put('/:id', protect, authorize('owner', 'admin'), updateProperty);
router.delete('/:id', protect, authorize('owner', 'admin'), deleteProperty);

// Admin approval
router.put('/:id/status', protect, authorize('admin'), updateApprovalStatus);

// Reviews
router.post('/:id/reviews', protect, addReview);

module.exports = router;
