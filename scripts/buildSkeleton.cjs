const fs = require("fs");
const path = require("path");

const metadataDir = path.join(__dirname, "../metadata");
const outputFilePath = path.join(__dirname, "../skeleton.json");

const files = fs
  .readdirSync(metadataDir)
  .filter((file) => file.endsWith(".json"));

const components = files.map((file) => {
  const content = fs.readFileSync(path.join(metadataDir, file), "utf-8");
  return JSON.parse(content);
});

const skeleton = {
  data: {
    components: components,
  },
};

fs.writeFileSync(outputFilePath, JSON.stringify(skeleton, null, 2), "utf-8");
console.log("Skeleton UI generated successfully!");
