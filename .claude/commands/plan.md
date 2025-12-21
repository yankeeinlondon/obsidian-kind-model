---
description: Create a detailed multi-phase plan with sub-agent ownership and parallel reviews
---

# Multi-Phase Planning with Sub-Agent Review

You have been asked to create a comprehensive implementation plan. This command orchestrates a sophisticated planning workflow that leverages specialized sub-agents for domain expertise and parallel review.

**IMPORTANT:** Use the TodoWrite tool to track your progress through these steps.

## Overview

This planning workflow:

1. Gathers requirements and analyzes the task
2. Creates a detailed plan with phases and assigns principal owners
3. Launches parallel reviews by domain specialists
4. Consolidates feedback and identifies parallelization opportunities
5. Produces a final, implementation-ready plan

## Available Sub-Agents (Principal Owners)

| Sub-Agent | Domain | Assign When |
|-----------|--------|-------------|
| **Frontend Developer** | UI, UX, Vue 3, CSS, accessibility, CodeMirror | User-facing interfaces, editor extensions, components |
| **Backend TypeScript Developer** | Plugin core logic, APIs, handlers, event system | Plugin architecture, query handlers, page APIs |
| **Schema Architect** | Type systems, data modeling, validation | TypeToken system, type definitions, data contracts |
| **Feature Tester (TypeScript)** | TypeScript testing strategy, TDD, Vitest, type tests | All features requiring test coverage |

