---
name: mr-description
description: Write a merge-request (MR/PR) description — Problem, Solution, and Affected Files — from the actual code diff of the current branch, not from commit messages. Use this whenever the user asks to write/generate an MR or PR description, wants help filling in GitLab's or GitHub's description box before opening one, asks to "summarize this branch for review", "describe these changes", "what did I fix here", or is clearly about to open a merge request and needs the write-up for it — even if they don't say "MR" or "description" explicitly.
---

# MR Description

Write the merge-request description from what the code actually changed, not from
whatever the commit messages happen to say. Commit messages on this kind of project
are often terse or generic ("fix: placeholder", "wip", "fix bug") — useful as a hint
about intent, never as the source of truth. The diff is the source of truth.

## 1. Get the branch's full diff

Run the bundled script from the skill's own directory:

```bash
bash scripts/get-branch-diff.sh
```

It figures out which branch this one diverged from (tries `development`, `develop`,
`main`, `master` in that order — pass an explicit branch name as an argument if the
project uses something else, e.g. `bash scripts/get-branch-diff.sh release`) and
prints the merge-base, the commit log since that point (context only), the changed
files (`git diff --name-status <merge-base>`), and a diffstat.

That `<merge-base>` is the number to build everything else from — it's what makes this
correct even when the branch has commits already merged from elsewhere in its history
(a common source of confusion: `git log` on a long-lived feature branch can include
merge commits that have nothing to do with this branch's own changes). Diffing against
the merge-base, not just `HEAD~N`, is also what naturally picks up **uncommitted**
changes too — a real MR description needs to cover everything about to go into the
MR, whether it's committed yet or not.

If the working tree is completely clean and there's nothing between the merge-base and
HEAD, say so plainly instead of inventing a description — there's nothing to write up.

## 2. Read the actual diff, not just the file list

The file list tells you _what_ changed; only the diff tells you _why_ it matters. For
each changed file (or each logical group of files that clearly belong to the same
change), read its diff with `git diff <merge-base> -- <path>`. For a large diff, work
through it in logical chunks rather than trying to hold the whole thing in your head at
once — group files by the feature/bugfix they belong to before writing anything.

Skim past pure noise (formatting-only diffs, lockfile bumps, generated files) rather
than analyzing them line by line, but still mention them in Affected Files so the list
stays complete — a reviewer scanning the file list shouldn't have to wonder whether
something was silently left out.

If the branch genuinely contains more than one unrelated fix bundled together, don't
force them into one Problem/Solution narrative — say so, and describe each one as its
own bullet. That's a real (if slightly awkward) shape for this kind of write-up, and
forcing a single story onto unrelated changes produces a description a reviewer can't
actually use.

## 3. Write the description

Always use this exact structure — it's what makes the output pastable straight into
GitLab's/GitHub's description box with no editing:

```markdown
## Problem

[What was broken, missing, or requested — described from the *symptom or need*, in
terms a reviewer who wasn't in the room for the bug report would understand. Not "the
code didn't check X" — "an admin user with isAdmin=true was still blocked by RBAC on
screens they should have full access to."]

## Solution

[What was actually changed, and why that fixes the Problem — the mechanism, not a
restatement of the diff. Name the key functions/files where it matters for
understanding the fix, but this is prose explaining a decision, not a changelog.]

## Affected Files

- `path/to/file.ts` — one-line note on what changed here and why
- `path/to/other-file.tsx` — same
```

Notes on getting this right:

- **Problem and Solution are each a short paragraph (or a couple of tight bullets for
  multiple unrelated fixes) — not a wall of text and not a single vague sentence.**
  Aim for what a reviewer needs to review the change with confidence, not a full
  design doc and not a one-liner that just repeats the branch name.
- **Affected Files lists every changed file** (from the script's name-status output),
  each with a genuinely useful one-liner — "renamed" or "updated" tells a reviewer
  nothing; say what changed _in that file specifically_. A config/lockfile/generated
  file still gets a line, just a short one ("lockfile update from the new dependency").
- **Use the real paths from the diff**, exactly as git prints them — don't paraphrase
  or shorten them, a reviewer may search the description for a specific path.
- Skip any section that's genuinely empty (there's no "Problem" for a pure refactor
  with no bug/request behind it) rather than padding it with filler — but say plainly
  what the section became instead (e.g. rename `## Problem` to `## Motivation` for a
  refactor) rather than silently dropping structure the reviewer expects.

## 4. Hand it back

Print the finished markdown directly in the conversation, in a fenced code block, so
it can be copy-pasted straight into the MR without Claude's own formatting (headers,
bullets) being re-interpreted by the chat UI on the way there. Don't save it to a file
or open/update an actual MR unless the user asks for that separately — this skill's
job ends at handing over the description.
