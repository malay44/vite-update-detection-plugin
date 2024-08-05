# vite-plugin-update-detection

A package to detect version changes in your application, including a Vite plugin and a React hook.

## Installation

Install the package via npm:

```bash
npm install vite-plugin-update-detection
```

## Vite Plugin

### Usage

To use the Vite plugin, import and configure it in your `vite.config.ts`. You can dynamically set the version using the current timestamp.

First, ensure you have `fs` and `path` modules available to read from your `package.json`:

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import vitePluginVersion from 'vite-plugin-update-detection/plugin';
import fs from 'fs';
import path from 'path';
// Read version from package.json
import { version } from "./package.json";

const versionByBuildTime = new Date().getTime().toString(); // Use current timestamp as version

export default defineConfig({
  plugins: [
    // use version from package.json or current timestamp as version
    vitePluginVersion({ version, pollInterval: 60000 })
  ],
});
```

### Options

- `version` (string): The current version of your application.
- `pollInterval` (number, optional): The interval in milliseconds to poll for version changes. Default is `60000` (1 minute). Set to `0` to disable polling.

###

## React Hook

### Usage

To use the React hook, import and use it in your React components:

```typescript
// SomeComponent.tsx
import React from 'react';
import useVersionChangeDetection from 'vite-plugin-update-detection/react-hook';

function SomeComponent() {
  const checkVersion = useVersionChangeDetection((newVersion) => {
    renderPopupCenterComponent(
      <NewVersionPopUp 
        oldVersion={import.meta.env.VITE_APP_VERSION} 
        newVersion={newVersion}
      />
    );
  });

  // Use the checkVersion function as needed
  return (
    <div>
      <button onClick={checkVersion}>Check Version</button>
    </div>
  );
}

export default SomeComponent;
```

### Hook API

#### `useVersionChangeDetection(onChange?: (newVersion: string) => void): () => Promise<boolean>`

- **onChange** (function, optional): A callback function to be called when a version change is detected.
- **Returns**: A function that can be called to manually check for a version change. Returns a promise that resolves to `true` if the version has changed, otherwise `false`.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request on GitHub.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.