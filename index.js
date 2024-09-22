const express = require('express');
const cors = require('cors');
const app = express();

// Middleware to handle CORS and JSON input
app.use(cors());
app.use(express.json());

app.route("/bfhl")
  .get((req, res) => {
    // Hardcoded response for GET method
    res.status(200).json({ operation_code: 1 });
  })
  .post((req, res) => {
    const data = req.body.data || [];
    const fileB64 = req.body.file_b64 || '';
    const numbers = [];
    const alphabets = [];
    let highestLowercaseAlphabet = "";

    // Separate numbers and alphabets
    for (const item of data) {
      if (!isNaN(item)) {
        numbers.push(item);
      } else if (item.length === 1 && isNaN(item)) {
        alphabets.push(item);

        // Check if the item is lowercase and compare alphabetically
        if (item === item.toLowerCase()) {
          if (!highestLowercaseAlphabet || item > highestLowercaseAlphabet) {
            highestLowercaseAlphabet = item;
          }
        }
      }
    }

    // File validation logic
    let fileValid = false;
    let fileMimeType = '';
    let fileSizeKb = 0;

    if (fileB64) {
      try {
        // Decode base64 and calculate file size
        const buffer = Buffer.from(fileB64, 'base64');
        fileSizeKb = (buffer.length / 1024).toFixed(2);  // size in KB

        // Determine MIME type (this is a basic check)
        if (fileB64.startsWith('/9j')) {
          fileMimeType = 'image/jpeg';
          fileValid = true;
        } else if (fileB64.startsWith('iVBOR')) {
          fileMimeType = 'image/png';
          fileValid = true;
        } else if (fileB64.startsWith('JVBER')) {
          fileMimeType = 'application/pdf';
          fileValid = true;
        } else {
          fileMimeType = 'unknown';
        }
      } catch (err) {
        fileValid = false;
      }
    }

    // Response structure
    res.json({
      is_success: true,
      user_id: "john_doe_17091999",  // Hardcoded user_id
      email: "john@xyz.com",         // Hardcoded email
      roll_number: "ABCD123",        // Hardcoded roll number
      numbers: numbers,
      alphabets: alphabets,
      highest_lowercase_alphabet: highestLowercaseAlphabet ? [highestLowercaseAlphabet] : [],
      file_valid: fileValid,
      file_mime_type: fileMimeType,
      file_size_kb: fileSizeKb
    });
  });

// Start server on port 4000
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
