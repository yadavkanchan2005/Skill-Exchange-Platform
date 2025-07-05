import multer from 'multer';
import path from 'path';


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); 
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});


const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(
            new Error(
                `Only JPEG, PNG, JPG, and PDF files are allowed! You uploaded: ${file.originalname} (${file.mimetype})`
            ),
            false
        );
    }
};

const upload = multer({ storage, fileFilter });

export default upload;


// import multer from 'multer';
// import path from 'path';

// // Storage config
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'uploads/');
//     },
//     filename: function (req, file, cb) {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//         const ext = path.extname(file.originalname);
//         cb(null, file.fieldname + '-' + uniqueSuffix + ext);
//     }
// });

// // Allowed MIME types
// const allowedTypes = [
//     // Images
//     'image/jpeg',
//     'image/png',
//     'image/jpg',
//     'image/gif',
//     'image/webp',

//     // Videos
//     'video/mp4',
//     'video/x-matroska', // mkv
//     'video/quicktime',  // mov
//     'video/x-msvideo',  // avi

//     // Audio
//     'audio/mpeg',  // mp3
//     'audio/wav',
//     'audio/ogg',
//     'audio/mp4',

//     // Documents
//     'application/pdf',
//     'text/plain',
//     'application/msword', // .doc
//     'application/vnd.openxmlformats-officedocument.wordprocessingml.document' // .docx
// ];

// // File filter
// const fileFilter = (req, file, cb) => {
//     if (allowedTypes.includes(file.mimetype)) {
//         cb(null, true);
//     } else {
//         cb(
//             new Error(
//                 `Unsupported file type: ${file.originalname} (${file.mimetype})`
//             ),
//             false
//         );
//     }
// };

// // Upload middleware
// const upload = multer({ storage, fileFilter });

// export default upload;
