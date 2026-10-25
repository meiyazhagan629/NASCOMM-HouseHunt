const http = require('http');

const BASE_URL = 'http://localhost:5000/api';

const request = (url, options = {}, body = null) => {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const reqOptions = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.pathname + parsedUrl.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    };

    const req = http.request(reqOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, body: json });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', reject);
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
};

const runTests = async () => {
  console.log('=== RUNNING HOUSEHUNT BACKEND API TESTS ===\n');
  let passed = 0;
  let failed = 0;

  const assert = (condition, testName) => {
    if (condition) {
      console.log(`PASS: ${testName}`);
      passed++;
    } else {
      console.error(`FAIL: ${testName}`);
      failed++;
    }
  };

  try {
    // 1. Health check
    const health = await request(`${BASE_URL}/health`);
    assert(health.status === 200 && health.body.status === 'ok', 'GET /api/health returns 200 OK');

    // 2. Login as Admin
    const adminLogin = await request(`${BASE_URL}/auth/login`, { method: 'POST' }, {
      email: 'admin@househunt.com',
      password: 'Admin@123'
    });
    assert(adminLogin.status === 200 && adminLogin.body.token, 'POST /api/auth/login (Admin login)');
    const adminToken = adminLogin.body.token;

    // 3. Login as Landlord
    const ownerLogin = await request(`${BASE_URL}/auth/login`, { method: 'POST' }, {
      email: 'owner@househunt.com',
      password: 'Owner@123'
    });
    assert(ownerLogin.status === 200 && ownerLogin.body.token, 'POST /api/auth/login (Owner login)');
    const ownerToken = ownerLogin.body.token;

    // 4. Login as Renter
    const renterLogin = await request(`${BASE_URL}/auth/login`, { method: 'POST' }, {
      email: 'renter@househunt.com',
      password: 'Renter@123'
    });
    assert(renterLogin.status === 200 && renterLogin.body.token, 'POST /api/auth/login (Renter login)');
    const renterToken = renterLogin.body.token;

    // 5. Query Properties with Filters
    const propList = await request(`${BASE_URL}/properties?city=New York`);
    assert(propList.status === 200 && Array.isArray(propList.body.properties), 'GET /api/properties?city=New York filters by city');

    const firstProp = propList.body.properties[0];
    assert(firstProp && firstProp._id, 'Properties list contains valid property items');

    // 6. Landlord creates a new listing
    const newProp = await request(
      `${BASE_URL}/properties`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${ownerToken}` }
      },
      {
        title: 'Modern Sunset Loft in San Francisco',
        description: 'Brand new construction loft with floor to ceiling windows.',
        propertyType: 'Apartment',
        listingType: 'Rent',
        location: {
          address: '404 Market St',
          city: 'San Francisco',
          state: 'CA',
          pincode: '94105'
        },
        price: 3200,
        bedrooms: 2,
        bathrooms: 2,
        areaSqFt: 1100,
        furnishing: 'Furnished',
        amenities: ['WiFi', 'Parking', 'Gym'],
        images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80']
      }
    );
    assert(newProp.status === 201 && newProp.body.property._id, 'POST /api/properties (Owner listing creation)');
    const createdPropId = newProp.body.property._id;

    // 7. Admin approves listing
    const approve = await request(
      `${BASE_URL}/properties/${createdPropId}/status`,
      {
        method: 'PUT',
        headers: { Authorization: `Bearer ${adminToken}` }
      },
      { status: 'approved' }
    );
    assert(approve.status === 200 && approve.body.property.status === 'approved', 'PUT /api/properties/:id/status (Admin approval)');

    // 8. Renter books a visit
    const booking = await request(
      `${BASE_URL}/bookings`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${renterToken}` }
      },
      {
        propertyId: createdPropId,
        bookingType: 'Visit',
        visitDate: new Date(Date.now() + 86400000 * 2).toISOString(),
        preferredTime: '03:00 PM',
        tenantNotes: 'Looking to move in early next month.'
      }
    );
    assert(booking.status === 201 && booking.body.booking._id, 'POST /api/bookings (Renter visit scheduling)');

    // 9. Admin checks platform stats
    const stats = await request(`${BASE_URL}/admin/stats`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert(stats.status === 200 && stats.body.stats.users.total >= 3, 'GET /api/admin/stats returns aggregate metrics');

    console.log(`\nResults: ${passed} PASSED, ${failed} FAILED`);
    if (failed > 0) process.exit(1);
    process.exit(0);
  } catch (err) {
    console.error('Test run failed with unexpected error:', err);
    process.exit(1);
  }
};

runTests();
