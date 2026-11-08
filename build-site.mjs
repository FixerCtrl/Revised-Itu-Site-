import { cp, mkdir, readdir } from 'node:fs/promises';
import { extname, join, resolve } from 'node:path';

const outputDirectory = resolve(process.argv[2] || 'dist');
const rootDirectory = process.cwd();
if (outputDirectory === rootDirectory || !outputDirectory.startsWith(`${rootDirectory}/`)) {
  throw new Error('Build output must be a directory inside the repository and cannot be the repository root.');
}

await mkdir(outputDirectory, { recursive: true });
const files = await readdir(rootDirectory, { withFileTypes: true });
const publicExtensions = new Set(['.html', '.css', '.js', '.json', '.xml', '.txt']);

for (const entry of files) {
  const source = join(rootDirectory, entry.name);
  const destination = join(outputDirectory, entry.name);
  if (entry.isFile() && publicExtensions.has(extname(entry.name))) {
    await cp(source, destination);
  } else if (entry.isDirectory() && entry.name === 'images') {
    await cp(source, destination, { recursive: true });
  }
}

console.log(`Assembled the public site in ${outputDirectory}.`);
