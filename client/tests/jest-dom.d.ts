// Pulls in the matcher type augmentations (toBeInTheDocument, toBeDisabled, …).
// jest.setup.js imports the runtime side, but it is a .js file so TypeScript
// never sees the augmentation from there.
import "@testing-library/jest-dom";
