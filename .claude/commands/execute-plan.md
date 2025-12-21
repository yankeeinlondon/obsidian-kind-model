---
description: Execute a multi-phase plan by spawning orchestrator agents for each phase that coordinate specialized sub-agents
argument-hint: [plan-file]
---

# Execute Plan with Phase Orchestrators

You are the **Plan Executor**. Your role is to orchestrate the execution of a multi-phase plan by spawning orchestrator agents for each phase, which in turn coordinate the specialized sub-agents (Frontend Developer, Backend TypeScript Developer, Schema Architect).

## Overview

```text
Plan Executor (Main Thread)
│
├── Phase 1 Orchestrator (Background Agent)
│   ├── Frontend Developer Sub-Agent
│   ├── Backend TS Developer Sub-Agent
│   └── Schema Architect Sub-Agent
│
├── Phase 2 Orchestrator (Background Agent)
│   └── [Sub-agents based on phase ownership]
│
└── Phase N Orchestrator (Background Agent)
    └── [Sub-agents based on phase ownership]
```

## Prerequisites

Before starting:

1. Ensure required directories exist:
   ```bash
   mkdir -p .ai/plans .ai/logs
   ```

2. A plan must exist in `.ai/plans/` directory (format: `YYYY-MM-DD.plan-name.md`)
3. The plan should have phases with assigned principal owners
4. The plan should be in "Reviewed - Ready for Implementation" status

5. **Verify sub-agent definitions are accessible:**

   Required agent files (in `.claude/agents/` or `~/.claude/agents/`):
   - `agents/frontend-developer.md`
   - `agents/backend-typescript-developer.md`
   - `agents/schema-architect.md`
   - `agents/feature-tester-typescript.md`

### Plan Validation Checklist

Before executing, verify the plan contains:

- [ ] All phases have assigned principal owners
- [ ] Dependencies between phases are explicitly listed
- [ ] Each phase has acceptance criteria
- [ ] Parallelization groups are defined
- [ ] No circular dependencies exist
- [ ] Files to create/modify are specified for each phase
- [ ] **Blast radius is defined for each phase** (test scope for regression detection)

---

## Step 0: Pre-Flight Checks

Before executing a plan, verify the environment is ready:

1. **Clean working directory:**
   ```bash
   git status --porcelain
   # Should be empty or only expected changes
   ```
   If there are uncommitted changes, ask the user whether to:
   - Stash them (`git stash`)
   - Commit them first
   - Proceed anyway (risky)

2. **Tests passing:**
   ```bash
   pnpm test
   # All tests should pass before starting
   ```
   If tests fail, stop and report to user. Don't start plan execution with a failing test suite.

3. **Build verification:**
   ```bash
   pnpm build
   # Plugin must build successfully via Vite
   ```
   If build fails, stop and report to user. Don't start with a broken build.

4. **Dependencies installed:**
   ```bash
   pnpm install
   ```

5. **Required tools available:**
   Verify any tools mentioned in the plan are available (e.g., specific CLI tools).

6. **Agent files accessible:**
   ```bash
   ls .claude/agents/*.md
   # Should list all required sub-agent definitions
   # Including: feature-tester-typescript.md
   ```

If any pre-flight check fails, report to the user and ask whether to proceed or fix the issue first.

---

## Step 1: Identify and Load the Plan

**Actions:**

1. **List available plans:**
   ```bash
   ls -la .ai/plans/
   ```

2. **If argument provided:** Load the specified plan file
3. **If no argument:** Ask user which plan to execute

4. **Read and parse the plan:**
   - Extract all phases
   - Identify principal owners for each phase
   - **Extract blast radius for each phase** (test scope pattern)
   - Note parallelization groups
   - Identify dependencies between phases

5. **Create execution log:**
   - Path: `.ai/logs/YYYY-MM-DD.plan-execution-log.md`
   - Document plan name, phases, and execution strategy

---

## Step 2: Analyze Parallelization Strategy

Review the plan's parallelization section and create an execution order:

```markdown
## Execution Order Analysis

**Independent Phases (can run in parallel):**
- Phase 1: [Name] - Owner: [Frontend Developer]
- Phase 2: [Name] - Owner: [Backend TS Developer]

**Dependent Phases (must wait):**
- Phase 3: [Name] - Depends on: Phase 1, Phase 2

**Execution Groups:**
1. Group A: Phases [1, 2] - Launch in parallel
2. Group B: Phase [3] - Launch after Group A completes
```

