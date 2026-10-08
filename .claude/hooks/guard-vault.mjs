import { readFileSync } from 'node:fs';
import { relative, resolve } from 'node:path';

const input = JSON.parse(readFileSync(0, 'utf8') || '{}');
const file = input.tool_input?.file_path;
if (!file) process.exit(0);

const root = process.env.CLAUDE_PROJECT_DIR || process.cwd();
const rel = relative(root, resolve(root, file)).split('\\').join('/');
const protectedPaths = [
  'src/content/.obsidian/',
  'src/content/_bases/',
  'src/content/_GUIDE.md',
];

if (protectedPaths.some((p) => rel === p || rel.startsWith(p))) {
  console.error(
    `Blocked: ${rel} is a protected vault file. Ask the user to edit it by hand in Obsidian.`,
  );
  process.exit(2);
}
