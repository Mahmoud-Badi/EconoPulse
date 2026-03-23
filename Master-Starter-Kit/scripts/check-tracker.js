#!/usr/bin/env node

/**
 * check-tracker.js — STATUS.md ↔ Master Tracker Consistency Checker
 *
 * Reads STATUS.md and master-tracker.md, compares task IDs, counts,
 * and statuses. Outputs a pass/fail report.
 *
 * Usage: node scripts/check-tracker.js [dev_docs_path]
 *   dev_docs_path: Path to dev_docs/ directory (default: ./dev_docs)
 *
 * Exit codes:
 *   0 = PASS (zero discrepancies)
 *   1 = FAIL (discrepancies found)
 *   2 = ERROR (files not found or parse error)
 */

const fs = require("fs");
const path = require("path");

const devDocsPath = process.argv[2] || "./dev_docs";
const statusPath = path.join(devDocsPath, "STATUS.md");
const trackerPath = path.join(devDocsPath, "tracker", "master-tracker.md");

// --- Helpers ---

function fileExists(filePath) {
  try {
    fs.accessSync(filePath, fs.constants.R_OK);
    return true;
  } catch {
    return false;
  }
}

function extractTaskIds(content) {
  // Match task IDs in formats: task-1-01, P1-T01, TASK-001, etc.
  const taskIdPattern = /\b((?:task|TASK|P\d+|Phase\s*\d+)[-_]\S+)\b/g;
  const ids = new Set();
  let match;
  while ((match = taskIdPattern.exec(content)) !== null) {
    ids.add(match[1].toLowerCase());
  }
  return ids;
}

function countCheckboxes(content) {
  const checked = (content.match(/- \[x\]/gi) || []).length;
  const unchecked = (content.match(/- \[ \]/g) || []).length;
  return { checked, unchecked, total: checked + unchecked };
}

function extractHeaderCount(content) {
  // Look for patterns like "Total Tasks: 90" or "Tasks: 102" or "## 90 Tasks"
  const patterns = [
    /total\s*tasks?\s*[:=]\s*(\d+)/i,
    /tasks?\s*[:=]\s*(\d+)/i,
    /(\d+)\s+total\s+tasks?/i,
    /##\s+(\d+)\s+tasks?/i,
  ];
  for (const pattern of patterns) {
    const match = content.match(pattern);
    if (match) return parseInt(match[1], 10);
  }
  return null;
}

function extractSubtaskCount(content) {
  const patterns = [
    /total\s*subtasks?\s*[:=]\s*(\d+)/i,
    /subtasks?\s*[:=]\s*(\d+)/i,
    /(\d+)\s+total\s+subtasks?/i,
    /(\d+)\s+subtasks?/i,
  ];
  for (const pattern of patterns) {
    const match = content.match(pattern);
    if (match) return parseInt(match[1], 10);
  }
  return null;
}

// --- Main ---

console.log("=== STATUS.md ↔ Master Tracker Consistency Check ===\n");

// Check file existence
if (!fileExists(statusPath)) {
  console.log(`ERROR: STATUS.md not found at ${statusPath}`);
  console.log("  → Generate STATUS.md first (Step 9)");
  process.exit(2);
}

if (!fileExists(trackerPath)) {
  console.log(`WARN: master-tracker.md not found at ${trackerPath}`);
  console.log("  → Master tracker may not be enabled for this project");
  console.log("  → If enabled, generate it first (Step 9.5)");
  console.log("\nRESULT: SKIP (no tracker to compare)\n");
  process.exit(0);
}

const statusContent = fs.readFileSync(statusPath, "utf-8");
const trackerContent = fs.readFileSync(trackerPath, "utf-8");

const findings = [];

// Check 1: Task ID consistency
const statusIds = extractTaskIds(statusContent);
const trackerIds = extractTaskIds(trackerContent);

const inStatusNotTracker = [...statusIds].filter((id) => !trackerIds.has(id));
const inTrackerNotStatus = [...trackerIds].filter((id) => !statusIds.has(id));

if (inStatusNotTracker.length > 0) {
  findings.push({
    severity: "FAIL",
    check: "Task ID Consistency",
    detail: `${inStatusNotTracker.length} task(s) in STATUS.md but NOT in master-tracker: ${inStatusNotTracker.slice(0, 5).join(", ")}${inStatusNotTracker.length > 5 ? "..." : ""}`,
  });
}

if (inTrackerNotStatus.length > 0) {
  findings.push({
    severity: "FAIL",
    check: "Task ID Consistency",
    detail: `${inTrackerNotStatus.length} task(s) in master-tracker but NOT in STATUS.md: ${inTrackerNotStatus.slice(0, 5).join(", ")}${inTrackerNotStatus.length > 5 ? "..." : ""}`,
  });
}

if (inStatusNotTracker.length === 0 && inTrackerNotStatus.length === 0) {
  findings.push({
    severity: "PASS",
    check: "Task ID Consistency",
    detail: `${statusIds.size} task IDs match across both files`,
  });
}

