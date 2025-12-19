---
description: Execute a phase of a detailed TDD plan from .ai/plans/
argument-hint: [phase-number]
---

# Execute Phase Using TDD Workflow

You are now in **TDD Execution Mode**. Your goal is to execute a single phase from a plan following the rigorous 5-Step TDD Workflow.

## Prerequisites

Before starting, ensure:

1. A plan exists in `.ai/plans/` directory
2. You know which phase to execute
3. All previous phases are complete (if applicable)

## Step 0: Load the Testing Skill

Before proceeding, invoke the appropriate testing skill based on the project language:

- **TypeScript projects:** Invoke the `unit-testing` skill to load TDD knowledge and Vitest best practices

Use the Skill tool to activate the relevant skill.

## Step 1: Identify the Phase

Ask the user:

1. **Which plan should we execute?**
   - List available plans in `.ai/plans/`
   - Or ask for the plan filename

2. **Which phase should we execute?**
   - Show available phases from the plan
   - Suggest the next incomplete phase
   - Confirm phase number with the user

3. **Read the plan file:**
   - Use Read tool to load `.ai/plans/[planName].md`
   - Extract the details for the specified phase
   - **Extract the blast radius** for this phase (test scope pattern)
   - If blast radius is empty string `""`, tests will run against entire test suite

## Step 1.5: EXPLORE EXISTING CODE - MANDATORY

**CRITICAL: Before doing ANYTHING else, understand what code already exists!**

**Purpose:** Prevent architectural misunderstandings by examining existing code structure BEFORE implementation.

**Actions:**

1. **Identify files mentioned in the plan:**

   From the phase description, note ALL files that will be created or modified.

2. **Search for existing related files:**

   ```bash
   # Search for files with similar names
   find src -name "*[keyword]*" -type f

   # Or use Glob
   Glob: src/**/*[keyword]*.ts
   ```

   For example, if implementing "logging", search for:
   - Existing files with "log" in the name
   - Related service stubs
   - Similar utilities

3. **Read existing stubs/interfaces:**

   If files already exist:
   - **Read them COMPLETELY** using the Read tool
   - Understand the existing structure
   - Note TODOs or incomplete sections
   - Check if you're meant to COMPLETE existing code, not create new files

4. **Understand the architecture:**

   Before writing code, understand:
   - What patterns does the existing code use?
   - Are there type definitions you need to follow?
   - Are there existing interfaces or base classes?
   - How do similar features work in the codebase?

5. **Use Grep to find usage patterns:**

   ```bash
   # Find how existing code uses similar features
   Grep: "similar pattern"
   Grep: "import.*from.*types"
   ```

6. **Reference Obsidian plugin patterns:**

   Read relevant Obsidian plugin development patterns:
   - `.claude/skills/obsidian/SKILL.md` - Overview
   - `.claude/skills/obsidian/plugin-development.md` - Plugin lifecycle and patterns
   - `.claude/skills/obsidian/codemirror-6.md` - Editor integration (if applicable)

7. **Document findings in log file:**

   ```markdown
   ### Existing Code Exploration

   **Files found:**
   - `src/hooks/services/logging.ts` - EXISTS as stub (needs completion)
   - `src/types/Service.ts` - Defines Service type pattern

   **Architecture notes:**
   - Services are composable functions that hooks subscribe to
   - Pattern: `(evt) => { kind, name, stage, fn }`
   - Post-stage services receive payload AND response

   **Obsidian integration:**
   - Plugin extends `Plugin` class from obsidian
   - Settings persisted in Obsidian's plugin data file
   - Event system via `on_xxx` handlers

   **Decision:** Complete existing stub, don't create new utility
   ```

8. **Validate plan against reality:**

   Ask yourself:
   - Does the plan match the existing code structure?
   - Am I creating something that already exists?
   - Am I understanding the architecture correctly?
   - Should I complete an existing stub instead of creating new files?
   - Does this follow Obsidian plugin patterns?

**If you discover a mismatch between the plan and existing code, STOP and inform the user before proceeding.**