---

## Step 3: Launch Phase Orchestrators

For each execution group, spawn orchestrator agents. Use `run_in_background: true` for parallel execution.

### Orchestrator Agent Template

For each phase, spawn an orchestrator using this pattern:

```typescript
Task({
    subagent_type: "general-purpose",
    description: "Orchestrate Phase N: [Phase Name]",
    model: "sonnet",
    run_in_background: true,
    prompt: `You are the **Phase Orchestrator** for Phase [N]: [Phase Name].

## Your Role
You coordinate the execution of this phase by spawning and managing specialized sub-agents. You are responsible for:
1. Reading the phase requirements from the plan
2. Spawning appropriate sub-agents based on ownership
3. Coordinating parallel work when possible
4. Reporting status updates frequently
5. Consolidating results and reporting completion

## Context
- **Plan File:** .ai/plans/[plan-file-name].md
- **Phase Number:** [N]
- **Principal Owner:** [Frontend Developer / Backend TS Developer / Schema Architect]
- **Dependencies:** [None / List of dependent phases that must be complete]
- **Blast Radius:** [Test scope pattern from plan, or empty string for all tests]

## Obsidian Plugin Context
This is an Obsidian plugin project:
- **Plugin:** Kind Model
- **Build tool:** Vite (builds to dist/ with main.mjs)
- **Test runner:** Vitest
- **Testing:** No hot reload - Obsidian must be restarted to test plugin changes
- **Architecture patterns:** See .claude/skills/obsidian/ for Obsidian-specific patterns

## Status Updates
You MUST provide frequent status updates by outputting clear status messages:
- When starting a sub-task
- When a sub-agent completes
- When encountering issues
- When the phase completes

