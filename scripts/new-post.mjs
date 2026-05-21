import fs from 'fs';
import path from 'path';

const title = process.argv[2] || 'hello world';
const slug = title.toLowerCase().replace(/\s+/g, '-');
const date = new Date().toISOString().split('T')[0];

const template = `---
title: "${title}"
description: "securi"
pubDate: ${date}
tags: ["hello"]
---

# ${title}

在此開始撰寫內容...
`;

const fileName = `${slug}.md`;
const filePath = path.join(process.cwd(), 'src/content/blog', fileName);

if (fs.existsSync(filePath)) {
  console.error(`❌ 錯誤: 檔案 ${fileName} 已經存在了！`);
} else {
  fs.writeFileSync(filePath, template);
  console.log(`✅ 成功建立新文章: ${filePath}`);
}
