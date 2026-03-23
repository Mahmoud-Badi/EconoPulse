#!/usr/bin/env node
/**
 * Build Review Portal — Master Kit
 *
 * Reads diagram .md files from a directory, auto-categorizes them,
 * inlines all content, and outputs a self-contained review-portal.html.
 *
 * Usage:
 *   node build-review-portal.js --dir ./dev_docs/comms/diagrams
 *   node build-review-portal.js --dir ./diagrams --name "My Project" --output ./portal.html
 *
 * Options:
 *   --dir <path>       Directory containing .md diagram files (required)
 *   --output <path>    Output HTML file (default: <dir>/review-portal.html)
 *   --name <string>    Project name (default: derived from directory)
 *   --abbr <string>    Brand abbreviation for logo (default: first letter)
 *   --color <hex>      Brand accent color (default: #818cf8)
 *   --template <path>  Path to template HTML (default: auto-detect)
 */

const fs = require('fs');
const path = require('path');

// ─── CLI ARGS ───
function parseArgs() {
  const args = process.argv.slice(2);
  const config = { dir: null, output: null, name: null, abbr: null, color: '#818cf8', template: null };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--dir':     config.dir = args[++i]; break;
      case '--output':  config.output = args[++i]; break;
      case '--name':    config.name = args[++i]; break;
      case '--abbr':    config.abbr = args[++i]; break;
      case '--color':   config.color = args[++i]; break;
      case '--template': config.template = args[++i]; break;
      default:
        if (!config.dir && !args[i].startsWith('--')) config.dir = args[i];
    }
  }

  if (!config.dir) {
    console.error('Error: --dir is required.\nUsage: node build-review-portal.js --dir <path>');
    process.exit(1);
  }

  config.dir = path.resolve(config.dir);
  if (!fs.existsSync(config.dir)) {
    console.error(`Error: Directory not found: ${config.dir}`);
    process.exit(1);
  }

  if (!config.output) config.output = path.join(config.dir, 'review-portal.html');
  if (!config.name) config.name = deriveProjectName(config.dir);
  if (!config.abbr) config.abbr = config.name.charAt(0).toUpperCase();

  return config;
}

function deriveProjectName(dir) {
  // Walk up to find a meaningful project name
  const base = path.basename(dir);
  if (base === 'diagrams') {
    const parent = path.basename(path.dirname(dir));
    if (parent === 'comms') {
      const grandparent = path.basename(path.dirname(path.dirname(dir)));
      if (grandparent === 'dev_docs') {
        return titleCase(path.basename(path.dirname(path.dirname(path.dirname(dir)))));
      }
      return titleCase(grandparent);
    }
    return titleCase(parent);
  }
  return titleCase(base);
}

