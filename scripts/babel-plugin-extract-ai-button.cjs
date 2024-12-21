// scripts/babel-plugin-extract-ai-button.cjs
const fs = require("fs");
const path = require("path");

module.exports = function ({ types: t }) {
  const buttonInstances = [];

  return {
    name: "extract-ai-button-metadata",
    visitor: {
      JSXElement(path) {
        const openingElement = path.node.openingElement;
        const elementName = openingElement.name;

        // Check if it's an AIButton (e.g., <AIButton ... />)
        if (t.isJSXIdentifier(elementName) && elementName.name === "AIButton") {
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
              } else {
                // For complex expressions
                propValue = "[complex expression not resolved]";
              }

              propsObj[propName] = propValue;
            }
          });

          // Add the extracted info to our array
          buttonInstances.push({
            component: "AIButton",
            ...propsObj,
          });
        }
      },
    },
    post() {
      // Define the output path for the metadata
      const outputPath = path.join(__dirname, "..", "AIButtonMetadata.json");

      // Structure the final JSON
      const skeleton = {
        data: buttonInstances,
      };

      // Write the metadata to the JSON file
      fs.writeFileSync(outputPath, JSON.stringify(skeleton, null, 2), "utf-8");
      console.log("AIButton metadata extracted to AIButtonMetadata.json");
    },
  };
};
