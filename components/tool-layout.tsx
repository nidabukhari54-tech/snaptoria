'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { ChevronLeft, ArrowRight, ShieldCheck, CloudOff } from 'lucide-react'
import { tools, Tool } from '@/lib/tools'
import { ToolCardVisual } from '@/components/tool-card-visual'
import { ToolSchema, FaqSchema, BreadcrumbSchema, HowToSchema } from '@/components/schema'

interface ToolLayoutProps {
  tool: Tool
  children: ReactNode
}

interface ToolContent {
  h1: string
  intro: string
  howTo: { step: number; text: string }[]
  angle: string
  howItWorks: string
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
    howItWorks: 'When you add a photo, the file goes to a compression engine that runs in a web worker, a background thread in your browser, so the page stays responsive while it works. The number on the quality slider becomes the engine\'s target quality for the re-encode. When it finishes, you see the new file size next to the original and the percentage saved, before you download anything. If the result is still too big, lower the slider and compress again. Every run starts from your original file rather than the last compressed copy, so experimenting with different quality levels does not keep degrading the picture.',
    privacy: 'All image processing happens directly in your browser—your files are never uploaded to any external server, ensuring complete privacy and security.',
    faqs: [
      { question: 'How do I compress image to 100kb or less?', answer: 'You compress an image to 100kb or less by adding it here and lowering the quality slider until the size readout reaches your target. Watch the result panel as you go, because it shows the new file size and the percentage saved before you download. Every try re-encodes your original file, so you can test settings freely without wearing the picture down.' },
      { question: 'Can I compress JPEG without losing quality?', answer: 'JPEG compression is always lossy, but at quality settings of 85% or higher most people cannot see any difference from the original. This compressor re-encodes your file from the original on every run, so experimenting never stacks damage on top of damage. If you need every pixel kept exactly as it is, save your final image as PNG instead.' },
      { question: 'What file formats can I reduce image file size online for?', answer: 'You can reduce the file size of JPEG, PNG, and WebP images with this compressor. JPEG suits photographs, PNG suits graphics and images with transparency, and WebP gives strong compression for both kinds of pictures. The engine runs in a background thread in your browser, so the page stays responsive while your file is processed, and nothing is uploaded anywhere.' },
      { question: 'Why should I compress PNG for website use?', answer: 'You should compress PNG files for website use because uncompressed PNGs are often large, and large files make pages load slowly, especially on phones. A compressed PNG keeps the same dimensions and look while asking each visitor\'s browser to download far less data. That means faster pages, lower bandwidth use, and a smoother experience for people on slow connections.' }
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
    howItWorks: 'The resizer draws your image onto a canvas at exactly the pixel dimensions you ask for. In pixels mode you type a width and height directly. With the aspect-ratio lock switched on, typing one side works out the other from your photo\'s original proportions, so nothing gets stretched. Percentage mode scales both sides by the same factor, which is handy when you know you want the image half or twice as big but do not care about exact pixels. A live preview shows the result at its new size, and the download is exported from the canvas as a PNG file.',
    privacy: 'Image resizing happens entirely in your browser—no files are uploaded to any server, keeping your photos private and secure.',
    faqs: [
      { question: 'How do I resize image to pixels for exact dimensions?', answer: 'You resize an image to exact pixels by typing your target width and height into the dimension fields. Turn on the aspect ratio lock and the tool works out the second number for you, so your photo keeps its shape. A live preview shows the result before you download, and the finished image is saved as a PNG file.' },
      { question: 'What size should I resize photo for Instagram?', answer: 'You resize a photo for Instagram to 1080 by 1080 pixels for a square post, 1080 by 1350 for a portrait post, or 1080 by 608 for a landscape post. Enter one of those sizes here and the preview shows you exactly what will be uploaded. Using the platform\'s own dimensions keeps your photo sharp and stops Instagram cropping it for you.' },
      { question: 'Can I change image dimensions online without losing quality?', answer: 'You can change image dimensions online without losing visible quality when you shrink an image, because the remaining pixels still hold plenty of detail. Enlarging is different: software cannot invent detail that was never captured, so a small image stretched bigger can look soft or pixelated. For the best result, always start from the largest original you have.' },
      { question: 'How do I resize image without cropping?', answer: 'You resize an image without cropping by scaling the whole picture, so every part of it stays in the frame. Use the aspect ratio lock, or choose to fit the image within your target dimensions, and nothing gets stretched or cut off. Only the size changes. If you actually want to trim edges away, use the cropper tool instead.' }
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
    howItWorks: 'Your photo opens in a crop frame that you drag and zoom until the composition looks right. The frame tracks its position and size in the pixels of your original image, not in screen pixels, so the area you choose maps exactly onto the full-resolution photo. When you confirm, that region is drawn onto a canvas at its true size and exported as a JPEG. Nothing outside the frame is kept, and the parts of the photo you cropped away are not hidden in the downloaded file. What you framed is precisely what you get.',
    privacy: 'Cropping happens directly in your browser—your images are never uploaded to any external server.',
    faqs: [
      { question: 'How do I crop photo online free without signing up?', answer: 'You crop a photo online free by opening this page, adding your image, and dragging the crop frame over the part you want to keep. No registration, email, or payment is needed to start, and the free plan covers 10 actions a day across all of Snaptoria\'s tools. When the frame looks right, click Crop and download the finished image.' },
      { question: 'Can I crop image to square format?', answer: 'Yes, you can crop an image to a square format by dragging the corner handles until the width and height match. The dimensions display updates in real time, so you can land on exact equal sides before you confirm. If you want the square locked in from the start, the Aspect Ratio Cropper tool holds a 1:1 frame for you.' },
      { question: 'Is this an online image cropper no download required?', answer: 'Yes, this is an online image cropper with no download required, because everything runs inside your web browser. There is no software to install and no app to keep updated. It works on any device with a modern browser, including desktops, laptops, tablets, and phones. You just open the page, add your photo, and start cropping straight away.' },
      { question: 'What image formats work with the crop tool?', answer: 'You can crop JPEG, PNG, WebP, GIF, and BMP images with this tool. Add your file, frame the area you want to keep, and the selected region is drawn from your original photo at full resolution. When you are done, you can export the cropped result as a JPEG, PNG, or WebP file, ready to share or upload anywhere.' }
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
    howItWorks: 'The converter decodes your image and redraws its pixels onto a canvas, then re-encodes those pixels in the format you picked: PNG, JPEG, or WebP. That redraw is also why the conversion is clean. The new file is built from picture data only, so metadata attached to the original, such as camera details or GPS coordinates, is not carried across. If your browser can display the file you added, the converter can re-encode it, which is how iPhone HEIC photos become ordinary JPEGs on systems that support them. Pick a target format, convert, and download the result.',
    privacy: 'Format conversion happens entirely in your browser—your images never leave your device.',
    faqs: [
      { question: 'How do I convert HEIC to JPG online?', answer: 'You convert HEIC to JPG online by adding your iPhone photo here, choosing JPG as the target format, and clicking Convert. The tool decodes the picture and re-encodes its pixels as a standard JPEG that opens on any device. As long as your browser can display the HEIC file, the conversion happens right there in the tab, with no uploads.' },
      { question: 'Why should I convert WebP to PNG?', answer: 'You convert WebP to PNG when you need transparency kept intact or maximum compatibility with older software. WebP compresses well, but some older apps and systems still cannot display it, while PNG opens practically everywhere. Add your WebP file, pick PNG as the target, and download a copy that will display correctly wherever you use it.' },
      { question: 'How does a PNG to JPG converter work?', answer: 'A PNG to JPG converter redraws your image and saves it in JPEG format, which does not support transparency. This tool handles that for you by placing transparent areas on a white background automatically. Choose JPG when you do not need transparency and you want a smaller file that every device, app, and website accepts without complaint.' },
      { question: 'Is this really a convert image format free tool?', answer: 'Yes, this is a genuinely free image format converter with no watermarks and no signup needed to start. Your free plan includes 10 actions a day across all of Snaptoria\'s tools, and Pro at $9 a month removes that limit. Every conversion runs in your browser using the canvas, so your files stay on your device the whole time.' }
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
    howItWorks: 'Each image you add becomes its own page in an A4 portrait PDF. The tool measures every image and scales it to fit inside the page while keeping its original proportions, so a wide photo is never stretched tall or squashed flat. The scaled image is centered on the page and written into the document as a JPEG. Pages follow the order of your list, and you can drag images up or down to change that order before generating. When every page is placed, the finished PDF is assembled in your browser and downloaded as one file.',
    privacy: 'PDF generation happens entirely in your browser—your images are never transmitted to any external server.',
    faqs: [
      { question: 'How do I convert JPG to PDF online?', answer: 'You convert JPG to PDF online by adding your JPG image here and clicking Create PDF. The tool places the photo on its own A4 page, scaled to fit while keeping its proportions, and centered on the page. Download the finished PDF seconds later. Add several JPGs at once and each one becomes its own page in the same document.' },
      { question: 'Can I combine multiple images to one PDF?', answer: 'Yes, you can combine multiple images into one PDF, with each image becoming its own page in the document. Add every file you need, then drag the images up or down in the list to set the page order before you generate. Each photo is scaled to fit its A4 page without stretching, and the finished PDF downloads as one file.' },
      { question: 'How do I convert PNG to PDF free?', answer: 'You convert PNG to PDF free by adding your PNG file here and clicking Create PDF. The image is placed on its own A4 page, scaled to fit and centered, then written into the document. There is no signup and nothing to install. Add more images at the same time if you want a multi-page PDF instead of a single page.' },
      { question: 'What image formats can I use?', answer: 'You can use JPG, PNG, WebP, GIF, and BMP images in this converter. Every file you add becomes its own page in the PDF, in the order shown in your list. Each image is scaled to fit inside its page while keeping its original proportions, so a wide photo is never stretched tall or squashed flat to fill the space.' }
    ]
  },
  'pdf-dpi-checker': {
    h1: 'PDF DPI Checker - Check the DPI of Images Inside Any PDF',
    intro: 'Check PDF DPI online free with this PDF DPI checker. A PDF file does not have one single DPI — every image inside it has its own resolution, and the number that decides print quality is the effective DPI: the image’s pixel count divided by the size it is printed at on the page. Upload a PDF and this tool inspects every embedded image, shows its pixel dimensions, the size it occupies on the page, and its effective DPI, then tells you plainly whether the document is print-ready at 300 DPI or only good for screens. Everything runs in your browser — your PDF is never uploaded to a server.',
    howTo: [
      { step: 1, text: 'Upload your PDF by dragging and dropping it above or clicking to browse your files.' },
      { step: 2, text: 'The tool reads every page and lists each embedded image with its pixel size, printed size, and effective DPI.' },
      { step: 3, text: 'Check the summary: the lowest-DPI image is highlighted, because that is the one that decides your print quality.' }
    ],
    angle: 'Print shops ask for 300 DPI because that is roughly the finest detail the human eye can resolve at normal reading distance — below it, photos start to look soft or pixelated in print. The catch with PDFs is that one document can mix images of wildly different quality: a logo exported at high resolution can sit right next to a website screenshot that works out to under 100 DPI at its printed size. A PDF also stores each image at its original pixel size, so enlarging an image on the page lowers its effective DPI even though the image file itself never changed. That is why checking a PDF means checking it image by image, at the exact size each one appears — which is exactly what this tool does, page by page.',
    howItWorks: 'The checker opens your PDF with a PDF renderer and walks through the drawing instructions of every page, one by one. As it walks, it tracks the transformation matrix, the maths that decides where each element lands on the printed page and at what size, through every save, restore, and transform step, including images nested inside form XObjects. When an image is painted, the tool divides its pixel dimensions by the physical size it will print at. That gives the effective DPI, and it keeps the lower of the horizontal and vertical values. Three hundred DPI or more is print-ready. From 150 to 299 suits large prints and drafts. Below that, the image is flagged as screen quality only. The headline verdict comes from the weakest image in the file, because that is the one a printer will notice.',
    privacy: 'PDF analysis happens entirely in your browser — your files are never uploaded to any server, so even confidential documents stay on your device.',
    faqs: [
      { question: 'How to check DPI of a PDF?', answer: 'You check the DPI of a PDF by adding the file here and letting the checker inspect every image embedded in it. For each image you see its pixel dimensions, the size it occupies on the page, and the effective DPI that results. The summary highlights the lowest-DPI image, because that single number decides whether the document prints sharply.' },
      { question: 'How do I check DPI on a PDF on Windows or Mac?', answer: 'You check DPI on a PDF on Windows or Mac by opening this page in any modern browser and dropping your file in, with no Acrobat and no installed software. The tool reads the PDF locally on your device and reports every embedded image. Desktop readers rarely show per-image DPI without paid plugins, so this is usually the faster route.' },
      { question: 'What DPI should a PDF be for printing?', answer: 'Your PDF should be 300 DPI at the final printed size for most print work, including photos, brochures, flyers, and books. Large pieces viewed from a distance, such as posters and banners, are often accepted at 150 DPI, and the 150 to 299 range also suits big prints and drafts. Anything below 150 DPI belongs on screens, not in print.' },
      { question: 'Why is my PDF low resolution?', answer: 'Your PDF is usually low resolution because one or more images inside it have too few pixels for the size they are printed at. Common causes are pictures pulled from websites, screenshots, and images scaled up during layout. This checker points to the exact page and image at fault, so you can replace just that file instead of rebuilding everything.' },
      { question: 'Can you increase the DPI of a PDF?', answer: 'You cannot genuinely increase the DPI of a PDF, because DPI comes from pixel data and software cannot invent detail that was never captured. Tools that promise it usually rewrite the metadata number or upscale the image with blur. The real fix is replacing the weak image with a higher-resolution original and exporting again, after this checker shows you which images need it.' },
      { question: 'Does a PDF have DPI?', answer: 'No, a PDF does not have a DPI of its own, because its pages are measured in points rather than dots per inch. DPI belongs to the raster images placed inside the PDF, and each one has its own effective DPI based on its pixel size and how large it is drawn. Text and vector shapes stay sharp at any size.' },
      { question: 'How do I check PDF resolution online?', answer: 'You check PDF resolution online by dropping your PDF into the checker above. You get the page count and page sizes, then a table of every embedded image with its pixels, its size in inches on the page, and its effective DPI, plus an overall verdict against the 300 DPI print standard. Nothing is uploaded; the analysis runs in your browser.' }
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
    angle: 'DPI (dots per inch) measures print resolution — how many ink dots appear in each inch of printed output. Print services typically require 300 DPI for photographs and marketing materials, while newspapers may accept 150-200 DPI. The quickest way to know your print quality is simple maths: divide the pixel width by the print width in inches. A 3000 x 2400 pixel image printed at 10 x 8 inches is exactly 300 DPI. On Windows you can also right-click a photo, open Properties and check the Details tab for horizontal and vertical resolution, and on a Mac you can open the image in Preview and use Tools, then Show Inspector. An online DPI checker like this one is faster and more complete, because it also shows the largest print size your image can produce at 300 DPI, which is the number print shops actually care about.',
    howItWorks: 'This checker looks at two different things. First, it reads the resolution tags embedded in the file itself, the X and Y resolution values and their unit, which most cameras and editing apps write into the metadata. Those tags are where the DPI estimate comes from. Second, it decodes the image to measure its true pixel width and height, and reports the aspect ratio, color space, and bit depth when the file carries them. The two views matter because they often disagree. Plenty of images have no embedded DPI at all, and in that case the honest numbers are the pixel dimensions and the size they make at 300 DPI.',
    privacy: 'Image analysis happens entirely in your browser—your files are never uploaded to any server.',
    faqs: [
      { question: 'How to check the DPI of an image?', answer: 'You check the DPI of an image by adding the file above, and this checker instantly shows its embedded DPI metadata, its exact pixel dimensions, and the largest size it can print at 300 DPI. There is nothing to install and no settings to learn. Your file is read inside your browser and never leaves your device during the check.' },
      { question: 'How do I check the DPI of an image on Windows?', answer: 'You check the DPI of an image on Windows by right-clicking the file, choosing Properties, and opening the Details tab, where horizontal and vertical resolution are shown in DPI. That tells you the stored number, but not what it means for printing. Add the image to this checker as well and you get its maximum print size at 300 DPI.' },
      { question: 'How do I check the DPI of an image on a Mac?', answer: 'You check the DPI of an image on a Mac by opening it in Preview, choosing Tools, and then Show Inspector, which displays the image DPI together with its pixel dimensions. If you want the print size worked out too, add the same file to this online checker. It shows the largest size your image can print at 300 DPI in one step.' },
      { question: 'How can I tell if my image is 300 DPI?', answer: 'You can tell if your image is 300 DPI by dividing its pixel width by the width you want to print, in inches. If the result is 300 or more, you are fine at that size: a 2400-pixel-wide image printed 8 inches wide is exactly 300 DPI. This tool does that maths for you and shows the largest size that holds 300 DPI.' },
      { question: 'What DPI is my image if it came from my phone or the web?', answer: 'Your phone or web image probably carries 72 or 96 DPI metadata, and that number alone says nothing about its quality. What matters is the pixel count. A 4000 by 3000 phone photo still prints sharply at 300 DPI up to about 13 by 10 inches. Add your image here to see its exact pixel dimensions and true print size.' },
      { question: 'What is the difference between DPI and PPI?', answer: 'PPI describes the pixels per inch inside an image file on a screen, while DPI describes the dots per inch a printer lays down on paper. In everyday use the two terms are treated as the same thing, and print shops do the same. When a printer asks you for 300 DPI, they mean a file with 300 pixels per printed inch.' },
      { question: 'Why would I need a DPI checker for printing?', answer: 'You need a DPI checker for printing because print services reject low-resolution files that come out pixelated, and finding out after a print run costs time and money. Checking first catches weak images while they are still easy to replace. That is why photographers, designers, and marketers verify the resolution of their files before anything goes to press.' },
      { question: 'What does this image resolution checker show?', answer: 'This image resolution checker shows the embedded DPI metadata, the exact pixel width and height, the file size, and the maximum print size your image can reach at the 300 DPI print standard. It also reports the aspect ratio, and color details when the file carries them. One look tells you whether your image is ready for print or not.' },
    ]
  },
  'exif-viewer': {
    h1: 'EXIF Viewer - View Photo Metadata & Remove EXIF Data Online',
    intro: 'Use this free EXIF viewer to see exactly what data is hidden inside your photos. Every photo taken with a smartphone or digital camera carries EXIF metadata — camera make and model, lens and exposure settings, the date and time, and often GPS coordinates showing where the photo was taken. Upload a photo to view its full metadata in one place, then remove EXIF data with one click and download a clean copy that is safe to share anywhere.',
    howTo: [
      { step: 1, text: 'Upload your image to view all of its embedded EXIF and metadata.' },
      { step: 2, text: 'Review the displayed information: camera, GPS location, date, settings, and more. Location data is highlighted when present.' },
      { step: 3, text: 'Click "Download Cleaned Image (No EXIF)" to save a re-encoded copy with all metadata removed.' }
    ],
    angle: 'Viewing and removing metadata are two sides of the same job. Photographers use an EXIF viewer to check camera settings, verify when and where a shot was taken, or confirm a file still carries its copyright details. Privacy is the other side: when you share a photo without removing its metadata, anyone who downloads it can extract the GPS coordinates and learn where you live, work, or where the photo was taken. Some social platforms strip metadata on upload and some do not — and the ones that do may still keep a copy internally. This tool handles both jobs in your browser: it displays every metadata field the file contains, flags GPS location data, and then re-encodes the image through a canvas so the downloaded copy carries no EXIF data at all. The picture itself is preserved; only the hidden data is removed.',
    howItWorks: 'The viewer parses the metadata segments inside your photo file and lists what it finds: camera make and model, lens and exposure settings, the date and time, and GPS coordinates when they were recorded. Location fields are treated as sensitive here. If GPS data is present, the page warns you before you share the photo anywhere. The cleaned download works differently from the viewer. Your photo\'s pixels are redrawn onto a canvas and saved as a brand-new file. A fresh file built from pixels alone carries no metadata with it, so the EXIF block, the GPS position, and the camera fields are all left behind.',
    privacy: 'All metadata viewing and removal happens in your browser—your original images never leave your device.',
    faqs: [
      { question: 'What is an EXIF viewer?', answer: 'An EXIF viewer reads the metadata embedded inside a photo file and shows it to you in readable form. That includes the camera make and model, lens, shutter speed, aperture, ISO, the date and time taken, image dimensions, and GPS coordinates when the camera recorded them. Add a photo above and this viewer lists every field it finds, instantly.' },
      { question: 'How do I view EXIF data online?', answer: 'You view EXIF data online by adding any photo to the viewer above, and it extracts and displays all the embedded metadata for you. You will see the camera make and model, lens information, exposure settings, the date and time taken, and GPS coordinates when they exist. Nothing is uploaded to a server; the file is read locally in your browser.' },
      { question: 'How do I remove metadata from a photo?', answer: 'You remove metadata from a photo by adding it here, checking what the viewer finds, and clicking Download Cleaned Image (No EXIF). The tool redraws your picture through a canvas and saves it as a fresh file, which leaves the EXIF, GPS, camera details, and timestamps behind. The picture itself stays intact, at full size, ready to share safely.' },
      { question: 'How do I remove EXIF data from a photo?', answer: 'You remove EXIF data from a photo the same way: add the image here and download the cleaned copy. Re-encoding the picture drops every EXIF field, including the GPS location, the device model, and the date and time the photo was taken. The cleaned file is a standard JPG, so it opens on any device and in any app.' },
      { question: 'How do I remove GPS location from a photo?', answer: 'You remove GPS location from a photo by downloading the cleaned copy from this page, because GPS coordinates are stored inside the EXIF data. The re-encoded file has all metadata removed, coordinates included. If the viewer flags Location Data Detected on your photo, it definitely holds coordinates, and stripping them before you share it is the sensible move.' },
      { question: 'Why should I remove metadata from photos before sharing?', answer: 'You should remove metadata from photos before sharing because it can reveal your exact location, the device you own, and when each photo was taken. Anyone who downloads your picture from social media, a marketplace listing, or a public forum can inspect that hidden data. Some platforms strip it on upload and some do not, so cleaning it yourself is safer.' },
      { question: 'Does removing EXIF data reduce image quality?', answer: 'Removing EXIF data does not meaningfully reduce image quality, because the cleaned copy is re-encoded as a high-quality JPG and the pixels are redrawn at full size. Any difference is negligible for normal viewing and sharing; only the hidden metadata is dropped. If you need a bit-for-bit archival original, keep your master file and share only the cleaned copy.' },
      { question: 'How do I check photo metadata on any image?', answer: 'You check photo metadata on any image by adding the file to this viewer, which immediately displays whatever metadata it contains. It works for photos from any camera or phone, and for images you downloaded from the web. If a file shows no EXIF data, its metadata was already stripped, which is common for screenshots and many edited images.' }
    ]
  },
  'image-resolution-checker': {
    h1: 'Image Resolution Checker - Check Image Resolution Online',
    intro: 'Check image resolution online in seconds with this free image resolution checker. Upload any photo and instantly see its pixel dimensions, megapixels, aspect ratio, file size, and embedded DPI, together with a plain-language verdict: the largest size it can print sharply at 300 DPI, and whether it is high resolution enough for web, social media, or print. No software to install and no file ever leaves your browser.',
    howTo: [
      { step: 1, text: 'Upload your image file to check its resolution.' },
      { step: 2, text: 'Review the pixel dimensions, megapixels, aspect ratio, and embedded DPI.' },
      { step: 3, text: 'Read the verdict: maximum sharp print size at 300 DPI and suitability for web and social use.' }
    ],
    angle: 'Image resolution simply means how many pixels an image contains, written as width x height — for example 4000 x 3000 pixels, which is 12 megapixels. That pixel count, not the DPI number stored in the file, decides what you can do with the image. The maths is simple: divide the pixel width by the print width in inches to get the effective DPI. A 3000-pixel-wide photo printed 10 inches wide comes out at exactly 300 DPI, the standard for sharp print. The same file is far more than enough for screens, where a full-width website hero image rarely needs more than 1920 pixels across. This checker does all of that maths for you and translates the raw numbers into a clear verdict, so you know before you upload, send, or print whether the image is up to the job.',
    howItWorks: 'The checker decodes your image and measures its pixel width and height, then does the arithmetic that decides what those pixels are worth. Megapixels are the width times the height divided by a million. The aspect ratio is reduced to its simplest form, so 6000 by 4000 becomes 3:2. Print sizes come from dividing the pixels by 300 for a sharp print and by 150 for a larger, softer one. It also reads any DPI value embedded in the file. The verdict bands are plain: six megapixels or more counts as high resolution for most print and screen work, two to six is moderate, and under two is low. The long side gets its own guidance, with 1920 pixels marking comfortable full-screen use.',
    privacy: 'Resolution analysis happens entirely in your browser—your files are never uploaded to any server.',
    faqs: [
      { question: 'How do I check the resolution of an image?', answer: 'You check the resolution of an image by adding the file above, and this checker instantly shows its resolution in pixels, width by height, plus its megapixel count, aspect ratio, file size, and any DPI metadata stored in the file. There is nothing to install and no settings to adjust. Your image is measured inside your browser and never leaves your device.' },
      { question: 'How to check resolution of an image on Windows or Mac?', answer: 'You check the resolution of an image on Windows by right-clicking the file, opening Properties, and reading the dimensions on the Details tab; on a Mac, open it in Preview and choose Tools, then Show Inspector. Both show raw pixel dimensions only. This online checker adds megapixels, aspect ratio, embedded DPI, and a plain print-size verdict in the same step.' },
      { question: 'How can I check if an image is high resolution?', answer: 'You can check if an image is high resolution by looking at its pixel dimensions and megapixels. Six megapixels or more, such as 3000 by 2000, counts as high resolution here: it prints sharply at 300 DPI up to about 10 by 6.5 inches. Two to six megapixels is moderate, and under two is low. The verdict section tells you directly.' },
      { question: 'What resolution do I need for printing?', answer: 'You need 300 pixels for every inch of print, so multiply your print size in inches by 300 to get the resolution required. A 6 by 4 inch print needs 1800 by 1200 pixels, an 8 by 10 needs 2400 by 3000, and an A4 page needs about 3508 by 2480. This checker shows the largest print your image can produce at 300 DPI.' },
      { question: 'What is the difference between image resolution and DPI?', answer: 'Image resolution is the pixel count stored in the file, such as 4000 by 3000, while DPI only becomes meaningful when the image is printed. DPI is that pixel count divided by the printed size, so the same 4000-pixel-wide image is 400 DPI printed at 10 inches wide and 200 DPI at 20 inches. This tool reports both numbers for you.' },
      { question: 'What resolution is good for websites and social media?', answer: 'A resolution of 1920 pixels wide is good for websites and screens, because it covers full-HD displays and website hero images. For social media, 1080 by 1080 suits Instagram posts and 1080 by 1920 suits stories and reels. Anything at or above these sizes looks sharp. Much larger files only slow your page down, so resize oversized originals before uploading them.' },
      { question: 'How many megapixels is high resolution?', answer: 'Megapixels are the width multiplied by the height in pixels, divided by one million, and phone cameras typically produce 12 megapixels or more. That counts as high resolution and prints well up to roughly 13 by 10 inches at 300 DPI. Around 2 to 6 megapixels suits small prints and screens, while under 1 megapixel is best kept to thumbnails.' },
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
    howItWorks: 'Your photo is drawn onto a canvas at full size and every pixel is read. Counting millions of exact colors would produce noise, so each red, green, and blue channel is rounded to the nearest step of 32. That groups near-identical shades into one bucket, the way your eye already groups them. The tool counts how many pixels land in each bucket, sorts the buckets by count, and shows the eight biggest as swatches. Each swatch comes with its hex code and the percentage of the whole image that color covers, and one click copies the hex value for use in your design tool or stylesheet.',
    privacy: 'Color analysis happens entirely in your browser—your images are never uploaded to any external server.',
    faqs: [
      { question: 'How do I get hex code from image?', answer: 'You get a hex code from an image by adding your photo here and letting the tool pull out its dominant colors. The results appear as swatches, and clicking any swatch copies its hex code straight to your clipboard. You can then paste that value into your CSS, your design software, or anywhere else you need the exact color.' },
      { question: 'What does this color palette generator from photo show?', answer: 'This color palette generator from a photo shows the eight colors that cover the largest share of your image. Each swatch comes with its hex code and the percentage of the whole picture that color covers. The colors are worked out by grouping near-identical shades together and counting real pixels, so the palette reflects what your eye actually sees.' },
      { question: 'Can I use this as a dominant color picker for design projects?', answer: 'Yes, you can use this as a dominant color picker for design projects of any kind. Add a reference photo and take the brand colors straight from it, match your website colors to a photograph, or build a scheme from nature or architecture shots. Designers also use it to study the palette behind a competitor\'s visuals before starting their own.' },
      { question: 'What color formats are available?', answer: 'The color format you get from each extracted color is its hex code, such as #4A90D9, shown next to the swatch with the percentage of the image that color covers. Hex is the format CSS and web design tools expect, and one click copies the value to your clipboard. That makes it quick to move a photo\'s colors into a stylesheet.' }
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
    angle: 'Common causes of image corruption include incomplete downloads, interrupted file transfers, failing SD cards and storage errors, messaging apps that recompress files badly, and software crashes during saving. A corrupt image might display only partially, show grey bands or garbled colours, produce an “image check failed” style error on upload forms, or fail to open entirely. JPG files usually break when their header or scan data is damaged, while PNG files fail a strict checksum test when even a small part of the data changes. This corrupt image checker fully decodes your file the same way a browser or upload form does, so a pass here means the file is structurally sound, and a failure tells you the file itself — not the website or app — is the problem. Checking before you send files to print, share them with clients, or submit them to an application portal catches embarrassing failures early.',
    howItWorks: 'The detector puts your file through three tests, in the same order your browser would meet the problems. First, the file is read into memory; a file that cannot even be read fails here. Second, the browser\'s own image decoder tries to load it. Truncated files, wrong extensions, and broken headers usually fail at this stage. Third, the decoded image is drawn onto a canvas and the tool reads a pixel back. That last test catches files whose headers look fine but whose picture data is damaged underneath. Pass all three and the file is reported valid, with its dimensions. Fail any stage and you get the stage-specific reason instead of a guess.',
    privacy: 'Image validation happens entirely in your browser—files never leave your device.',
    faqs: [
      { question: 'What is a corrupt image checker and how does it work?', answer: 'A corrupt image checker tests whether your image file is structurally sound by putting it through the same steps your browser uses. This one reads the file, tries to decode it fully, then draws it to a canvas and reads a pixel back. Pass all three stages and the file is valid; fail one and you see exactly where it broke.' },
      { question: 'How do I check if an image is corrupted?', answer: 'You check if an image is corrupted by adding the file above and letting the tool decode it completely. If the decode succeeds, you see Valid Image together with the dimensions and file size. If it fails or stops partway, the image is corrupt, and the tool reports which stage caught the problem, so you are not left guessing.' },
      { question: 'Why does my image say it failed or will not open?', answer: 'Your image says it failed or will not open usually because the file itself is damaged, most often by an incomplete download, an interrupted transfer, or a failing memory card or drive. Run the file through this checker to be sure. If it fails here as well, the file is the problem, not the app or website you were using.' },
      { question: 'Can a corrupted JPG or PNG be repaired?', answer: 'A corrupted JPG or PNG can sometimes be repaired, mainly when only the header is damaged and re-saving the file in an editor rebuilds it. If the picture data itself is missing, which is common after interrupted downloads, that lost part cannot be reconstructed. In that case, re-downloading from the original source or restoring a backup is the reliable fix.' },
      { question: 'Why does my photo look fine as a thumbnail but fail when opened?', answer: 'Your photo can look fine as a thumbnail but fail when opened because many apps store a small preview separately from the full image data. The preview can survive damage that breaks the full-resolution picture underneath. So the gallery shows you a healthy-looking thumbnail while editors and this checker, which read the real data, report corruption. It is a classic warning sign.' },
      { question: 'My image won’t open — how do I fix it?', answer: 'You fix an image that will not open by first confirming the damage with this tool, then working through simple steps in order. Re-download or re-copy the file from its original source, try opening it in a different app or browser, and restore it from a backup or cloud copy. If the checker says the file is valid, the app is at fault.' },
      { question: 'Can I validate an image file online before an important upload?', answer: 'Yes, you can validate an image file online here before an important upload, and it is worth the few seconds it takes. Print services, clients, and school or visa application portals often reject damaged files with vague error messages that tell you nothing. Checking first shows you exactly which file is at fault, while there is still time to replace it.' },
      { question: 'Which image formats can this broken image checker test?', answer: 'This broken image checker tests the formats your browser can decode, including JPG and JPEG, PNG, WebP, GIF, BMP, and AVIF. For a valid image it shows the dimensions and file size. For a corrupt one it tells you which stage failed, whether the file could not be read, the decoder rejected it, or the picture data underneath was damaged.' },
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
    howItWorks: 'Rotation and flipping happen on a canvas sized to fit the turned image, so a sideways photo gets a wider canvas rather than cropped corners. The drawing context is rotated in exact 90-degree steps, and the flip switches mirror the picture by drawing it with a negative scale, horizontally, vertically, or both. Your rotation and flip choices combine into a single redraw of the original pixels, and the result is exported as a new file. Because the export starts from the original each time you change a setting, turning an image back and forth does not wear it down.',
    privacy: 'Image rotation happens entirely in your browser—files never leave your device.',
    faqs: [
      { question: 'How do I flip image horizontally online?', answer: 'You flip an image horizontally online by adding your photo here and clicking the Flip Horizontal button, and the picture mirrors left to right instantly. That gives you a true mirror image, handy for symmetrical designs and for reversing text before printing it on iron-on transfers. Check the live preview, then download the flipped file when it looks right.' },
      { question: 'Can I rotate photo 90 degrees quickly?', answer: 'Yes, you can rotate a photo 90 degrees quickly by clicking the 90-degree rotation button once for a quarter turn. Click again for 180 degrees and a third time for 270, with the preview updating at every step. The canvas is sized to fit the turned image, so your corners are never cropped off. Download when the orientation looks right.' },
      { question: 'How do I mirror image online free without losing quality?', answer: 'You mirror an image online free without wearing it down because every change is redrawn from your original pixels. Turning or flipping the picture back and forth does not stack up damage, since each new setting starts again from the file you added. The result is exported as a fresh file, ready to download in the format you choose.' },
      { question: 'What file types can I rotate?', answer: 'You can rotate all common image file types here, including JPEG, PNG, WebP, GIF, and BMP. Add your file, turn it or flip it with the buttons, and watch the preview update as you work. When the orientation is right, download the finished image as a JPEG, PNG, or WebP file, whichever suits where you plan to use it.' }
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
    howItWorks: 'Encoding reads your image file and produces its data URL form: the file\'s contents written out as one long base64 text string, with the image type declared at the front. That string is what you paste into an HTML img tag, a CSS background, or a JSON payload when a separate image file is not an option. Decoding runs the trip in reverse. Paste a base64 string or a full data URL, and the tool rebuilds the image from the text, shows you a preview so you can confirm it decoded correctly, and offers the result as a downloadable image file.',
    privacy: 'Base64 encoding and decoding happens entirely in your browser—your images and data strings never leave your device.',
    faqs: [
      { question: 'How do I convert base64 to image file?', answer: 'You convert base64 to an image file by pasting your string into the decode field here. The tool checks the string, rebuilds the image from it, and shows you a preview so you can confirm it decoded correctly. Click download to save the result as an image file. Both pure base64 strings and full data URLs are accepted.' },
      { question: 'How do I base64 encode image online?', answer: 'You base64 encode an image online by adding any image file here, and the tool generates its base64 string instantly. Copy it with one click and paste it wherever you need it. You can choose pure base64 output or the complete data URI format, which is ready to drop straight into an img src attribute or a CSS background.' },
      { question: 'Why use a base64 image string generator?', answer: 'You use a base64 image string generator when a picture needs to travel as text instead of as a file. Developers embed small icons and thumbnails directly in HTML and CSS, include images inside JSON API responses, build self-contained email signatures, and make single-file HTML prototypes. For small images, it removes the need for separate hosting and extra requests.' },
      { question: 'Does base64 encoding affect image quality?', answer: 'No, base64 encoding does not affect image quality at all, because it is a lossless way of writing the same binary data as text. Decode the string and you get a file that is byte-for-byte identical to the original. The only trade-off is size: base64 output runs about 33% larger than the file it came from.' }
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
    howItWorks: 'For every size a browser or phone might ask for, the generator draws your image onto a square canvas of exactly that size: 16, 32, 180, 192, and 512 pixels. Your artwork is scaled to fit inside the square and centered, with high-quality smoothing so the small sizes stay as crisp as the source allows. Each size is exported as a PNG. The tool then writes the two companion files a site needs, a web manifest pointing at the Android icons and a browserconfig for Windows tiles, and packs the whole set into a single ZIP for download.',
    privacy: 'Favicon generation happens entirely in your browser—your images never leave your device.',
    faqs: [
      { question: 'How do I generate favicon from image?', answer: 'You generate a favicon from an image by adding a square logo or icon here, ideally 512 by 512 pixels or larger. The tool resizes it into every standard favicon size automatically: 16, 32, 48, 180, 192, and 512 pixels, plus the classic favicon.ico. Everything arrives bundled in a single ZIP file, ready to drop into your website.' },
      { question: 'What is a favicon.ico generator online?', answer: 'A favicon.ico generator online creates the legacy Windows icon format, which can hold several image sizes inside one file, plus the modern PNG sizes today\'s browsers and phones ask for. This tool builds the complete set for you in your browser. Place the favicon.ico in your site root and older browsers and Windows will pick it up automatically.' },
      { question: 'How do I create favicon for website that works everywhere?', answer: 'You create a favicon for a website that works everywhere by using the full generated set, not just one file. Put favicon.ico in your site root, then add the link tags for the apple-touch-icon and the Android Chrome sizes in your page head. The ZIP includes an HTML snippet showing exactly which tags to add, so setup takes minutes.' },
      { question: 'What sizes are included in the favicon set?', answer: 'The favicon set includes 16 by 16 for browser tabs, 32 by 32 for Windows, 48 by 48 for Windows site icons, 180 by 180 for Apple Touch, 192 by 192 for Android Chrome, and 512 by 512 for high-resolution Android displays. It also includes the classic favicon.ico, which packs multiple sizes into a single file for older browsers.' }
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
    howItWorks: 'Pick a grid and the splitter divides your image into that many equal tiles: 2 by 2, 3 by 3, 4 by 4, or a custom number of rows and columns. Every tile is cut from the original at full resolution, drawn from its own region of the photo rather than from a shrunk preview, so the pieces stay sharp when they are posted at full size. The tiles are exported as separate PNG files and bundled into one ZIP. They are ordered in reading sequence, left to right and top to bottom, which is the order an Instagram carousel needs.',
    privacy: 'Image splitting happens entirely in your browser—your photos never leave your device.',
    faqs: [
      { question: 'How do I use this as an Instagram grid maker?', answer: 'You use this as an Instagram grid maker by adding your image, choosing the 3 by 3 grid, and downloading the ZIP of nine pieces. Instagram shows carousel images in upload order, so upload piece 9 first, then 8, and work backwards to piece 1. When all nine are posted, your profile displays them together as one complete grid image.' },
      { question: 'How do I cut image into pieces online?', answer: 'You cut an image into pieces online by choosing your grid dimensions here, and the tool works out equal-sized pieces for you automatically. Every piece is cut from your original photo at full resolution, so the tiles stay sharp instead of being sliced from a shrunk preview. Download all the pieces in one numbered ZIP, ready to post or print.' },
      { question: 'How do I split photo into squares for Instagram?', answer: 'You split a photo into squares for Instagram by picking the grid that matches the layout you want. A 3 by 1 grid makes a three-image panoramic row, 1 by 3 makes a vertical triptych, and 3 by 3 makes the classic nine-post grid across your profile. Each piece keeps the full resolution of the region it was cut from.' },
      { question: 'What file format are the split pieces?', answer: 'The split pieces are generated as PNG files, so no quality is lost between the cuts. They are bundled into a ZIP archive and numbered in reading order, left to right and top to bottom, as 1.png, 2.png, and so on. That numbering tells you the correct order for posting a carousel or reassembling the picture later.' }
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
    howItWorks: 'Choose a layout and the collage maker builds a single canvas with a cell for each of your photos: two side by side, two stacked, three in a row, a 2 by 2 grid, and more. Each photo is scaled and placed into its cell, and the combined picture is exported as one image file. The layouts are fixed grids rather than freeform canvases, which keeps edges aligned and spacing even without any dragging around. Swap the layout and the same photos are rearranged instantly, so you can try a horizontal strip and a square grid before deciding which one to download.',
    privacy: 'Collage creation happens entirely in your browser—your photos are never uploaded to any server.',
    faqs: [
      { question: 'How do I make a collage online free?', answer: 'You make a collage online free by adding 2 to 9 images here, choosing a layout, and downloading the finished picture. There is no registration to complete and no watermark added to your collage. Everything happens instantly in your browser, so your photos never leave your device. Try a grid, then a strip, and keep the arrangement you like best.' },
      { question: 'How do I combine photos into one image?', answer: 'You combine photos into one image by adding all the photos you want to include and selecting a layout that fits them. Choose a grid for a clean array, side-by-side for a comparison, or a vertical stack for a story. The tool arranges everything into a single picture, and you download that one file, ready for sharing or printing.' },
      { question: 'Is this a collage maker no app download required?', answer: 'Yes, this is a collage maker with no app download required, because everything runs in your web browser. There is no mobile app to install, no software to download, and no plugins to enable. It works the same on phones, tablets, laptops, and desktops, so you can start a collage on whichever device already holds your photos.' },
      { question: 'Can I adjust photos within the collage?', answer: 'You adjust photos within the collage by choosing a layout preset, and the tool arranges your images automatically into balanced cells. The layouts are fixed grids rather than a freeform canvas, which keeps edges aligned and spacing even without dragging things around. Swap the layout and the same photos rearrange instantly, so you can compare looks before downloading.' }
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
    howItWorks: 'The presets lock the crop frame to a fixed shape: 1:1 for a square post, 16:9 for video thumbnails, 9:16 for stories, 4:5 for portrait posts, and others. You drag and scale the frame over your photo, and the frame can grow or shrink but never change shape, so the composition you settle on is exactly the ratio the platform expects. When you confirm, the selected region is drawn from the original photo at full resolution onto a canvas and downloaded as a JPEG. The platform gets its ratio, and you keep every pixel inside the frame.',
    privacy: 'Aspect ratio cropping happens entirely in your browser—images never leave your device.',
    faqs: [
      { question: 'How do I crop photo for Instagram story?', answer: 'You crop a photo for an Instagram story by selecting the 9:16 Stories and Reels preset here. That tall vertical ratio fills the whole phone screen in Stories, Reels, and IGTV, with no empty bars at the sides. Position your image inside the frame, keeping the important parts away from the very top and bottom, then download your crop.' },
      { question: 'How do I crop image 16:9 for YouTube?', answer: 'You crop an image 16:9 for YouTube by selecting the 16:9 preset, which matches YouTube video and thumbnail dimensions exactly. Position your picture inside the widescreen frame and download the result at full resolution. The same ratio also suits desktop wallpapers, presentation slides, and most other video platforms, so one crop often covers several uses.' },
      { question: 'How do I crop image for YouTube thumbnail specifically?', answer: 'You crop an image for a YouTube thumbnail by choosing the 16:9 preset here, because YouTube recommends thumbnails at 1280 by 720 pixels in that ratio. Position your composition inside the frame, keeping faces and text clear of the edges, and download at high resolution. The crop is drawn from your original photo, so the quality stays as high as your source allows.' },
      { question: 'What is the best aspect ratio for Instagram posts?', answer: 'The best aspect ratio for Instagram posts depends on your content: square 1:1 works in every feed position, portrait 4:5 takes up more vertical space in the feed and draws more attention, and landscape 1.91:1 suits wide scenes. Pick the preset that matches your photo\'s shape, position the crop, and download a file the platform displays properly.' }
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
    howItWorks: 'The five sliders, brightness, contrast, saturation, grayscale, and sepia, are combined into a single filter instruction. When you export, that instruction is applied by the canvas as it redraws your photo, so the effect is baked into the downloaded pixels rather than sitting on top as a display trick. The preset buttons simply move the sliders to known recipes, such as full grayscale for black and white or a warm sepia mix, and you can fine-tune from there. Because the preview uses the same filter values as the export, the photo you see is the photo you download.',
    privacy: 'Filter application happens entirely in your browser—your images are never uploaded to any external server.',
    faqs: [
      { question: 'How do I create a black and white photo filter online?', answer: 'You create a black and white photo filter online by adding your image and clicking the B&W preset, or by dragging the Grayscale slider to 100 percent yourself. Either way you get a classic monochrome picture. Fine-tune it afterwards with the brightness and contrast sliders, because a good black and white photo depends on its tonal range more than anything.' },
      { question: 'How do I apply a sepia filter online?', answer: 'You apply a sepia filter online by clicking the Sepia preset for an instant vintage look, or by moving the Sepia slider yourself for a lighter touch. Sepia lays warm brown tones over your photo, like an antique print. For a more convincing aged effect, pair it with slightly reduced saturation and a small lift in brightness.' },
      { question: 'How do I adjust photo brightness online?', answer: 'You adjust photo brightness online by adding your image and dragging the Brightness slider in the preview. Values below 100 percent darken the picture and values above 100 percent lighten it, so underexposed shots can be rescued gently. Use the contrast slider alongside it for the best result, because boosting both together adds punch while keeping the tones balanced.' },
      { question: 'Can I combine multiple filters?', answer: 'Yes, you can combine multiple filters here, because all five sliders feed into one combined filter that is applied when you export. Add grayscale, layer sepia on top, then set brightness, contrast, and saturation to taste. The live preview uses the exact same values as the download, so the photo you see is the photo you get.' }
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
    howItWorks: 'Your photo is drawn onto a canvas first. Then your watermark text is painted over it with the canvas text renderer, using the size, color, and opacity you set and placed at the position you picked on the image. Lower opacity keeps the mark readable to a person looking for it without shouting over the photo; higher opacity makes it obvious and harder to ignore. The marked image is exported as a new file with the text as part of the pixels. That is what makes it useful as a deterrent: the words are no longer a separate layer that a viewer can simply switch off.',
    privacy: 'Watermarking happens entirely in your browser—your photos never leave your device.',
    faqs: [
      { question: 'How do I add text watermark to photo?', answer: 'You add a text watermark to a photo by adding your image here, typing your watermark text, and setting its size, color, opacity, and position. Use your name, your brand, or a copyright notice as the text. At export, the words are painted into the picture itself, so download the finished file and the mark travels with it everywhere.' },
      { question: 'Why should I watermark photos free online?', answer: 'You watermark photos free online to discourage other people from using your images without permission on social media, stock sites, and rival platforms. A visible mark establishes clear ownership the moment someone sees the picture. Watermarks can be removed with enough effort, so they are not a lock, but they deter the casual copying that happens most often.' },
      { question: 'How does a copyright watermark generator help photographers?', answer: 'A copyright watermark generator helps photographers by keeping the same mark consistent across a whole portfolio, which builds brand recognition while it protects the work. Put your name or brand on each image, add the copyright symbol if you like, and apply the same style every time. Clients start recognizing your pictures on sight, and casual copiers think twice.' },
      { question: 'What opacity should I use for watermarks?', answer: 'You should use 40 to 60 percent opacity for a watermark when strong protection matters, placed somewhere visible on the image. For subtle branding instead, 15 to 30 percent in a corner is usually enough. The right balance depends on the photo: the mark should be easy to spot if someone looks, without shouting over the picture itself.' }
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
    howItWorks: 'The reader draws your image onto a canvas and hands the pixels to a QR decoding library, which scans them for the finder patterns that mark a QR code and then decodes the grid inside. If a code is found, its contents are shown as text. Links are presented so you can open or copy them, and plain text can be copied as-is. No camera is involved at any point, which is why screenshots work so well here: a crisp screenshot of a code decodes just as reliably as a photograph of one, as long as the code is complete and not badly blurred.',
    privacy: 'QR code decoding happens entirely in your browser—your images are never uploaded to any server.',
    faqs: [
      { question: 'How do I decode QR code online?', answer: 'You decode a QR code online by adding an image that contains the code, and this reader does the rest without any camera. It scans the pixels, locates the code, and shows you what is inside it. If the code holds a link, you can open it or copy it; if it holds plain text, you can copy that instead.' },
      { question: 'Can I read QR code from screenshot?', answer: 'Yes, you can read a QR code from a screenshot, which is exactly what this tool is built for. Take a screenshot of any code on your phone, computer, or TV screen, add the screenshot here, and decode it. Cropped screenshots and photos of screens also work, as long as the whole code is visible and not badly blurred.' },
      { question: 'How does a QR code scanner without app work?', answer: 'A QR code scanner without an app works by analysing a saved image instead of a live camera feed. You add a picture containing a code, and a decoding library in your browser searches the pixels for the code\'s finder patterns, then reads the grid inside. It is handy when you cannot install scanner apps, or the code is already on your screen.' },
      { question: 'What happens after the QR code is decoded?', answer: 'After the QR code is decoded, what you see depends on what the code contains. A URL appears as a clickable link you can open directly, and plain text appears with a copy button. Contact details, Wi-Fi credentials, and other data types are shown in a readable form with copy options, so you can use the information straight away.' }
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
    howItWorks: 'The invoice is drawn as a real PDF document, field by field, from the details you type in: your business information, the client, the invoice number and dates, and each line item with its quantity and price. The maths is done as you go. Line totals multiply quantity by price, the subtotal adds every line, your tax rate is applied on top of the subtotal, and the total is the two combined. If you add your logo, it is placed at the top of the document with your business details. When the numbers look right, one click generates the finished PDF, ready to send or file.',
    privacy: 'Invoice generation happens entirely in your browser—your business details and client information never leave your device.',
    faqs: [
      { question: 'Is this really a free invoice generator?', answer: 'Yes, this is a genuinely free invoice generator with no watermarks and no account needed to start. Your free plan covers 10 actions a day across all of Snaptoria\'s tools, and Pro at $9 a month removes that limit. Your business and client details stay private, because the invoice is generated in your browser and never sent to a server.' },
      { question: 'How do I create invoice online free?', answer: 'You create an invoice online free by filling in your business information at the top, adding your client\'s details, and entering a line item for each product or service. Set a tax rate if one applies, and the tool works out the line totals, subtotal, tax, and grand total as you type. Click download and your finished PDF is ready.' },
      { question: 'How does invoice template generator PDF export work?', answer: 'The invoice template generator\'s PDF export works by turning your completed form into a real PDF document in your browser. Click Generate PDF and it builds the invoice field by field, with your logo if you added one, automatic totals, and clean formatting throughout. The finished file suits printing or attaching to an email, and nothing leaves your device.' },
      { question: 'Can I make invoice PDF online with my logo?', answer: 'Yes, you can make an invoice PDF online with your logo by uploading the logo image while you fill in the form. It appears at the top of the invoice alongside your business details, which keeps your branding consistent for clients. The logo is placed and sized automatically for the PDF layout, and any common image format works.' }
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
    angle: 'Receipts serve important business functions: expense tracking for tax purposes, documentation for reimbursements, proof of purchase for warranty claims, and transaction records for bookkeeping. This free receipt maker works for many everyday cases — a restaurant or café issuing a customer receipt, a freelancer billing a client, a small shop recording a cash sale, or an employee documenting an expense for reimbursement. Add each item on its own line with quantity and price to create a clear itemized receipt, include tax where it applies, and note the payment method (cash, card, or transfer). Use this generator to create receipts for real, documented transactions in your business operations. Professional formatting makes records clear and audit-ready, and the finished receipt downloads as a clean PDF you can print, email, or attach to an expense report.',
    howItWorks: 'The receipt generator takes the same details you would write on a paper receipt and typesets them into a clean PDF: your business name and details at the top, the date and receipt number, then each purchased item on its own line with its price. Line prices add up to the subtotal, tax is calculated on top when you include it, and the total and payment method close the document out. The layout is deliberately plain and narrow, like a real receipt, so it reads naturally when printed or attached to an expense report. Everything is generated in your browser from the numbers you entered, and the PDF downloads ready to keep.',
    privacy: 'Receipt generation happens entirely in your browser—your transaction details never leave your device.',
    faqs: [
      { question: 'How do I make a receipt online?', answer: 'You make a receipt online by entering your business information, the customer name if you need one, each item purchased with its price, and the payment method. The generator typesets everything into a clean receipt, totals it up, and you download it as a PDF. No account is needed, and the whole process happens in your browser.' },
      { question: 'Is this receipt maker really free, with no watermark?', answer: 'Yes, this receipt maker is genuinely free and adds no watermark to your receipts. There is no signup to complete before you start. The free plan covers 10 actions a day across all of Snaptoria\'s tools, and if you regularly need more, Pro at $9 a month removes the limit. One receipt or many, the PDF comes out clean.' },
      { question: 'How do I make a restaurant receipt?', answer: 'You make a restaurant receipt by putting your restaurant\'s name and details at the top, then adding each dish or drink as its own line item with its price. Include tax where it applies, let the tool total everything, and note whether the customer paid by cash or card. Download the PDF and it is ready to print or email.' },
      { question: 'Can I create an itemized receipt for an expense report?', answer: 'Yes, you can create an itemized receipt for an expense report by adding every purchase as a separate line item with its quantity and price. Expense teams and accountants prefer itemized receipts because they show exactly what was bought, line by line, instead of one unexplained total. The PDF attaches easily to reimbursement forms and expense systems.' },
      { question: 'What should a receipt include?', answer: 'A complete receipt includes your business name and contact details, the date of the transaction, a receipt number, and each item or service with its price. It should also show any tax charged, the total amount, and how the customer paid. This template covers all of those fields, so the receipts you generate hold up as proper business records.' },
      { question: 'How do I create a receipt PDF for business records?', answer: 'You create a receipt PDF for business records by filling in the details of a real transaction, itemizing the purchases with prices, and adding the payment method and date before you download. Keep the file with your records for tax documentation, expense verification, and bookkeeping. A clear, itemized PDF is far easier to audit later than a paper slip.' },
      { question: 'Can freelancers and small businesses use this receipt generator?', answer: 'Yes, freelancers and small businesses can use this receipt generator to give customers professional proof of payment without buying accounting software. Sole traders, market sellers, and small shops all use it for everyday sales. It works for services as well as products: just describe the service as a line item with its price, like any other purchase.' },
      { question: 'What payment methods can I include on a receipt?', answer: 'You can include any payment method on a receipt, including cash, credit card, debit card, check, bank transfer, PayPal, and Venmo. The payment field accepts custom text, so you are never forced into a preset list. Type whatever your business actually accepted, and the receipt will match how the customer really paid, which keeps your records accurate.' },
    ]
  }
}

/** Corner-anchored wave closing the branded band (same geometry as the homepage WaveDivider). */
function BandWave() {
  return (
    <div aria-hidden className="relative mt-6 -mb-px leading-none">
      <svg
        viewBox="0 0 1440 60"
        preserveAspectRatio="none"
        className="block h-8 w-full text-white md:h-10"
      >
        <path
          d="M0,60 L0,30 C180,54 340,58 520,42 C700,26 820,6 980,12 C1140,18 1280,46 1440,28 L1440,60 Z"
          fill="currentColor"
        />
      </svg>
    </div>
  )
}

/** Mascot host per tool category: avatar + one factual line in the site's voice. */
const categoryHosts: Record<string, { img: string; line: string }> = {
  'Image Processing': {
    img: '/mascot.webp',
    line: 'I work right here in your browser. Nothing gets uploaded, ever.',
  },
  'Image Analysis': {
    img: '/mascot-shutter.webp',
    line: 'I read the numbers hidden inside your file and explain what they mean.',
  },
  'Document Tools': {
    img: '/mascot-photo.webp',
    line: 'I build your document on this device. It never leaves your hands.',
  },
}

export function ToolLayout({ tool, children }: ToolLayoutProps) {
  const content = toolContent[tool.id]
  const host = categoryHosts[tool.category]
  const priorityToolIds = ['image-compressor', 'image-to-pdf', 'image-format-converter', 'qr-code-reader', 'corrupt-image-detector', 'dpi-checker', 'receipt-generator', 'image-resizer']
  const sameCategory = tools.filter((t) => t.id !== tool.id && t.category === tool.category)
  const priorityTools = priorityToolIds
    .map((id) => tools.find((t) => t.id === id))
    .filter((t): t is Tool => Boolean(t) && t!.id !== tool.id)
  const seenIds = new Set<string>()
  const relatedTools = [...sameCategory, ...priorityTools].filter((t) => {
    if (seenIds.has(t.id)) return false
    seenIds.add(t.id)
    return true
  }).slice(0, 6)

  return (
    <>
      <ToolSchema tool={tool} />
      <BreadcrumbSchema tool={tool} />
      {content && <FaqSchema faqs={content.faqs} />}
      {content && <HowToSchema name={`How to Use ${tool.name}`} steps={content.howTo} />}
      <section className="relative overflow-hidden bg-gradient-to-br from-sky-500 via-blue-700 to-blue-800 text-white">
        <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-sky-400/30 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -left-32 bottom-0 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl" />
        <div className="container relative mx-auto px-4 pt-8 sm:px-6 md:pt-12 lg:px-8">
          <Link href="/" className="mb-6 inline-flex items-center text-sm text-sky-100 transition-colors hover:text-white">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to all tools
          </Link>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <div className="group w-40 shrink-0 rounded-2xl bg-white/10 p-3 ring-1 ring-white/25 backdrop-blur-sm md:w-56 [&_.tool-visual]:mb-0">
              <ToolCardVisual toolId={tool.id} />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="mb-4 text-3xl font-bold text-white md:text-4xl">{content?.h1 || tool.name}</h1>
              <p id="tool-answer" className="max-w-3xl text-lg text-white/90">{content?.intro || tool.description}</p>
              <div className="mt-5 flex flex-wrap gap-2.5">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white ring-1 ring-white/25">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Runs 100% in your browser
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white ring-1 ring-white/25">
                  <CloudOff className="h-3.5 w-3.5" />
                  Files never uploaded
                </span>
              </div>
            </div>
            {host && (
              <img
                src={host.img}
                alt=""
                className="hidden h-40 w-40 shrink-0 self-center rounded-full bg-white object-cover shadow-xl ring-4 ring-white/30 lg:block xl:h-44 xl:w-44"
              />
            )}
          </div>
        </div>
        <BandWave />
      </section>

      <section className="bg-white pb-12 md:pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative z-10 -mt-4 rounded-3xl bg-white p-4 shadow-xl ring-1 ring-sky-100 sm:p-6 md:-mt-6 md:p-8">
            {children}

          </div>
        </div>
      </section>

      {content && (
        <>
          <section className="bg-sky-50 py-12 md:py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="mb-6 text-2xl font-bold text-gray-900">How to Use</h2>
              <ol className="grid gap-4 md:grid-cols-3">
                {content.howTo.map((item) => (
                  <li key={item.step} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-sky-100">
                    <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-blue-700 font-bold text-white shadow">
                      {item.step}
                    </span>
                    <p className="text-gray-700">{item.text}</p>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {content.angle && (
            <section className="bg-white py-12 md:py-16">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="mb-4 text-2xl font-bold text-gray-900">Key Features</h2>
                <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-sky-100 md:p-8">
                  <p className="leading-relaxed text-gray-600">{content.angle}</p>
                </div>
              </div>
            </section>
          )}

          <section className="bg-sky-50 py-12 md:py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              {host && (
                <div className="mb-10 flex items-center gap-4">
                  <img
                    src={host.img}
                    alt=""
                    className="h-16 w-16 shrink-0 rounded-full bg-white object-cover shadow-md ring-2 ring-white md:h-20 md:w-20"
                  />
                  <div className="relative rounded-2xl bg-white px-5 py-3.5 shadow-sm">
                    <span aria-hidden className="absolute -left-1.5 top-1/2 h-3 w-3 -translate-y-1/2 rotate-45 bg-white" />
                    <p className="relative text-gray-700">{host.line}</p>
                  </div>
                </div>
              )}
              {content.howItWorks && (
                <div>
                  <h2 className="mb-4 text-2xl font-bold text-gray-900">How It Works</h2>
                  <p className="leading-relaxed text-gray-600">{content.howItWorks}</p>
                </div>
              )}
              <p className="mt-8 italic text-gray-500">{content.privacy}</p>
            </div>
          </section>

          {content.faqs.length > 0 && (
            <section id="faq" className="bg-white py-12 md:py-16">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="mb-6 text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
                <div className="space-y-4">
                  {content.faqs.map((faq, i) => (
                    <div key={i} className="flex gap-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-sky-100">
                      <span aria-hidden className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-sky-500 font-bold text-white">
                        ?
                      </span>
                      <div>
                        <h3 className="mb-2 font-semibold text-gray-900">{faq.question}</h3>
                        <p className="text-gray-600">{faq.answer}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </>
      )}

      {relatedTools.length > 0 && (
        <section className="bg-sky-50 py-12 md:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">Related & Popular Tools</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {relatedTools.map((relatedTool) => (
                <Link
                  key={relatedTool.id}
                  href={`/tools/${relatedTool.id}`}
                  className="group block rounded-2xl bg-white p-4 shadow-sm ring-1 ring-sky-100 transition hover:shadow-md"
                >
                  <ToolCardVisual toolId={relatedTool.id} />
                  <div className="flex items-center justify-between gap-2 px-1 pb-1">
                    <div>
                      <h3 className="font-semibold text-gray-900">{relatedTool.name}</h3>
                      <p className="text-sm text-gray-500">{relatedTool.category}</p>
                    </div>
                    <ArrowRight className="h-5 w-5 flex-shrink-0 text-sky-500 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
