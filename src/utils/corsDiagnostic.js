// CORS Diagnostic Utility
// This helps identify and fix CORS issues with Firebase Storage

export const diagnoseCORSIssue = async () => {
  console.log("🔍 Starting CORS diagnostic...");
  
  // Check if Firebase is properly configured
  try {
    const { storage } = await import('../config/firebase');
    console.log("✅ Firebase Storage initialized successfully");
    
    // Get storage instance info
    console.log("📍 Storage app name:", storage.app.name);
    console.log("📍 Storage bucket:", storage._bucket);
    
    return {
      firebaseConfigured: true,
      bucketName: storage._bucket,
      appName: storage.app.name
    };
  } catch (error) {
    console.error("❌ Firebase Storage configuration error:", error);
    return {
      firebaseConfigured: false,
      error: error.message
    };
  }
};

export const testCORSPreflight = async (bucketName) => {
  console.log("🧪 Testing CORS preflight request...");
  
  try {
    // Test OPTIONS request to Firebase Storage
    const testUrl = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o`;
    
    const response = await fetch(testUrl, {
      method: 'OPTIONS',
      headers: {
        'Origin': window.location.origin,
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type, Authorization'
      }
    });
    
    console.log("✅ CORS preflight test completed");
    console.log("Response status:", response.status);
    console.log("Response headers:", Object.fromEntries(response.headers.entries()));
    
    return {
      success: true,
      status: response.status,
      headers: Object.fromEntries(response.headers.entries())
    };
  } catch (error) {
    console.error("❌ CORS preflight test failed:", error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const runFullDiagnostic = async () => {
  console.log("🚀 Running full CORS diagnostic...");
  
  const firebaseCheck = await diagnoseCORSIssue();
  
  if (firebaseCheck.firebaseConfigured) {
    const corsCheck = await testCORSPreflight(firebaseCheck.bucketName);
    
    console.log("📊 Diagnostic Summary:");
    console.log("- Firebase configured:", firebaseCheck.firebaseConfigured);
    console.log("- Bucket name:", firebaseCheck.bucketName);
    console.log("- CORS test passed:", corsCheck.success);
    
    if (!corsCheck.success) {
      console.log("💡 Recommended actions:");
      console.log("1. Check if the bucket name is correct");
      console.log("2. Verify CORS configuration is applied to the bucket");
      console.log("3. Try using the fallback upload method");
      console.log("4. Check Firebase Storage rules");
    }
    
    return {
      firebase: firebaseCheck,
      cors: corsCheck
    };
  } else {
    console.log("❌ Cannot proceed with CORS test - Firebase not configured properly");
    return {
      firebase: firebaseCheck,
      cors: null
    };
  }
};

// Add this to window for easy testing in browser console
if (typeof window !== 'undefined') {
  window.corsDiagnostic = {
    diagnose: diagnoseCORSIssue,
    testCORS: testCORSPreflight,
    runFull: runFullDiagnostic
  };
}
