'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { ChevronLeft, ArrowRight } from 'lucide-react'
import { tools, Tool } from '@/lib/tools'

interface ToolLayoutProps {
  tool: Tool
  children: ReactNode
}

interface ToolContent {
  h1: string
  intro: string
  howTo: { step: number; text: string }[]
  angle: string
  privacy: string
  faqs: { question: string; answer: string }[]
}

const toolContent: Record<string, ToolContent> = {
  'image-compressor': {
    h1: 'Compress Image Online - Reduce File Size Without Losing Quality',
    intro: 'Looking to compress image online without sacrificing visual quality? Our free browser-based image compressor reduces file sizes for JPEG, PNG, and WebP formats in seconds. Whether you need to compress image to 100kb for email attachments, optimize images for faster website loading, or meet social media upload size limits, this tool delivers instant results. The compression happens entirely in your browser using advanced algorithms that analyze and reduce redundant image data while preserving the details that matter most.',
    howTo: [
      { step: 1, text: 'Upload your image by dragging and dropping or clicking to browse your files.' },
      { step: 2, text: 'Adjust the quality slider to balance file size reduction with image clarity.' },
      { step: 3, text: 'Click "Compress Image" and download your optimized file instantly.' }
    ],
    angle: 'Our tool supports both lossy and lossless compression approaches. Lossy compression achieves smaller file sizes by selectively removing less visible image data, ideal for web use. Lossless compression preserves every pixel exactly, better for archival or professional photography. For most web and social media applications, a quality setting between 70-85% provides the best balance of size reduction and visual fidelity.',
    privacy: 'All image processing happens directly in your browser—your files are never uploaded to any external server, ensuring complete privacy and security.',
    faqs: [
      { question: 'How do I compress image to 100kb or less?', answer: 'Upload your image and gradually lower the quality slider until the compressed file size reaches your target. For images that need to meet strict size limits like 100kb, you may need to accept slightly lower quality. Starting with a higher resolution original gives you more flexibility in the final result.' },
      { question: 'Can I compress JPEG without losing quality?', answer: 'While all JPEG compression is technically lossy, our tool uses smart compression algorithms that prioritize visual quality. At quality settings of 85% or higher, most users cannot detect any difference from the original. For truly lossless compression, use PNG format instead.' },
      { question: 'What file formats can I reduce image file size online for?', answer: 'Our compressor supports JPEG, PNG, and WebP formats. Each format handles compression differently—JPEG excels at photographs, PNG is best for graphics with transparency, and WebP offers superior compression for both types of images.' },
      { question: 'Why should I compress PNG for website use?', answer: 'Uncompressed PNG files can be very large, slowing down page load times and hurting your SEO rankings. Compressing PNGs reduces bandwidth costs and improves visitor experience, especially on mobile devices with slower connections.' }
    ]
  },
  'image-resizer': {
    h1: 'Resize Image Online - Change Dimensions by Pixels or Percentage',
    intro: 'Need to resize image online quickly and accurately? Our free image resizer lets you change image dimensions using exact pixel values or percentage scaling. Whether you\'re preparing photos for Instagram posts, creating web banners, or adjusting images for print, this tool handles it all. Resize photos to specific pixel dimensions, scale by percentage, or fit images to preset sizes—all without the need for expensive software like Photoshop.',
    howTo: [
      { step: 1, text: 'Upload your image by dragging it onto the dropzone or clicking to select.' },
      { step: 2, text: 'Enter your target dimensions in pixels or choose a percentage scale.' },
      { step: 3, text: 'Preview the result and download your resized image instantly.' }
    ],
    angle: 'Common target sizes for digital use include 1080x1080px for Instagram posts, 1200x628px for Facebook shares, 1920x1080px for YouTube thumbnails, and 800x600px for standard web content. For print, consider that 300 DPI is standard for high-quality prints—a 4x6 inch photo needs 1200x1800 pixels. Always resize to larger dimensions rather than upscaling small images for best quality.',
    privacy: 'Image resizing happens entirely in your browser—no files are uploaded to any server, keeping your photos private and secure.',
    faqs: [
      { question: 'How do I resize image to pixels for exact dimensions?', answer: 'Enter your desired width and height in pixels directly into the dimension fields. The tool shows a real-time preview so you can verify the result before downloading. You can also lock the aspect ratio to prevent distortion.' },
      { question: 'What size should I resize photo for Instagram?', answer: 'Instagram supports square (1080x1080px), portrait (1080x1350px), and landscape (1080x608px) formats. For best quality, use these exact dimensions. Our tool lets you quickly resize to any of these Instagram-optimized sizes.' },
      { question: 'Can I change image dimensions online without losing quality?', answer: 'Downsizing (reducing dimensions) generally preserves or improves perceived quality. Upscaling (increasing dimensions) may reveal pixelation since you cannot add detail that was not in the original. For best results, start with high-resolution source images.' },
      { question: 'How do I resize image without cropping?', answer: 'Our resizer scales the entire image proportionally, preserving all content. To avoid distortion, use the aspect ratio lock or choose "fit within dimensions" to ensure your image scales properly within your target size.' }
    ]
  },
  'image-cropper': {
    h1: 'Crop Image Online Free - Fast and Precise Photo Cropping',
    intro: 'Crop image online with our fast, free, and intuitive cropping tool. No signup required, no software to install—just upload your image and drag to select the area you want to keep. Whether you need to crop photo online free of charge, crop image to square for social media, or remove unwanted edges from any picture, this tool delivers instant results with pixel-perfect precision.',
    howTo: [
      { step: 1, text: 'Upload your image by dragging it onto the canvas or clicking to browse.' },
      { step: 2, text: 'Drag the crop handles to select the portion you want to keep.' },
      { step: 3, text: 'Click "Crop" and download your cropped image in seconds.' }
    ],
    angle: 'Speed is the priority here—no account creation, no email verification, no waiting. Upload, crop, download. The entire process takes seconds because all processing happens locally in your browser. For cropping to specific aspect ratios like 1:1, 16:9, or 4:5, try our dedicated Aspect Ratio Cropper tool.',
    privacy: 'Cropping happens directly in your browser—your images are never uploaded to any external server.',
    faqs: [
      { question: 'How do I crop photo online free without signing up?', answer: 'Simply visit this page, upload your image, and start cropping. No registration, email, or payment is ever required. The tool works immediately with zero barriers.' },
      { question: 'Can I crop image to square format?', answer: 'Yes! The crop tool lets you freely adjust the selection area. For a perfect square, drag the corner handles to create equal width and height. The dimensions display in real-time so you can achieve exact proportions.' },
      { question: 'Is this an online image cropper no download required?', answer: 'Absolutely—everything happens in your browser with no software installation. Works on any device with a modern web browser: desktop, laptop, tablet, or phone. Just open the page and start cropping.' },
      { question: 'What image formats work with the crop tool?', answer: 'All common formats are supported: JPEG, PNG, WebP, GIF, and BMP. You can export your cropped result in JPEG, PNG, or WebP format.' }
    ]
  },
  'image-format-converter': {
    h1: 'Image Converter Online - Convert HEIC to JPG, WebP, PNG & More',
    intro: 'Convert image format free with our powerful online image converter supporting JPEG, PNG, WebP, and GIF formats. Whether you need to convert HEIC to JPG from your iPhone, convert WebP to PNG for broader compatibility, or transform any image between popular formats, this tool handles it instantly. Format conversion happens in your browser with no quality loss and no waiting for uploads.',
    howTo: [
      { step: 1, text: 'Upload your image in any supported format (HEIC, JPG, PNG, WebP, GIF).' },
      { step: 2, text: 'Select your target format from the conversion options.' },
      { step: 3, text: 'Click "Convert" and download your new file immediately.' }
    ],
    angle: 'HEIC to JPG conversion is one of the most requested features since iPhones capture photos in HEIC format by default. HEIC files offer excellent compression but may not open on older devices or some Windows computers. Converting to JPG ensures universal compatibility. Additionally, WebP offers superior compression for web use—up to 34% smaller than equivalent JPEGs—making it ideal for websites prioritizing fast load times.',
    privacy: 'Format conversion happens entirely in your browser—your images never leave your device.',
    faqs: [
      { question: 'How do I convert HEIC to JPG online?', answer: 'HEIC (High Efficiency Image Container) is the default format for iPhone photos. Upload your HEIC file, select JPG as the target format, and convert instantly. The resulting JPG will work on any device or platform without special software.' },
      { question: 'Why should I convert WebP to PNG?', answer: 'WebP offers excellent compression, but PNG remains the best choice for images requiring transparency or when you need maximum compatibility. PNG is universally supported across all applications, while some older software may not display WebP correctly.' },
      { question: 'How does a PNG to JPG converter work?', answer: 'When converting PNG to JPG, any transparent areas become filled with a solid background color (typically white). Our tool detects transparency and automatically adds a white background. Choose JPG when you do not need transparency and want smaller file sizes.' },
      { question: 'Is this really a convert image format free tool?', answer: 'Yes, completely free with no hidden costs, watermarks, or usage limits. All conversion happens in your browser using the HTML5 Canvas API, so there are no server processing fees to pass on to you.' }
    ]
  },
  'image-to-pdf': {
    h1: 'Image to PDF Converter - Combine Multiple Images into One PDF',
    intro: 'Convert image to PDF online free with our easy-to-use converter. Upload a single image or combine multiple images into one PDF document seamlessly. Whether you need to convert JPG to PDF online for document sharing, create a PDF from photos, or merge PNG files into a single PDF, this tool handles it all without requiring software installation or account registration.',
    howTo: [
      { step: 1, text: 'Upload one or more images in any common format (JPG, PNG, WebP, GIF).' },
      { step: 2, text: 'Drag to reorder images if uploading multiple files for one PDF.' },
      { step: 3, text: 'Click "Create PDF" and download your combined document.' }
    ],
    angle: 'Combining multiple images into a single PDF is perfect for creating photo collections, document packages, or presentation materials. Each image becomes a separate page in the PDF, maintaining the original quality and orientation. Portrait photos appear as portrait pages, landscape as landscape—no awkward stretching or cropping.',
    privacy: 'PDF generation happens entirely in your browser—your images are never transmitted to any external server.',
    faqs: [
      { question: 'How do I convert JPG to PDF online?', answer: 'Upload your JPG image, click "Create PDF," and download the result. The process takes seconds. For multiple JPGs, upload them all and they will each become a separate page in your PDF.' },
      { question: 'Can I combine multiple images to one PDF?', answer: 'Yes! Upload as many images as you need—each image becomes a separate page in the PDF. Drag and drop to reorder pages before generating the final document.' },
      { question: 'How do I convert PNG to PDF free?', answer: 'Upload your PNG file and click "Create PDF." Transparency is preserved in the PDF output. If combining PNG with other formats, each image maintains its original quality.' },
      { question: 'What image formats can I use?', answer: 'All common formats are supported: JPG, PNG, WebP, GIF, and BMP. Each format converts accurately to PDF with no quality loss during the conversion process.' }
    ]
  },
  'dpi-checker': {
    h1: 'Check Image DPI Online - Resolution & Dimensions Inspector',
    intro: 'Check image DPI online instantly with our free DPI checker tool. Whether you are preparing images for professional printing or verifying resolution requirements, this tool displays DPI, pixel dimensions, and file size at a glance. Understanding how to check DPI of an image is essential for anyone submitting photos for print publications, passport photos, or high-quality prints that require 300 DPI minimum.',
    howTo: [
      { step: 1, text: 'Upload your image file to view its embedded resolution metadata.' },
      { step: 2, text: 'Review the displayed DPI, pixel dimensions, and print size at 300 DPI.' },
      { step: 3, text: 'Use the information to determine if your image meets print requirements.' }
    ],
    angle: 'DPI (dots per inch) measures print resolution—how many ink dots appear in each inch of printed output. Print services typically require 300 DPI for photographs and marketing materials, while newspapers may accept 150-200 DPI. Web images use PPI (pixels per inch) and are typically 72-96 PPI, but screen resolution is measured differently than print. An image DPI checker helps verify your files meet specifications before sending to print.',
    privacy: 'Image analysis happens entirely in your browser—your files are never uploaded to any server.',
    faqs: [
      { question: 'How to check DPI of an image for printing?', answer: 'Upload your image and the tool displays the embedded DPI metadata alongside pixel dimensions. Most professional print services require 300 DPI minimum. If your image shows 72 DPI (common for web images), you may need to resize or use a higher resolution source for print quality.' },
      { question: 'What does this image resolution checker show?', answer: 'The tool reveals embedded DPI metadata, exact pixel width and height, file size in KB/MB, and the maximum print size achievable at 300 DPI standard print quality.' },
      { question: 'Why would I need a DPI checker for printing?', answer: 'Print services reject low-resolution images that appear pixelated in the final printed piece. Checking DPI before submitting files saves time and money by catching potential quality issues early. Professional photographers, designers, and marketers all benefit from verifying resolution before print runs.' },
      { question: 'What is the difference between DPI and resolution?', answer: 'DPI measures print density (dots per inch), while resolution refers to total pixel count (width x height). An image can have high pixel resolution but low DPI if not properly configured for print. Both metrics together determine print quality.' }
    ]
  },
  'exif-viewer': {
    h1: 'Remove Metadata from Image - EXIF Viewer & Photo Data Stripper',
    intro: 'Remove metadata from image files before sharing online to protect your privacy. Every photo taken with a smartphone or digital camera contains EXIF data—hidden information including GPS coordinates, camera model, date and time, and even device settings. Our EXIF viewer lets you view exif data online, then download a cleaned version that strips all sensitive information, including GPS location data that could reveal where you live or work.',
    howTo: [
      { step: 1, text: 'Upload your image to see all embedded EXIF and metadata.' },
      { step: 2, text: 'Review the displayed information: camera, GPS, date, settings, and more.' },
      { step: 3, text: 'Click "Download Cleaned Image" to get a version with all metadata removed.' }
    ],
    angle: 'Privacy risk is real: when you share photos online without stripping EXIF data, anyone can extract the GPS coordinates where the photo was taken, revealing your home, workplace, or where your children attend school. Social media platforms often remove some metadata, but not always, and platforms that do strip data may retain it internally. Taking control by stripping EXIF data before uploading ensures your location and device information never leave your device.',
    privacy: 'All metadata viewing and stripping happens in your browser—your original images never leave your device.',
    faqs: [
      { question: 'How do I view EXIF data online?', answer: 'Simply upload any photo and our tool extracts and displays all embedded metadata: camera make and model, lens information, exposure settings, date and time taken, and GPS coordinates when available.' },
      { question: 'How do I remove GPS location from photo?', answer: 'After uploading your image, click "Download Cleaned Image." The downloaded file has all EXIF metadata, including GPS coordinates, completely removed while preserving image quality.' },
      { question: 'Why should I strip EXIF data free before sharing images?', answer: 'EXIF data can reveal your exact location, the device you own, and when photos were taken. Stripping this information protects your privacy on social media, dating apps, and public forums where others might download and analyze your shared images.' },
      { question: 'How do I check photo metadata on any image?', answer: 'Upload any image file and our tool immediately displays all available metadata. This works for photos from any camera, smartphone screenshots, and images downloaded from the web.' }
    ]
  },
  'color-palette-extractor': {
    h1: 'Extract Colors from Image - Get Hex Codes from Any Photo',
    intro: 'Extract colors from image files and discover the dominant color palette hidden within any photo. Our color palette generator analyzes your image to identify the most prominent colors, displaying them as swatches with copyable hex codes. Perfect for designers seeking inspiration from reference photos, developers matching website colors to photography, or anyone wanting to get hex code from image files for brand consistency.',
    howTo: [
      { step: 1, text: 'Upload your image to analyze its color composition.' },
      { step: 2, text: 'View the extracted dominant colors as clickable swatches.' },
      { step: 3, text: 'Click any color swatch to copy its hex code to your clipboard.' }
    ],
    angle: 'Designers use extracted color palettes to create cohesive brand identities, match UI colors to photography, and ensure visual consistency across projects. The dominant color picker identifies the most visually significant colors—the ones the eye notices most—not just random pixels. Export options include hex codes for CSS/web, RGB values for design software, and visual swatches for presentations.',
    privacy: 'Color analysis happens entirely in your browser—your images are never uploaded to any external server.',
    faqs: [
      { question: 'How do I get hex code from image?', answer: 'Upload your image and the tool extracts the dominant colors. Click any swatch to instantly copy its hex code to your clipboard. Paste directly into your CSS, design software, or anywhere you need the color value.' },
      { question: 'What does this color palette generator from photo show?', answer: 'The tool identifies 5-6 dominant colors that best represent your image. These are not random samples but mathematically calculated to represent the most visually prominent colors the human eye perceives in the photo.' },
      { question: 'Can I use this as a dominant color picker for design projects?', answer: 'Absolutely. Upload reference photos to extract brand colors, match website UI to photography, derive color schemes from nature or architecture, or analyze competitor visuals for competitive positioning.' },
      { question: 'What color formats are available?', answer: 'Each extracted color displays its hex code (like #4A90D9) ready for CSS and web use. Click to copy the hex value instantly. RGB values are also shown for design software compatibility.' }
    ]
  },
  'corrupt-image-detector': {
    h1: 'Check if Image is Corrupted - Validate Image Files Online',
    intro: 'Check if image is corrupted before using it in important projects. Our corrupt image detector attempts to load and decode your file, identifying problems that prevent proper display. Whether your image won\'t open, you need to validate image file online before uploading, or you want to detect broken image file issues before sharing, this tool provides instant diagnostic feedback.',
    howTo: [
      { step: 1, text: 'Upload the image file you want to validate.' },
      { step: 2, text: 'The tool attempts to load and decode the image completely.' },
      { step: 3, text: 'View the result: either "Valid Image" or details about the corruption detected.' }
    ],
    angle: 'Common causes of image corruption include incomplete downloads, interrupted file transfers, storage device errors, and software crashes during save operations. A corrupt image might display partially, show artifacts, or fail to open entirely. This tool catches issues before you send files to print, share with clients, or upload to critical platforms.',
    privacy: 'Image validation happens entirely in your browser—files never leave your device.',
    faqs: [
      { question: 'My image won\'t open—how do I fix it?', answer: 'Upload the file to see if our tool can detect the type of corruption. Some partially corrupted images may still be viewable. If the file is severely damaged, restoration options may be limited—try re-downloading from the original source or checking your backup.' },
      { question: 'How does this detect broken image file problems?', answer: 'The tool attempts to fully decode the image data using the browser\'s native image rendering. If the browser cannot parse the file structure or decode the pixel data, the image is flagged as corrupted with details about where the problem was detected.' },
      { question: 'Can I validate image file online before important uploads?', answer: 'Yes—upload questionable files to verify they are valid before sending to print services, clients, or critical platforms. Early detection prevents embarrassing situations with damaged files.' },
      { question: 'What information does the checker show about corrupt files?', answer: 'For valid images, you see dimensions and file size. For corrupt files, the tool indicates whether the header is readable, if pixel data is damaged, and whether the corruption is recoverable or fatal.' }
    ]
  },
  'image-rotator': {
    h1: 'Rotate Image Online - Flip and Rotate Photos Instantly',
    intro: 'Rotate image online in seconds with our free browser-based tool. Rotate photos 90, 180, or 270 degrees, or flip image horizontally online to create mirror effects. Whether you need to rotate photo 90 degrees to fix orientation, mirror image online free for creative projects, or batch-prepare images for social media, this rotation tool handles all transformations without quality loss.',
    howTo: [
      { step: 1, text: 'Upload your image to the rotation canvas.' },
      { step: 2, text: 'Click rotate buttons (90°, 180°, 270°) or flip horizontal/vertical buttons.' },
      { step: 3, text: 'Preview and download your rotated or flipped image.' }
    ],
    angle: 'Sometimes photos import sideways from cameras or phones, or a portrait orientation was intended to be landscape. Quick rotation fixes these issues instantly. Mirror flips are useful for creating symmetrical designs, reversing text for iron-on transfers, or correcting selfies that appear reversed from front-facing cameras.',
    privacy: 'Image rotation happens entirely in your browser—files never leave your device.',
    faqs: [
      { question: 'How do I flip image horizontally online?', answer: 'Upload your image and click the "Flip Horizontal" button. The image is mirrored left-to-right instantly. This creates a mirror image perfect for symmetrical designs or reversing text.' },
      { question: 'Can I rotate photo 90 degrees quickly?', answer: 'Yes, click the 90° rotation button to rotate clockwise by 90 degrees. Click multiple times for 180° or 270° rotations. The preview updates instantly so you can verify the result before downloading.' },
      { question: 'How do I mirror image online free without losing quality?', answer: 'Our rotation and flip tools use lossless Canvas operations. The image is transformed pixel-by-pixel without re-compressing, so there is no quality loss regardless of how many times you rotate or flip.' },
      { question: 'What file types can I rotate?', answer: 'All common image formats work: JPEG, PNG, WebP, GIF, and BMP. Download your rotated image in JPEG, PNG, or WebP format.' }
    ]
  },
  'base64-converter': {
    h1: 'Image to Base64 Converter - Encode & Decode Images Online',
    intro: 'Use our image to base64 converter to transform images into encoded strings for web embedding, or convert base64 to image files for download. Base64 encoding converts binary image data into text that can be embedded directly in HTML, CSS, JSON, and email templates—eliminating the need for separate image file hosting in many applications. Developer-focused and fast, this tool handles encoding and decoding in both directions.',
    howTo: [
      { step: 1, text: 'Upload an image to encode, or paste a base64 string to decode.' },
      { step: 2, text: 'The tool instantly converts in either direction.' },
      { step: 3, text: 'Copy the base64 string or download the decoded image file.' }
    ],
    angle: 'Developers embed base64 images directly into HTML using data URIs in img src attributes, into CSS for background images, into JSON APIs for image payloads, and into email templates where external images may be blocked. This eliminates HTTP requests for small images and works in environments where file hosting is unavailable. Security note: base64 increases file size by approximately 33%, so consider this trade-off for large images.',
    privacy: 'Base64 encoding and decoding happens entirely in your browser—your images and data strings never leave your device.',
    faqs: [
      { question: 'How do I convert base64 to image file?', answer: 'Paste your base64 string into the decode field. The tool validates the string and renders the image. Click download to save the decoded image as a file. Works with both pure base64 and data URI format.' },
      { question: 'How do I base64 encode image online?', answer: 'Upload any image file and the tool instantly generates its base64 string. Copy with one click. Options include pure base64 output or complete data URI format ready to paste into img src.' },
      { question: 'Why use a base64 image string generator?', answer: 'Embed images directly in HTML/CSS without separate file hosting, reduce HTTP requests for small icons and thumbnails, include images in JSON API responses, create self-contained email signatures, and build single-file HTML prototypes.' },
      { question: 'Does base64 encoding affect image quality?', answer: 'No—base64 is a lossless encoding of the binary data. The decoded image is byte-for-byte identical to the original. The only downside is increased data size (approximately 33% larger), but there is no quality loss.' }
    ]
  },
  'favicon-generator': {
    h1: 'Favicon Generator - Create Favicon.ico & Multi-Size Icons Online',
    intro: 'Generate favicon from image files for your website with our comprehensive favicon generator. Create all the favicon sizes modern browsers and devices require: 16x16 for browser tabs, 32x32 for Windows taskbar, 48x48 for site icons, 180x180 for Apple Touch icons, 192x192 for Android Chrome, and 512x512 for high-resolution displays. Download everything bundled in a convenient ZIP file.',
    howTo: [
      { step: 1, text: 'Upload a square or nearly-square image (ideally 512x512 pixels or larger).' },
      { step: 2, text: 'The tool generates all required favicon sizes automatically.' },
      { step: 3, text: 'Download the ZIP containing favicon.ico and all PNG sizes.' }
    ],
    angle: 'A complete favicon set ensures your site icon displays correctly across all browsers, devices, and operating systems: browser tabs (16x16), bookmarks, Windows pinned sites (32x32), iOS home screen shortcuts (180x180), Android Chrome (192x192, 512x512), and more. The legacy favicon.ico format is still needed for older browsers and Windows. All sizes are included in one download for easy implementation.',
    privacy: 'Favicon generation happens entirely in your browser—your images never leave your device.',
    faqs: [
      { question: 'How do I generate favicon from image?', answer: 'Upload a square logo or icon image. The tool automatically resizes it to all standard favicon dimensions: 16x16, 32x32, 48x48, 180x180, 192x192, and 512x512 pixels. Download everything in a single ZIP file.' },
      { question: 'What is a favicon.ico generator online?', answer: 'Favicon.ico is a legacy Windows icon format that can contain multiple image sizes in one file. Our tool generates this format plus modern PNG sizes for comprehensive cross-browser support. Include the favicon.ico file in your site root for maximum compatibility.' },
      { question: 'How do I create favicon for website that works everywhere?', answer: 'Use the generated files: place favicon.ico in your site root, add link tags for apple-touch-icon.png and android-chrome sizes in your HTML head. The ZIP includes an HTML snippet showing exactly which tags to add.' },
      { question: 'What sizes are included in the favicon set?', answer: 'The complete set includes: 16x16 (browser tabs), 32x32 (Windows), 48x48 (Windows site icons), 180x180 (Apple Touch), 192x192 (Android Chrome), 512x512 (Android high-res), plus the classic favicon.ico containing multiple sizes.' }
    ]
  },
  'image-splitter': {
    h1: 'Split Image into Grid - Instagram Grid Maker & Photo Splitter',
    intro: 'Split image into grid pieces for Instagram carousel posts or creative projects with our free image splitter. Choose from preset grids (2x2, 3x3, 4x4) or set custom rows and columns. The tool precisely divides your image into equal squares that you can download as individual files in a ZIP archive. Perfect as an Instagram grid maker to create seamless multi-image posts that span across your profile.',
    howTo: [
      { step: 1, text: 'Upload the image you want to split into a grid.' },
      { step: 2, text: 'Select grid size (2x2, 3x3, 4x4) or enter custom rows/columns.' },
      { step: 3, text: 'Download the ZIP containing all grid pieces with correct naming.' }
    ],
    angle: 'Instagram grid posts—where a single large image is split across multiple carousel photos—are a creative way to make your profile stand out. Upload your image, choose 3x3 for a nine-image grid, and download the numbered pieces. Upload them in reverse order to Instagram so they display correctly. Also useful for printing large images across multiple pages, creating jigsaw puzzles, or abstract artistic projects.',
    privacy: 'Image splitting happens entirely in your browser—your photos never leave your device.',
    faqs: [
      { question: 'How do I use this as an Instagram grid maker?', answer: 'Upload your image, select 3x3 (for a nine-post grid), and download the ZIP. Instagram displays carousel images in upload order, so upload piece 9 first, then 8, then 7, and so on. The final profile display will show your complete grid image.' },
      { question: 'How do I cut image into pieces online?', answer: 'Choose your grid dimensions, and the tool calculates equal-sized pieces automatically. Each piece is precisely cut so they fit together perfectly when recombined. Download all pieces in a numbered ZIP file.' },
      { question: 'How do I split photo into squares for Instagram?', answer: 'Select the grid size that matches your desired Instagram layout. 3x1 creates a three-image panoramic row, 1x3 creates a vertical triptych for stories, and 3x3 creates the classic grid span across your profile. All pieces are sized for Instagram\'s requirements.' },
      { question: 'What file format are the split pieces?', answer: 'Pieces are generated as PNG files to preserve quality, with no compression between splits. The ZIP archive number them sequentially (1.png, 2.png, etc.) so you know the correct order for reassembly.' }
    ]
  },
  'collage-maker': {
    h1: 'Photo Collage Maker - Combine Photos Online Free',
    intro: 'Create stunning photo collages with our free online collage maker. Upload multiple images, choose from preset layouts, and combine photos into one image without watermarks or registration. Whether you want to make a collage online free for Instagram, create a memory wall of vacation photos, or design professional presentations, this tool offers various layout options with drag-and-drop simplicity.',
    howTo: [
      { step: 1, text: 'Upload 2-9 images for your collage.' },
      { step: 2, text: 'Select a layout preset (grid, side-by-side, or vertical stack).' },
      { step: 3, text: 'Download your finished collage—no watermark, completely free.' }
    ],
    angle: 'Layout variety includes classic grids for clean photo arrays, side-by-side for before/after comparisons or dual portraits, and vertical stacks for stories or timeline presentations. Each layout automatically arranges your images for balanced composition. No app to download, no account required, and no watermarks on your finished collage. Professional results in seconds.',
    privacy: 'Collage creation happens entirely in your browser—your photos are never uploaded to any server.',
    faqs: [
      { question: 'How do I make a collage online free?', answer: 'Upload 2-9 images, choose your preferred layout, and download. No registration required, no watermarks added, and no limit on how many collages you can create. Everything happens instantly in your browser.' },
      { question: 'How do I combine photos into one image?', answer: 'Upload all the photos you want to include, select a layout that matches your vision, and the tool arranges them into a single image. Download the result as one file ready for sharing or printing.' },
      { question: 'Is this a collage maker no app download required?', answer: 'Yes—everything runs in your web browser on any device. No mobile app, no software installation, no plugins. Works on phones, tablets, laptops, and desktops equally well.' },
      { question: 'Can I adjust photos within the collage?', answer: 'Select layout presets arrange images automatically for balanced composition. For custom arrangements, images can be repositioned within their cells. Focus on choosing the right photos and layout—the tool handles the arrangement.' }
    ]
  },
  'aspect-ratio-cropper': {
    h1: 'Crop Image to Aspect Ratio - Social Media Preset Cropper',
    intro: 'Crop image to aspect ratio presets designed specifically for social media platforms. Whether you need to crop photo for Instagram story (9:16), create YouTube thumbnail (16:9), or prepare images for TikTok and Facebook, this tool locks aspect ratios for perfect platform-optimized crops. No manual calculations needed—select the platform and aspect ratio, position your image, and export.',
    howTo: [
      { step: 1, text: 'Upload your image and select an aspect ratio preset.' },
      { step: 2, text: 'Position your image within the crop frame for best composition.' },
      { step: 3, text: 'Download your cropped image at the correct aspect ratio.' }
    ],
    angle: 'Each social platform has specific aspect ratio requirements for optimal display. Instagram feed posts accept 1:1 (square), 4:5 (portrait), or 1.91:1 (landscape). Instagram Stories and Reels require 9:16. YouTube thumbnails are 16:9. TikTok videos are 9:16. Using incorrect aspect ratios results in black bars, cropping, or poor display. This tool ensures your images fit perfectly.',
    privacy: 'Aspect ratio cropping happens entirely in your browser—images never leave your device.',
    faqs: [
      { question: 'How do I crop photo for Instagram story?', answer: 'Select the 9:16 (Stories/Reels) preset. This vertical aspect ratio fills the entire screen in Instagram Stories, IGTV, and Reels. Position your image within the tall crop frame and download.' },
      { question: 'How do I crop image 16:9 for YouTube?', answer: 'Select the 16:9 preset, which matches YouTube video and thumbnail dimensions. This widescreen ratio also works for desktop wallpapers, presentation slides, and most video platforms.' },
      { question: 'How do I crop image for YouTube thumbnail specifically?', answer: 'YouTube recommends 1280x720 pixels at 16:9 aspect ratio. Select the 16:9 preset, position your composition, and download at high resolution. The tool maintains quality while fitting the exact ratio.' },
      { question: 'What is the best aspect ratio for Instagram posts?', answer: 'Square (1:1) works for all feed positions. Portrait (4:5) takes more vertical space in the feed, attracting more attention. Landscape (1.91:1) matches the width of stories and link posts. Choose based on your content and platform focus.' }
    ]
  },
  'image-filters': {
    h1: 'Add Filter to Photo Online - B&W, Sepia, Brightness & More',
    intro: 'Add filter to photo online with our free image filters tool. Apply black and white photo filter for classic monochrome effects, adjust brightness and contrast for perfect exposure, add sepia tones for vintage warmth, or adjust saturation for vivid or muted results. All filters apply in real-time with live preview, so you see exactly how your image will look before downloading.',
    howTo: [
      { step: 1, text: 'Upload your image to see it in the filter preview.' },
      { step: 2, text: 'Adjust filter sliders or click preset buttons (B&W, Sepia, Vivid).' },
      { step: 3, text: 'Download your filtered image with all effects baked in.' }
    ],
    angle: 'Visual adjustments are intuitive with real-time feedback. Drag the brightness slider to lighten underexposed photos or darken overexposed ones. Contrast adds pop to flat images or reduces harsh lighting. Saturation intensifies or mutes colors. Combine multiple adjustments for custom looks. Save presets by noting your favorite values.',
    privacy: 'Filter application happens entirely in your browser—your images are never uploaded to any external server.',
    faqs: [
      { question: 'How do I create a black and white photo filter online?', answer: 'Upload your image and click the "B&W" preset, or drag the Grayscale slider to 100%. The result is a classic black and white image. Fine-tune with brightness and contrast for optimal tonal range.' },
      { question: 'How do I apply a sepia filter online?', answer: 'Click the "Sepia" preset for an instant vintage look, or manually adjust the Sepia slider. Sepia adds warm brown tones reminiscent of antique photographs. Combine with reduced saturation and slightly increased brightness for authentic aged-photo style.' },
      { question: 'How do I adjust photo brightness online?', answer: 'Upload your image and drag the Brightness slider. Values below 100% darken the image, values above 100% lighten it. Use contrast alongside brightness for best results—boosting both together adds punch while maintaining tonal balance.' },
      { question: 'Can I combine multiple filters?', answer: 'Yes—all sliders work together. Apply grayscale, add sepia on top, adjust brightness and contrast together, and set saturation. The live preview shows combined results in real-time. Download when satisfied.' }
    ]
  },
  'text-watermark': {
    h1: 'Add Watermark to Image Online - Free Text Watermark Tool',
    intro: 'Add watermark to image online free to protect your photography and creative work. Place custom text watermarks with adjustable font size, color, opacity, and position across your images. Perfect for photographers protecting portfolio images, freelancers preventing unauthorized use, or content creators establishing brand identity. The copyright watermark generator handles batch processing for consistent branding.',
    howTo: [
      { step: 1, text: 'Upload your image and enter your watermark text.' },
      { step: 2, text: 'Choose position, font size, color, and opacity level.' },
      { step: 3, text: 'Preview and download your watermarked image.' }
    ],
    angle: 'Photographers use visible watermarks on portfolio images shared online to prevent theft while still showcasing their work. Position watermarks strategically—center placement provides strongest protection but may obscure key details. Corner placement with high opacity is more subtle but easier to crop out. Semi-transparent overlays (30-50% opacity) protect without ruining image appreciation.',
    privacy: 'Watermarking happens entirely in your browser—your photos never leave your device.',
    faqs: [
      { question: 'How do I add text watermark to photo?', answer: 'Upload your image, type your watermark text (name, brand, or copyright symbol), and customize the appearance. Adjust font size relative to your image, choose a color that contrasts or blends appropriately, set opacity, and position the text where you want it.' },
      { question: 'Why should I watermark photos free online?', answer: 'Watermarks discourage unauthorized use of your images on social media, stock sites, and competitive platforms. While visible watermarks can be removed with effort, they establish clear ownership and often deter casual theft.' },
      { question: 'How does a copyright watermark generator help photographers?', answer: 'Consistent watermarking across your portfolio creates brand recognition while protecting intellectual property. Include your name or brand, optionally add the copyright symbol (©), and apply the same style across all work for professional presentation.' },
      { question: 'What opacity should I use for watermarks?', answer: 'For strong protection, use 40-60% opacity in a visible position. For subtle branding, use 15-30% opacity in a corner. Balance between visibility for protection and subtle enough not to distract from your image content.' }
    ]
  },
  'qr-code-reader': {
    h1: 'Scan QR Code from Image - Decode QR Codes Without Camera',
    intro: 'Scan QR code from image files without needing a live camera or mobile app. Upload screenshots, saved QR images, or any picture containing a QR code, and our decoder instantly extracts the embedded data. Read QR code from screenshot captures, decode QR code online from downloaded images, or scan QR codes from photos friends have shared with you.',
    howTo: [
      { step: 1, text: 'Upload an image containing a QR code.' },
      { step: 2, text: 'The tool automatically locates and decodes the QR code.' },
      { step: 3, text: 'View the decoded content and click links or copy text.' }
    ],
    angle: 'No app or live camera needed—works from any uploaded image or screenshot. This is useful when QR codes appear on websites, in documents, on TV screens, or in shared photos. Simply capture or save the QR image, upload it here, and decode. The extracted content might be a URL (which appears as a clickable link), text, contact info, or any other QR-encoded data.',
    privacy: 'QR code decoding happens entirely in your browser—your images are never uploaded to any server.',
    faqs: [
      { question: 'How do I decode QR code online?', answer: 'Upload any image containing a QR code. Our decoder scans the image, locates the QR code, and extracts the embedded information. The decoded text or URL appears instantly—click links directly or copy the content.' },
      { question: 'Can I read QR code from screenshot?', answer: 'Yes—take a screenshot of any QR code you see on your screen (phone, computer, TV), upload the screenshot image, and decode. Works with partial screenshots, cropped images, and photos of screens.' },
      { question: 'How does a QR code scanner without app work?', answer: 'Instead of using your camera in real-time, upload a saved image containing a QR code. The tool analyzes the image statically, finding and decoding any visible QR codes. Useful when you cannot or do not want to install scanner apps.' },
      { question: 'What happens after the QR code is decoded?', answer: 'If the QR code contains a URL, it appears as a clickable link you can open directly. Text content appears with a copy button. Contact info, Wi-Fi credentials, and other data types display in readable format with copy options.' }
    ]
  },
  'invoice-generator': {
    h1: 'Free Invoice Generator - Create Professional Invoices Online',
    intro: 'Create professional invoices in seconds with our free invoice generator. No signup required—enter your business details, line items, and client information, then download a polished PDF invoice ready to send. Customize invoice numbers, add your logo, include payment terms, and let the tool calculate subtotals, taxes, and grand totals automatically. Perfect for freelancers, consultants, and small businesses needing professional documents fast.',
    howTo: [
      { step: 1, text: 'Enter your business name, logo, and client details.' },
      { step: 2, text: 'Add line items with descriptions, quantities, and rates.' },
      { step: 3, text: 'Download your professional PDF invoice instantly.' }
    ],
    angle: 'Professional invoices make a strong impression on clients and improve payment speed. Our invoice template generator produces clean, elegant PDFs suitable for any industry. Automatic calculation eliminates math errors. Include your logo for brand consistency. Set payment terms (Net 15, Net 30, etc.) to communicate expectations clearly. No account required, no watermarks, no hidden fees.',
    privacy: 'Invoice generation happens entirely in your browser—your business details and client information never leave your device.',
    faqs: [
      { question: 'Is this really a free invoice generator?', answer: 'Completely free with no restrictions. Create unlimited invoices with no watermarks, no required account, no hidden charges. Your data stays private since everything is generated in your browser without server processing.' },
      { question: 'How do I create invoice online free?', answer: 'Fill in your business information at the top, add client details, enter line items for products or services rendered, set tax rate if applicable, and click to download the finished PDF. No signup step—start immediately.' },
      { question: 'How does invoice template generator PDF export work?', answer: 'After filling the form, click "Generate PDF." Your browser creates a professional PDF instantly with proper formatting, your logo if uploaded, automatic totals, and clean typography suitable for printing or email attachment.' },
      { question: 'Can I make invoice PDF online with my logo?', answer: 'Yes—upload your logo image and it appears at the top of your invoice for professional branding. This works with any image format. Position and size are automatically optimized for PDF output.' }
    ]
  },
  'receipt-generator': {
    h1: 'Free Receipt Generator - Create Receipt PDF for Transactions',
    intro: 'Generate professional receipts for real transactions with our free receipt generator. Whether documenting business expenses, providing customer receipts, or maintaining transaction records, this tool creates clean, professional receipt PDFs in seconds. Enter business and customer details, itemize purchases, and download instantly—no signup, no limits, completely free.',
    howTo: [
      { step: 1, text: 'Enter your business name, address, and transaction details.' },
      { step: 2, text: 'Add purchased items or services with prices.' },
      { step: 3, text: 'Download your professional receipt as a PDF.' }
    ],
    angle: 'Receipts serve important business functions: expense tracking for tax purposes, documentation for reimbursements, proof of purchase for warranty claims, and transaction records for bookkeeping. Use this generator for creating receipts for real, documented transactions in your business operations. Professional formatting makes records clear and audit-ready.',
    privacy: 'Receipt generation happens entirely in your browser—your transaction details never leave your device.',
    faqs: [
      { question: 'How do I make a receipt online?', answer: 'Enter your business information, customer name if applicable, items purchased, and payment method. Click to generate and download your receipt as a PDF. No account needed, works immediately.' },
      { question: 'Is this receipt template generator free?', answer: 'Yes, completely free with no limits on the number of receipts you can generate. No watermarks, no required signup, no hidden costs. Works for businesses of any size.' },
      { question: 'How do I create receipt PDF free for business records?', answer: 'Fill in the transaction details, itemize purchases with prices, specify payment method and date, and download the PDF. Keep records for tax documentation, expense verification, and customer service reference.' },
      { question: 'What payment methods can I include on receipts?', answer: 'Enter any payment method: cash, credit card, debit card, check, bank transfer, PayPal, Venmo, or any other payment type your business accepts. The field accepts custom text for any payment method.' }
    ]
  }
}

