#!/usr/bin/env node

const http = require('http');

console.log('🧪 Testing Local Activity Finder Setup...\n');

// Test health endpoint
function testHealth() {
  return new Promise((resolve, reject) => {
    const req = http.get('http://localhost:12000/api/health', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (result.status === 'OK') {
            console.log('✅ Server health check: PASSED');
            resolve(true);
          } else {
            console.log('❌ Server health check: FAILED');
            resolve(false);
          }
        } catch (e) {
          console.log('❌ Server health check: FAILED (Invalid response)');
          resolve(false);
        }
      });
    });
    
    req.on('error', () => {
      console.log('❌ Server health check: FAILED (Server not running)');
      resolve(false);
    });
    
    req.setTimeout(5000, () => {
      console.log('❌ Server health check: FAILED (Timeout)');
      resolve(false);
    });
  });
}

// Test API endpoint
function testAPI() {
  return new Promise((resolve) => {
    const postData = JSON.stringify({
      latitude: 40.7128,
      longitude: -74.0060,
      locationName: "Test Location"
    });

    const options = {
      hostname: 'localhost',
      port: 12000,
      path: '/api/suggestions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (result.error && result.message.includes('quota')) {
            console.log('⚠️  API endpoint test: OpenAI API key needed');
            console.log('   (This is expected - set up your API key to get real suggestions)');
            resolve('needs_key');
          } else if (result.success) {
            console.log('✅ API endpoint test: PASSED (API key configured)');
            resolve('success');
          } else {
            console.log('❌ API endpoint test: FAILED');
            console.log('   Error:', result.error || 'Unknown error');
            resolve('failed');
          }
        } catch (e) {
          console.log('❌ API endpoint test: FAILED (Invalid response)');
          resolve('failed');
        }
      });
    });

    req.on('error', () => {
      console.log('❌ API endpoint test: FAILED (Connection error)');
      resolve('failed');
    });

    req.setTimeout(10000, () => {
      console.log('❌ API endpoint test: FAILED (Timeout)');
      resolve('failed');
    });

    req.write(postData);
    req.end();
  });
}

async function runTests() {
  const healthOK = await testHealth();
  
  if (!healthOK) {
    console.log('\n🚨 Server is not running. Please start it with:');
    console.log('   npm start');
    return;
  }

  const apiResult = await testAPI();
  
  console.log('\n📋 Setup Status:');
  console.log('================');
  
  if (apiResult === 'success') {
    console.log('🎉 Everything is working! Your app is ready to use.');
    console.log('🌐 Open: http://localhost:12000');
  } else if (apiResult === 'needs_key') {
    console.log('⚙️  Server is running but needs OpenAI API key configuration.');
    console.log('');
    console.log('Next steps:');
    console.log('1. Run: npm run setup');
    console.log('2. Enter your OpenAI API key');
    console.log('3. Restart the server: npm start');
    console.log('');
    console.log('🎮 Or try the demo version: npm run demo');
  } else {
    console.log('❌ There are issues with the setup. Check the errors above.');
  }
  
  console.log('\n📚 For detailed setup instructions, see: SETUP_GUIDE.md');
}

runTests();