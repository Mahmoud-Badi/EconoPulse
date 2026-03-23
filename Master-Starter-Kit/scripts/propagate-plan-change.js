#!/usr/bin/env node

/**
 * propagate-plan-change.js — Plan ↔ Tracker Consistency Checker
 *
 * Validates that all planning files (task files, specs) are properly
 * reflected in tracking files (STATUS.md, master-tracker.md, etc.).
 * Catches drift between "what's planned" and "what's tracked."
 *
 * Usage: node scripts/propagate-plan-change.js [dev_docs_path]
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
const depsPath = path.join(devDocsPath, "tracker", "dependency-map.md");
const tasksDir = path.join(devDocsPath, "tasks");
const sprintsDir = path.join(devDocsPath, "sprints");

// --- Helpers ---

function fileExists(filePath) {
  try {
    fs.accessSync(filePath, fs.constants.R_OK);
    return true;
  } catch {
    return false;
  }
}

function dirExists(dirPath) {
  try {
    return fs.statSync(dirPath).isDirectory();
  } catch {
    return false;
  }
}

function extractTaskIds(content) {
  // Match task IDs: T-001, TASK-001, P1-T01, QS-001, CC-042, etc.
  const taskIdPattern =
    /\b([A-Z]{1,5}-\d{2,4}(?:\.\d{1,2})?)\b/g;
  const ids = new Set();
  let match;
  while ((match = taskIdPattern.exec(content)) !== null) {
    // Only keep top-level task IDs (no subtask suffixes like T-065.1)
    const id = match[1];
    if (!id.includes(".")) {
      ids.add(id.toUpperCase());
    }
  }
  return ids;
}

function extractAllTaskIds(content) {
  // Include subtask IDs too (T-065.1, T-065.2, etc.)
  const taskIdPattern =
    /\b([A-Z]{1,5}-\d{2,4}(?:\.\d{1,2})?)\b/g;
  const ids = new Set();
  let match;
  while ((match = taskIdPattern.exec(content)) !== null) {
    ids.add(match[1].toUpperCase());
  }
  return ids;
}

function countCheckboxes(content) {
  const checked = (content.match(/- \[x\]/gi) || []).length;
  const unchecked = (content.match(/- \[ \]/g) || []).length;
  return { checked, unchecked, total: checked + unchecked };
}

function extractPhaseBlocks(content) {
  // Extract phase headers with counts like "## Phase 3: Notifications (0/8 complete — 0%)"
  const phasePattern =
    /^##\s+Phase\s+(\d+)[^(]*\((\d+)\/(\d+)\s+complete/gim;
  const phases = [];
  let match;
  while ((match = phasePattern.exec(content)) !== null) {
    phases.push({
      number: parseInt(match[1], 10),
      completed: parseInt(match[2], 10),
      total: parseInt(match[3], 10),
      headerIndex: match.index,
    });
  }
  return phases;
}

function countPhaseCheckboxes(content, phaseIndex, nextPhaseIndex) {
  const section = content.substring(
    phaseIndex,
    nextPhaseIndex || content.length
  );
  return countCheckboxes(section);
}

function getTaskFilesFromDir(dir) {
  const taskIds = new Set();
  if (!dirExists(dir)) return taskIds;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // Recurse into phase subdirectories
      const subIds = getTaskFilesFromDir(fullPath);
      subIds.forEach((id) => taskIds.add(id));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      // Try to extract task ID from filename or file content
      const filenameMatch = entry.name.match(/^([A-Z]{1,5}-\d{2,4})/i);
      if (filenameMatch) {
        taskIds.add(filenameMatch[1].toUpperCase());
      } else {
        // Try reading first few lines for task ID
        try {
          const content = fs.readFileSync(fullPath, "utf-8");
          const firstLine = content.split("\n").slice(0, 5).join("\n");
          const idMatch = firstLine.match(/\b([A-Z]{1,5}-\d{2,4})\b/);
          if (idMatch) {
            taskIds.add(idMatch[1].toUpperCase());
          }
        } catch {
          // Skip unreadable files
        }
      }
    }
  }
  return taskIds;
}

function getFileMtime(filePath) {
  try {
    return fs.statSync(filePath).mtimeMs;
  } catch {
    return 0;
  }
}

function getNewestMtime(dir) {
  let newest = 0;
  if (!dirExists(dir)) return newest;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      newest = Math.max(newest, getNewestMtime(fullPath));
    } else {
      newest = Math.max(newest, getFileMtime(fullPath));
    }
  }
  return newest;
}

// --- Main ---

console.log("=== Plan ↔ Tracker Consistency Check ===\n");

// Pre-flight: STATUS.md must exist
if (!fileExists(statusPath)) {
  console.log(`ERROR: STATUS.md not found at ${statusPath}`);
  console.log("  → Generate STATUS.md first (Step 9 of ORCHESTRATOR)");
  process.exit(2);
}

const statusContent = fs.readFileSync(statusPath, "utf-8");
const findings = [];

// --- Check 1: Task File Coverage ---
// Task files that exist on disk but aren't referenced in STATUS.md

if (dirExists(tasksDir)) {
  const taskFileIds = getTaskFilesFromDir(tasksDir);
  const statusIds = extractTaskIds(statusContent);

  const orphans = [...taskFileIds].filter((id) => !statusIds.has(id));
  const ghosts = [...statusIds].filter((id) => !taskFileIds.has(id));

  if (orphans.length > 0) {
    findings.push({
      severity: "FAIL",
      check: "Task File Coverage (Orphans)",
      detail: `${orphans.length} task file(s) exist on disk but are NOT in STATUS.md: ${orphans.slice(0, 8).join(", ")}${orphans.length > 8 ? "..." : ""}\n    These tasks are invisible to the execution pipeline.`,
    });
  }

  if (ghosts.length > 0) {
    findings.push({
      severity: "WARN",
      check: "Task File Coverage (Ghosts)",
      detail: `${ghosts.length} task(s) in STATUS.md have no matching task file: ${ghosts.slice(0, 8).join(", ")}${ghosts.length > 8 ? "..." : ""}\n    These may be inline tasks or may need task files generated.`,
    });
  }

  if (orphans.length === 0 && ghosts.length === 0) {
    findings.push({
      severity: "PASS",
      check: "Task File Coverage",
      detail: `${taskFileIds.size} task files match STATUS.md entries`,
    });
  }
} else {
  findings.push({
    severity: "WARN",
    check: "Task File Coverage",
    detail: `Task directory not found at ${tasksDir} — skipping`,
  });
}

// --- Check 2: Phase Count Accuracy ---
// Header counts vs actual checkbox counts per phase

const phases = extractPhaseBlocks(statusContent);
if (phases.length > 0) {
  let phaseErrors = 0;

  for (let i = 0; i < phases.length; i++) {
    const phase = phases[i];
    const nextPhaseIndex =
      i + 1 < phases.length ? phases[i + 1].headerIndex : undefined;
    const actualCheckboxes = countPhaseCheckboxes(
      statusContent,
      phase.headerIndex,
      nextPhaseIndex
    );

    if (phase.total !== actualCheckboxes.total) {
      findings.push({
        severity: "FAIL",
        check: `Phase ${phase.number} Count`,
        detail: `Header says ${phase.completed}/${phase.total} but found ${actualCheckboxes.checked}/${actualCheckboxes.total} checkboxes`,
      });
      phaseErrors++;
    }

    if (phase.completed !== actualCheckboxes.checked) {
      findings.push({
        severity: "FAIL",
        check: `Phase ${phase.number} Completion`,
        detail: `Header says ${phase.completed} complete but ${actualCheckboxes.checked} checkboxes are checked`,
      });
      phaseErrors++;
    }
  }

  if (phaseErrors === 0) {
    findings.push({
      severity: "PASS",
      check: "Phase Count Accuracy",
      detail: `All ${phases.length} phase headers match their checkbox counts`,
    });
  }
} else {
  findings.push({
    severity: "WARN",
    check: "Phase Count Accuracy",
    detail:
      "No phase headers found in STATUS.md (expected format: ## Phase N: Name (X/Y complete))",
  });
}

// --- Check 3: Master Tracker Completeness ---
// Tasks in STATUS.md that have no subtask entries in master-tracker.md

if (fileExists(trackerPath)) {
  const trackerContent = fs.readFileSync(trackerPath, "utf-8");
  const statusIds = extractTaskIds(statusContent);
  const trackerAllIds = extractAllTaskIds(trackerContent);

  // For each STATUS.md task, check if any subtask (T-065.1, etc.) exists in tracker
  const missingFromTracker = [...statusIds].filter((id) => {
    // Check if the task ID itself or any subtask ID (id.1, id.2, etc.) exists
    if (trackerAllIds.has(id)) return false;
    // Check for subtask pattern
    for (const tid of trackerAllIds) {
      if (tid.startsWith(id + ".")) return false;
    }
    return true;
  });

  if (missingFromTracker.length > 0) {
    findings.push({
      severity: "FAIL",
      check: "Master Tracker Completeness",
      detail: `${missingFromTracker.length} task(s) in STATUS.md have NO subtask entries in master-tracker: ${missingFromTracker.slice(0, 8).join(", ")}${missingFromTracker.length > 8 ? "..." : ""}\n    These tasks have no execution breakdown.`,
    });
  } else {
    findings.push({
      severity: "PASS",
      check: "Master Tracker Completeness",
      detail: `All ${statusIds.size} STATUS.md tasks have subtask entries in master-tracker`,
    });
  }
} else {
  findings.push({
    severity: "WARN",
    check: "Master Tracker Completeness",
    detail: `master-tracker.md not found — skipping (may not be enabled)`,
  });
}

// --- Check 4: Sprint Assignment Validity ---
// Sprint files referencing task IDs that don't exist in STATUS.md

if (dirExists(sprintsDir)) {
  const statusIds = extractTaskIds(statusContent);
  const sprintFiles = fs
    .readdirSync(sprintsDir)
    .filter((f) => f.endsWith(".md"));
  let invalidRefs = [];

  for (const file of sprintFiles) {
    const sprintContent = fs.readFileSync(
      path.join(sprintsDir, file),
      "utf-8"
    );
    const sprintIds = extractTaskIds(sprintContent);

    for (const id of sprintIds) {
      if (!statusIds.has(id)) {
        invalidRefs.push(`${file}: ${id}`);
      }
    }
  }

  if (invalidRefs.length > 0) {
    findings.push({
      severity: "FAIL",
      check: "Sprint Assignment Validity",
      detail: `${invalidRefs.length} sprint reference(s) to non-existent tasks: ${invalidRefs.slice(0, 5).join(", ")}${invalidRefs.length > 5 ? "..." : ""}`,
    });
  } else if (sprintFiles.length > 0) {
    findings.push({
      severity: "PASS",
      check: "Sprint Assignment Validity",
      detail: `All sprint task references exist in STATUS.md`,
    });
  }
} else {
  // Sprints directory missing is not an error — not all projects use sprint files
}

// --- Check 5: Dependency Map Completeness ---
// Tasks in STATUS.md that don't appear in dependency-map.md

if (fileExists(depsPath)) {
  const depsContent = fs.readFileSync(depsPath, "utf-8");
  const statusIds = extractTaskIds(statusContent);
  const depsIds = extractTaskIds(depsContent);

  const missingFromDeps = [...statusIds].filter((id) => !depsIds.has(id));

  if (missingFromDeps.length > 0) {
    findings.push({
      severity: "FAIL",
      check: "Dependency Map Completeness",
      detail: `${missingFromDeps.length} task(s) in STATUS.md have NO entry in dependency-map: ${missingFromDeps.slice(0, 8).join(", ")}${missingFromDeps.length > 8 ? "..." : ""}\n    These tasks have no dependency tracking.`,
    });
  } else {
    findings.push({
      severity: "PASS",
      check: "Dependency Map Completeness",
      detail: `All ${statusIds.size} STATUS.md tasks appear in dependency-map`,
    });
  }
} else {
  findings.push({
    severity: "WARN",
    check: "Dependency Map Completeness",
    detail: `dependency-map.md not found — skipping (may not be enabled)`,
  });
}

// --- Check 6: Timestamp Staleness ---
// Task directories with files newer than STATUS.md

if (dirExists(tasksDir)) {
  const statusMtime = getFileMtime(statusPath);
  const newestTaskMtime = getNewestMtime(tasksDir);
  const ONE_HOUR = 60 * 60 * 1000;

  if (newestTaskMtime > statusMtime + ONE_HOUR) {
    const staleness = Math.round(
      (newestTaskMtime - statusMtime) / (60 * 1000)
    );
    findings.push({
      severity: "WARN",
      check: "Timestamp Staleness",
      detail: `Task files were modified ${staleness} minutes after STATUS.md was last updated.\n    STATUS.md may not reflect recent plan changes.`,
    });
  } else {
    findings.push({
      severity: "PASS",
      check: "Timestamp Staleness",
      detail: `STATUS.md is up-to-date with task file modifications`,
    });
  }
}

// --- Output ---

console.log("Findings:\n");

let failCount = 0;
let warnCount = 0;
let passCount = 0;

for (const finding of findings) {
  const icon =
    finding.severity === "PASS"
      ? "\u2713"
      : finding.severity === "WARN"
        ? "\u26A0"
        : "\u2717";
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
  console.log(
    "RESULT: FAIL \u2014 Plan changes have not been propagated to trackers.\n"
  );
  console.log(
    "Run /plan-changed to update all trackers, or see PLAN-CHANGE-PROTOCOL.md.\n"
  );
  process.exit(1);
} else if (warnCount > 0) {
  console.log("RESULT: PASS WITH WARNINGS \u2014 Review WARN items.\n");
  process.exit(0);
} else {
  console.log("RESULT: PASS \u2014 All plan-tracker checks passed.\n");
  process.exit(0);
}
