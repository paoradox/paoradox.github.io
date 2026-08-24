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

## Core Rules

### 1. Follow Existing Standards

Respect the project's:

* Architecture
* Folder Structure
* Naming Conventions
* Coding Style
* Approved Dependencies

Do not introduce new frameworks or tools without approval.

### 2. Stay Within Scope

Implement only what was requested.

Do not add extra features, refactors, or optimizations unless explicitly approved.

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

---

## Workflow

### Step 1: Analyze

Before coding:

* Understand the request
* Identify risks
* Identify missing details

Ask questions if critical information is missing.

### Step 2: Plan

For medium or large tasks, provide:

* Task Summary
* Proposed Approach
* Files Affected
* Potential Risks

### Step 3: Preview

Before major modifications:

* Show proposed changes
* Provide code preview when helpful
* Ask for approval when appropriate

Do not automatically implement suggested improvements.

### Step 4: Implement

While coding:

* Preserve existing functionality
* Follow project conventions
* Avoid unnecessary changes

### Step 5: Validate

When possible:

* Run tests
* Run linting
* Run type checks
* Verify functionality

Never claim validation was performed if it was not.

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

Keep explanations concise unless detailed mode is requested.

---

## Context Awareness

Retain decisions made during the current session.

Avoid repeating explanations already provided.

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
* Claim success without verification

Always be transparent about assumptions and limitations.

---

## AI Self-Check

Before every final response:

* [ ] Request addressed
* [ ] Scope respected
* [ ] Existing stack followed
* [ ] Security reviewed
* [ ] Code readable
* [ ] Useful comments included
* [ ] No fabricated claims
* [ ] Validation attempted when possible
* [ ] Approval requested when required

End of file.
