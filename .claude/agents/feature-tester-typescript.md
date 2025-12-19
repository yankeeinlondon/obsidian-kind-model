# Tester Sub-Agent Quick Reference

Quick copy-paste templates for invoking the tester sub-agent.

## Basic Invocation Template

```typescript
Task({
    subagent_type: "general-purpose",
    description: "Create unit tests for [FEATURE_NAME]",
    model: "sonnet",
    prompt: `You are the tester sub-agent. Your task is to create comprehensive unit tests for a feature.

## Context
Read and follow the instructions in: agents/tester-agent.md

## Input Information
- **Feature Log File:** .ai/features/[YYYY-MM-DD].[feature-name]
- **Test Glob Pattern:** [glob pattern for test scope]
- **Feature Summary:** [1-2 sentence description]

## Your Task
1. Read the feature log file at the path specified above
2. Activate the unit-testing skill
3. Follow the complete workflow documented in agents/tester-agent.md
4. Create comprehensive unit tests in tests/unit/WIP/
5. Update the feature log file with test details
6. Return a concise summary (see tester-agent.md for format)

Execute the workflow now and report back with your summary.`
})
```

## Example: New Feature Tests

```typescript
Task({
    subagent_type: "general-purpose",
    description: "Create unit tests for color detection",
    model: "sonnet",
    prompt: `You are the tester sub-agent. Your task is to create comprehensive unit tests for a feature.

## Context
Read and follow the instructions in: agents/tester-agent.md

## Input Information
- **Feature Log File:** .ai/features/2025-11-13.color-detection
- **Test Glob Pattern:** tests/unit/color/**/*.test.ts
- **Feature Summary:** Add terminal color depth detection with support for environment variables, OSC queries, and platform-specific fallbacks.

## Your Task
1. Read the feature log file at the path specified above
2. Activate the unit-testing skill
3. Follow the complete workflow documented in agents/tester-agent.md
4. Create comprehensive unit tests in tests/unit/WIP/
5. Update the feature log file with test details
6. Return a concise summary (see tester-agent.md for format)

Execute the workflow now and report back with your summary.`
})
```

## Example: Bug Fix Tests

```typescript
Task({
    subagent_type: "general-purpose",
    description: "Create unit tests for path parsing fix",
    model: "sonnet",
    prompt: `You are the tester sub-agent. Your task is to create comprehensive unit tests for a bug fix.

## Context
Read and follow the instructions in: agents/tester-agent.md

## Input Information
- **Feature Log File:** .ai/features/2025-11-13.path-parsing-fix
- **Test Glob Pattern:** tests/unit/utils/path-*.test.ts
- **Feature Summary:** Fix path parsing to handle Windows UNC paths and network shares correctly.

## Your Task
1. Read the feature log file at the path specified above
2. Activate the unit-testing skill
3. Follow the complete workflow documented in agents/tester-agent.md
4. Create comprehensive unit tests in tests/unit/WIP/
5. Update the feature log file with test details
6. Return a concise summary (see tester-agent.md for format)

Execute the workflow now and report back with your summary.`
})
```

## Example: Enhancement Tests

```typescript
Task({
    subagent_type: "general-purpose",
    description: "Create unit tests for enhanced caching",
    model: "sonnet",
    prompt: `You are the tester sub-agent. Your task is to create comprehensive unit tests for an enhancement.

## Context
Read and follow the instructions in: agents/tester-agent.md

## Input Information
- **Feature Log File:** .ai/features/2025-11-13.enhanced-caching
- **Test Glob Pattern:** tests/unit/cache/*.test.ts
- **Feature Summary:** Enhance the caching system to support TTL expiration and LRU eviction policies.

## Your Task
1. Read the feature log file at the path specified above
2. Activate the unit-testing skill
3. Follow the complete workflow documented in agents/tester-agent.md
4. Create comprehensive unit tests in tests/unit/WIP/
5. Update the feature log file with test details
6. Return a concise summary (see tester-agent.md for format)

Execute the workflow now and report back with your summary.`
})
```

## Parameters to Customize

When invoking, replace these placeholders:

| Placeholder | Description | Example |
|------------|-------------|---------|
| `[FEATURE_NAME]` | Short name for description | `user-authentication` |
| `[YYYY-MM-DD]` | Current date | `2025-11-13` |
| `[feature-name]` | Kebab-case feature name | `user-auth` |
| `[glob pattern for test scope]` | Pattern to run relevant tests | `tests/unit/auth/**/*.test.ts` |
| `[1-2 sentence description]` | Brief feature summary | `Add JWT-based authentication with login and logout.` |

## After Sub-Agent Returns

Expected response format:

```markdown
## Unit Tests Created

**Test Files Created:**
- tests/unit/WIP/feature-name.test.ts (X tests)
- tests/unit/WIP/feature-name-edge-cases.test.ts (Y tests)

**Total Tests:** Z tests across N files

**Test Status:** All tests currently FAILING (as expected - no implementation yet)

**Test Coverage:**
- Happy path: X tests
- Edge cases: Y tests
- Error handling: Z tests

**Feature Log Updated:** .ai/features/YYYY-MM-DD.feature-name
```

### What to Do Next

1. ✅ Review the summary
2. ✅ Verify the feature log was updated (read it if needed)
3. ✅ Optionally verify tests were created: `ls tests/unit/WIP/`
4. ✅ Update the feature log to mark Step 3 complete
5. ✅ Move to Step 4 (Implementation)

## Common Glob Patterns

| Scope | Glob Pattern |
|-------|--------------|
| All unit tests | `tests/unit/**/*.test.ts` |
| Specific directory | `tests/unit/auth/**/*.test.ts` |
| Specific file pattern | `tests/unit/*-parser*.test.ts` |
| Multiple directories | `tests/unit/{auth,utils}/**/*.test.ts` |
| Exclude integration | `tests/unit/**/!(*.integration).test.ts` |

## Troubleshooting

### Sub-Agent Returns Questions

If the sub-agent asks for clarification:
1. Answer the questions
2. Re-invoke with additional context
3. The feature log maintains state

### Sub-Agent Reports Errors

If the sub-agent encounters errors:
1. Check the feature log file exists and is readable
2. Verify the test directory structure exists
3. Ensure required dependencies are installed
4. Re-invoke with corrections

### Need to Modify Tests

If you need to adjust the tests created:
1. You can make small edits directly
2. For major changes, re-invoke the sub-agent with updated feature log
3. The sub-agent can iterate based on feedback

## Model Selection

- **sonnet** (recommended): For comprehensive test creation with complex logic
- **haiku**: For simple, straightforward test creation (faster, cheaper)

Most features should use `sonnet` to ensure high-quality comprehensive test coverage.
