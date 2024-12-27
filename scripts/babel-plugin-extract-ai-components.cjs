// scripts/babel-plugin-extract-ai-components.cjs
const fs = require("fs");
const path = require("path");

module.exports = function ({ types: t }) {
  // Object to hold metadata for each AI component type
  const componentMetadata = {};

  return {
    name: "extract-ai-components-metadata",
    visitor: {
      JSXElement(path) {
        const openingElement = path.node.openingElement;
        const elementName = openingElement.name;

        // Check if the JSX element is an identifier and starts with 'AI'
        if (
          t.isJSXIdentifier(elementName) &&
          elementName.name.startsWith("AI")
        ) {
          const componentType = elementName.name; // e.g., AIButton, AIInput
          const propsObj = {};

          // Iterate over each attribute of the JSX element
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
              if (propName === "uid" || propName === "purpose") {
                propsObj[propName] = propValue;
              }
            }
          });

          // Initialize metadata array for this component type if not already
          if (!componentMetadata[componentType]) {
            componentMetadata[componentType] = [];
          }

          // Push the extracted props into the corresponding metadata array
          componentMetadata[componentType].push({
            component: componentType,
            ...propsObj,
          });
        }
      },
    },
    // Inside the post() method
    post() {
      const skeleton = {};

      Object.keys(componentMetadata).forEach((componentType) => {
        skeleton[componentType] = {
          data: componentMetadata[componentType],
        };
      });

      const outputPath = path.join(__dirname, "../metadata", "skeleton.json");

      fs.writeFileSync(outputPath, JSON.stringify(skeleton, null, 2), "utf-8");
      console.log("Skeleton UI metadata extracted to skeleton.json");
    },
  };
};
