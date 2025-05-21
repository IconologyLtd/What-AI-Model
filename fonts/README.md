# Brand Fonts Setup

This directory contains the structure for the brand fonts used in the project:

1. **Gotham Rounded** - Primary font
2. **Avenir** - Secondary font

## Font Implementation

The fonts have been configured in the CSS using `@font-face` rules. The CSS is set up to use:

- Gotham Rounded as the primary font for most text elements
- Avenir as the secondary font for specific elements
- Calibri as a fallback system font when the branded fonts are not available

## Adding Font Files

Please add the required font files to their respective directories:

- `/fonts/gotham-rounded/` - For all Gotham Rounded font files
- `/fonts/avenir/` - For all Avenir font files

See the README.md files in each directory for specific font files needed.

## Font Formats

For best cross-browser compatibility, we recommend using both .woff2 and .woff formats:

- .woff2 - Newer format with better compression (for modern browsers)
- .woff - Wider browser support

If you have the fonts in other formats (like .ttf or .otf), you may need to convert them using an online font converter.
