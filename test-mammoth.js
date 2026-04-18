const fs = require('fs');
const mammoth = require('mammoth');
async function run() {
  const file = fs.readFileSync('package.json'); // just a dummy
  try {
    await mammoth.convertToHtml({ arrayBuffer: file.buffer });
  } catch(e) {
    console.error("error:", e);
  }
}
run();
