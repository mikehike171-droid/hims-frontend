const fs = require('fs');
const path = require('path');

const dirPath = path.join('c:', 'himsworkingcode', 'hims', 'frontend', 'app', 'blog', ' [slug]');
console.log('Target path:', dirPath);

if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true });
    console.log('Successfully deleted:', dirPath);
} else {
    console.log('Path does not exist:', dirPath);
}