function titleCase(str) {
  return str.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function toSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// ─── DISCOVER DIAGRAM FILES ───
const EXCLUDE_FILES = new Set([
  '_index.md', '_diagram-index.md', '_diagram-index.template.md',
  'DIAGRAM-GENERATION-SUITE.md', 'INTERACTIVE-MINDMAP-GENERATOR.md',
  'MASTER-mind-map-generator.md', 'DIAGRAM-REVIEW-PORTAL-KIT.md',
  'README.md',
]);

function discoverDiagrams(dir) {
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.md') && !EXCLUDE_FILES.has(f) && !f.endsWith('.template.md'))
    .sort();
}

// ─── PARSE INDEX ───
function parseIndex(dir) {
  const indexFiles = ['_index.md', '_diagram-index.md'];
  let indexPath = null;
  for (const f of indexFiles) {
    const p = path.join(dir, f);
    if (fs.existsSync(p)) { indexPath = p; break; }
  }
  if (!indexPath) return null;

  const content = fs.readFileSync(indexPath, 'utf-8');
  const categories = [];
  let currentCat = null;

  for (const line of content.split('\n')) {
    // Match category headings:
    //   ## Category N — Label (numbered style)
    //   ## Any Heading (generic — treated as a category if it has tables below)
    const catMatch = line.match(/^##\s+Category\s+\d+\s*[—:\-]\s*(.+)/i);
    const genericH2 = !catMatch && line.match(/^##\s+(.+)/);

    if (catMatch || genericH2) {
      const rawLabel = (catMatch ? catMatch[1] : genericH2[1]).trim();
      // Skip table header rows and separator lines
      if (rawLabel.startsWith('|') || rawLabel.startsWith('---')) continue;
      const label = rawLabel.replace(/\s*\(\d+\s+files?\)/i, '').replace(/\s*\(Pre-[\d.]+\)/i, '').trim();
      const id = toSlug(label);
      currentCat = { id, label, diagrams: [] };
      categories.push(currentCat);
      continue;
    }

    // Match table rows with filenames: | N | filename.md | ...
    if (currentCat && line.includes('|') && line.includes('.md')) {
      const cells = line.split('|').map(c => c.trim()).filter(c => c);
      for (const cell of cells) {
        const fileMatch = cell.match(/^([\w][\w.-]+\.md)$/);
        if (fileMatch) {
          const file = fileMatch[1];
          currentCat.diagrams.push({ file, label: labelFromFilename(file) });
          break;
        }
      }
    }
  }

  // Filter out empty categories and categories with no matching files
  return categories.filter(c => c.diagrams.length > 0);
}

// ─── AUTO-CATEGORIZE BY PREFIX ───
const PREFIX_MAP = [
  { prefixes: ['overview-', 'system-', 'feature-', 'dependency-', 'MASTER-'], id: 'overview', label: 'Overview' },
  { prefixes: ['svc-'], id: 'services', label: 'Services' },
  { prefixes: ['wf-'], id: 'workflows', label: 'Workflows' },
  { prefixes: ['sm-'], id: 'states', label: 'State Machines' },
  { prefixes: ['data-flow', 'df-'], id: 'dataflows', label: 'Data Flows' },
  { prefixes: ['int-'], id: 'integrations', label: 'Integrations' },
  { prefixes: ['xc-'], id: 'crosscutting', label: 'Cross-Cutting' },
  { prefixes: ['infra-'], id: 'infra', label: 'Infrastructure' },
  { prefixes: ['database-'], id: 'database', label: 'Database' },
  { prefixes: ['timeline-', 'milestone-', 'roadmap-'], id: 'timelines', label: 'Timelines' },
  { prefixes: ['auth-', 'mobile-'], id: 'authmobile', label: 'Auth & Mobile' },
  { prefixes: ['stakeholder-'], id: 'stakeholder', label: 'Stakeholder' },
];

function autoCategorize(files) {
  const buckets = {};
  const uncategorized = [];

  for (const file of files) {
    let matched = false;
    for (const rule of PREFIX_MAP) {
      if (rule.prefixes.some(p => file.startsWith(p))) {
        if (!buckets[rule.id]) buckets[rule.id] = { id: rule.id, label: rule.label, diagrams: [] };
        buckets[rule.id].diagrams.push({ file, label: labelFromFilename(file) });
        matched = true;
        break;
      }
    }
    if (!matched) uncategorized.push({ file, label: labelFromFilename(file) });
  }

  const categories = PREFIX_MAP
    .filter(r => buckets[r.id])
    .map(r => {
      const cat = buckets[r.id];
      // Update label with count for large categories
      if (cat.diagrams.length > 5) cat.label = `${cat.label} (${cat.diagrams.length})`;
      return cat;
    });

  if (uncategorized.length > 0) {
    categories.push({ id: 'other', label: 'Other', diagrams: uncategorized });
  }

  return categories;
}

function labelFromFilename(filename) {
  let name = filename.replace(/\.md$/, '');

  // Strip common prefixes
  name = name
    .replace(/^svc-\d+-/, '')
    .replace(/^wf-/, '')
    .replace(/^sm-/, '')
    .replace(/^df-/, '')
    .replace(/^int-/, '')
    .replace(/^xc-/, '')
    .replace(/^infra-/, '')
    .replace(/^stakeholder-/, '')
    .replace(/^overview-/, '')
    .replace(/^timeline-/, '')
    .replace(/^milestone-/, '')
    .replace(/^auth-/, '')
    .replace(/^mobile-/, '')
    .replace(/^database-/, '')
    .replace(/^data-flow/, 'Data Flow')
    .replace(/-features$/, '');

  // Keep numeric prefix for svc files (e.g., "01 Auth Admin")
  const svcMatch = filename.match(/^svc-(\d+)-(.+)\.md$/);
  if (svcMatch) {
    name = `${svcMatch[1]} ${svcMatch[2].replace(/-features$/, '')}`;
  }

  // Title case
  return name.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()).trim();
}

// ─── BUILD DIAGRAM DATA ───
function buildDiagramData(dir, files) {
  const data = {};
  for (const file of files) {
    const filePath = path.join(dir, file);
    try {
      data[file] = fs.readFileSync(filePath, 'utf-8');
    } catch (err) {
      console.warn(`Warning: Could not read ${file}: ${err.message}`);
    }
  }
  return data;
}

// ─── FIND TEMPLATE ───
function findTemplate(config) {
  if (config.template) {
    const p = path.resolve(config.template);
    if (fs.existsSync(p)) return p;
    console.error(`Error: Template not found: ${p}`);
    process.exit(1);
  }

  // Look in common locations
  const candidates = [
    path.join(__dirname, 'review-portal-generator.template.html'),
    path.join(config.dir, 'review-portal-generator.template.html'),
  ];

  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }

  console.error('Error: Could not find review-portal-generator.template.html. Use --template to specify path.');
  process.exit(1);
}

// ─── MAIN BUILD ───
function build() {
  const config = parseArgs();
  const slug = toSlug(config.name);

  console.log(`Building review portal for: ${config.name}`);
  console.log(`  Directory: ${config.dir}`);

  // 1. Discover files
  const files = discoverDiagrams(config.dir);
  console.log(`  Found ${files.length} diagram files`);

  if (files.length === 0) {
    console.error('Error: No diagram .md files found in directory.');
    process.exit(1);
  }

  // 2. Categorize
  let categories = parseIndex(config.dir);
  if (!categories || categories.length === 0) {
    console.log('  No index file found — using auto-categorization by prefix');
    categories = autoCategorize(files);
  } else {
    console.log(`  Parsed index: ${categories.length} categories`);
  }

  // Ensure all discovered files are in a category
  const categorizedFiles = new Set(categories.flatMap(c => c.diagrams.map(d => d.file)));
  const uncategorized = files.filter(f => !categorizedFiles.has(f));
  if (uncategorized.length > 0) {
    console.log(`  Adding ${uncategorized.length} uncategorized files to "Other"`);
    let otherCat = categories.find(c => c.id === 'other');
    if (!otherCat) {
      otherCat = { id: 'other', label: 'Other', diagrams: [] };
      categories.push(otherCat);
    }
    uncategorized.forEach(f => otherCat.diagrams.push({ file: f, label: labelFromFilename(f) }));
  }

  const totalDiagrams = categories.reduce((n, c) => n + c.diagrams.length, 0);
  console.log(`  Total diagrams in portal: ${totalDiagrams}`);

  // 3. Inline diagram data
  const diagramData = buildDiagramData(config.dir, files);

  // 4. Read template
  const templatePath = findTemplate(config);
  console.log(`  Template: ${templatePath}`);
  let html = fs.readFileSync(templatePath, 'utf-8');

  // 5. Replace placeholders
  // Use a function to handle all occurrences (replaceAll equivalent)
  const replacements = [
    ['{{PROJECT_NAME}}', config.name],
    ['{{BRAND_ABBREVIATION}}', config.abbr],
    ['{{BRAND_COLOR}}', config.color],
    ['{{PROJECT_SLUG}}', slug],
    ['{{CATEGORIES_JSON}}', JSON.stringify(categories, null, 2)],
    ['{{DIAGRAM_DATA_JSON}}', JSON.stringify(diagramData)],
  ];

  for (const [placeholder, value] of replacements) {
    while (html.includes(placeholder)) {
      html = html.replace(placeholder, value);
    }
  }

  // 6. Write output
  const outputPath = path.resolve(config.output);
  fs.writeFileSync(outputPath, html, 'utf-8');

  const sizeKB = Math.round(fs.statSync(outputPath).size / 1024);
  console.log(`\n  Output: ${outputPath} (${sizeKB} KB)`);
  console.log('  Done! Open the file in a browser to use the portal.');
}

build();
