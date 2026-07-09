// load-test.mjs
// Run this file using: node load-test.mjs

const IMAGE_URL = "https://ik.imagekit.io/shantanushinde99/images/images/hero_exterior/frame_000000.webp";

// We will ramp up concurrency in waves to find the exact breaking point
const CONCURRENCY_LEVELS = [100, 500, 1000, 2000, 5000];

async function fetchAsset(id) {
  try {
    const start = performance.now();
    
    // Fetch directly from ImageKit
    const res = await fetch(IMAGE_URL);
    
    // Consume the body
    await res.arrayBuffer();
    const end = performance.now();
    const time = Math.round(end - start);
    
    if (res.status === 200) {
      console.log(`  ➔ [User ${id}] ✅ 200 OK (${time}ms)`);
    } else if (res.status === 429) {
      console.log(`  ➔ [User ${id}] 🛑 429 RATE LIMITED!`);
    } else {
      console.log(`  ➔ [User ${id}] ⚠️ HTTP ${res.status}`);
    }
    
    return {
      status: res.status,
      timeMs: end - start,
      isRateLimited: res.status === 429
    };
  } catch (error) {
    console.log(`  ➔ [User ${id}] ❌ ERROR: ${error.message}`);
    return {
      status: 'ERROR',
      timeMs: null,
      isRateLimited: false,
      error: error.message
    };
  }
}

async function runTestLevel(concurrency) {
  console.log(`\n==========================================`);
  console.log(`Testing ${concurrency} simultaneous users hitting ImageKit...`);
  console.log(`==========================================`);
  
  const startTime = performance.now();
  const promises = [];
  
  // Fire all requests at the exact same millisecond
  for (let i = 0; i < concurrency; i++) {
    promises.push(fetchAsset(i));
  }
  
  const results = await Promise.all(promises);
  const totalTime = ((performance.now() - startTime) / 1000).toFixed(2);
  
  let successCount = 0;
  let rateLimitCount = 0;
  let errorCount = 0;
  let totalTimeMs = 0;
  
  results.forEach(res => {
    if (res.status === 200) {
      successCount++;
      totalTimeMs += res.timeMs;
    } else if (res.isRateLimited) {
      rateLimitCount++;
    } else {
      errorCount++;
    }
  });
  
  const avgTime = successCount > 0 ? Math.round(totalTimeMs / successCount) : 0;
  
  console.log(`⏱️  Batch Time:   ${totalTime} seconds`);
  console.log(`✅ Success (200): ${successCount} (Avg speed per image: ${avgTime}ms)`);
  
  if (rateLimitCount > 0) {
    console.log(`⚠️  Rate Limited (429): ${rateLimitCount} requests blocked by ImageKit!`);
  }
  if (errorCount > 0) {
    console.log(`❌  Errors/Timeouts: ${errorCount}`);
  }
  
  // If we get blocked or start failing heavily, we've found the limit
  return rateLimitCount === 0 && errorCount < (concurrency * 0.1); 
}

async function startLoadTest() {
  console.log(`🚀 Starting ImageKit Rate Limit & Stress Test`);
  console.log(`🌐 Target: ${IMAGE_URL}\n`);
  
  for (const level of CONCURRENCY_LEVELS) {
    const passed = await runTestLevel(level);
    
    if (!passed) {
      console.log(`\n🛑 LIMIT FOUND: ImageKit began rate-limiting or dropping connections at ~${level} concurrent users!`);
      break;
    }
    
    if (level !== CONCURRENCY_LEVELS[CONCURRENCY_LEVELS.length - 1]) {
      console.log("Cooling down for 3 seconds to avoid permanent IP bans...");
      await new Promise(r => setTimeout(r, 3000));
    }
  }
  console.log(`\n🏁 Stress Test Complete.`);
}

startLoadTest();