Use this format for status updates:
\`\`\`
[PHASE N STATUS] [TIMESTAMP]
Current Task: [what's happening]
Sub-Agents Active: [list]
Progress: [X/Y tasks complete]
Next Action: [what's next]
\`\`\`

## Workflow

### Step 1: Load Phase Details
1. Read the plan file at .ai/plans/[plan-file-name].md
2. Extract Phase [N] details including:
   - Goal and deliverables
   - Technical details
   - Acceptance criteria
   - Files to create/modify

### Step 2: Read Sub-Agent Guidelines
Load the guidelines for the principal owner and any supporting sub-agents:
- .claude/agents/frontend-developer.md
- .claude/agents/backend-typescript-developer.md
- .claude/agents/schema-architect.md
- .claude/agents/feature-tester-typescript.md

Also read Obsidian plugin development patterns:
- .claude/skills/obsidian/SKILL.md
- .claude/skills/obsidian/plugin-development.md

### Step 3: Execute Phase Work

Based on the phase deliverables, spawn sub-agents to do the work.

**For each deliverable/task in the phase:**

1. **Identify the right sub-agent** based on task type:
   - UI/UX/Vue components → Frontend Developer
   - API/TypeScript logic → Backend TypeScript Developer
   - Data modeling/Schemas → Schema Architect
   - Testing → Feature Tester (TypeScript)

2. **Spawn sub-agent using this pattern:**

\`\`\`typescript
Task({
    subagent_type: "general-purpose",
    description: "[Task description]",
    model: "sonnet",
    run_in_background: [true if can parallelize, false if sequential],
    prompt: \`You are the [Sub-Agent Type] sub-agent working on Phase [N].

## Context
Read your expertise guidelines in: .claude/agents/[sub-agent-file].md

## Obsidian Plugin Context
Read Obsidian plugin patterns in:
- .claude/skills/obsidian/SKILL.md
- .claude/skills/obsidian/plugin-development.md

## Plan Context
Read the full plan at: .ai/plans/[plan-file-name].md
Focus on Phase [N]: [Phase Name]

## Your Task
[Specific task description from the phase deliverables]

## Technical Requirements
- Files to create/modify: [list from plan]
- Key functions/components: [list from plan]
- Integration points: [list from plan]

## Acceptance Criteria
[Copy acceptance criteria from plan]

## Output Requirements
1. Implement the required functionality
2. Create necessary tests
3. Ensure code follows project patterns
4. Return a summary of:
   - Files created/modified
   - Key implementation decisions
   - Any issues encountered
   - Suggested next steps\`
})
\`\`\`

3. **Collect sub-agent results:**
   - Use TaskOutput to get results from background sub-agents
   - Track completion status
   - Note any issues or blockers

4. **Handle parallel sub-agents:**
   - If multiple sub-agents can work in parallel, launch them together
   - Wait for all to complete before proceeding to dependent tasks

### Step 4: Validate Phase Completion

1. **Check acceptance criteria:**
   - Review each criterion from the plan
   - Verify implementation satisfies it
   - Document any gaps

2. **Run tests within blast radius:**

   - If blast radius is empty string, run all tests: \`pnpm test\`
   - If blast radius is a pattern, run scoped tests: \`pnpm test [blast-radius]\`

   - Document **starting test failures** BEFORE making changes
   - Document **ending test failures** AFTER implementation
   - Ensure no NEW regressions within blast radius

3. **Verify build:**

   ```bash
   pnpm build
   # Plugin must build successfully via Vite
   ```

   If build fails, document errors and fix before marking phase complete.

4. **Optional: Deploy to vault for manual testing:**

   ```bash
   pnpm push
   # Copies built files to Obsidian vault
   ```

   Note: Obsidian must be restarted to load plugin changes.

5. **Update phase status in plan:**
   - Mark phase as complete
   - Note completion timestamp

### Step 5: Report Completion

Return a comprehensive summary:

\`\`\`markdown
## Phase [N] Complete: [Phase Name]

**Status:** COMPLETE / PARTIAL / BLOCKED

**Completion Time:** [timestamp]

**Deliverables Completed:**
- [x] [Deliverable 1]
- [x] [Deliverable 2]
- [ ] [Incomplete deliverable - if any]

**Files Created/Modified:**
- \`path/to/file1\` - [description]
- \`path/to/file2\` - [description]

**Sub-Agents Used:**
- [Sub-Agent Type]: [Task] - [Status]
- [Sub-Agent Type]: [Task] - [Status]

**Blast Radius:** \`[test scope pattern]\`

**Test Results (within blast radius):**
- Tests run: X
- Passed: Y
- Failed: Z
- Starting failures: [list any pre-existing failures]
- Ending failures: [list any failures after implementation]
- New regressions: [None / list new failures]

**Build Status:**
- Build successful: [Yes/No]
- Build errors: [None / list errors]

**Deployment (if applicable):**
- Pushed to vault: [Yes/No]
- Manual testing notes: [any observations]

**Acceptance Criteria:**
- [x] Criterion 1
- [x] Criterion 2

**Issues Encountered:**
- [Issue 1 and resolution]
- [Issue 2 and resolution]

**Notes for Next Phase:**
- [Any important context for subsequent phases]
\`\`\`

Execute the phase now and report back with your summary.`
})
```

### Launching Parallel Phases

When phases can run in parallel, launch ALL orchestrators in a SINGLE message:

```typescript
// Launch Group A phases in parallel
Task({ /* Phase 1 Orchestrator */ run_in_background: true })
Task({ /* Phase 2 Orchestrator */ run_in_background: true })
```

---

## Step 4: Monitor and Coordinate

As the Plan Executor, your job is to:

### 4.1 Track Phase Progress

Use TodoWrite to track overall progress:

```markdown
- [ ] Phase 1: [Name] - [Owner] - Status: Running
- [ ] Phase 2: [Name] - [Owner] - Status: Running
- [ ] Phase 3: [Name] - [Owner] - Status: Waiting (depends on 1, 2)
```

### 4.2 Collect Results

Use TaskOutput to gather results from background orchestrators:

```typescript
TaskOutput({ task_id: "phase-1-orchestrator-id", block: true })
TaskOutput({ task_id: "phase-2-orchestrator-id", block: true })
```

### 4.3 Update Execution Log

After each phase completes, update `.ai/logs/YYYY-MM-DD.plan-execution-log.md`:

```markdown
## Execution Progress

### [Timestamp] - Phase 1 Complete
- Duration: X minutes
- Status: Success
- Key outcomes: [summary]

