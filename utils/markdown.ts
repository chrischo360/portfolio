import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import { Writing } from '../types/writing';

const writingDirectory = path.join(process.cwd(), 'content/writing');

export async function getWritingData(slug: string): Promise<Writing> {
  const fullPath = path.join(writingDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  const { data, content } = matter(fileContents);

  const processedContent = await remark().use(html).process(content);
  const contentHtml = processedContent.toString();

  return {
    id: slug,
    slug,
    content: contentHtml,
    title: data.title,
    publishedDate: data.publishedDate,
    tags: data.tags,
    excerpt: data.excerpt,
  };
}

export function getAllWritingSlugs() {
  const fileNames = fs.readdirSync(writingDirectory);
  return fileNames.map(fileName => {
    return fileName.replace(/\.md$/, '');
  });
}

export async function getAllWriting(): Promise<Writing[]> {
  const slugs = getAllWritingSlugs();
  const allWritingData = await Promise.all(
    slugs.map(async slug => {
      return getWritingData(slug);
    })
  );

  return allWritingData.sort((a, b) => {
    return a.publishedDate < b.publishedDate ? 1 : -1;
  });
}