**NOT Used in This Project:**
- ~~Rust Developer~~ - No Rust code in this Obsidian plugin
- ~~Database Expert~~ - No database (uses Obsidian's MetadataCache and Dataview index)

---

## Prerequisites

Before starting:

1. **Ensure required directories exist:**

   ```bash
   mkdir -p .ai/plans .ai/logs
   ```

2. **Verify sub-agent definitions are accessible:**

   These commands require sub-agent definitions in one of these locations:
   - `.claude/agents/` (project-level, preferred)
   - `~/.claude/agents/` (user-level, fallback)

   Required agent files:
   - `agents/frontend-developer.md`
   - `agents/backend-typescript-developer.md`
   - `agents/schema-architect.md`
   - `agents/feature-tester-typescript.md`

   If running from a different directory, ensure `.claude/` is accessible or symlinked.

3. **Activate Obsidian skill:**

   Before proceeding with planning, activate the `obsidian` skill from `.claude/skills/obsidian/` for Obsidian-specific expertise.

---

## Step 1: Requirements Gathering

### 1.1 Understand the Task

Ask the user clarifying questions to fully understand what needs to be built:

1. **What is being built?**
   - Feature name and description
   - Primary goal and user value
   - How does it fit into the Kind Model system?

2. **Who are the stakeholders?**
   - End users (vault users)
   - Integration with existing handlers/APIs
   - Dependencies on Dataview or other plugins

3. **What are the constraints?**
   - Performance requirements (rendering speed, cache freshness)
   - Compatibility needs (Obsidian version, mobile vs desktop)
   - Timeline expectations (scope, not duration)

### 1.2 Identify Requirements

Document both functional and non-functional requirements:

**Functional Requirements (FR):**

- What the plugin should DO
- User interactions and flows
- Data inputs and outputs (frontmatter, tags, links)
- Business rules and logic (classification, relationships)

**Non-Functional Requirements (NFR):**

- Performance (render time, cache invalidation)
- Plugin lifecycle considerations (loading, unloading, settings)
- Obsidian API compatibility (MetadataCache, Workspace, Vault)
- Dataview dependency management
- CodeMirror integration (if editor extensions needed)
- Mobile compatibility (if applicable)
- Maintainability (code standards, documentation)

### 1.3 Codebase Analysis

Use the Task tool with `subagent_type=Explore` to understand the current codebase:

```
Explore the codebase to understand:
1. Existing architecture and patterns (higher-order functions, currying)
2. Relevant files and modules (src/handlers/, src/page/, src/api/)
3. Plugin lifecycle hooks and event system
4. Testing infrastructure (Vitest setup)
5. Build and deployment processes (Vite, pnpm push)
6. How similar features are implemented
```

---

## Step 2: Create the Initial Plan

### 2.1 Plan Structure

Create a plan document at `.ai/plans/YYYY-MM-DD.plan-name.md`:

```markdown
# [Plan Name]

**Created:** [Date]
**Status:** Draft - Awaiting Review
**Plugin:** Kind Model (Obsidian)

## Executive Summary

[2-3 sentence overview of what this plan accomplishes]

## Requirements

### Functional Requirements

| ID | Requirement | Priority | Owner |
|----|-------------|----------|-------|
| FR-1 | [requirement] | High/Med/Low | [sub-agent] |
| FR-2 | [requirement] | High/Med/Low | [sub-agent] |

### Non-Functional Requirements

| ID | Requirement | Target | Owner |
|----|-------------|--------|-------|
| NFR-1 | [requirement] | [metric] | [sub-agent] |
| NFR-2 | [requirement] | [metric] | [sub-agent] |

## Architecture Overview

[High-level architecture description]

### Component Diagram

[ASCII or description of component relationships]

### Data Flow

[How data moves through the system - consider both Obsidian MetadataCache and Dataview index]

## Phases

### Phase 1: [Phase Name]

**Principal Owner:** [Frontend/Backend TS/Schema Architect/Feature Tester]

**Goal:** [What this phase accomplishes]

**Dependencies:** None / [list dependencies]

**Blast Radius:** [Test scope - glob pattern or empty string for all tests]

**Deliverables:**
- [Deliverable 1]
- [Deliverable 2]

**Technical Details:**
- Files to create/modify
- Key functions/components
- Integration points (Obsidian API, Dataview, CodeMirror)
- Plugin lifecycle considerations

**Acceptance Criteria:**
- [ ] [Criterion 1]
- [ ] [Criterion 2]

---

### Phase 2: [Phase Name]

[Repeat structure - include Blast Radius field]

---

## Blast Radius Analysis

For each phase, determine the **blast radius** - the scope of tests that should be run to verify both new functionality AND detect unintended downstream effects.

### How to Determine Blast Radius

1. **Identify direct test files:**
   - Tests for files being created/modified
   - Example: `test/handlers/**/*.test.ts` for handler changes

2. **Identify downstream dependencies:**
   - What modules import the files being changed?
   - What tests cover those dependent modules?

3. **Construct the glob pattern:**
   - Combine direct and downstream test patterns
   - Use `test/{handlers,page,api}/**/*.test.ts` for multiple areas

4. **Use empty string for full coverage:**
   - If changes are foundational (types, utilities, core modules)
   - If unsure about impact scope
   - Empty string `""` runs ALL tests

### Blast Radius Examples (Obsidian Plugin)

| Change Type | Blast Radius |
|-------------|--------------|
| New isolated handler | `test/handlers/NewHandler.test.ts` |
| Page API changes | `test/{page,api}/**/*.test.ts` |
| Type definition changes | `""` (all tests - types affect everything) |
| Event system changes | `test/{events,handlers}/**/*.test.ts` |
| Cache/startup changes | `""` (foundational - affects entire plugin) |
| CodeMirror extension | `test/editor/**/*.test.ts` |

---

## Cross-Cutting Concerns

### Testing Strategy
- Unit tests: [approach using Vitest]
- Type tests: [for complex types using inferred-types]
- Manual testing: [in Obsidian vault using `pnpm dev`]

### Obsidian API Considerations
- Plugin lifecycle: [onload, onunload, deferred initialization]
- Data freshness: [MetadataCache vs Dataview index]
- Event handling: [file events, editor events, layout changes]
- Settings persistence: [plugin data file]

### Performance Considerations
- Render performance: [KM block re-rendering, debouncing]
- Cache invalidation: [when to refresh kind/type definitions]
- Filter optimization: [cheap operations first, expensive last]

### CodeMirror Integration (if applicable)
- Editor extensions: [decorations, widgets, state fields]
- Event handling: [editor change events]

## Parallelization Opportunities

[Phases that can be executed in parallel]

| Parallel Group | Phases | Reason |
|----------------|--------|--------|
| Group A | Phase 1, Phase 2 | No dependencies |
| Group B | Phase 3 | Depends on Group A |

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| [Risk 1] | High/Med/Low | [Mitigation strategy] |

## Open Questions

- [ ] [Question 1]
- [ ] [Question 2]
```

### 2.2 Assign Principal Owners

For each phase and requirement, assign a principal owner based on:

| Content Type | Primary Owner | Secondary |
|--------------|---------------|-----------|
| Vue components, UI layouts, styling, CodeMirror widgets | Frontend Developer | - |
| Plugin core logic, handlers, APIs, event system | Backend TypeScript Developer | - |
| Type systems, TypeToken validation, data modeling | Schema Architect | Backend TS |
| Data contracts, classification schema | Schema Architect | Backend TS |
| Testing strategy, test coverage, TDD workflow | Feature Tester (TS) | Backend TS |
| Full-stack features (UI + handler logic) | Backend TS + Frontend | (split phases) |

---

## Step 3: Parallel Sub-Agent Reviews

**CRITICAL:** Launch ALL reviews in PARALLEL using multiple Task tool calls in a single message.

### 3.1 Review Prompts

For each sub-agent with assigned ownership, create a review task:

**Frontend Developer Review:**

```typescript
Task({
    subagent_type: "general-purpose",
    description: "Frontend review of [plan-name]",
    model: "sonnet",
    run_in_background: true,
    prompt: `You are the Frontend Developer sub-agent reviewing a plan for an Obsidian plugin.

## First: Activate Skills
Activate the \`vuejs\` and \`obsidian\` skills before proceeding with the review.

## Context
Read your expertise guidelines in: .claude/agents/frontend-developer.md

## Plan to Review
Read the plan at: .ai/plans/YYYY-MM-DD.plan-name.md

## Your Review Focus
Review ALL sections where Frontend Developer is assigned as owner, plus:

1. **Component Architecture**
   - Are Vue 3 component boundaries well-defined?
   - Is the composition pattern appropriate?
   - Are there reusability opportunities?
   - Are CodeMirror extensions properly structured (if applicable)?

2. **User Experience**
   - Is the user flow intuitive within Obsidian?
   - Are loading and error states handled?
   - Is the UI consistent with Obsidian's design patterns?

3. **Type Safety**
   - Are props and events properly typed?
   - Are there opportunities for better type inference?

4. **Styling Approach**
   - Does styling follow Obsidian's CSS variable conventions?
   - Are responsive requirements addressed?
   - Is mobile compatibility considered?

5. **Obsidian Integration**
   - Are Obsidian Workspace APIs used correctly?
   - Are editor extensions (CodeMirror) implemented properly?
   - Is DOM rendering compatible with Obsidian's markdown renderer?

6. **Feasibility & Estimates**
   - Are the frontend phases achievable?
   - Are there hidden complexities?

## Output Format
Return your review as:

### Frontend Developer Review

**Overall Assessment:** [Approve / Approve with Changes / Request Revision]

**Strengths:**
- [strength 1]
- [strength 2]

**Concerns:**
- [concern 1 with suggested fix]
- [concern 2 with suggested fix]

**Suggested Changes:**
1. [specific change to plan]
2. [specific change to plan]

**Parallelization Notes:**
- [which frontend phases can run in parallel]
- [dependencies to be aware of]

**Missing Considerations:**
- [anything overlooked regarding Obsidian UI integration]`
})
```

**Backend TypeScript Developer Review:**

```typescript
Task({
    subagent_type: "general-purpose",
    description: "Backend TS review of [plan-name]",
    model: "sonnet",
    run_in_background: true,
    prompt: `You are the Backend TypeScript Developer sub-agent reviewing a plan for an Obsidian plugin.

## First: Activate Skills
Activate the \`typescript\`, \`unit-testing\`, and \`obsidian\` skills before proceeding with the review.

## Context
Read your expertise guidelines in: .claude/agents/backend-typescript-developer.md

## Plan to Review
Read the plan at: .ai/plans/YYYY-MM-DD.plan-name.md

## Your Review Focus
Review ALL sections where Backend TypeScript Developer is assigned as owner, plus:

1. **Plugin Architecture**
   - Is the plugin lifecycle properly managed (onload/onunload)?
   - Is deferred initialization (Dataview dependency) handled correctly?
   - Are higher-order functions and currying patterns followed?

2. **Handler Design**
   - Are createHandler() patterns used correctly?
   - Is TypeToken validation appropriate?
   - Are scalar/options parameters well-defined?

3. **Page API Usage**
   - Are getPage/getPageInfo/getPageInfoBlock used appropriately?
   - Is data freshness considered (MetadataCache vs Dataview)?
   - Are filter chains ordered efficiently (cheap operations first)?

4. **Type Architecture**
   - Are discriminated unions used for variants?
   - Is validation thorough (TypeToken system)?
   - Are types inferred where possible?

5. **Event System**
   - Are file/editor events handled correctly?
   - Is KM block re-rendering optimized (debouncing, normalized HTML)?
   - Are cache invalidation patterns correct?

6. **Error Handling**
   - Are errors from Obsidian API calls handled?
   - Are user-facing error messages clear?
   - Is @yankeeinlondon/kind-error used appropriately?

7. **Testing Strategy**
   - Is the testing approach comprehensive?
   - Are both runtime and type tests planned?
   - Are integration points covered?

## Output Format
Return your review as:

### Backend TypeScript Developer Review

**Overall Assessment:** [Approve / Approve with Changes / Request Revision]

**Strengths:**
- [strength 1]
- [strength 2]

**Concerns:**
- [concern 1 with suggested fix]
- [concern 2 with suggested fix]

**Suggested Changes:**
1. [specific change to plan]
2. [specific change to plan]

**Parallelization Notes:**
- [which backend phases can run in parallel]
- [dependencies to be aware of]

**Missing Considerations:**
- [anything overlooked regarding plugin architecture]`
})
```

**Schema Architect Review:**

```typescript
Task({
    subagent_type: "general-purpose",
    description: "Schema/data modeling review of [plan-name]",
    model: "sonnet",
    run_in_background: true,
    prompt: `You are the Schema Architect sub-agent reviewing a plan for an Obsidian plugin.

## First: Activate Skills
Activate the \`typescript\` and \`obsidian\` skills before proceeding with the review.

## Context
Read your expertise guidelines in: .claude/agents/schema-architect.md

## Plan to Review
Read the plan at: .ai/plans/YYYY-MM-DD.plan-name.md

## Your Review Focus
Review ALL sections where Schema Architect is assigned as owner, plus:

1. **Data Modeling**
   - Are entities and relationships well-defined?
   - Does the classification hierarchy (Type > Kind > Category > SubCategory) fit?
   - Are frontmatter conventions clear?

2. **Type System Design**
   - Can invalid states be represented? (they shouldn't be)
   - Are branded types used for identifiers?
   - Is type evolution considered?

3. **TypeToken Validation**
   - Is the TypeToken syntax used correctly?
   - Are validation rules appropriate (opt, array, enum, union)?
   - Are there edge cases to handle?

4. **Page API Contracts**
   - Are Page/PageInfo/PageBlock contracts well-defined?
   - Is there a single source of truth for types?
   - Are transformations documented?

5. **Dataview Integration**
   - Are DvPage types handled correctly?
   - Is the distinction between Dataview and MetadataCache clear?
   - Are link/tag representations consistent?

6. **Evolution & Versioning**
   - How will types evolve?
   - Is backwards compatibility with user vaults addressed?

## Output Format
Return your review as:

### Schema Architect Review

**Overall Assessment:** [Approve / Approve with Changes / Request Revision]

**Strengths:**
- [strength 1]
- [strength 2]

**Concerns:**
- [concern 1 with suggested fix]
- [concern 2 with suggested fix]

**Suggested Changes:**
1. [specific change to plan]
2. [specific change to plan]

**Parallelization Notes:**
- [which schema/data phases can run in parallel]
- [dependencies to be aware of]

**Missing Considerations:**
- [anything overlooked regarding type systems or data modeling]`
})
```

**Feature Tester Review (TypeScript):**

```typescript
Task({
    subagent_type: "general-purpose",
    description: "TypeScript testing strategy review of [plan-name]",
    model: "sonnet",
    run_in_background: true,
    prompt: `You are the Feature Tester (TypeScript) sub-agent reviewing a plan for an Obsidian plugin.

## First: Activate Skills
Activate the \`unit-testing\` and \`obsidian\` skills before proceeding with the review.

## Context
Read your expertise guidelines in: .claude/agents/feature-tester-typescript.md

## Plan to Review
Read the plan at: .ai/plans/YYYY-MM-DD.plan-name.md

## Your Review Focus
Review the TypeScript testing strategy and ensure comprehensive test coverage:

1. **Test Strategy Completeness**
   - Are unit tests planned for all new code?
   - Is TDD workflow incorporated appropriately?
   - Is manual testing in Obsidian vault planned (\`pnpm dev\`)?

2. **Test Coverage**
   - Are happy paths covered?
   - Are edge cases and error conditions addressed?
   - Are type tests planned for complex types?

3. **Test Organization**
   - Is test file placement consistent (test/ directory)?
   - Are test utilities and fixtures planned?
   - Is test data management addressed?

4. **Obsidian Testing Challenges**
   - How will Obsidian API dependencies be mocked/isolated?
   - How will Dataview plugin dependency be tested?
   - Are plugin lifecycle scenarios tested?

5. **Acceptance Criteria Testability**
   - Can each acceptance criterion be verified by a test?
   - Are there missing criteria that should be added?

6. **TypeScript-Specific Testing**
   - Are runtime AND type tests planned together?
   - Is Vitest configured correctly?
   - Are inferred-types assertions used for type tests?

7. **Blast Radius Validation**
   - Are blast radius patterns correct for each phase?
   - Are downstream dependencies identified?

## Output Format
Return your review as:

### Feature Tester (TypeScript) Review

**Overall Assessment:** [Approve / Approve with Changes / Request Revision]

**Strengths:**
- [strength 1]
- [strength 2]

**Concerns:**
- [concern 1 with suggested fix]
- [concern 2 with suggested fix]

**Suggested Changes:**
1. [specific change to plan]
2. [specific change to plan]

**Test Scenarios to Add:**
- [missing test scenario 1]
- [missing test scenario 2]

**Missing Considerations:**
- [anything overlooked regarding testing in Obsidian context]`
})
```

### 3.2 Launch Reviews in Parallel

**IMPORTANT:** Send ALL relevant Task calls in a SINGLE message to run them in parallel.

Only invoke sub-agents that have assigned ownership in the plan.

Example parallel invocation:

```typescript
// All in ONE message for parallel execution
Task({ /* Frontend review */ run_in_background: true })
Task({ /* Backend TS review */ run_in_background: true })
Task({ /* Schema Architect review */ run_in_background: true })
Task({ /* Feature Tester review */ run_in_background: true })
```

### 3.3 Collect Review Results

Use TaskOutput to collect results from all background tasks:

```typescript
TaskOutput({ task_id: "frontend-review-id", block: true })
TaskOutput({ task_id: "backend-review-id", block: true })
TaskOutput({ task_id: "schema-architect-review-id", block: true })
TaskOutput({ task_id: "feature-tester-review-id", block: true })
```

---

## Step 4: Consolidation and Optimization

After all reviews complete, perform a final consolidation pass:

### 4.1 Synthesize Feedback

1. **Aggregate Concerns:** Group similar concerns across reviews
2. **Resolve Conflicts:** If reviewers disagree, determine the best path
3. **Prioritize Changes:** Order suggested changes by impact

### 4.2 Update the Plan

Incorporate review feedback into the plan:

1. Update requirement assignments if suggested
2. Modify phase details based on concerns
3. Add missing considerations identified by reviewers
4. Update acceptance criteria
5. Add Obsidian-specific considerations flagged by reviewers

### 4.3 Finalize Parallelization Analysis

Based on all reviews, create the final parallelization strategy:

```markdown
## Implementation Parallelization Strategy

