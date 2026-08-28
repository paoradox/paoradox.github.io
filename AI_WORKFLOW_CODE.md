# AI_WORKFLOW.md

## Purpose

Provide consistent AI behavior across development tasks while minimizing repetitive prompting.

---

## Project Settings

* Project Name: `[ui-paoradox]`
* Language(s): `[HTML, CSS, JAVASCRIPT]`
* Framework(s): `[BOOTSTRAP 5]`
* Database: `[NONE]`
* Package Manager: `[NONE]`
* Testing Framework: `[NONE]`

---

## Operating Preferences

* Experience Level: `[Beginner]`
* Explanation Level: `[Balanced]`
* Change Policy: `[Preview First]`
* Comment Style: `[Block Comments]`

---

## Configuration Validation

Before proceeding, verify that all required Project Settings and Operating Preferences have valid values.

If a field contains an unresolved placeholder or an unselected choice, request the missing information only when it is necessary to complete the current task.

Do not assume values unless they have already been provided or established during the current session.

---

## Core Rules

### 1. Follow Existing Standards

Respect the project's:

* Architecture
* Folder Structure
* Naming Conventions
* Coding Style
* Approved Dependencies

Do not introduce new frameworks, libraries, tools, or architectural patterns without approval.

### 2. Stay Within Scope

Implement only what was requested.

Do not add extra features, refactors, optimizations, or opinionated improvements unless explicitly approved.

### 3. Write Maintainable Code

Code must be:

* Readable
* Beginner-friendly
* Secure
* Easy to modify

Prefer clarity over cleverness.

### 4. Use Appropriate Documentation

Add comments when:

* Logic is complex
* Business rules exist
* Future maintenance may be difficult

Avoid comments that explain obvious code.

### 5. Minimize Prompt Waste

Provide only information necessary to complete the task.

Avoid:

* Repeating known context
* Redundant explanations
* Unnecessary assumptions

Prefer concise, actionable responses.

---

## Workflow

### Step 1: Analyze

Before coding:

* Understand the request
* Identify the actual goal behind the request
* Identify risks
* Identify missing details
* Extract constraints before proposing solutions
* Reuse decisions already established in the current session

Ask questions only when critical information is missing.

### Step 2: Plan

For medium or large tasks, provide:

* Task Summary
* Proposed Approach
* Files Affected
* Potential Risks
* Success Criteria

### Step 3: Preview

Before major modifications:

* Show proposed changes
* Provide code previews when helpful
* Ask for approval when required by the Change Policy

Do not automatically implement suggested improvements.

### Step 4: Implement

While coding:

* Preserve existing functionality
* Follow project conventions
* Avoid unnecessary changes
* Keep modifications scoped to the request

### Step 5: Validate

When possible:

* Run tests
* Run linting
* Run type checks
* Verify functionality

Never claim validation was performed if it was not.

### Step 6: Export

Export exactly the requested deliverable.

If generating a complete project file (README, configuration, documentation, etc.), provide exactly one final version unless multiple versions are explicitly requested.

When exporting Markdown files, prefer a single complete Markdown code block for easy copy-paste.

---

## Security Rules

Always consider:

* Input Validation
* Error Handling
* Authentication
* Authorization
* Secret Management

Never expose:

* API Keys
* Passwords
* Tokens
* Sensitive Credentials

---

## Response Format

When providing solutions:

1. Summary
2. Changes Made
3. Code
4. Validation Results
5. Recommendations (Optional)

Keep explanations concise unless a detailed explanation is requested.

---

## Context Awareness

Retain decisions made during the current session.

Avoid repeating explanations already provided.

Prioritize previously approved decisions before creating new ones.

Carry forward:

* Architecture Decisions
* Technical Constraints
* Rejected Approaches
* Approved Standards
* Coding Standards
* Project Preferences

Reuse approved:

* Architecture Decisions
* Coding Standards
* Project Preferences

When uncertain, ask instead of assuming.

---

## Prohibited Behavior

Do not:

* Invent requirements
* Invent test results
* Invent performance metrics
* Invent completed work
* Invent dependencies
* Claim success without verification

Always be transparent about assumptions, limitations, and unverified information.

---

## AI Self-Check

Before every final response:

* [ ] Request addressed
* [ ] Scope respected
* [ ] Existing stack followed
* [ ] Existing session decisions reused
* [ ] Security reviewed
* [ ] Code readable
* [ ] Useful comments included
* [ ] Success criteria satisfied
* [ ] No unnecessary output
* [ ] No fabricated claims
* [ ] Validation attempted when possible
* [ ] Approval requested when required

End of file.