**DO NOT SKIP THIS STEP.** Most architectural mistakes happen because this exploration was skipped.

---

## Step 2: SNAPSHOT - Capture Current Test State

**Purpose:** Establish a baseline so you can detect regressions and measure progress within the blast radius.

**Actions:**

1. **Run tests within the blast radius:**

   ```bash
   # If blast radius is empty string, run all tests:
   pnpm test

   # If blast radius is a pattern, run scoped tests:
   pnpm test [blast-radius]
   ```

2. **Verify build:**

   ```bash
   pnpm build
   # Plugin must build successfully via Vite
   ```

3. **Create XML snapshot:**

   Create a simple XML representation of test results:

   ```xml
   <test-snapshot date="YYYY-MM-DD">
     <blast-radius>[pattern or "all"]</blast-radius>
     <suite name="runtime-tests" total="X" passed="Y" failed="Z" />
     <build status="success|failure" />
     <starting-failures>
       <failure test="file.test.ts: test description" />
     </starting-failures>
   </test-snapshot>
   ```

4. **Document starting failures within blast radius** - these are your baseline, don't fix them yet

## Step 3: CREATE LOG - Document Starting Position

**Purpose:** Create a detailed record for debugging and tracking progress.

**Actions:**

1. **Create log file:**
   - Path: `.ai/logs/YYYY-MM-[planName]-phase[N]-log.md`
   - Example: `.ai/logs/2025-12-kind-model-feature-phase1-log.md`
   - Create `.ai/logs/` directory if it doesn't exist

2. **Write log file with starting state:**

   ```markdown
   # Phase [N]: [Phase Name]

   **Plan:** [planName]
   **Phase:** [N]
   **Started:** [Date and Time]
   **Blast Radius:** [test scope pattern or "all"]

   ## Phase Overview

   [Copy phase overview from plan]

   ## Starting Test Position

       <test-snapshot date="YYYY-MM-DD">
         <blast-radius>[pattern or "all"]</blast-radius>
         <suite name="runtime-tests" total="X" passed="Y" failed="Z" />
         <build status="success|failure" />
         <starting-failures>
           <failure test="file.test.ts: test description" />
         </starting-failures>
       </test-snapshot>

   ## Repo Starting Position

   **Last local commit:** [git log -1 --format="%H"]
   **Last remote commit:** [git log origin/main -1 --format="%H" 2>/dev/null || echo "N/A"]
   **Branch:** [git branch --show-current]
   **Dirty files:** [git status --short || echo "None"]

   ## Work Log

   [This section will be updated as work progresses]
   ```

3. **Save the log file**

4. **IMPORTANT:** Verify the markdown file has NO linting errors - proper formatting makes logs readable and professional

## Step 4: WRITE TESTS - Create Tests FIRST

**Purpose:** Tests define the contract and expected behavior before any code is written.

**CRITICAL: This is TRUE Test-Driven Development - tests MUST be written BEFORE implementation!**

**Actions:**

1. **Create WIP directory if needed:**

   ```bash
   mkdir -p test/unit/WIP
   ```

2. **Review test requirements from plan:**

   - Happy path tests
   - Edge case tests
   - Error condition tests
   - Type tests (TypeScript)

3. **Create test files in WIP directory:**

   - File naming: `phase[N]-[description].test.ts`
   - Example: `phase1-authentication.test.ts`
   - Use project's test patterns and conventions

4. **Write comprehensive tests:**

   For **TypeScript projects**:

   - Import from Vitest: `import { describe, it, expect } from "vitest"`
   - Import type assertions: `import type { Expect, AssertEqual, AssertExtends } from "inferred-types/types"`
   - Use `describe()` and `it()` blocks
   - Include BOTH runtime tests (using `expect()`) AND type tests (using `type cases = [...]`)
   - **NEVER separate runtime and type tests** - keep them in the same `it()` blocks
   - Use intermediate variables/types to allow hovering for type inspection

5. **Verify tests FAIL initially:**

   - Run only WIP tests: `pnpm test WIP` (or equivalent)
   - Confirm tests fail (no implementation exists yet)
   - This verifies the tests are checking for real functionality, not trivially passing

