const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const app = express();

// Multer configuration for file uploads
const upload = multer({
  dest: path.join(__dirname, 'uploads'),
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'Swiftshare')));

// Users database (simple JSON file storage)
const usersFile = path.join(__dirname, 'users.json');
const filesDB = path.join(__dirname, 'files.json');

function loadUsers() {
  if (fs.existsSync(usersFile)) {
    const data = fs.readFileSync(usersFile, 'utf8');
    return JSON.parse(data);
  }
  return [];
}

function saveUsers(users) {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

function loadFiles() {
  if (fs.existsSync(filesDB)) {
    const data = fs.readFileSync(filesDB, 'utf8');
    return JSON.parse(data);
  }
  return {};
}

function saveFiles(files) {
  fs.writeFileSync(filesDB, JSON.stringify(files, null, 2));
}

function generateCode() {
  return Math.random().toString(36).substring(2, 12).toUpperCase();
}

// API: Login Free (Quick access)
app.post('/api/login-free', (req, res) => {
  const { email, name } = req.body;

  if (!email || !name) {
    return res.json({ success: false, message: 'Email and name are required' });
  }

  // Add user to free access list
  const users = loadUsers();
  const existingUser = users.find(u => u.email === email && u.mode === 'free');
  
  if (!existingUser) {
    users.push({
      email,
      name,
      mode: 'free',
      createdAt: new Date(),
      accessToken: require('crypto').randomBytes(16).toString('hex')
    });
    saveUsers(users);
  }

  res.json({
    success: true,
    message: 'Quick access granted',
    user: { email, name, mode: 'free' }
  });
});

// API: Login (Account based)
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({ success: false, message: 'Email and password are required' });
  }

  const users = loadUsers();
  let user = users.find(u => u.email === email && u.mode === 'premium');

  if (!user) {
    // Create new premium account
    const hashedPassword = require('crypto')
      .createHash('sha256')
      .update(password)
      .digest('hex');

    user = {
      email,
      password: hashedPassword,
      mode: 'premium',
      createdAt: new Date(),
      accessToken: require('crypto').randomBytes(16).toString('hex')
    };
    users.push(user);
    saveUsers(users);
    
    return res.json({
      success: true,
      message: 'Account created and logged in',
      user: { email, mode: 'premium' }
    });
  } else {
    // Verify password
    const hashedPassword = require('crypto')
      .createHash('sha256')
      .update(password)
      .digest('hex');

    if (user.password === hashedPassword) {
      return res.json({
        success: true,
        message: 'Login successful',
        user: { email, mode: 'premium' }
      });
    } else {
      return res.json({
        success: false,
        message: 'Invalid password'
      });
    }
  }
});

// API: Get user info
app.get('/api/user/:email', (req, res) => {
  const { email } = req.params;
  const users = loadUsers();
  const user = users.find(u => u.email === email);

  if (user) {
    res.json({ success: true, user: { email: user.email, name: user.name, mode: user.mode } });
  } else {
    res.json({ success: false, message: 'User not found' });
  }
});

// API: File Conversion (Direct download)
app.post('/api/convert', upload.single('file'), (req, res) => {
  const { conversionType } = req.body;

  console.log('Convert request:', { conversionType, fileName: req.file?.originalname, fileSize: req.file?.size });

  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  if (!conversionType) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(400).json({ message: 'Conversion type required' });
  }

  try {
    const inputFile = req.file.path;
    const originalName = req.file.originalname || 'file';
    const outputExtension = getOutputExtension(conversionType);
    const fileName = `converted_${Date.now()}${outputExtension}`;
    const outputFile = path.join(uploadsDir, fileName);

    console.log('Converting file:', { inputFile, outputFile, conversionType });

    // Simulate conversion by copying the file
    // In production, integrate actual conversion libraries
    fs.copyFileSync(inputFile, outputFile);
    fs.unlinkSync(inputFile);

    console.log('Conversion successful, downloading:', fileName);

    // Set proper headers for file download
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(fileName)}"`);
    res.setHeader('Content-Type', 'application/octet-stream');
    
    res.download(outputFile, fileName, (err) => {
      if (err) console.error('Download error:', err);
      // Clean up output file after sending
      setTimeout(() => {
        if (fs.existsSync(outputFile)) {
          try {
            fs.unlinkSync(outputFile);
          } catch(e) {
            console.log('Cleanup error:', e);
          }
        }
      }, 1000);
    });
  } catch (err) {
    console.error('Conversion error:', err);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: 'Conversion failed: ' + err.message });
  }
});

// Helper function to get output file extension
function getOutputExtension(conversionType) {
  const extensionMap = {
    'PDF to Word': '.docx',
    'PDF to Excel': '.xlsx',
    'PDF to PPT': '.pptx',
    'PDF to JPG': '.jpg',
    'PDF to PNG': '.png',
    'PDF to TXT': '.txt',
    'PDF to HTML': '.html',
    'Word to PDF': '.pdf',
    'Excel to PDF': '.pdf',
    'PPT to PDF': '.pdf',
    'JPG to PDF': '.pdf',
    'PNG to PDF': '.pdf',
    'TXT to PDF': '.pdf',
    'HTML to PDF': '.pdf'
  };
  return extensionMap[conversionType] || '.out';
}

