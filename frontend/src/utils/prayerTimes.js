import axios from 'axios';

export const fetchPrayerTimes = async (date, region) => {
  try {
    // Extract city and country from region
    const [city, country] = getLocationFromTimezone(region);
    
    const response = await axios.get(`http://api.aladhan.com/v1/timingsByCity/${date}`, {
      params: {
        city,
        country,
        method: 2, // Islamic Society of North America (ISNA)
      }
    });

    if (response.data && response.data.data && response.data.data.timings) {
      const { timings } = response.data.data;
      return {
        fajr: new Date(`${date}T${timings.Fajr}`),
        dhuhr: new Date(`${date}T${timings.Dhuhr}`),
        asr: new Date(`${date}T${timings.Asr}`),
        maghrib: new Date(`${date}T${timings.Maghrib}`),
        isha: new Date(`${date}T${timings.Isha}`),
      };
    }
    throw new Error('Invalid response format from prayer times API');
  } catch (error) {
    console.error('Error fetching prayer times:', error);
    throw error;
  }
};

// Helper function to extract city and country from timezone
const getLocationFromTimezone = (timezone) => {
  const locationMap = {
    'Asia/Karachi': ['Karachi', 'Pakistan'],
    'Asia/Riyadh': ['Riyadh', 'Saudi Arabia'],
    'Asia/Dubai': ['Dubai', 'UAE'],
    'Asia/Kolkata': ['Mumbai', 'India'],
    'Europe/London': ['London', 'UK'],
    'America/New_York': ['New York', 'US'],
    'Australia/Sydney': ['Sydney', 'Australia'],
  };

  return locationMap[timezone] || ['Karachi', 'Pakistan']; // Default to Karachi if timezone not found
};

// Helper function to format date as YYYY-MM-DD
export const formatDate = (date) => {
  return date.toISOString().split('T')[0];
};