6. **Think critically about test completeness:**

   - Review each test and ask: **If the functionality were built, would this test be meaningful?**
   - Consider all variants the function/utility/symbol can express:
     - Different input types and combinations
     - Boundary conditions and edge cases
     - Error states and failure modes
     - Return value variations
   - **Think hardest here** - missing variants now means gaps in coverage later
   - Are you testing behavior, not just implementation details?
   - Would these tests catch regressions if someone changed the code?

7. **Update log file with test creation:**

   Add to "Work Log" section:

   ```markdown
   ### Tests Created

   - `test/unit/WIP/phase[N]-[description].test.ts`
     - [List of test cases written]

   **Initial test run:** All tests fail as expected (no implementation yet)
   ```

## Step 4.5: VALIDATE TESTS - Critical Checkpoint

**MANDATORY: Before proceeding to implementation, validate your tests are correct**

**Purpose:** Catch testing pattern mistakes NOW, before they're baked into implementation. This checkpoint prevents hours of rework.

### For TypeScript Projects

**Actions:**

1. **Open the validation checklist:**

   Open `~/.claude/skills/unit-testing/typescript.md` and go to the "Test Validation Checklist" section

2. **Complete EVERY item in the checklist:**

   - Import validation (correct paths and assertion utilities)
   - Structure validation (type cases arrays, no separation)
   - **Value capture validation (MOST CRITICAL)**:
     - Did you CAPTURE function results in variables?
     - Did you test BOTH runtime values AND types of those variables?
     - Are you testing `typeof capturedValue`, not abstract types?
   - Pattern comparison (does it match the skill examples?)
   - Final verification (do tests pass?)

3. **Compare your tests to skill examples:**

   Specifically, compare to Example 2 in the TypeScript guide ("Testing a Function with Narrow Return Type")

   Your tests should look similar - capturing values, testing them, then testing their types.

4. **Fix any deviations IMMEDIATELY:**

   - Wrong imports? Fix them.
   - Testing abstract types? Capture values and test those.
   - Dummy assertions like `expect(true).toBe(true)`? Remove them.
   - Separated runtime/type tests? Integrate them.

5. **Run the tests again:**

   ```bash
   pnpm test WIP  # Should pass after fixing patterns
   ```

6. **Update log file with validation:**

   ```markdown
   ### Test Validation

   - Completed TypeScript testing checklist
   - All tests follow correct pattern
   - Tests ready for implementation
   ```

**DO NOT PROCEED TO IMPLEMENTATION IF ANY CHECKLIST ITEM FAILS**

Testing mistakes caught here save hours of debugging and rework later. If you're unsure about any pattern, re-read the skill guide sections.

---

## Step 5: IMPLEMENTATION - Build to Pass Tests

**Purpose:** Let tests drive the implementation, ensuring you build exactly what's needed.

**Actions:**

1. **Implement minimal code to pass each test:**
   - Start with one test or small group of related tests
   - Write the simplest code that makes tests pass
   - Don't over-engineer or add features not covered by tests

2. **Follow the plan's implementation details:**
   - Create files specified in the plan
   - Modify files specified in the plan
   - Implement key functions/classes as planned

3. **Follow Obsidian plugin patterns:**
   - Reference `.claude/skills/obsidian/` for patterns
   - Plugin lifecycle: initialize in `onload()`, cleanup in `onunload()`
   - Settings: use `loadData()` and `saveData()`
   - UI: integrate with workspace API
   - Events: use `registerEvent()` for cleanup

4. **Iterate rapidly:**
   - Run WIP tests frequently: `pnpm test WIP`
   - Fix failures immediately
   - Keep the feedback loop tight

5. **Continue until all phase tests pass:**
   - All tests in `test/unit/WIP/` must be green
   - No shortcuts - every test must pass

6. **Verify build:**
   ```bash
   pnpm build
   # Must build successfully
   ```

7. **Refactor with confidence:**
   - Once tests pass, improve code quality
   - Tests act as a safety net
   - Re-run tests after each refactor

