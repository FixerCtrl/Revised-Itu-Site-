import { readdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const [siteOrigin, outputDirectory = process.cwd()] = process.argv.slice(2);
if (!siteOrigin) {
  console.error('Usage: node generate-site-files.mjs https://your-public-domain.example [output-directory]');
  process.exitCode = 1;
} else {
  const base = new URL(siteOrigin);
  if (base.protocol !== 'https:' || base.username || base.password || base.search || base.hash) {
    throw new Error('The public site URL must be HTTPS and must not contain credentials, a query, or a fragment.');
  }
  base.pathname = `${base.pathname.replace(/\/+$/, '')}/`;

  const output = resolve(outputDirectory);
  const files = await readdir(process.cwd());
  const pages = files.filter(file => file.endsWith('.html')).sort();
  const content = JSON.parse(await readFile(resolve(process.cwd(), 'content.json'), 'utf8'));
  if (!Array.isArray(content.articles)) throw new Error('content.json must contain an articles array.');

  const absoluteUrl = path => new URL(path, base).href;
  const escapeXml = value => String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
  const pageUrls = pages.map(page => absoluteUrl(page));
  const articleUrls = content.articles.map(article => {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(article.slug)) {
      throw new Error(`Invalid article slug: ${article.slug}`);
    }
    return absoluteUrl(`insights.html?post=${encodeURIComponent(article.slug)}`);
  });
  const sitemap = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...[...pageUrls, ...articleUrls].map(url => `  <url><loc>${escapeXml(url)}</loc></url>`),
    '</urlset>',
    ''
  ].join('\n');

  const articles = [...content.articles].sort((a, b) => b.date.localeCompare(a.date));
  const latestDate = articles[0]?.date;
  const items = articles.map(article => {
    if (!article.title || !article.date || !article.excerpt || Number.isNaN(Date.parse(`${article.date}T00:00:00Z`))) {
      throw new Error(`Article ${article.slug} needs a title, valid YYYY-MM-DD date, and excerpt.`);
    }
    const link = absoluteUrl(`insights.html?post=${encodeURIComponent(article.slug)}`);
    return [
      '<item>',
      `<title>${escapeXml(article.title)}</title>`,
      `<link>${escapeXml(link)}</link>`,
      `<guid isPermaLink="true">${escapeXml(link)}</guid>`,
      `<pubDate>${new Date(`${article.date}T00:00:00Z`).toUTCString()}</pubDate>`,
      `<description>${escapeXml(article.excerpt)}</description>`,
      '</item>'
    ].join('');
  }).join('\n');
  const feed = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0"><channel>',
    `<title>${escapeXml('Itumeleng D. Kgongwane — Insights')}</title>`,
    `<link>${escapeXml(absoluteUrl('insights.html'))}</link>`,
    `<description>${escapeXml('Articles on engineering, finance, innovation and leadership.')}</description>`,
    latestDate ? `<lastBuildDate>${new Date(`${latestDate}T00:00:00Z`).toUTCString()}</lastBuildDate>` : '',
    items,
    '</channel></rss>',
    ''
  ].filter(Boolean).join('\n');
  const robots = `User-agent: *\nAllow: /\nSitemap: ${absoluteUrl('sitemap.xml')}\n`;

  await Promise.all([
    writeFile(resolve(output, 'sitemap.xml'), sitemap),
    writeFile(resolve(output, 'feed.xml'), feed),
    writeFile(resolve(output, 'robots.txt'), robots)
  ]);
  console.log(`Generated sitemap.xml, feed.xml, and robots.txt for ${base.origin}${base.pathname === '/' ? '' : base.pathname}`);
}
