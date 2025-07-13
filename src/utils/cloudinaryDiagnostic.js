// Cloudinary Upload Diagnostic Tool
// Use this to test Cloudinary uploads in development

const CLOUDINARY_URL_IMAGE = 'https://api.cloudinary.com/v1_1/duk8twato/image/upload'; 
const CLOUDINARY_URL_AUTO = 'https://api.cloudinary.com/v1_1/duk8twato/auto/upload';
const UPLOAD_PRESET = 'e7fdrxuf';

export const testCloudinaryConnection = async () => {
  console.log("🔍 Testing Cloudinary connection...");
  
  try {
    // Test if we can reach Cloudinary API
    const response = await fetch(CLOUDINARY_URL_IMAGE, {
      method: 'GET'
    });
    
    console.log("✅ Cloudinary API reachable");
    console.log("Response status:", response.status);
    
    return {
      success: true,
      status: response.status,
      cloudName: 'duk8twato',
      uploadPreset: UPLOAD_PRESET
    };
  } catch (error) {
    console.error("❌ Cannot reach Cloudinary API:", error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const testUploadPreset = async () => {
  console.log("🧪 Testing upload preset...");
  
  try {
    // Create a small test file
    const testBlob = new Blob(['test'], { type: 'text/plain' });
    const testFile = new File([testBlob], 'test.txt', { type: 'text/plain' });
    
    const formData = new FormData();
    formData.append('file', testFile);
    formData.append('upload_preset', UPLOAD_PRESET);
    
    const response = await fetch(CLOUDINARY_URL_AUTO, {
      method: 'POST',
      body: formData
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log("✅ Upload preset working correctly");
      console.log("Test upload URL:", data.secure_url);
      
      // Clean up test file
      setTimeout(async () => {
        try {
          await deleteTestFile(data.public_id);
        } catch {
          console.log("Note: Could not delete test file automatically");
        }
      }, 5000);
      
      return {
        success: true,
        uploadUrl: data.secure_url,
        publicId: data.public_id
      };
    } else {
      const errorData = await response.json();
      console.error("❌ Upload preset test failed:", errorData);
      return {
        success: false,
        error: errorData
      };
    }
  } catch (error) {
    console.error("❌ Upload preset test error:", error);
    return {
      success: false,
      error: error.message
    };
  }
};

const deleteTestFile = async (publicId) => {
  // This would require API key/secret for deletion
  // For now, just log that cleanup would happen
  console.log("ℹ️ Test file cleanup:", publicId);
};

export const runCloudinaryDiagnostic = async () => {
  console.log("🚀 Running Cloudinary diagnostic...");
  
  const connectionTest = await testCloudinaryConnection();
  
  if (connectionTest.success) {
    const presetTest = await testUploadPreset();
    
    console.log("📊 Cloudinary Diagnostic Summary:");
    console.log("- API Connection:", connectionTest.success ? "✅ Working" : "❌ Failed");
    console.log("- Cloud Name:", connectionTest.cloudName);
    console.log("- Upload Preset:", connectionTest.uploadPreset);
    console.log("- Preset Test:", presetTest.success ? "✅ Working" : "❌ Failed");
    
    if (!presetTest.success) {
      console.log("💡 Troubleshooting steps:");
      console.log("1. Check if upload preset 'e7fdrxuf' exists in Cloudinary dashboard");
      console.log("2. Ensure the preset is set to 'Unsigned'");
      console.log("3. Check if your Cloudinary account has sufficient quota");
      console.log("4. Verify the cloud name 'duk8twato' is correct");
    }
    
    return {
      connection: connectionTest,
      preset: presetTest
    };
  } else {
    console.log("❌ Cannot proceed with preset test - API not reachable");
    return {
      connection: connectionTest,
      preset: null
    };
  }
};

// Make available globally in development
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  window.cloudinaryDiagnostic = {
    testConnection: testCloudinaryConnection,
    testPreset: testUploadPreset,
    runFull: runCloudinaryDiagnostic
  };
  
  console.log("🔧 Cloudinary diagnostic available:");
  console.log("- Run 'window.cloudinaryDiagnostic.runFull()' for full test");
  console.log("- Run 'window.cloudinaryDiagnostic.testConnection()' for connection test only");
}
