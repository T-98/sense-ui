// scripts/babel-plugin-extract-ai-components.cjs
const fs = require("fs");
const path = require("path");

/**
 * Babel Plugin: extract-ai-components-metadata
 *
 * This plugin traverses the JSX AST to identify AI-prefixed components (e.g., AIButton, AIInput)
 * and extracts their metadata. It intelligently groups these components based on their UI context
 * (e.g., forms, navbars, sections) to create a modular and organized skeleton UI structure
 * suitable for AI-driven analysis.
 */

module.exports = function ({ types: t }) {
  // Define context-defining tags/components (all lowercase)
  const contextDefiningTags = [
    "form",
    "nav",
    "header",
    "footer",
    "main",
    "section",
    // Add more context-defining tags/components as needed
  ];

  // Root of the skeleton UI tree
  const skeletonTree = {
    context: "root",
    children: [],
    components: {},
  };

  // Stack to keep track of current contexts during traversal
  const contextStack = [skeletonTree];

  return {
    name: "extract-ai-components-metadata",
    visitor: {
      JSXElement: {
        enter(path) {
          const openingElement = path.node.openingElement;
          const elementName = openingElement.name;

          // Determine the name of the element/component
          let name = null;
          if (t.isJSXIdentifier(elementName)) {
            name = elementName.name.toLowerCase(); // Convert to lowercase for matching
          }

          // Only handle simple JSXIdentifiers, skip member expressions
          if (name && contextDefiningTags.includes(name)) {
            // Create a new context node
            const newContextNode = {
              context: name,
              children: [],
              components: {},
            };

            console.log(`Entering context: ${name}`);

            // Add the new context as a child of the current context
            const currentContext = contextStack[contextStack.length - 1];
            currentContext.children.push(newContextNode);

            // Push the new context onto the stack
            contextStack.push(newContextNode);
          }

          // After handling context, check if it's an AI component
          // This allows AI components outside contexts to be added to 'root'
          // Or, AI components within contexts are added to their current context
          let isAIComponent = false;
          let componentType = null;

          if (
            t.isJSXIdentifier(elementName) &&
            elementName.name.startsWith("AI")
          ) {
            isAIComponent = true;
            componentType = elementName.name;
          }

          if (isAIComponent) {
            // Extract relevant props
            const propsObj = {};

            openingElement.attributes.forEach((attr) => {
              if (t.isJSXAttribute(attr) && t.isJSXIdentifier(attr.name)) {
                const propName = attr.name.name;
                let propValue = null;

                if (t.isStringLiteral(attr.value)) {
                  // <AIButton purpose="submitForm" />
                  propValue = attr.value.value;
                } else if (
                  t.isJSXExpressionContainer(attr.value) &&
                  t.isStringLiteral(attr.value.expression)
                ) {
                  // <AIButton purpose={"submitForm"} />
                  propValue = attr.value.expression.value;
                } else if (
                  t.isJSXExpressionContainer(attr.value) &&
                  (t.isNumericLiteral(attr.value.expression) ||
                    t.isBooleanLiteral(attr.value.expression))
                ) {
                  // <AIButton someProp={123} />
                  propValue = attr.value.expression.value.toString();
                } else if (
                  t.isJSXExpressionContainer(attr.value) &&
                  t.isIdentifier(attr.value.expression)
                ) {
                  // <AIButton someProp={variable} />
                  propValue = attr.value.expression.name;
                } else {
                  // For complex expressions or unsupported types
                  propValue = "[complex expression not resolved]";
                }

                // Filter props to include only 'uid' and 'purpose'
                if (propName === "uid" || propName === "purpose") {
                  propsObj[propName] = propValue;
                }
              }
            });

            // Determine the current context
            const currentContext =
              contextStack.length > 0
                ? contextStack[contextStack.length - 1]
                : skeletonTree;

            console.log(
              `Adding component to context '${currentContext.context}':`,
              componentType,
              propsObj
            );

            // Initialize components object if not present
            if (!currentContext.components) {
              currentContext.components = {};
            }

            // Initialize component type array within the current context
            if (!currentContext.components[componentType]) {
              currentContext.components[componentType] = [];
            }

            // Push the extracted props into the corresponding metadata array
            currentContext.components[componentType].push({
              component: componentType,
              ...propsObj,
            });
          }
        },
        exit(path) {
          const openingElement = path.node.openingElement;
          const elementName = openingElement.name;

          // Determine the name of the element/component
          let name = null;
          if (t.isJSXIdentifier(elementName)) {
            name = elementName.name.toLowerCase(); // Convert to lowercase for matching
          }

          // Only handle simple JSXIdentifiers, skip member expressions
          if (name && contextDefiningTags.includes(name)) {
            console.log(`Exiting context: ${name}`);
            // Pop the context from the stack as we exit it
            contextStack.pop();
          }
        },
      },
    },

    // After traversal, write the grouped metadata to a single skeleton.json with nested structures
    post() {
      const metadataDir = path.join(__dirname, "../metadata");
      const outputPath = path.join(metadataDir, "skeleton.json");

      // Ensure the metadata directory exists
      if (!fs.existsSync(metadataDir)) {
        fs.mkdirSync(metadataDir, { recursive: true });
      }

      // Write the skeletonTree to skeleton.json
      fs.writeFileSync(
        outputPath,
        JSON.stringify(skeletonTree, null, 2),
        "utf-8"
      );

      console.log("Skeleton UI metadata extracted to skeleton.json");
    },
  };
};
