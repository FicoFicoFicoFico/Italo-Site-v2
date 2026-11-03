
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const source = path.join(root, "_site");
const destination = path.join(root, "docs");

if (!fs.existsSync(source)) {
    console.error("Error: _site does not exist. Build Eleventy first.");
    process.exit(1);
}

if (!fs.existsSync(path.join(source, "index.html"))) {
    console.error("Error: _site/index.html is missing.");
    process.exit(1);
}

fs.rmSync(destination, {
    recursive: true,
    force: true
});

fs.cpSync(source, destination, {
    recursive: true
});

fs.writeFileSync(
    path.join(destination, ".nojekyll"),
    ""
);

console.log("GitHub Pages files updated successfully.");
console.log("_site → docs");
console.log(".nojekyll created");
