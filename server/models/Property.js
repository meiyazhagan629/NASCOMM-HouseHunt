const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a property title'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters']
    },
    description: {
      type: String,
      required: [true, 'Please provide a property description']
    },
    propertyType: {
      type: String,
      required: [true, 'Please select property type'],
      enum: ['Apartment', 'Independent House', 'Villa', 'Studio', 'Penthouse'],
      default: 'Apartment'
    },
    listingType: {
      type: String,
      enum: ['Rent', 'Sale'],
      default: 'Rent'
    },
    location: {
      address: {
        type: String,
        required: [true, 'Address is required']
      },
      city: {
        type: String,
        required: [true, 'City is required'],
        trim: true,
        index: true
      },
      state: {
        type: String,
        default: ''
      },
      pincode: {
        type: String,
        default: ''
      },
      landmark: {
        type: String,
        default: ''
      },
      latitude: {
        type: Number,
        default: 37.7749
      },
      longitude: {
        type: Number,
        default: -122.4194
      }
    },
    price: {
      type: Number,
      required: [true, 'Please provide monthly rent or price'],
      min: [0, 'Price must be positive']
    },
    securityDeposit: {
      type: Number,
      default: 0
    },
    bedrooms: {
      type: Number,
      required: [true, 'Specify number of bedrooms'],
      min: [0, 'Bedrooms cannot be negative']
    },
    bathrooms: {
      type: Number,
      required: [true, 'Specify number of bathrooms'],
      min: [1, 'Must have at least 1 bathroom']
    },
    areaSqFt: {
      type: Number,
      required: [true, 'Specify total area in Sq Ft']
    },
    furnishing: {
      type: String,
      enum: ['Furnished', 'Semi-Furnished', 'Unfurnished'],
      default: 'Semi-Furnished'
    },
    amenities: {
      type: [String],
      default: []
    },
    images: {
      type: [String],
      default: [
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'
      ]
    },
    virtualTourUrl: {
      type: String,
      default: 'https://my.matterport.com/show/?m=JGPnGQ6hosj'
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
      index: true
    },
    statusReason: {
      type: String,
      default: ''
    },
    availability: {
      type: String,
      enum: ['available', 'rented'],
      default: 'available'
    },
    featured: {
      type: Boolean,
      default: false
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      default: 4.8
    },
    reviewsCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Compound text index for search
propertySchema.index({
  title: 'text',
  description: 'text',
  'location.city': 'text',
  'location.address': 'text'
});

module.exports = mongoose.model('Property', propertySchema);
