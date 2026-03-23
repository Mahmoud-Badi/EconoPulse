# API Contract Registry — TaskFlow (Projects Service)
# ============================================================
# EXAMPLE FILE — This is a filled-in API contract registry for
# a fictional TaskFlow project. Your contract registry will be
# generated during ORCHESTRATOR Step 10 (API Contract Registry).
# ============================================================

> **Service:** Projects | **API Style:** tRPC | **Base Path:** `project.*`
> **Last Updated:** 2026-03-12

---

## Contract Status Legend

| Stage | Meaning |
|-------|---------|
| DB | Database schema + migration done |
| API | tRPC procedure implemented |
| FE | Frontend calls the procedure |
| INT | Integration tested (FE ↔ API ↔ DB) |
| VER | Verified in review / E2E test |

---

## Screen-to-API Mapping

### Projects List (`/projects`)

| UI Element | Procedure | Input | Output | Status |
|-----------|-----------|-------|--------|--------|
| Project cards (paginated) | `project.list` | `{ status?, search?, page, limit, sort }` | `{ data: Project[], pagination }` | DB-API-FE-INT-VER |
| Status filter tab counts | `project.countByStatus` | — | `{ draft, active, onHold, completed, archived }` | DB-API-FE-INT-VER |
| "New Project" button | Navigate only | — | — | VER |

### Project Detail (`/projects/[id]`)

| UI Element | Procedure | Input | Output | Status |
|-----------|-----------|-------|--------|--------|
| Project header + overview | `project.getById` | `{ id }` | Full project with stats | DB-API-FE-INT-VER |
| Task list tab | `task.listByProject` | `{ projectId, status?, page }` | Paginated tasks | DB-API-FE-INT-VER |
| Team members tab | `project.listMembers` | `{ projectId }` | Member list with roles | DB-API-FE-INT-VER |
| Time summary tab | `timeEntry.getProjectSummary` | `{ projectId }` | Hours by member + week | DB-API-FE-INT |
| Edit button | Navigate only | — | — | VER |
| Status change dropdown | `project.updateStatus` | `{ id, status }` | Updated project | DB-API-FE-INT-VER |

### New Project Form (`/projects/new`)

| UI Element | Procedure | Input | Output | Status |
|-----------|-----------|-------|--------|--------|
| Create form submit | `project.create` | `{ name, description?, clientName?, budget?, dueDate? }` | Created project | DB-API-FE-INT-VER |
| Name uniqueness check | `project.checkName` | `{ name }` | `{ available: boolean }` | DB-API-FE-INT |

### Edit Project Form (`/projects/[id]/edit`)

| UI Element | Procedure | Input | Output | Status |
|-----------|-----------|-------|--------|--------|
| Load existing data | `project.getById` | `{ id }` | Full project | DB-API-FE-INT-VER |
| Update form submit | `project.update` | `{ id, ...fields }` | Updated project | DB-API-FE-INT-VER |
| Delete button | `project.delete` | `{ id }` | Success (soft delete) | DB-API-FE-INT |

### Project Settings (`/projects/[id]/settings`)

| UI Element | Procedure | Input | Output | Status |
|-----------|-----------|-------|--------|--------|
| Add member | `project.addMember` | `{ projectId, userId, role }` | Member record | DB-API-FE-INT-VER |
| Remove member | `project.removeMember` | `{ projectId, userId }` | Success | DB-API-FE-INT |
| Change member role | `project.updateMemberRole` | `{ projectId, userId, role }` | Updated member | DB-API-FE-INT |

---

## Completion Summary

| Screen | Total Contracts | DB | API | FE | INT | VER |
|--------|----------------|----|----|----|----|-----|
| Projects List | 3 | 3 | 3 | 3 | 3 | 3 |
| Project Detail | 6 | 6 | 6 | 6 | 5 | 4 |
| New Project | 2 | 2 | 2 | 2 | 2 | 1 |
| Edit Project | 3 | 3 | 3 | 3 | 3 | 2 |
| Project Settings | 3 | 3 | 3 | 3 | 3 | 2 |
| **Total** | **17** | **17** | **17** | **17** | **16** | **12** |