### [Timestamp] - Phase 2 Complete
- Duration: Y minutes
- Status: Success
- Key outcomes: [summary]
```

### 4.4 Launch Dependent Phases

Once a group completes, launch the next group of phases:

```typescript
// Group A complete, now launch Group B
Task({ /* Phase 3 Orchestrator */ run_in_background: true })
```

### 4.5 Handle Issues

If a phase reports issues:

1. Document in execution log
2. Decide whether to:
   - Retry the phase
   - Skip and continue (if non-blocking)
   - Stop execution and report to user
3. Update user on status

---

## Step 5: Completion and Reporting

When all phases complete:

### 5.1 Final Validation

1. **Run full test suite:**

   ```bash
   pnpm test
   ```

2. **Verify build:**

   ```bash
   pnpm build
   ```

3. **Check for regressions:**
   - Compare against initial test state
   - Document any new failures

### 5.2 Update Plan Status

Edit the plan file to mark as implemented:

```markdown
**Status:** Implemented

## Implementation Summary

**Completed:** [Date]
**Total Duration:** [time]

**Phases Completed:**
- Phase 1: [Name] - Complete
- Phase 2: [Name] - Complete
- Phase 3: [Name] - Complete
```

### 5.3 Final Report to User

Provide a comprehensive summary:

```markdown
## Plan Execution Complete

**Plan:** [Plan Name]
**Execution Time:** [Total duration]
**Status:** SUCCESS / PARTIAL SUCCESS / FAILED

### Phase Summary

| Phase | Name | Owner | Status | Duration |
|-------|------|-------|--------|----------|
| 1 | [Name] | [Owner] | Complete | Xm |
| 2 | [Name] | [Owner] | Complete | Ym |
| 3 | [Name] | [Owner] | Complete | Zm |

### Files Changed

**Created:**
- `path/to/file1` - [description]
- `path/to/file2` - [description]

**Modified:**
- `path/to/file3` - [description]

### Test Results

- Total tests: X
- Passed: Y
- Failed: Z
- New tests added: W

### Build Status

- Build successful: Yes/No
- Final build output: dist/main.mjs

### Implementation Highlights

1. [Key implementation detail 1]
2. [Key implementation detail 2]
3. [Key implementation detail 3]

### Issues Resolved

1. [Issue and resolution]
2. [Issue and resolution]

### Next Steps

1. Review generated tests in `tests/unit/WIP/` (if any)
2. Run manual testing for [areas]
3. Optional: Deploy to vault with `pnpm push` and restart Obsidian
4. Consider [follow-up tasks]

### Logs

- Execution log: `.ai/logs/YYYY-MM-DD.plan-execution-log.md`
- Plan file: `.ai/plans/[plan-file].md`
```

---

## Execution Checklist

Use this checklist to track your progress:

- [ ] Plan file identified and loaded
- [ ] Execution log created
- [ ] Parallelization strategy analyzed
- [ ] Execution groups identified
- [ ] Group A phases launched
- [ ] Group A phases completed
- [ ] Group B phases launched (if applicable)
- [ ] Group B phases completed (if applicable)
- [ ] All phases completed
- [ ] Full test suite run
- [ ] Build verification successful
- [ ] Plan status updated
- [ ] Final report provided to user

---

## Error Handling

### Phase Fails

If a phase orchestrator reports failure:

1. Log the failure details
2. Check if dependent phases can still proceed
3. Ask user whether to:
   - Retry the failed phase
   - Continue without it
   - Stop execution

### Sub-Agent Timeout

Default timeout values:
- Phase orchestrators: 10 minutes (600000ms)
- Sub-agent tasks: 5 minutes (300000ms)
- Total plan execution: No limit (monitored by user)

To configure timeouts, use the `timeout` parameter in Task calls:

```typescript
Task({
    subagent_type: "general-purpose",
    description: "Orchestrate Phase N",
    model: "sonnet",
    run_in_background: true,
    timeout: 600000, // 10 minute timeout
    prompt: `...`
})
```

If a phase exceeds its timeout:

1. Log the timeout event with timestamp
2. Mark the phase status as `TIMEOUT` (distinct from `FAILED`)
3. Check if dependent phases can proceed
4. Continue to next phase if no blocking dependencies
5. Report timeout to user with recommendations:
   - Break the phase into smaller sub-phases
   - Increase the timeout for complex tasks
   - Investigate why the task is taking longer than expected

### Dependency Conflicts

If phases report conflicting changes:

1. Stop affected phases
2. Review conflicts
3. Coordinate resolution
4. Restart with corrected approach

---

## Checkpoint System

To enable recovery from failures, maintain checkpoints in the plan file after each phase completes:

### Checkpoint Format

Add an `## Execution Checkpoints` section to the plan file:

```yaml
## Execution Checkpoints

- phase_1:
    status: complete
    completed_at: 2025-12-19T14:30:00Z
    artifacts: [src/components/Feature.vue, src/composables/useFeature.ts]
- phase_2:
    status: complete
    completed_at: 2025-12-19T15:00:00Z
    artifacts: [src/api/feature.ts, tests/unit/feature.test.ts]
- phase_3:
    status: failed
    failed_at: 2025-12-19T15:30:00Z
    error: "Type error in UserService.ts:42"
    last_successful_step: "Created API endpoint"
```

### Resuming from Checkpoint

When resuming a failed plan execution:

1. **Check for existing checkpoints:**
   ```bash
   grep -A 20 "## Execution Checkpoints" .ai/plans/[plan-file].md
   ```

2. **Identify the failed phase** and its last successful step

3. **Resume execution** by:
   - Skipping completed phases (verify their artifacts exist)
   - Restarting the failed phase from its last successful step
   - Continuing with remaining phases

4. **Update checkpoints** as each phase completes

### Checkpoint Best Practices

- Update checkpoint immediately after each phase completes
- Include artifact paths for verification during resume
- Record error messages verbatim for debugging
- Never delete checkpoint data until plan is fully complete

---

## Context Window Management

Phase orchestrators must actively manage context to prevent overflow in large multi-phase plans:

### Guidelines for Orchestrators

1. **Request summaries from sub-agents, not full file contents:**
   - Sub-agents should return only: status, file paths, key decisions, blockers
   - Full implementation details go to `.ai/logs/phase-N-details.md`

2. **Use the standard output format:**
   Sub-agents return a structured response with:
   ```markdown
   ### Summary (for orchestrator - max 500 tokens)
   [Brief status and key points]

   ### Details (written to log file)
   [Full implementation notes - orchestrator reads from file if needed]
   ```

3. **Store detailed outputs in log files:**
   ```
   .ai/logs/
   ├── YYYY-MM-DD.plan-execution-log.md  (main log)
   ├── phase-1-details.md                 (sub-agent details)
   ├── phase-2-details.md
   └── ...
   ```

4. **Incremental summarization:**
   - After each phase, summarize key outcomes in the execution log
   - Don't carry full phase details forward to subsequent phases
   - Reference log files when detailed context is needed

5. **Sub-agent context instructions:**
   Include in sub-agent prompts:
   ```
   Return a SUMMARY to the orchestrator (max 500 tokens).
   Write DETAILED notes to: .ai/logs/phase-N-details.md
   ```

### Context Budget Guidelines

| Component | Target Budget |
|-----------|---------------|
| Phase summary to orchestrator | 500 tokens |
| Orchestrator's running state | 2000 tokens |
| Plan file reference | 1000 tokens |
| Error/blocker details | 500 tokens |

---

## Obsidian Plugin-Specific Considerations

### No Hot Reload
Unlike web development, Obsidian doesn't support hot module replacement:
- After building, use `pnpm push` to copy files to vault
- Restart Obsidian to load plugin changes
- Consider this when planning manual testing steps

### Plugin Architecture
Refer to `.claude/skills/obsidian/` for patterns:
- Plugin lifecycle and initialization
- Event system integration
- Settings management
- UI integration with Obsidian's workspace

### No Database
This plugin doesn't use a database:
- Relies on Obsidian's MetadataCache
- Uses Dataview plugin's index
- State managed through frontmatter and tags

---

## Tips for Success

1. **Status updates are critical** - Users need visibility into long-running operations
2. **Launch parallel phases together** - Use a single message with multiple Task calls
3. **Track everything** - Update todos and logs frequently
4. **Handle failures gracefully** - Don't let one failure cascade unnecessarily
5. **Validate incrementally** - Run tests after each phase, not just at the end
6. **Keep context concise** - Sub-agents should return summaries, not full file contents
7. **Build verification** - Always verify `pnpm build` succeeds after changes
8. **Reference Obsidian patterns** - Use `.claude/skills/obsidian/` for plugin-specific guidance
