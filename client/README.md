# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you are on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Testing (Unit & Integration)

This project includes unit and integration tests using React Testing Library and Jest.

What is included

- `@testing-library/react`, `@testing-library/jest-dom`, and `@testing-library/user-event` for component testing
- Tests are written in TypeScript using the `.test.tsx`/`.test.ts` convention

Where tests live

- Component/unit tests: colocated next to components, e.g. `src/components/.../*.test.tsx`
  - Examples: `src/components/PropertiesList/PropertiesList.test.tsx`, `src/components/PropertyForm/PropertyForm.test.tsx`
- Integration tests: placed alongside components or at the app level
  - Examples: `src/components/PropertyWizard/PropertyWizard.integration.test.tsx`, `src/App.integration.test.tsx`

How integration tests are structured

- Integration tests simulate user interaction across multiple components (for example the `PropertyWizard` flow) and mock the `apiService` for network interactions to keep tests deterministic.

Run tests

- Run in interactive watch mode (default):

```bash
npm test
```

- Run once in CI mode (useful for CI pipelines):

```bash
CI=true npm test
```

- Run a specific test file:

```bash
npx react-scripts test src/components/PropertyWizard/PropertyWizard.integration.test.tsx --runInBand
```

Notes

- The test setup file `src/setupTests.ts` loads `@testing-library/jest-dom`.
- API calls from the UI are encapsulated in `src/services/api.ts` and are mocked in integration tests to avoid network dependencies.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