export function ToolLayout({ tool, children }: ToolLayoutProps) {
  const content = toolContent[tool.id]
  const relatedTools = tools.filter((t) => t.id !== tool.id && t.category === tool.category).slice(0, 3)

  return (
    <div className="container py-8 md:py-12">
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to all tools
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{content?.h1 || tool.name}</h1>
        <p className="text-lg text-gray-600 max-w-3xl">{content?.intro || tool.description}</p>
      </div>

      {children}

      {content && (
        <>
          <section className="mt-12 max-w-4xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Use</h2>
            <ol className="space-y-4">
              {content.howTo.map((item) => (
                <li key={item.step} className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-semibold">
                    {item.step}
                  </span>
                  <p className="text-gray-700 pt-1">{item.text}</p>
                </li>
              ))}
            </ol>
          </section>

          {content.angle && (
            <section className="mt-12 max-w-4xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Features</h2>
              <p className="text-gray-600 leading-relaxed">{content.angle}</p>
            </section>
          )}

          <section className="mt-8 max-w-4xl">
            <p className="text-gray-500 italic">{content.privacy}</p>
          </section>

          {content.faqs.length > 0 && (
            <section className="mt-16 max-w-4xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {content.faqs.map((faq, i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                      <p className="text-gray-600">{faq.answer}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {relatedTools.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Tools</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {relatedTools.map((relatedTool) => (
              <Link key={relatedTool.id} href={`/tools/${relatedTool.id}`}>
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardContent className="p-6 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{relatedTool.name}</h3>
                      <p className="text-sm text-gray-500">{relatedTool.category}</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