// API: Quicker Convert (with code generation and proper handling)
app.post('/api/quicker-convert', upload.single('file'), (req, res) => {
  const { conversionType } = req.body;
  
  console.log('Quicker convert request:', { conversionType, fileSize: req.file?.size });

  if (!req.file) {
    console.error('No file received');
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  if (!conversionType) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    console.error('No conversion type specified');
    return res.status(400).json({ success: false, message: 'Conversion type required' });
  }

  try {
    const inputFile = req.file.path;
    const originalFileName = req.file.originalname || 'file';
    const fileExtension = path.extname(originalFileName);
    const outputExtension = getOutputExtension(conversionType) || fileExtension;
    const code = generateCode();
    const outputFile = path.join(uploadsDir, `${code}${outputExtension}`);

    console.log('Converting file:', { code, outputExtension, inputFile, outputFile });

    // Simulate conversion by copying the file
    // In production, add actual conversion using libraries like:
    // - sharp (image conversion)
    // - pdf-lib (PDF conversion)
    // - imagemin (compression)
    fs.copyFileSync(inputFile, outputFile);
    fs.unlinkSync(inputFile);

    // Store file info in database
    const files = loadFiles();
    files[code] = {
      filePath: outputFile,
      fileName: `converted_${Date.now()}${outputExtension}`,
      originalFileName: originalFileName,
      conversionType: conversionType,
      fileSize: req.file.size,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
    };
    saveFiles(files);

    console.log('Conversion successful:', { code });
    res.json({
      success: true,
      code: code,
      fileName: files[code].fileName,
      fileSize: req.file.size,
      message: 'File converted and code generated'
    });

  } catch (err) {
    console.error('Quicker conversion error:', err);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ success: false, message: 'Conversion failed: ' + err.message });
  }
});

// API: Compress file (Quicker feature specifically)
app.post('/api/compress', upload.single('file'), (req, res) => {
  console.log('Compress request:', { fileSize: req.file?.size });

  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  try {
    const inputFile = req.file.path;
    const originalFileName = req.file.originalname || 'file';
    const code = generateCode();
    const outputFile = path.join(uploadsDir, `${code}_compressed.zip`);

    console.log('Compressing file:', { code, inputFile, outputFile });

    // Simulate compression by copying the file
    // In production, use 'archiver' or 'pako' for real compression
    fs.copyFileSync(inputFile, outputFile);
    fs.unlinkSync(inputFile);

    // Store file info
    const files = loadFiles();
    files[code] = {
      filePath: outputFile,
      fileName: `${originalFileName}_compressed.zip`,
      originalFileName: originalFileName,
      conversionType: 'Compression',
      fileSize: req.file.size,
      compressedSize: fs.statSync(outputFile).size,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    };
    saveFiles(files);

    res.json({
      success: true,
      code: code,
      fileName: files[code].fileName,
      originalSize: req.file.size,
      message: 'File compressed successfully'
    });

  } catch (err) {
    console.error('Compression error:', err);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ success: false, message: 'Compression failed: ' + err.message });
  }
});

// API: Retrieve file using code
app.get('/api/retrieve-file/:code', (req, res) => {
  const { code } = req.params;
  const files = loadFiles();

  if (!files[code]) {
    console.log('File not found for code:', code);
    return res.status(404).json({ success: false, message: 'File not found or code expired' });
  }

  const fileInfo = files[code];
  const filePath = fileInfo.filePath;

  if (!fs.existsSync(filePath)) {
    console.log('File path does not exist:', filePath);
    return res.status(404).json({ success: false, message: 'File not found on server' });
  }

  try {
    const fileName = fileInfo.fileName || `file_${code}`;
    console.log('Downloading file:', { code, filePath, fileName });
    
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(fileName)}"`);
    res.setHeader('Content-Type', 'application/octet-stream');
    
    res.download(filePath, fileName, (err) => {
      if (err) console.error('Download error:', err);
    });
  } catch(err) {
    console.error('Download error:', err);
    res.status(500).json({ success: false, message: 'Download failed: ' + err.message });
  }
});

// API: Get file info (for preview before download)
app.get('/api/file-info/:code', (req, res) => {
  const { code } = req.params;
  const files = loadFiles();

  if (!files[code]) {
    return res.json({ success: false, message: 'File not found or code expired' });
  }

  res.json({
    success: true,
    fileName: files[code].fileName,
    conversionType: files[code].conversionType,
    createdAt: files[code].createdAt
  });
});

// Cleanup expired files (run every hour)
setInterval(() => {
  const files = loadFiles();
  const now = new Date();
  let cleaned = false;

  for (const code in files) {
    const expiryDate = new Date(files[code].expiresAt);
    if (now > expiryDate) {
      try {
        if (fs.existsSync(files[code].filePath)) {
          fs.unlinkSync(files[code].filePath);
        }
      } catch (err) {
        console.error('Cleanup error:', err);
      }
      delete files[code];
      cleaned = true;
    }
  }

  if (cleaned) {
    saveFiles(files);
  }
}, 60 * 60 * 1000); // 1 hour

// Serve index.html for root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Swiftshare', 'index.html'));
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
