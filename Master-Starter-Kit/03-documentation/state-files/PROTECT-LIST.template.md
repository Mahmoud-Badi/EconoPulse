# PROTECT LIST

> Files and routes that MUST NOT be modified without explicit user approval.

## Purpose

This file lists production-stable code that has been tested, verified, and should not be touched during routine development. AI agents must check this list before modifying any file. If a task requires changes to a protected file, **stop and ask for approval first**.

## Protected Files

| File | Reason | Protected Since |
|------|--------|-----------------|
| `{{FILE_PATH_1}}` | {REASON — e.g., "Core auth logic, 100% test coverage"} | {{DATE}} |
| `{{FILE_PATH_2}}` | {{REASON}} | {{DATE}} |

## Protected Routes

| Route | Reason | Protected Since |
|-------|--------|-----------------|
| `{{ROUTE_1}}` | {REASON — e.g., "Payment flow, PCI compliant"} | {{DATE}} |

## Protected Database Tables

| Table | Reason | Protected Since |
|-------|--------|-----------------|
| `{{TABLE_1}}` | {REASON — e.g., "Core user table, migration-only changes"} | {{DATE}} |

## Rules

1. **Never modify** a protected file without explicit user approval in the current session
2. **Never delete** a protected file under any circumstances
3. **Never rename** a protected file — downstream imports will break
4. If a task requires protected file changes, create a separate task with `[PROTECTED]` prefix
5. Changes to protected files require **mandatory code review** (Gate 1 in quality-gates.md)
6. When a file graduates to protected status, add it here with date and reason

## How to Add Files

A file should be added to the PROTECT LIST when:
- It handles auth, payments, or compliance logic
- It has been production-stable for 2+ phases
- It has comprehensive test coverage (80%+)
- Breaking it would affect multiple downstream features
- It contains complex business logic that took multiple iterations to get right

## How to Remove Files

A file should be removed from the PROTECT LIST when:
- It is being intentionally replaced by a new implementation
- The feature it supports is being deprecated
- A major refactor has been explicitly approved
