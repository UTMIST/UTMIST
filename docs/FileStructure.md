# Project File Structure

## Root Directory
The root directory contains the main configuration files and subdirectories for the project.

### Key Files and Directories
- **`/client/`**
    The Next.js application. This is the entire codebase — the site is a single
    full-stack Next.js app, with server-side logic living in route handlers
    under `client/src/app/api/` rather than a separate backend service.

- **`/docs/`**
    Project documentation, including this file.

- **`/.github/`**
    CI/CD pipeline setup for GitHub Actions, plus issue templates.

## Client Structure
See [`client/FileStructure.md`](client/FileStructure.md) for the breakdown of
`client/src/`.

## Additional Notes
- Follow the naming conventions and folder structure to maintain consistency.
- Add documentation for any new directories or files you create.

For further questions, refer to the `README.md` or contact the project maintainers.
