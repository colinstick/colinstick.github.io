module.exports = function(eleventyConfig) {
  const normalizeTag = (value) => String(value ?? "").trim().toLowerCase();

  const findTagColor = (tag, tagColors) => {
    if (!tag || !tagColors || typeof tagColors !== "object") {
      return undefined;
    }

    if (Object.prototype.hasOwnProperty.call(tagColors, tag)) {
      return tagColors[tag];
    }

    const normalizedTag = normalizeTag(tag);
    for (const [tagName, color] of Object.entries(tagColors)) {
      if (normalizeTag(tagName) === normalizedTag) {
        return color;
      }
    }

    return undefined;
  };

  const getProjectEntries = (collectionApi) => {
    return collectionApi.getFilteredByGlob("projects/*.md");
  };

  const isVisibleProject = (item) => item.data.hidden !== true;

  const byPinnedThenDateDesc = (a, b) => {
    const aPinned = a.data.pinned === true;
    const bPinned = b.data.pinned === true;

    if (aPinned !== bPinned) {
      return aPinned ? -1 : 1;
    }

    const aTime = new Date(a.date).getTime();
    const bTime = new Date(b.date).getTime();
    return bTime - aTime;
  };

  // Custom date filter, e.g. {{ date | readableDate }} -> "Oct 2021"
  eleventyConfig.addFilter("readableDate", function(dateObj) {
    return new Date(dateObj).toLocaleDateString("en-US", { month: "short", year: "numeric" });
  });

  eleventyConfig.addFilter("fullDate", function(dateObj) {
    return new Date(dateObj).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  });

  eleventyConfig.addFilter("tagColor", function(tag, tagColors) {
    return findTagColor(tag, tagColors);
  });

  // Copy static assets
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("js");

  // Create a collection of all projects
  eleventyConfig.addCollection("projects", function(collectionApi) {
    return getProjectEntries(collectionApi)
      .filter(isVisibleProject)
      .sort(byPinnedThenDateDesc);
  });

  // Create a collection of all blog posts, sorted newest first
  eleventyConfig.addCollection("posts", function(collectionApi) {
    return collectionApi.getFilteredByGlob("blog/*.md").reverse();
  });

  // Collect all unique tags across projects
  eleventyConfig.addCollection("projectTags", function(collectionApi) {
    const tagSet = new Set();
    getProjectEntries(collectionApi).filter(isVisibleProject).forEach(item => {
      (item.data.tags || []).forEach(tag => tagSet.add(tag));
    });
    return [...tagSet].sort();
  });

  // Transform that modifies all links in the final HTML build
  eleventyConfig.addTransform("force-external-links", function(content) {
    // Only target HTML files
    if (this.page.outputPath && this.page.outputPath.endsWith(".html")) {
      
      // Matches <a href="..."> but ignores links starting with /, #, or your own domain
      const modifiedContent = content.replace(
        /<a\s+([^>]*?)href="(?!(?:https?:\/\/yourdomain\.com|\/|#))([^"]+)"([^>]*?)>/gi,
        '<a $1href="$2"$3 target="_blank" rel="noopener noreferrer">'
      );
      
      return modifiedContent;
    }
    return content;
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