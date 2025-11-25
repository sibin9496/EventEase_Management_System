const API_URL = 'http://localhost:5000/api';

// Test credentials - these are common test users
const testUser = {
  email: 'user@eventease.com',
  password: 'password123'
};

let authToken = '';
let userId = '';

async function login() {
  try {
    console.log('\n🔐 Attempting login...');
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    });
    const data = await response.json();
    authToken = data.token;
    userId = data.user.id || data.user._id;
    console.log('✅ Login successful');
    console.log(`   Token: ${authToken.substring(0, 20)}...`);
    console.log(`   User ID: ${userId}`);
    return true;
  } catch (error) {
    console.log('❌ Login failed:', error.message);
    return false;
  }
}

async function getSettings() {
  try {
    console.log('\n📖 Fetching current settings...');
    const response = await fetch(`${API_URL}/users/settings`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    const data = await response.json();
    console.log('✅ Settings retrieved successfully');
    console.log('Current settings:', JSON.stringify(data.settings, null, 2));
    return data.settings;
  } catch (error) {
    console.log('❌ Failed to fetch settings:', error.message);
    return null;
  }
}

async function updateNotificationSettings() {
  try {
    console.log('\n✉️  Updating notification settings...');
    const newSettings = {
      eventUpdates: false,
      newEvents: true,
      registrationReminders: true,
      weeklyDigest: false,
      promotionalOffers: true
    };
    
    const response = await fetch(`${API_URL}/users/settings/notifications`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newSettings)
    });
    const data = await response.json();
    console.log('✅ Notification settings updated successfully');
    console.log('Updated settings:', JSON.stringify(data.settings.emailNotifications, null, 2));
    return true;
  } catch (error) {
    console.log('❌ Failed to update notification settings:', error.message);
    return false;
  }
}

async function updatePrivacySettings() {
  try {
    console.log('\n🔒 Updating privacy settings...');
    const newSettings = {
      profileVisibility: 'friends',
      showEmail: true,
      showPhone: false,
      allowMessages: true,
      showAttendedEvents: false
    };
    
    const response = await fetch(`${API_URL}/users/settings/privacy`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newSettings)
    });
    const data = await response.json();
    console.log('✅ Privacy settings updated successfully');
    console.log('Updated settings:', JSON.stringify(data.settings.privacy, null, 2));
    return true;
  } catch (error) {
    console.log('❌ Failed to update privacy settings:', error.message);
    return false;
  }
}

async function getProfile() {
  try {
    console.log('\n👤 Fetching user profile...');
    const response = await fetch(`${API_URL}/users/profile`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    const data = await response.json();
    console.log('✅ Profile retrieved successfully');
    console.log('User info:', {
      name: data.user.name,
      email: data.user.email,
      role: data.user.role,
      phone: data.user.phone
    });
    return true;
  } catch (error) {
    console.log('❌ Failed to fetch profile:', error.message);
    return false;
  }
}

async function updateProfile() {
  try {
    console.log('\n✏️  Updating user profile...');
    const updates = {
      name: 'Test User Updated',
      phone: '+1234567890',
      location: 'New York, USA',
      interests: ['technology', 'events', 'networking']
    };
    
    const response = await fetch(`${API_URL}/users/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updates)
    });
    const data = await response.json();
    console.log('✅ Profile updated successfully');
    console.log('Updated user:', {
      name: data.user.name,
      phone: data.user.phone,
      location: data.user.location,
      interests: data.user.interests
    });
    return true;
  } catch (error) {
    console.log('❌ Failed to update profile:', error.message);
    return false;
  }
}

async function verifySettingsPersistedToDatabase() {
  try {
    console.log('\n🔍 Verifying settings persisted in database...');
    const response = await axios.get(`${API_URL}/users/settings`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    
    const settings = response.data.settings;
    
    let allCorrect = true;
    console.log('\n📊 Verification Results:');
    
    if (settings.emailNotifications.eventUpdates === false) {
      console.log('   ✅ eventUpdates: false (correct)');
    } else {
      console.log('   ❌ eventUpdates: not persisted correctly');
      allCorrect = false;
    }
    
    if (settings.emailNotifications.promotionalOffers === true) {
      console.log('   ✅ promotionalOffers: true (correct)');
    } else {
      console.log('   ❌ promotionalOffers: not persisted correctly');
      allCorrect = false;
    }
    
    if (settings.privacy.profileVisibility === 'friends') {
      console.log('   ✅ profileVisibility: friends (correct)');
    } else {
      console.log('   ❌ profileVisibility: not persisted correctly');
      allCorrect = false;
    }
    
    if (settings.privacy.showEmail === true) {
      console.log('   ✅ showEmail: true (correct)');
    } else {
      console.log('   ❌ showEmail: not persisted correctly');
      allCorrect = false;
    }
    
    if (allCorrect) {
      console.log('\n🎉 All settings correctly persisted to database!');
    } else {
      console.log('\n⚠️  Some settings were not persisted correctly');
    }
    
    return allCorrect;
  } catch (error) {
    console.log('❌ Verification failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function runTests() {
  console.log('════════════════════════════════════════════════════');
  console.log('   Settings Endpoints Test Suite');
  console.log('════════════════════════════════════════════════════');
  
  // Login
  const loggedIn = await login();
  if (!loggedIn) {
    console.log('\n❌ Cannot proceed without login');
    process.exit(1);
  }
  
  // Get initial settings
  await getSettings();
  
  // Get profile
  await getProfile();
  
  // Update profile
  await updateProfile();
  
  // Update notification settings
  await updateNotificationSettings();
  
  // Update privacy settings
  await updatePrivacySettings();
  
  // Get updated settings
  await getSettings();
  
  // Verify persistence
  await verifySettingsPersistedToDatabase();
  
  console.log('\n════════════════════════════════════════════════════');
  console.log('   Test Suite Complete');
  console.log('════════════════════════════════════════════════════\n');
  
  process.exit(0);
}

runTests().catch(error => {
  console.error('Test error:', error.message);
  process.exit(1);
});
