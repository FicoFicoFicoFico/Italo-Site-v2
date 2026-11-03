export default function (eleventyConfig) {
  // Only project Markdown becomes generated pages.
  // Plain HTML is copied as-is: no template syntax is evaluated.
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/projects/**/*.webp");
    eleventyConfig.addPassthroughCopy("src/favicon.png");

  return {
    dir: { input: "src", output: "_site", includes: "_includes" },
    templateFormats: ["md", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: false
  };
}
