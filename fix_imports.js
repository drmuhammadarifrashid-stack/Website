const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src');

function walkDir(dir) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        if (isDirectory) {
            walkDir(dirPath);
        } else if (dirPath.endsWith('.tsx') || dirPath.endsWith('.ts')) {
            let content = fs.readFileSync(dirPath, 'utf8');
            let newContent = content
                .replace(/@\/components\/ui\/Button/g, '@/components/ui/button')
                .replace(/@\/components\/ui\/Card/g, '@/components/ui/card')
                .replace(/@\/components\/ui\/Badge/g, '@/components/ui/badge')
                .replace(/\.\.\/ui\/Button/g, '../ui/button')
                .replace(/\.\.\/ui\/Card/g, '../ui/card')
                .replace(/\.\.\/ui\/Badge/g, '../ui/badge');
            if (content !== newContent) {
                fs.writeFileSync(dirPath, newContent);
                console.log('Updated: ' + dirPath);
            }
        }
    });
}
walkDir(directoryPath);
