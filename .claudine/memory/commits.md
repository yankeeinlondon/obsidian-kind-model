# Commit Lessons Learned

Operational lessons for orchestrating parallel group commits in this repo.

## Verifying parallel subagent commits

- When multiple subagents commit concurrently into the same worktree, sibling
  commits land on top of each other in history. Do NOT verify a subagent's
  commit with `git log --oneline -3` (or any small top-N) — the target commit
  may have been pushed down to position 5+. Instead, verify by searching the
  log for the specific commit hash, or widen the window (e.g. `-10`).

## Scoped commits in a multi-agent run

- Use `git commit --only -F <msg-file> -- <path1> <path2> ...` to commit each
  semantic group. `--only` scopes the commit to exactly the listed paths even
  when other files are staged by parallel agents. Prefer this over
  `git commit -a` or a plain `git commit`, which can sweep in another agent's
  staged files.
- For multi-line messages (summary + bullet body), write the message to a temp
  file and pass it with `-F` rather than juggling `-m` flags or shell-escaped
  newlines.

## Lock contention is expected, not fatal

- `fatal: Unable to create '.git/index.lock': File exists.` (or the
  `refs/heads/<branch>.lock` variant) is normal when several agents commit in
  parallel. Git's locks are fail-fast, not queued. Wait 1–3s and retry the
  same `git commit --only …` command; budget ~5 retries. In practice, with
  ~10 parallel agents, most commits still succeeded on the first attempt and
  the worst case needed a single retry.

## Do NOT unstage / restage to group commits

- Never use `git reset` and do not try to group commits by unstaging and
  re-staging one group at a time. Developers may be working in the tree
  concurrently, so staging/unstaging can have unexpected consequences. Commit
  each group's files explicitly with `git commit --only …` instead.

## Keep `onlyBuiltDependencies` with the bump that needs it

- When a dependency bump introduces a package that has a native build step
  (e.g. `@codemirror/language`), the matching `onlyBuiltDependencies` entry in
  `pnpm-workspace.yaml` MUST land in the same commit as the `package.json`
  bump. Splitting them leaves an intermediate commit where `pnpm install`
  can fail or skip the required build. Treat `package.json`,
  `pnpm-workspace.yaml`, and `pnpm-lock.yaml` as one logical unit for
  dependency-update groups.
