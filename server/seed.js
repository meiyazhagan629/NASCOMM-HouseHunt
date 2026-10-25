const mongoose = require('mongoose');
const User = require('./models/User');
const Property = require('./models/Property');
const Booking = require('./models/Booking');
const Review = require('./models/Review');

const seedInitialData = async () => {
  try {
    const existingCount = await Property.countDocuments();
    if (existingCount > 0) {
      console.log(`[Seed] Database already has ${existingCount} properties. Skipping seed.`);
      return;
    }

    console.log('[Seed] Database is empty. Seeding demo real-estate data...');

    // 1. Create Demo Users
    const adminUser = await User.create({
      name: 'Alexander Vance (System Admin)',
      username: 'admin',
      email: 'admin@househunt.com',
      password: 'Admin@123',
      role: 'admin',
      phone: '+1 (555) 901-4455',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'
    });

    const ownerUser = await User.create({
      name: 'Marcus Sterling (Premier Host)',
      username: 'marcus_host',
      email: 'owner@househunt.com',
      password: 'Owner@123',
      role: 'owner',
      phone: '+1 (555) 782-1199',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80'
    });

    const renterUser = await User.create({
      name: 'Sophia Martinez',
      username: 'sophia_renter',
      email: 'renter@househunt.com',
      password: 'Renter@123',
      role: 'renter',
      phone: '+1 (555) 431-8822',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80'
    });

    // 2. Create Realistic Properties
    const propertiesData = [
      {
        title: 'Skyline Panorama Luxury Penthouse',
        description: 'Breathtaking 360-degree skyline views of the metropolis. Features floor-to-ceiling soundproof windows, custom Italian marble kitchen, private infinity terrace, smart home automation, and dedicated concierge services.',
        propertyType: 'Penthouse',
        listingType: 'Rent',
        location: {
          address: '740 Park Avenue, Upper East Side',
          city: 'New York',
          state: 'NY',
          pincode: '10021',
          landmark: 'Central Park East',
          latitude: 40.7711,
          longitude: -73.9632
        },
        price: 4800,
        securityDeposit: 9600,
        bedrooms: 3,
        bathrooms: 3,
        areaSqFt: 2450,
        furnishing: 'Furnished',
        amenities: [
          'WiFi',
          'Swimming Pool',
          'Gym',
          'Security / CCTV',
          'Power Backup',
          'Air Conditioning',
          'Balcony',
          'Elevator',
          'Parking'
        ],
        images: [
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'
        ],
        virtualTourUrl: 'https://my.matterport.com/show/?m=JGPnGQ6hosj',
        status: 'approved',
        availability: 'available',
        featured: true,
        owner: ownerUser._id,
        rating: 4.9,
        reviewsCount: 14
      },
      {
        title: 'Modern Minimalist Villa with Private Garden',
        description: 'Sun-drenched contemporary architectural haven in Silicon Valley. Boasts an open-concept living pavilion, heated saltwater pool, solar backup, EV charging, and an organic vegetable garden.',
        propertyType: 'Villa',
        listingType: 'Rent',
        location: {
          address: '1420 Sunset Ridge Drive',
          city: 'San Francisco',
          state: 'CA',
          pincode: '94110',
          landmark: 'Twin Peaks Overlook',
          latitude: 37.7544,
          longitude: -122.4477
        },
        price: 5500,
        securityDeposit: 11000,
        bedrooms: 4,
        bathrooms: 4,
        areaSqFt: 3600,
        furnishing: 'Furnished',
        amenities: [
          'WiFi',
          'Swimming Pool',
          'Gym',
          'Security / CCTV',
          'Pet Friendly',
          'Air Conditioning',
          'Parking',
          'Power Backup'
        ],
        images: [
          'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80'
        ],
        virtualTourUrl: 'https://my.matterport.com/show/?m=JGPnGQ6hosj',
        status: 'approved',
        availability: 'available',
        featured: true,
        owner: ownerUser._id,
        rating: 5.0,
        reviewsCount: 18
      },
      {
        title: 'Urban Chic Studio in Downtown Cultural District',
        description: 'Chic designer studio with industrial exposed brick accents, high ceilings, custom quartz island kitchen, walk-in closet, and walking distance to award-winning eateries, theaters, and metro.',
        propertyType: 'Studio',
        listingType: 'Rent',
        location: {
          address: '425 S Michigan Avenue',
          city: 'Chicago',
          state: 'IL',
          pincode: '60605',
          landmark: 'Grant Park',
          latitude: 41.8756,
          longitude: -87.6244
        },
        price: 1850,
        securityDeposit: 2000,
        bedrooms: 1,
        bathrooms: 1,
        areaSqFt: 620,
        furnishing: 'Furnished',
        amenities: [
          'WiFi',
          'Gym',
          'Elevator',
          'Security / CCTV',
          'Air Conditioning'
        ],
        images: [
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80'
        ],
        virtualTourUrl: 'https://my.matterport.com/show/?m=JGPnGQ6hosj',
        status: 'approved',
        availability: 'available',
        featured: false,
        owner: ownerUser._id,
        rating: 4.7,
        reviewsCount: 8
      },
      {
        title: 'Serene Lakeside 2-BHK Apartment',
        description: 'Immaculately maintained 2-bedroom residence featuring direct waterfront views, private balcony, hardwood flooring throughout, stainless steel kitchen suite, in-unit washer/dryer, and covered parking.',
        propertyType: 'Apartment',
        listingType: 'Rent',
        location: {
          address: '210 Lady Bird Lake Way',
          city: 'Austin',
          state: 'TX',
          pincode: '78701',
          landmark: 'Downtown Boardwalk',
          latitude: 30.2672,
          longitude: -97.7431
        },
        price: 2400,
        securityDeposit: 2400,
        bedrooms: 2,
        bathrooms: 2,
        areaSqFt: 1180,
        furnishing: 'Semi-Furnished',
        amenities: [
          'WiFi',
          'Swimming Pool',
          'Parking',
          'Balcony',
          'Air Conditioning',
          'Pet Friendly'
        ],
        images: [
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80'
        ],
        virtualTourUrl: 'https://my.matterport.com/show/?m=JGPnGQ6hosj',
        status: 'approved',
        availability: 'available',
        featured: true,
        owner: ownerUser._id,
        rating: 4.8,
        reviewsCount: 11
      },
      {
        title: 'Emerald Bay Coastal Villa',
        description: 'Spectacular resort-style estate right on the coastline. Lush tropical landscaping, heated infinity pool with cabana, chef-grade commercial kitchen, wine cellar, and private beach access.',
        propertyType: 'Villa',
        listingType: 'Rent',
        location: {
          address: '880 Oceanfront Boulevard',
          city: 'Miami',
          state: 'FL',
          pincode: '33139',
          landmark: 'South Beach Promenade',
          latitude: 25.7617,
          longitude: -80.1918
        },
        price: 6200,
        securityDeposit: 12000,
        bedrooms: 5,
        bathrooms: 5,
        areaSqFt: 4200,
        furnishing: 'Furnished',
        amenities: [
          'WiFi',
          'Swimming Pool',
          'Gym',
          'Security / CCTV',
          'Power Backup',
          'Air Conditioning',
          'Balcony',
          'Pet Friendly',
          'Parking'
        ],
        images: [
          'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80'
        ],
        virtualTourUrl: 'https://my.matterport.com/show/?m=JGPnGQ6hosj',
        status: 'approved',
        availability: 'available',
        featured: true,
        owner: ownerUser._id,
        rating: 4.9,
        reviewsCount: 22
      },
      {
        title: 'Classic Craftsman Independent Family House',
        description: 'Charming two-story craftsman home in a quiet leafy neighborhood. Includes a cozy fireplace, renovated kitchen, fenced backyard ideal for pets and children, attached 2-car garage, and top-tier school district.',
        propertyType: 'Independent House',
        listingType: 'Rent',
        location: {
          address: '350 Queen Anne Avenue N',
          city: 'Seattle',
          state: 'WA',
          pincode: '98109',
          landmark: 'Queen Anne Hill',
          latitude: 47.6205,
          longitude: -122.3493
        },
        price: 3300,
        securityDeposit: 4000,
        bedrooms: 3,
        bathrooms: 2,
        areaSqFt: 1950,
        furnishing: 'Semi-Furnished',
        amenities: [
          'WiFi',
          'Parking',
          'Pet Friendly',
          'Power Backup',
          'Balcony'
        ],
        images: [
          'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1502005229762-ee1b2b8ab00f?auto=format&fit=crop&w=1200&q=80'
        ],
        virtualTourUrl: 'https://my.matterport.com/show/?m=JGPnGQ6hosj',
        status: 'approved',
        availability: 'available',
        featured: false,
        owner: ownerUser._id,
        rating: 4.6,
        reviewsCount: 6
      },
      // PENDING PROPERTIES FOR DEMONSTRATING ADMIN MODERATION
      {
        title: 'Sunny Silicon Palms 3-BHK Duplex [Pending Review]',
        description: 'Newly listed duplex with high ceilings, polished wood floors, and modern modular kitchen. Awaiting administrator review for marketplace verification.',
        propertyType: 'Apartment',
        listingType: 'Rent',
        location: {
          address: '109 Castro Street',
          city: 'San Francisco',
          state: 'CA',
          pincode: '94114',
          landmark: 'Castro Plaza',
          latitude: 37.7609,
          longitude: -122.435
        },
        price: 3600,
        securityDeposit: 5000,
        bedrooms: 3,
        bathrooms: 2,
        areaSqFt: 1650,
        furnishing: 'Furnished',
        amenities: [
          'WiFi',
          'Parking',
          'Elevator',
          'Air Conditioning',
          'Power Backup'
        ],
        images: [
          'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1560184897-ae75f418493e?auto=format&fit=crop&w=1200&q=80'
        ],
        virtualTourUrl: 'https://my.matterport.com/show/?m=JGPnGQ6hosj',
        status: 'pending',
        availability: 'available',
        featured: false,
        owner: ownerUser._id,
        rating: 0,
        reviewsCount: 0
      },
      {
        title: 'Modern Highrise Studio Overlooking Central Park [Pending Review]',
        description: 'Cozy, modern city-center studio with floor-to-ceiling windows and marble bathroom. Ideal for students or working professionals.',
        propertyType: 'Studio',
        listingType: 'Rent',
        location: {
          address: '15 Central Park West',
          city: 'New York',
          state: 'NY',
          pincode: '10023',
          landmark: 'Columbus Circle',
          latitude: 40.769,
          longitude: -73.982
        },
        price: 2100,
        securityDeposit: 2500,
        bedrooms: 1,
        bathrooms: 1,
        areaSqFt: 550,
        furnishing: 'Furnished',
        amenities: ['WiFi', 'Gym', 'Elevator', 'Security / CCTV'],
        images: [
          'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=1200&q=80'
        ],
        virtualTourUrl: 'https://my.matterport.com/show/?m=JGPnGQ6hosj',
        status: 'pending',
        availability: 'available',
        featured: false,
        owner: ownerUser._id,
        rating: 0,
        reviewsCount: 0
      }
    ];

    const createdProperties = await Property.insertMany(propertiesData);
    console.log(`[Seed] Successfully created ${createdProperties.length} properties.`);

    // 3. Create Demo Bookings & Reviews
    await Booking.create({
      property: createdProperties[0]._id,
      renter: renterUser._id,
      owner: ownerUser._id,
      bookingType: 'Visit',
      visitDate: new Date(Date.now() + 86400000 * 3),
      preferredTime: '11:30 AM',
      durationMonths: 12,
      monthlyRent: createdProperties[0].price,
      totalDeposit: createdProperties[0].securityDeposit,
      status: 'confirmed',
      tenantNotes: 'Looking forward to viewing the terrace and checking the home office space.',
      ownerResponse: 'Confirmed! I will meet you at the concierge reception at 11:30 AM.'
    });

    await Booking.create({
      property: createdProperties[1]._id,
      renter: renterUser._id,
      owner: ownerUser._id,
      bookingType: 'Rent',
      visitDate: new Date(Date.now() + 86400000 * 7),
      preferredTime: '02:00 PM',
      durationMonths: 12,
      monthlyRent: createdProperties[1].price,
      totalDeposit: createdProperties[1].securityDeposit,
      status: 'pending',
      tenantNotes: 'Relocating to Silicon Valley for tech role. Interested in long-term lease.'
    });

    await Review.create({
      property: createdProperties[0]._id,
      user: renterUser._id,
      rating: 5,
      comment: 'Absolutely stunning apartment! The 360 views from the private terrace are even better in person than the photos. Management is super responsive.'
    });

    console.log('[Seed] Seeding completed.');
  } catch (err) {
    console.error('[Seed] Seeding error:', err);
  }
};

module.exports = { seedInitialData };

if (require.main === module) {
  const { connectDB, disconnectDB } = require('./config/db');
  (async () => {
    await connectDB();
    await seedInitialData();
    await disconnectDB();
    process.exit(0);
  })();
}
