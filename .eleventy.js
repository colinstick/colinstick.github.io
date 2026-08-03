module.exports = function(eleventyConfig) {
  // Custom date filter, e.g. {{ date | readableDate }} -> "Oct 2021"
  eleventyConfig.addFilter("readableDate", function(dateObj) {
    return new Date(dateObj).toLocaleDateString("en-US", { month: "short", year: "numeric" });
  });

  eleventyConfig.addFilter("fullDate", function(dateObj) {
    return new Date(dateObj).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  });

  // Copy static assets
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("assets");

  // Create a collection of all projects
  eleventyConfig.addCollection("projects", function(collectionApi) {
    return collectionApi.getFilteredByGlob("projects/*.md");
  });

  // Create a collection of all blog posts, sorted newest first
  eleventyConfig.addCollection("posts", function(collectionApi) {
    return collectionApi.getFilteredByGlob("blog/*.md").reverse();
  });

  // Collect all unique tags across projects
  eleventyConfig.addCollection("projectTags", function(collectionApi) {
    const tagSet = new Set();
    collectionApi.getFilteredByGlob("projects/*.md").forEach(item => {
      (item.data.tags || []).forEach(tag => tagSet.add(tag));
    });
    return [...tagSet].sort();
  });

  return {
    dir: {
      input: ".",
      output: "_site",
      includes: "_includes"
    }
  };
};

// npx @11ty/eleventy --serve