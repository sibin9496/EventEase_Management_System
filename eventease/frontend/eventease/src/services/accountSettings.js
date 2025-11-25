// Account Settings API Service

const BASE_URL = '/api/users';
const TOKEN = localStorage.getItem('token');

export const accountSettingsService = {
  // Fetch user settings
  getSettings: async () => {
    try {
      const response = await fetch(`${BASE_URL}/settings`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${TOKEN}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch settings');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching settings:', error);
      throw error;
    }
  },

  // Update email notification settings
  updateNotificationSettings: async (notificationSettings) => {
    try {
      const response = await fetch(`${BASE_URL}/settings/notifications`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(notificationSettings)
      });

      if (!response.ok) {
        throw new Error('Failed to update notification settings');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating notification settings:', error);
      throw error;
    }
  },

  // Update privacy settings
  updatePrivacySettings: async (privacySettings) => {
    try {
      const response = await fetch(`${BASE_URL}/settings/privacy`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(privacySettings)
      });

      if (!response.ok) {
        throw new Error('Failed to update privacy settings');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating privacy settings:', error);
      throw error;
    }
  }
};

export default accountSettingsService;