8. **Update log file during implementation:**

   Add to "Work Log" section as you go:

   ```markdown
   ### Implementation Progress

   **[Timestamp]** - Created `path/to/file.ts`
   - Implemented `functionName()`
   - Tests passing: X/Y

   **[Timestamp]** - Modified `path/to/existing-file.ts`
   - Added integration with new functionality
   - Tests passing: Y/Y

   **[Timestamp]** - Verified build
   - Build successful

   **[Timestamp]** - Refactored for better readability
   - All tests still passing
   ```

## Step 6: CLOSE OUT - Verify and Document

**Purpose:** Ensure quality, prevent regressions, and properly document completion.

### CRITICAL WARNING: DO NOT MIGRATE TESTS AUTOMATICALLY

**Tests MUST remain in `test/unit/WIP/` until the user explicitly reviews and approves them!**

**Actions:**

1. **Run tests within blast radius:**

   ```bash
   # If blast radius is empty string, run all tests:
   pnpm test        # All runtime tests

   # If blast radius is a pattern, run scoped tests:
   pnpm test [blast-radius]
   ```

2. **Verify build:**

   ```bash
   pnpm build
   # Must build successfully
   ```

3. **Optional: Deploy to vault for manual testing:**

   ```bash
   pnpm push
   # Copies built files to Obsidian vault
   ```

   Note: User must restart Obsidian to load plugin changes.

4. **Check for regressions within blast radius:**

   Compare ending test failures against starting failures:

   - **Capture ending failures:** Run tests and note all failures
   - **Compare against starting failures:** Identify NEW failures
   - **New regressions = ending failures - starting failures**

   If NEW regressions exist:

   - **STOP and think deeply** - understand WHY, not just the error message
   - Add a "Regressions Found" section to log file with test name, failure message, root cause analysis, and resolution
   - Determine root cause:
     - Is your implementation incorrect?
     - Does the existing test need updating? (only if requirements changed)
     - Is there a side effect you didn't anticipate?
   - Fix the root cause, not just the symptom
   - Re-run tests within blast radius to confirm fix

5. **Update log file with completion:**

   Add `## Phase Completion` section:

   ```markdown
   ## Phase Completion

   **Completed:** [Date and Time]
   **Duration:** [Time taken]
   **Blast Radius:** [test scope pattern or "all"]

   ### Final Test Results (within blast radius)

   - WIP tests: X/X passing
   - Blast radius tests: Y/Y passing

   ### Build Status

   - Build successful: Yes/No
   - Build output: dist/main.mjs

   ### Regression Analysis

   **Starting failures:** [count] tests
   - [list from starting snapshot]

   **Ending failures:** [count] tests
   - [list from final run]

   **New regressions:** [None / list any new failures]

   ### Files Changed

   **Created:**
   - `path/to/new-file.ts`

   **Modified:**
   - `path/to/existing-file.ts`

   ### Tests Location

   **IMPORTANT:** Tests remain in `test/unit/WIP/` awaiting user review.

   The user must review and approve tests before they are migrated to their permanent location.
   ```

   **Verify markdown quality:** Ensure log file has no linting errors

6. **Update plan status:**

   - Read the plan file
   - Mark this phase as complete
   - Update the plan's status section
   - Save the updated plan
   - **Verify markdown quality:** Ensure updated plan has no linting errors

7. **Report completion to user:**

   Provide a clear summary:

   ```text
   Phase [N] Complete: [Phase Name]

   **What was implemented:**
   - [Summary of implementation]

   **Test coverage added:**
   - [Number] tests written
   - All tests passing
   - No regressions

   **Build status:**
   - Build successful
   - Output: dist/main.mjs

   **Tests location:**
   Tests are in `test/unit/WIP/` awaiting your review

   **Next steps:**
   1. Review tests in `test/unit/WIP/phase[N]-*.test.ts`
   2. When satisfied, tell me to "migrate the tests"
   3. Optional: Run `pnpm push` and restart Obsidian to test manually
   4. Or run `/execute-phase [N+1]` to continue to next phase

   **Log file:** `.ai/logs/YYYY-MM-[planName]-phase[N]-log.md`
   ```

