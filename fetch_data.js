const fs = require('fs');
const https = require('https');

// Fetch Max Verstappen (driver 1) from Abu Dhabi 2023 race (session 9159)
const url = 'https://api.openf1.org/v1/car_data?driver_number=1&session_key=9159';

console.log('Fetching data from OpenF1 API...');

https.get(url, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    try {
      const parsedData = JSON.parse(data);
      console.log('Total records:', parsedData.length);
      
      // Find a window where he is actually driving (speed > 250)
      let startIndex = 0;
      for (let i = 0; i < parsedData.length; i++) {
        if (parsedData[i].speed > 250) {
          // Go back a bit to get a full lap
          startIndex = Math.max(0, i - 100);
          break;
        }
      }
      
      console.log('Found driving data starting at index:', startIndex);
      const slice = parsedData.slice(startIndex, startIndex + 1500); // about 1-2 laps at 10Hz
      
      fs.writeFileSync('public/f1_live_telemetry_feed.json', JSON.stringify(slice, null, 2));
      console.log(`Successfully saved ${slice.length} records to public/f1_live_telemetry_feed.json`);
    } catch (e) {
      console.error('Error parsing JSON', e);
    }
  });
});
