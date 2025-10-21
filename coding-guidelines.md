## **9\. Coding Guidelines:**
We will follow established, public style guides and enforce them with automated tooling and review.

TypeScript

Guide: [https://ts.dev/style/#visibility]

We chose this because it is clear and practical. It explains naming, imports, visibility, and API design so our code stays consistent and easy to review.
Enforcement: ESLint with TypeScript rules and Prettier for auto formatting. Continuous integration runs lint and format checks on every pull request. Precommit hooks run the same checks before a commit. Code reviews use a short style checklist.

CSS

Guide: [https://developer.mozilla.org/en-US/docs/MDN/Writing_guidelines/Code_style_guide/CSS]

We chose this because it follows web standards and stresses readability and accessibility, which keeps styles simple and maintainable.
Enforcement: Stylelint with the standard config and Prettier for formatting. Continuous integration runs style checks on every pull request. Precommit hooks check changed files. Reviewers confirm selector names, file structure, and comments follow the MDN guidance.