### Parallel Execution Groups

| Group | Phases | Can Start After | Assignees |
|-------|--------|-----------------|-----------|
| A | 1, 2 | Plan approval | Frontend, Schema |
| B | 3 | Group A complete | Backend TS |
| C | 4, 5 | Phase 3 complete | Backend TS, Feature Tester |

### Parallelization Diagram

```text
Timeline:
─────────────────────────────────────────────────────►

Group A: ████████████ (Phase 1 + Phase 2 in parallel)
                     │
Group B:             └──████████ (Phase 3)
                              │
Group C:                      └──████████████ (Phase 4 + Phase 5)
```

### Synchronization Points

1. **After Group A:** Type contracts must be finalized
2. **After Group B:** Handler APIs must be tested in vault
3. **Final:** Integration testing in live Obsidian environment
```

### 4.4 Update Plan Status

Change the plan status and add the review summary:

```markdown
**Status:** Reviewed - Ready for Implementation

## Review Summary

**Reviews Completed:** [Date]

**Reviewers:**
- Frontend Developer: [Approve/Approve with Changes/Request Revision]
- Backend TS Developer: [Approve/Approve with Changes/Request Revision]
- Schema Architect: [Approve/Approve with Changes/Request Revision]
- Feature Tester (TypeScript): [Approve/Approve with Changes/Request Revision]

