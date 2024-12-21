```markdown
# Sense-UI

**Sense-UI** is a scalable and maintainable React component library integrated with Vite, designed to facilitate AI-driven user interfaces. By leveraging a custom Babel plugin, Sense-UI automatically extracts metadata from AI-prefixed components (e.g., `AIButton`, `AIInput`) during the build process, enabling enhanced functionalities and integrations.

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
  - [Running the Development Server](#running-the-development-server)
  - [Building for Production](#building-for-production)
- [Metadata Extraction](#metadata-extraction)
  - [How It Works](#how-it-works)
  - [Generated Metadata](#generated-metadata)
- [Adding New AI Components](#adding-new-ai-components)
- [Scripts](#scripts)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Scalable AI Components:** Easily add AI-prefixed components (`AIButton`, `AIInput`, etc.) that are automatically detected and processed.
- **Automated Metadata Extraction:** Custom Babel plugin extracts component metadata during the build process.
- **Vite-Powered Build:** Fast and efficient build tooling optimized for React applications.
- **Ant Design Integration:** Utilize Ant Design components within AI-prefixed components for a polished UI.

## Project Structure
```

sense-ui/
├── src/
│ ├── components/
│ │ ├── AIButton.jsx
│ │ └── AIInput.jsx
│ ├── App.jsx
│ └── main.jsx
├── scripts/
│ └── babel-plugin-extract-ai-components.cjs
├── AIButtonMetadata.json
├── AIInputMetadata.json
├── skeleton.json
├── vite.config.js
├── package.json
├── README.md
└── ... other configuration files

````

## Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/yourusername/sense-ui.git
   cd sense-ui
````

