const Property = require('../models/Property');
const Review = require('../models/Review');

// @desc    Get all properties with advanced search, filter, pagination
// @route   GET /api/properties
// @access  Public
const getProperties = async (req, res, next) => {
  try {
    const {
      keyword,
      city,
      propertyType,
      listingType,
      minPrice,
      maxPrice,
      bedrooms,
      furnishing,
      amenities,
      featured,
      sort,
      page = 1,
      limit = 12
    } = req.query;

    const query = {};

    // For public browsing, only show approved properties
    query.status = 'approved';

    // Keyword search
    if (keyword && keyword.trim()) {
      query.$or = [
        { title: { $regex: keyword.trim(), $options: 'i' } },
        { description: { $regex: keyword.trim(), $options: 'i' } },
        { 'location.city': { $regex: keyword.trim(), $options: 'i' } },
        { 'location.address': { $regex: keyword.trim(), $options: 'i' } }
      ];
    }

    // City filter
    if (city && city !== 'All') {
      query['location.city'] = { $regex: `^${city.trim()}$`, $options: 'i' };
    }

    // Property type
    if (propertyType && propertyType !== 'All') {
      query.propertyType = propertyType;
    }

    // Listing type
    if (listingType && listingType !== 'All') {
      query.listingType = listingType;
    }

    // Bedrooms filter
    if (bedrooms && bedrooms !== 'All') {
      const beds = parseInt(bedrooms, 10);
      if (beds >= 4) {
        query.bedrooms = { $gte: 4 };
      } else if (!isNaN(beds)) {
        query.bedrooms = beds;
      }
    }

    // Furnishing
    if (furnishing && furnishing !== 'All') {
      query.furnishing = furnishing;
    }

    // Price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Amenities filter (comma-separated or single)
    if (amenities) {
      const amenitiesList = Array.isArray(amenities)
        ? amenities
        : amenities.split(',').map((a) => a.trim());
      if (amenitiesList.length > 0) {
        query.amenities = { $all: amenitiesList };
      }
    }

    // Featured only
    if (featured === 'true') {
      query.featured = true;
    }

    // Sorting
    let sortOption = { createdAt: -1 }; // default newest
    if (sort === 'price-asc') sortOption = { price: 1 };
    else if (sort === 'price-desc') sortOption = { price: -1 };
    else if (sort === 'rating') sortOption = { rating: -1 };
    else if (sort === 'bedrooms') sortOption = { bedrooms: -1 };

    // Pagination
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 12;
    const skip = (pageNum - 1) * limitNum;

    const total = await Property.countDocuments(query);
    const properties = await Property.find(query)
      .populate('owner', 'name email phone avatar')
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      count: properties.length,
      total,
      totalPages: Math.ceil(total / limitNum) || 1,
      currentPage: pageNum,
      properties
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single property by ID
// @route   GET /api/properties/:id
// @access  Public
const getPropertyById = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id).populate(
      'owner',
      'name email phone avatar createdAt'
    );

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Fetch reviews for this property
    const reviews = await Review.find({ property: property._id })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      property,
      reviews
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new property listing
// @route   POST /api/properties
// @access  Private (Owner / Admin)
const createProperty = async (req, res, next) => {
  try {
    const propertyData = {
      ...req.body,
      owner: req.user._id
    };

    // Admins are auto-approved, owners are pending moderation
    if (req.user.role === 'admin') {
      propertyData.status = 'approved';
    } else {
      propertyData.status = 'pending';
    }

    const property = await Property.create(propertyData);

    res.status(201).json({
      success: true,
      message:
        property.status === 'approved'
          ? 'Property listing published successfully!'
          : 'Property submitted! It is awaiting admin approval before going live.',
      property
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update property
// @route   PUT /api/properties/:id
// @access  Private (Owner of the property / Admin)
const updateProperty = async (req, res, next) => {
  try {
    let property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Ensure user is property owner or admin
    if (
      property.owner.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this property'
      });
    }

    property = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('owner', 'name email phone avatar');

    res.json({
      success: true,
      message: 'Property updated successfully',
      property
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete property
// @route   DELETE /api/properties/:id
// @access  Private (Owner of the property / Admin)
const deleteProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    if (
      property.owner.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this property'
      });
    }

    await Property.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Property listing removed successfully'
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get properties posted by current logged in user
// @route   GET /api/properties/my-listings
// @access  Private (Owner / Admin)
const getMyProperties = async (req, res, next) => {
  try {
    const properties = await Property.find({ owner: req.user._id }).sort({
      createdAt: -1
    });

    res.json({
      success: true,
      count: properties.length,
      properties
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Admin approve or reject property listing
// @route   PUT /api/properties/:id/status
// @access  Private (Admin only)
const updateApprovalStatus = async (req, res, next) => {
  try {
    const { status, statusReason } = req.body;

    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be approved, rejected, or pending'
      });
    }

    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    property.status = status;
    if (statusReason !== undefined) {
      property.statusReason = statusReason;
    }

    await property.save();

    res.json({
      success: true,
      message: `Property status updated to '${status}'`,
      property
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Add review for a property
// @route   POST /api/properties/:id/reviews
// @access  Private
const addReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const propertyId = req.params.id;

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    const existingReview = await Review.findOne({
      property: propertyId,
      user: req.user._id
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this property'
      });
    }

    const review = await Review.create({
      property: propertyId,
      user: req.user._id,
      rating: Number(rating),
      comment
    });

    // Update property rating & count
    const allReviews = await Review.find({ property: propertyId });
    const avgRating =
      allReviews.reduce((acc, item) => item.rating + acc, 0) / allReviews.length;

    property.rating = parseFloat(avgRating.toFixed(1));
    property.reviewsCount = allReviews.length;
    await property.save();

    const populatedReview = await Review.findById(review._id).populate(
      'user',
      'name avatar'
    );

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      review: populatedReview,
      newRating: property.rating,
      reviewsCount: property.reviewsCount
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getMyProperties,
  updateApprovalStatus,
  addReview
};
