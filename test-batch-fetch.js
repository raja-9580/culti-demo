// Simple test script to verify batch data fetch from API
const API_URL = 'http://localhost:3000/api/test-db';

async function testBatchFetch() {
  console.log('🧪 Testing batch data fetch from API...\n');
  
  try {
    console.log(`📍 Calling: ${API_URL}\n`);
    const response = await fetch(API_URL);
    
    if (!response.ok) {
      console.error(`❌ HTTP Error: ${response.status} ${response.statusText}`);
      return;
    }

    const result = await response.json();
    
    console.log('✅ API Response received:\n');
    console.log(`📊 Success: ${result.success}`);
    console.log(`📝 Message: ${result.message}`);
    console.log(`🔢 Batch count: ${result.count}`);
    
    if (result.count > 0) {
      console.log('\n📦 First batch record:');
      console.log(JSON.stringify(result.data[0], null, 2));
      
      if (result.count > 1) {
        console.log(`\n... and ${result.count - 1} more batch records`);
      }
    } else {
      console.log('\n⚠️  No batch records found in database');
    }

    if (result.error) {
      console.error(`\n❌ Error: ${result.error}`);
      console.error(`📋 Details: ${result.details}`);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n💡 Make sure your dev server is running: npm run dev');
  }
}

testBatchFetch();
