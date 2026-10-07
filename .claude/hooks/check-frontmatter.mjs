import { existsSync, readFileSync } from 'node:fs';
import { relative, resolve } from 'node:path';

const input = JSON.parse(readFileSync(0, 'utf8') || '{}');
const file = input.tool_response?.filePath ?? input.tool_input?.file_path;
if (!file) process.exit(0);

const root = process.env.CLAUDE_PROJECT_DIR || process.cwd();
const abs = resolve(root, file);
const rel = relative(root, abs).split('\\').join('/');

const rules = [
  [
    /^src\/content\/blog\/[^/]+\/index\.md$/,
    ['title', 'description', 'pubDate'],
  ],
  [
    /^src\/content\/projects\/[^/]+\/index\.md$/,
    ['title', 'description', 'date'],
  ],
];
const rule = rules.find(([re]) => re.test(rel));
if (!rule || !existsSync(abs)) process.exit(0);

const match = readFileSync(abs, 'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---/);
if (!match) {
  console.error(`${rel}: missing frontmatter block.`);
  process.exit(2);
}

const data = match[1];
const problems = [];
for (const key of rule[1]) {
  const line = data.match(new RegExp(`^${key}:[ \\t]*(.*)$`, 'm'));
  const value = line?.[1].trim().replace(/^['"]|['"]$/g, '');
  if (!value) problems.push(`'${key}' is missing or empty`);
  else if (/^(pubDate|date)$/.test(key) && !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    problems.push(`'${key}' must be YYYY-MM-DD (got '${value}')`);
  }
}

if (problems.length) {
  console.error(`${rel}: ${problems.join('; ')}.`);
  process.exit(2);
}
