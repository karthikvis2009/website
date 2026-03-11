const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
console.log(html.includes('cases/cases.html'));
console.log(html.includes('blogs/blogs.html'));