## After User Reviews Tests

**Only after explicit user approval:**

1. **Ask where tests should be migrated:**
   - Think carefully about the right permanent location
   - Consider if a new subdirectory is needed
   - Follow project's test organization patterns

2. **Migrate tests:**

   ```bash
   mv test/unit/WIP/phase[N]-*.test.ts [permanent-location]/
   ```

3. **Verify tests still pass in new location:**

   ```bash
   pnpm test
   ```

4. **Delete WIP directory (if empty):**

   ```bash
   rmdir test/unit/WIP
   ```

5. **Update log file with final locations:**

   ```markdown
   ### Tests Migrated

   - `test/unit/WIP/phase1-auth.test.ts` → `test/unit/auth/authentication.test.ts`

   All tests passing in new location
   ```

   **Verify markdown quality:** Ensure log file updates have no linting errors

## Important Reminders

- **Tests FIRST** - Always write tests before implementation
- **WIP directory** - All new tests go in `test/unit/WIP/`
- **No auto-migration** - Tests remain in WIP until user approves
- **Log everything** - Keep the log file updated throughout
- **Understand failures** - Don't just fix symptoms, understand root causes
- **Blast radius testing** - Run tests within blast radius, not necessarily entire suite
- **Track regressions properly** - Compare ending failures against starting failures; only NEW failures are regressions
- **TypeScript: Dual testing** - Include both runtime AND type tests where appropriate
- **TypeScript: Integration** - NEVER separate runtime and type tests into different blocks
- **Build verification** - Always verify `pnpm build` succeeds
- **Obsidian patterns** - Reference `.claude/skills/obsidian/` for plugin-specific guidance
- **No hot reload** - Obsidian must be restarted to test plugin changes
- **Markdown quality** - ALL markdown files (logs, plan updates) MUST be lint-free; linting errors make documents very hard to read

## Obsidian Plugin-Specific Considerations

### Plugin Lifecycle
- Initialize in `onload()` method
- Clean up in `onunload()` method
- Use `registerEvent()` for automatic cleanup
- Defer initialization if dependencies required (e.g., Dataview)

### Settings Management
- Use `loadData()` to load settings
- Use `saveData()` to persist settings
- Settings are stored in Obsidian's plugin data directory

### Event System
- File events: `on_file_created`, `on_file_deleted`, `on_file_modified`
- Editor events: `on_editor_change`, `on_tab_change`
- Use event handlers for cache invalidation

### No Database
- Use Obsidian's MetadataCache for file metadata
- Use Dataview plugin's index for queries
- State managed through frontmatter and tags

### Testing Changes
- Build with `pnpm build`
- Push to vault with `pnpm push` (optional)
- Restart Obsidian to load changes
- No hot reload available

## Phase Execution Checklist

Use this checklist to ensure you don't miss any steps:

- [ ] Testing skill loaded (unit-testing)
- [ ] Plan and phase identified
- [ ] **Blast radius extracted from plan**
- [ ] **Existing code explored** (Obsidian patterns reviewed)
- [ ] SNAPSHOT captured (baseline test state within blast radius)
- [ ] **Starting failures documented**
- [ ] LOG created in `.ai/logs/`
- [ ] Starting position documented
- [ ] Tests written in `test/unit/WIP/`
- [ ] Tests initially failed (proving validity)
- [ ] Implementation completed
- [ ] All WIP tests passing
- [ ] **Build verified** (`pnpm build`)
- [ ] **Blast radius tests run**
- [ ] **Ending failures documented**
- [ ] **No NEW regressions** (ending - starting = 0 new failures)
- [ ] Log file updated with completion
- [ ] Plan status updated
- [ ] User notified with summary
- [ ] **Tests remain in WIP awaiting review**

**After user review:**

- [ ] User approved tests
- [ ] Tests migrated to permanent location
- [ ] Tests verified in new location
- [ ] WIP directory removed (if empty)
- [ ] Log file updated with final locations
