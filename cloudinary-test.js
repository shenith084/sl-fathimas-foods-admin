const cloudinary = require('cloudinary').v2;

// 1. Configure Cloudinary — Inline Configuration block
cloudinary.config({
  cloud_name: 'dju4ob4dr',
  api_key: '645472744188924',
  api_secret: 'nMTAuP5ea3QLwrHLYZh5F2XBAAE',
  secure: true
});

async function runOnboarding() {
  console.log("Step 1: Configuration loaded.");
  
  // 2. Upload an image from Cloudinary's demo domain
  const sampleUrl = 'https://res.cloudinary.com/demo/image/upload/dog.jpg';
  console.log(`\nStep 2: Uploading image from URL: ${sampleUrl}...`);
  
  try {
    const uploadResult = await cloudinary.uploader.upload(sampleUrl, {
      folder: 'slfathimas_onboarding'
    });
    
    console.log("Upload successful!");
    console.log(`Secure URL: ${uploadResult.secure_url}`);
    console.log(`Public ID: ${uploadResult.public_id}`);
    
    // 3. Get image details (metadata: width, height, format, file size in bytes)
    console.log("\nStep 3: Fetching image metadata...");
    const details = await cloudinary.api.resource(uploadResult.public_id);
    console.log(`Width: ${details.width}px`);
    console.log(`Height: ${details.height}px`);
    console.log(`Format: ${details.format}`);
    console.log(`File size: ${details.bytes} bytes`);
    
    // 4. Transform the image using f_auto and q_auto
    console.log("\nStep 4: Generating transformed image URL...");
    
    // Transformation explanation:
    // fetch_format: 'auto' (f_auto) dynamically selects the best format for the user's browser (e.g. WebP, AVIF)
    // quality: 'auto' (q_auto) automatically compresses the image to minimize byte size while retaining quality
    const transformedUrl = cloudinary.url(uploadResult.public_id, {
      fetch_format: 'auto',
      quality: 'auto',
      secure: true
    });
    
    console.log("\nDone! Click link below to see optimized version of the image. Check the size and the format.");
    console.log(transformedUrl);
    
  } catch (error) {
    console.error("Error during Cloudinary onboarding flow:", error);
  }
}

runOnboarding();