**Key Changes from Review:**
1. [Change 1]
2. [Change 2]
3. [Change 3]

**Resolved Concerns:**
- [Concern] → [Resolution]
```

---

## Step 5: Present to User

### 5.1 Summary Report

Present the final plan to the user with:

1. **Executive Summary** - What will be built
2. **Phase Overview** - High-level view of all phases
3. **Owner Assignments** - Who owns what
4. **Parallelization Strategy** - How to maximize efficiency
5. **Key Risks** - Top risks and mitigations
6. **Obsidian-Specific Notes** - Plugin lifecycle, API usage, testing approach
7. **Open Questions** - Items needing user input

### 5.2 Request Approval

Ask the user to:

1. Review the plan at `.ai/plans/YYYY-MM-DD.plan-name.md`
2. Answer any open questions
3. Test in vault if needed (`pnpm dev`)
4. Approve or request changes

---

## Output Artifacts

This command produces:

| Artifact | Location | Purpose |
|----------|----------|---------|
| Plan Document | `.ai/plans/YYYY-MM-DD.plan-name.md` | Complete implementation plan |
| Review Log | Embedded in plan | Sub-agent feedback |

---

## Example Workflow

```text
User: Create a plan for adding a new query handler for time-based filtering

Main Thread:
├── Step 1: Gather requirements
│   ├── Ask clarifying questions
│   ├── Document FR and NFR
│   └── Explore codebase (existing handlers, TypeToken system)
│
├── Step 2: Create initial plan
│   ├── Draft plan with phases
│   ├── Assign principal owners:
│   │   ├── Backend TS: Handler implementation, event hookup
│   │   ├── Schema Architect: TypeToken parameter validation
│   │   └── Feature Tester: Test coverage, manual vault testing
│   └── Save to .ai/plans/
│
├── Step 3: Parallel reviews (ALL AT ONCE)
│   ├── Backend TS Developer ──┐
│   ├── Schema Architect ───────├── Running in parallel
│   └── Feature Tester ─────────┘
│
├── Step 4: Consolidation
│   ├── Synthesize feedback
│   ├── Update plan
│   ├── Finalize parallelization:
│   │   ├── Group A: Schema + handler scaffolding (parallel)
│   │   ├── Group B: Event integration + testing (after Group A)
│   │   └── Group C: Manual vault testing (after Group B)
│   └── Mark as reviewed
│
└── Step 5: Present to user
    └── Request approval + vault testing
```

---

## Tips for Success

1. **Be thorough in Step 1** - Good requirements lead to good plans
2. **Assign owners carefully** - Match expertise to tasks
3. **Always run reviews in parallel** - This is the key efficiency gain
4. **Don't skip consolidation** - Cross-cutting concerns emerge in review
5. **Document parallelization clearly** - Implementation teams need this
6. **Consider Obsidian-specific constraints** - Plugin lifecycle, data freshness, mobile compatibility
7. **Plan for vault testing** - Manual testing with `pnpm dev` is critical
8. **Keep the plan living** - Update as implementation reveals new information

---

## Next Steps After Planning

Once the plan is approved:

1. **For TDD workflow:** Use `/execute-phase` to implement each phase
2. **For feature workflow:** Use `/add-feature` with the plan as context
3. **For parallel implementation:** Coordinate sub-agents based on parallelization groups
4. **For testing:** Use `pnpm test` and `pnpm dev` for vault testing
5. **For quality:** Use `pnpm lint` to ensure code standards

---

## Common Test Commands

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with UI
pnpm test:ui

# Lint code
pnpm lint
pnpm lint:fix

# Build and test in vault
pnpm dev
```
