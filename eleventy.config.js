export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/projects": "projects" });
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addCollection("artworks", collection =>
    collection.getFilteredByTag("portfolio").sort((a, b) =>
      b.data.year - a.data.year || a.data.title.localeCompare(b.data.title)
    )
  );
  return { dir: { input: "src", output: "_site", includes: "_includes" },
    markdownTemplateEngine: "njk", htmlTemplateEngine: "njk" };
}