2. **Install Dependencies:**

   Ensure you have [Node.js](https://nodejs.org/) installed (version 14 or above is recommended).

   ```bash
   npm install
   ```

## Usage

### Running the Development Server

Start the development server with live reloading:

```bash
npm run dev
```

This command performs the following:

1. **Metadata Extraction:**  
   Runs the custom Babel plugin to extract metadata from AI-prefixed components.
2. **Vite Development Server:**  
   Launches the Vite development server, serving your React application.

### Building for Production

Build the application for production deployment:

```bash
npm run build
```

This command performs the following:

1. **Metadata Extraction:**  
   Executes the Babel plugin to generate metadata JSON files (`AIButtonMetadata.json`, `AIInputMetadata.json`, etc.).
2. **Vite Production Build:**  
   Compiles and optimizes the React application for production.

**Note:**  
After building, you can deploy the contents of the `dist/` directory to your preferred hosting service.

## Metadata Extraction

### How It Works

Sense-UI employs a custom Babel plugin to automatically detect and extract metadata from any React component prefixed with `AI`. During the build process, the plugin scans your JSX files, identifies AI-prefixed components, and extracts their props into structured JSON metadata files.

### Generated Metadata

For each AI component (e.g., `AIButton`, `AIInput`), the Babel plugin generates a corresponding metadata file (`AIButtonMetadata.json`, `AIInputMetadata.json`) containing an array of component instances with their props.

**Example: `AIButtonMetadata.json`**

```json
{
  "data": [
    {
      "component": "AIButton",
      "uid": "btn-001",
      "purpose": "submitForm",
      "label": "Submit",
      "onClick": "handleClick"
    },
    {
      "component": "AIButton",
      "uid": "btn-002",
      "purpose": "cancel",
      "label": "Cancel",
      "onClick": "handleClick"
    }
  ]
}
```

**Example: `AIInputMetadata.json`**

```json
{
  "data": [
    {
      "component": "AIInput",
      "uid": "input-001",
      "purpose": "collectUserEmail",
      "placeholder": "name@example.com",
      "value": "inputValue",
      "onChange": "handleInputChange"
    }
  ]
}
```

These metadata files are essential for dynamic UI generation, AI integrations, and further processing.

## Adding New AI Components

To extend the Sense-UI library with new AI components:

1. **Create the Component:**

   Follow the naming convention by prefixing the component name with `AI`. For example, to create an AI Card component:

   **File:** `src/components/AICard.jsx`

   ```jsx
   // src/components/AICard.jsx
   import React from "react";
   import { Card, Flex } from "antd";

   const AICard = ({ uid, purpose, title, content }) => (
     <Flex>
       <Card title={title}>{content}</Card>
     </Flex>
   );

   export default AICard;
   ```

2. **Use the Component in JSX:**

   **File:** `src/App.jsx`

   ```jsx
   import AIButton from "./components/AIButton";
   import AIInput from "./components/AIInput";
   import AICard from "./components/AICard";

   function App() {
     const [inputValue, setInputValue] = useState("");

     const handleClick = (e, uid) => {
       console.log("Button clicked!", uid, e.target);
     };

     const handleInputChange = (e) => {
       setInputValue(e.target.value);
     };

     return (
       <>
         <AIButton
           uid="btn-001"
           purpose="submitForm"
           onClick={(e) => handleClick(e, "btn-001")}
           label="Submit"
         />
         <AIInput
           uid="input-001"
           purpose="collectUserEmail"
           placeholder="name@example.com"
           value={inputValue}
           onChange={handleInputChange}
         />
         <AIButton
           uid="btn-002"
           purpose="cancel"
           onClick={(e) => handleClick(e, "btn-002")}
           label="Cancel"
         />
         <AICard
           uid="card-001"
           purpose="displayUserInfo"
           title="User Information"
           content="This card displays user-related information."
         />
       </>
     );
   }

   export default App;
   ```

3. **Build the Project:**

   ```bash
   npm run build
   ```

   The Babel plugin will automatically detect the new `AICard` component and generate `AICardMetadata.json` with the relevant metadata.

## Scripts

The project utilizes several npm scripts to streamline development and build processes.

| Script                      | Description                                                                               |
| --------------------------- | ----------------------------------------------------------------------------------------- |
| `npm run dev`               | Runs the metadata extraction and starts the Vite development server with live reloading.  |
| `npm run build`             | Extracts metadata, builds the project for production, and generates optimized assets.     |
| `npm run start-server`      | _(Optional)_ Starts the GraphQL server to serve the extracted metadata via API endpoints. |
| `npm run generate:skeleton` | _(Not implemented)_ Runs the standalone metadata extraction script.                       |

**Note:**  
Currently, the primary method for metadata extraction is integrated via the Babel plugin. The standalone script approach is mentioned for future reference and is not implemented in the current setup.

## Troubleshooting

### Common Issues

1. **`path is not defined` Error:**

   **Cause:**  
   The `path` module was used in `vite.config.js` without being properly imported.

   **Solution:**  
   Ensure that the `path` and `url` modules are imported at the top of `vite.config.js` and that `__dirname` is correctly defined in an ESM context.

   **Example Fix:**

   ```javascript
   // vite.config.js
   import { defineConfig } from "vite";
   import react from "@vitejs/plugin-react";
   import path from "path";
   import { fileURLToPath } from "url";
   import { dirname } from "path";

   // Define __filename and __dirname in ESM
   const __filename = fileURLToPath(import.meta.url);
   const __dirname = dirname(__filename);

   export default defineConfig({
     plugins: [
       react({
         babel: {
           plugins: [
             [
               path.resolve(
                 __dirname,
                 "scripts",
                 "babel-plugin-extract-ai-components.cjs"
               ),
               {},
             ],
           ],
         },
       }),
     ],
   });
   ```

2. **Metadata Files Are Empty:**

   **Cause:**  
   The Babel plugin is not correctly detecting AI-prefixed components.

   **Solution:**

   - Ensure that all AI components are correctly named with the `AI` prefix.
   - Verify that the components are being used with the exact names in JSX.
   - Add console logs within the Babel plugin to confirm detection and extraction.

   **Example Babel Plugin Logs:**

   ```javascript
   // Inside the Babel plugin
   if (t.isJSXIdentifier(elementName) && elementName.name.startsWith("AI")) {
     console.log(`Detected component: ${componentType}`);
     // ... rest of the code
     console.log(`Extracted props for ${componentType}:`, propsObj);
   }
   ```

3. **Build Fails with Module Resolution Errors:**

   **Cause:**  
   Incorrect path resolution or missing files.

   **Solution:**

   - Verify that the Babel plugin file exists at the specified path.
   - Ensure that file extensions are correct (`.cjs` for CommonJS modules).
   - Clean Vite's cache by removing the `.vite` directory.

   **Command to Clean Vite Cache:**

   ```bash
   rm -rf node_modules/.vite
   ```

### Additional Tips

- **Verify Node.js Version:**  
  Ensure you're using a compatible Node.js version (v14 or above) that supports ESM features.

- **Check File Permissions:**  
  Ensure that the script has write permissions to create JSON files in the project root.

- **Review Component Props:**  
  Ensure that components have the necessary props and they are passed correctly to facilitate accurate metadata extraction.

## Contributing

Contributions are welcome! To contribute to Sense-UI:

1. **Fork the Repository:**

   Click the "Fork" button at the top-right corner of the repository page.

2. **Clone Your Fork:**

   ```bash
   git clone https://github.com/yourusername/sense-ui.git
   cd sense-ui
   ```

3. **Create a Feature Branch:**

   ```bash
   git checkout -b feature/YourFeatureName
   ```

4. **Make Your Changes:**

   Implement your feature or bug fix, ensuring adherence to the existing coding standards and naming conventions.

5. **Commit Your Changes:**

   Follow the [commit message guidelines](#commit-message-guidelines) for clarity.

6. **Push to Your Fork:**

   ```bash
   git push origin feature/YourFeatureName
   ```

7. **Open a Pull Request:**

   Navigate to the original repository and open a pull request detailing your changes.

### Commit Message Guidelines

Use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) for your commit messages to ensure consistency and clarity.

**Example:**

```
feat(AICard): add new AICard component for displaying user information

- Created AICard.jsx with necessary props and Ant Design integration
- Updated App.jsx to include and use the new AICard component
- Enhanced Babel plugin to detect and extract metadata for AICard
```

## License

This project is licensed under the [MIT License](LICENSE).

---

**Sense-UI** empowers developers to create AI-driven user interfaces with ease, ensuring scalability and maintainability through automated metadata extraction. Whether you're building dynamic forms, interactive buttons, or advanced AI components, Sense-UI provides the tools and structure to accelerate your development process.

For any questions, issues, or feature requests, please open an issue on the [GitHub repository](https://github.com/yourusername/sense-ui/issues).

---

_Happy Coding! 🚀_

```

```
