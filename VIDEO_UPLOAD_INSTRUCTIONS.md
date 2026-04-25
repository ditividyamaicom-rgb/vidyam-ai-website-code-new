# How to Upload Videos to the Intern Testimonials Carousel

## Step-by-Step Instructions

### Step 1: Prepare Your Video Files
1. Make sure your videos are in a web-compatible format:
   - **Recommended formats**: `.mp4`, `.webm`, `.ogg`
   - **Best format**: `.mp4` (most widely supported)
   - Keep file sizes reasonable (under 50MB recommended for faster loading)

### Step 2: Copy Videos to the Project
1. Navigate to your project folder:
   ```
   vidyam-ai-website-code-main\vidyam-ai-website-code-main\public\videos\
   ```

2. Copy your video files from your desktop/local system to this `videos` folder.

3. **Rename your videos** to match the format in the code:
   - `video1.mp4` (for the first video)
   - `video2.mp4` (for the second video)
   - Or use any names you prefer (see Step 3)

### Step 3: Update the Code
1. Open the file: `src/components/HomeBody/HomeBody.js`

2. Find the `internVideos` array (around line 8-22)

3. Update the `videoUrl` paths to match your video file names:
   ```javascript
   const internVideos = [
     {
       id: 1,
       thumbnail: "/images/demo-1.jpeg", // Optional: preview image
       videoUrl: "/videos/video1.mp4",   // Update this to your video filename
       title: "Meet Drayson",
       subtitle: "Intern Experience",
       team: "Video Team"
     },
     {
       id: 2,
       thumbnail: "/images/demo-2.jpeg", // Optional: preview image
       videoUrl: "/videos/video2.mp4",   // Update this to your video filename
       title: "Darshan P.",
       subtitle: "Summer Sojourn 2017"
     }
   ];
   ```

4. **Important**: The path starts with `/videos/` because files in the `public` folder are served from the root.

### Step 4: Optional - Add Thumbnail Images
- If you want a preview image before the video loads, add thumbnail images to:
  ```
  public\images\
  ```
- Update the `thumbnail` property in the code to point to your thumbnail image

### Step 5: Test Your Videos
1. Start your development server:
   ```bash
   npm start
   ```

2. Navigate to the Intern Testimonials section on your website

3. The videos should now appear in the carousel with video controls

## File Structure Example
```
vidyam-ai-website-code-main/
└── vidyam-ai-website-code-main/
    └── public/
        ├── images/
        │   ├── demo-1.jpeg (thumbnail)
        │   └── demo-2.jpeg (thumbnail)
        └── videos/
            ├── video1.mp4 (your first video)
            └── video2.mp4 (your second video)
```

## Tips
- **Video Optimization**: Compress large videos using tools like HandBrake or online compressors
- **Naming**: Use lowercase, no spaces (use hyphens or underscores instead)
- **Testing**: Always test videos in different browsers to ensure compatibility
- **Fallback**: If a video doesn't load, the thumbnail image will be shown as a fallback

## Troubleshooting
- **Video not showing?** Check that the file path in `videoUrl` matches your actual filename
- **Video too large?** Compress the video or use a video hosting service (YouTube, Vimeo) and embed it instead
- **Format not supported?** Convert to MP4 format using a video converter

