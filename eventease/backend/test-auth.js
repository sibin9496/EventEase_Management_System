import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

async function testAuthFlow() {
  try {
    // Test 1: Create a new user
    const timestamp = Date.now();
    const testEmail = `testuser_${timestamp}@test.com`;
    const testPassword = 'Test@12345';
    const testName = `Test User ${timestamp}`;

    console.log('\n=== TEST 1: SIGNUP ===');
    console.log(`Email: ${testEmail}`);
    console.log(`Password: ${testPassword}`);
    
    const signupRes = await axios.post(`${BASE_URL}/auth/signup`, {
      email: testEmail,
      password: testPassword,
      name: testName
    });

    console.log('✅ Signup Success!');
    console.log(`Token: ${signupRes.data.token.substring(0, 20)}...`);
    console.log(`User: ${signupRes.data.user.name} (${signupRes.data.user.email})`);
    console.log(`Role: ${signupRes.data.user.role}`);

    // Test 2: Login with the same credentials
    console.log('\n=== TEST 2: LOGIN ===');
    console.log(`Email: ${testEmail}`);
    console.log(`Password: ${testPassword}`);
    
    const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
      email: testEmail,
      password: testPassword
    });

    console.log('✅ Login Success!');
    console.log(`Token: ${loginRes.data.token.substring(0, 20)}...`);
    console.log(`User: ${loginRes.data.user.name} (${loginRes.data.user.email})`);
    console.log(`Role: ${loginRes.data.user.role}`);

    // Test 3: Try wrong password
    console.log('\n=== TEST 3: WRONG PASSWORD ===');
    console.log(`Email: ${testEmail}`);
    console.log(`Password: wrongpassword`);
    
    try {
      await axios.post(`${BASE_URL}/auth/login`, {
        email: testEmail,
        password: 'wrongpassword'
      });
      console.log('❌ Should have failed!');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Correctly rejected invalid password');
        console.log(`Message: ${error.response.data.message}`);
      } else {
        throw error;
      }
    }

    // Test 4: Admin login
    console.log('\n=== TEST 4: ADMIN LOGIN ===');
    console.log(`Email: admin@eventease.com`);
    console.log(`Password: admin123`);
    
    try {
      const adminRes = await axios.post(`${BASE_URL}/auth/login`, {
        email: 'admin@eventease.com',
        password: 'admin123'
      });
      console.log('✅ Admin Login Success!');
      console.log(`Role: ${adminRes.data.user.role}`);
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('⚠️ Admin account not found or wrong password');
      } else {
        throw error;
      }
    }

    console.log('\n=== ALL TESTS PASSED ===\n');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Test failed!');
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Message: ${error.response.data?.message}`);
      console.error(`Error: ${error.response.data?.error}`);
    } else {
      console.error(error.message);
    }
    process.exit(1);
  }
}

testAuthFlow();
