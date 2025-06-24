#!/usr/bin/env node

const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🌍 Location Activity Finder Setup');
console.log('================================\n');

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function setup() {
  try {
    console.log('This setup will help you configure your OpenAI API key.\n');
    
    const hasApiKey = await askQuestion('Do you have an OpenAI API key? (y/n): ');
    
    if (hasApiKey.toLowerCase() === 'y' || hasApiKey.toLowerCase() === 'yes') {
      const apiKey = await askQuestion('Please enter your OpenAI API key: ');
      
      if (apiKey.trim()) {
        const envContent = `OPENAI_API_KEY=${apiKey.trim()}\nPORT=12000`;
        fs.writeFileSync('.env', envContent);
        console.log('\n✅ API key saved successfully!');
        console.log('\nYou can now run the app with:');
        console.log('  npm start');
        console.log('\nThen open: http://localhost:12000');
      } else {
        console.log('\n❌ No API key provided. Setup cancelled.');
      }
    } else {
      console.log('\n📝 To get an OpenAI API key:');
      console.log('1. Visit: https://platform.openai.com/api-keys');
      console.log('2. Sign up or log in to your OpenAI account');
      console.log('3. Create a new API key');
      console.log('4. Run this setup again with your API key');
      console.log('\n🎮 For now, you can try the demo version:');
      console.log('  node demo.js');
      console.log('  Then open: http://localhost:12001');
    }
    
  } catch (error) {
    console.error('Setup error:', error);
  } finally {
    rl.close();
  }
}

setup();