// Check 2: Header count vs actual count
const statusHeaderCount = extractHeaderCount(statusContent);
const statusCheckboxes = countCheckboxes(statusContent);
const trackerHeaderCount = extractHeaderCount(trackerContent);
const trackerCheckboxes = countCheckboxes(trackerContent);

if (statusHeaderCount !== null && statusHeaderCount !== statusCheckboxes.total) {
  findings.push({
    severity: "FAIL",
    check: "STATUS.md Header Count",
    detail: `Header says ${statusHeaderCount} tasks but found ${statusCheckboxes.total} checkboxes`,
  });
} else if (statusHeaderCount !== null) {
  findings.push({
    severity: "PASS",
    check: "STATUS.md Header Count",
    detail: `Header count (${statusHeaderCount}) matches checkbox count`,
  });
}

if (trackerHeaderCount !== null && trackerHeaderCount !== trackerCheckboxes.total) {
  findings.push({
    severity: "FAIL",
    check: "Tracker Header Count",
    detail: `Header says ${trackerHeaderCount} tasks but found ${trackerCheckboxes.total} checkboxes`,
  });
} else if (trackerHeaderCount !== null) {
  findings.push({
    severity: "PASS",
    check: "Tracker Header Count",
    detail: `Header count (${trackerHeaderCount}) matches checkbox count`,
  });
}

// Check 3: Cross-file task count
if (statusCheckboxes.total > 0 && trackerCheckboxes.total > 0) {
  const diff = Math.abs(statusCheckboxes.total - trackerCheckboxes.total);
  if (diff > 0) {
    findings.push({
      severity: "FAIL",
      check: "Cross-File Task Count",
      detail: `STATUS.md has ${statusCheckboxes.total} checkboxes, tracker has ${trackerCheckboxes.total} (diff: ${diff})`,
    });
  } else {
    findings.push({
      severity: "PASS",
      check: "Cross-File Task Count",
      detail: `Both files have ${statusCheckboxes.total} checkboxes`,
    });
  }
}

// Check 4: Subtask count verification
const trackerSubtaskHeader = extractSubtaskCount(trackerContent);
if (trackerSubtaskHeader !== null) {
  // Count actual subtask rows (lines starting with | that contain task-like content)
  const subtaskRows = trackerContent
    .split("\n")
    .filter(
      (line) =>
        line.startsWith("|") &&
        !line.includes("---") &&
        !line.match(/^\|\s*(#|Task|Subtask|Phase|Sprint)/i)
    ).length;

  if (subtaskRows > 0 && Math.abs(trackerSubtaskHeader - subtaskRows) > 5) {
    findings.push({
      severity: "FAIL",
      check: "Subtask Count",
      detail: `Tracker header claims ${trackerSubtaskHeader} subtasks but table has ${subtaskRows} data rows`,
    });
  } else if (subtaskRows > 0) {
    findings.push({
      severity: "PASS",
      check: "Subtask Count",
      detail: `Subtask count (${trackerSubtaskHeader}) approximately matches table rows (${subtaskRows})`,
    });
  }
}

// Check 5: Completion status consistency
if (statusCheckboxes.checked > 0 || trackerCheckboxes.checked > 0) {
  const statusPct = statusCheckboxes.total > 0 ? Math.round((statusCheckboxes.checked / statusCheckboxes.total) * 100) : 0;
  const trackerPct = trackerCheckboxes.total > 0 ? Math.round((trackerCheckboxes.checked / trackerCheckboxes.total) * 100) : 0;
  const pctDiff = Math.abs(statusPct - trackerPct);

  if (pctDiff > 10) {
    findings.push({
      severity: "WARN",
      check: "Completion Sync",
      detail: `STATUS.md shows ${statusPct}% complete, tracker shows ${trackerPct}% complete (${pctDiff}% divergence)`,
    });
  } else {
    findings.push({
      severity: "PASS",
      check: "Completion Sync",
      detail: `STATUS.md (${statusPct}%) and tracker (${trackerPct}%) are within 10% of each other`,
    });
  }
}

// --- Output ---

console.log("Findings:\n");

let failCount = 0;
let warnCount = 0;
let passCount = 0;

for (const finding of findings) {
  const icon = finding.severity === "PASS" ? "✓" : finding.severity === "WARN" ? "⚠" : "✗";
  console.log(`  ${icon} [${finding.severity}] ${finding.check}`);
  console.log(`    ${finding.detail}\n`);

  if (finding.severity === "FAIL") failCount++;
  else if (finding.severity === "WARN") warnCount++;
  else passCount++;
}

console.log("---");
console.log(`PASS: ${passCount} | WARN: ${warnCount} | FAIL: ${failCount}`);
console.log("");

if (failCount > 0) {
  console.log("RESULT: FAIL — Fix all FAIL items before proceeding.\n");
  process.exit(1);
} else if (warnCount > 0) {
  console.log("RESULT: PASS WITH WARNINGS — Review WARN items.\n");
  process.exit(0);
} else {
  console.log("RESULT: PASS — All checks passed.\n");
  process.exit(0);
}
