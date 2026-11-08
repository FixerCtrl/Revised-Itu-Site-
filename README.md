# Itumeleng D. Kgongwane — Portfolio Site

Static, responsive multi-page portfolio built with HTML, CSS and JavaScript.

## Pages

- `index.html` — introduction and previews that route visitors to the dedicated pages.
- `about.html` — owner profile and professional perspective.
- `expertise.html` — advisory services and who/what/how/why context.
- `work.html` — six case studies with project context and outcomes.
- `career.html` — education and career timeline with filters.
- `awards.html` — awards and recognition.
- `blogs.html` — searchable local article archive and article reader.
- `insights.html` — curated LinkedIn post previews and links to original posts.
- `resources.html` — reusable engineering-to-investment readiness worksheet.
- `contact.html` — contact details and email-based enquiry form.
- `search.html` — site-wide search across pages, projects, roles and awards.

## Content and assets

All provided career and project information is kept in the relevant page. The site source contains no real photographs; the portrait, project and award visuals are CSS graphics/placeholders. No generic stock or external photos are used. Replace the placeholders only with approved owner, project, mill, study and award images.

The light theme is the default. Visitors can switch to the original navy-and-cyan dark theme from any page; their choice is saved in that browser.

The homepage has an owner portrait space and three labelled photo spaces for research, mill/process and speaking/recognition images. Replace the `.owner-photo-space` placeholder in `index.html` with `<img class="owner-photo-image" src="images/portfolio/itumeleng.jpg" alt="Itumeleng D. Kgongwane">`. Replace each `.photo-slot` with an image such as `<img class="photo-slot-image" src="images/portfolio/lab.jpg" alt="Itumeleng reviewing a laboratory trial">`. Use approved images and descriptive alt text. Article thumbnails use the `image` and `imageAlt` fields in `content.json`.

The primary navigation links directly to Home, Selected work, Expertise, About, Career, Blogs and Resources. LinkedIn updates and Awards are grouped under More. Search is a visible header action on every page and a search form is available near the top of the homepage. The contact call-to-action remains visible on larger screens.

The homepage features a branded **Follow on LinkedIn** action, and every page footer includes a labelled LinkedIn follow link alongside email and phone contact icons. LinkedIn is the only social profile currently linked because it is the only profile URL supplied and verified in the site content. Add other social links only after the owner confirms the correct public profile URLs; do not guess handles or link to unrelated accounts.

The Resources page includes a project readiness checklist. Progress is stored only in the visitor’s browser using local storage and is never submitted. Visitors can print the worksheet or save it as a PDF from their browser.

### Publishing articles and LinkedIn posts

This is a static site, so it has no secure admin login or direct file-upload interface. The homepage reserves three blog and three LinkedIn preview cards; these are explicitly marked placeholders until real content is published. Add approved writing and post previews to `content.json`, add any image files to the site (for example `images/portfolio/`), then commit and push changes to `main`. The Blogs page lists and searches the local article archive, including article body text, and articles open on that page. LinkedIn previews are manually curated and shown on the homepage and LinkedIn page. Do not enter unpublished or unapproved material.

### Site updates and deployment

The publishing channel is the GitHub repository and its Actions deployment workflow, not an in-browser CMS:

1. Edit the relevant HTML page for profile, career, project or navigation changes, or update `content.json` for blog and LinkedIn content.
2. Add approved image assets under `images/` and use descriptive alt text.
3. Preview and validate the changes locally, then commit and push them to the `main` branch.
4. The **Build and deploy portfolio** workflow validates JavaScript and JSON, generates the sitemap, robots rules and RSS feed for the GitHub Pages URL, assembles the static site and deploys it.
5. Review the workflow run under the repository’s **Actions** tab. A manual run is also available through **Actions → Build and deploy portfolio → Run workflow**.

For the first deployment, configure the repository’s GitHub Pages publishing source as **GitHub Actions**. Deployment can only be confirmed after the repository’s Pages settings and workflow permissions allow the workflow to run; no browser upload or authenticated editor is provided by this static implementation.

Add an article to the `articles` array in `content.json`:

```json
{
  "slug": "engineering-commercial-value",
  "title": "Connecting engineering to commercial value",
  "date": "2026-11-08",
  "category": "Engineering & innovation",
  "excerpt": "A short introduction shown on the home page and Blogs archive.",
  "image": "images/portfolio/article-image.jpg",
  "imageAlt": "A concise description of the photograph",
  "body": [
    "The first paragraph of the article.",
    "The next paragraph of the article."
  ]
}
```

For a LinkedIn preview, add an item to `linkedinPosts` with `date` (`YYYY-MM-DD`), `title`, `excerpt`, and the original LinkedIn post `url`. Previews are intentionally curated manually: LinkedIn does not provide a public feed that this static site can safely read automatically. The site links visitors to the original post.

The contact form prepares an email in the visitor's email application; this static site does not store submissions. Testimonials should only be published with approved quotes and attributions.

### Sitemap, robots rules and RSS

After the final public HTTPS URL is confirmed, generate `sitemap.xml`, `robots.txt` and `feed.xml` from the repository root:

```sh
node generate-site-files.mjs https://your-public-domain.example
```

The command uses the optional URL path as a deployment prefix when needed, lists the site pages and published articles in the sitemap, and adds published articles to the RSS feed. The generated files are not committed with a placeholder domain. The `site.js` script also sets a canonical URL and Open Graph URL from the deployed HTTPS origin; valid article URLs retain their article query when the article is open.

Once deployed, verify the site in Google Search Console and submit the generated sitemap. Check the generated feed and sitemap against the public deployment. Search engine indexing and ranking are not guaranteed.

## Validation

Check JavaScript syntax with `node --check script.js`, `node --check search.js`, `node --check theme.js`, `node --check content.js`, `node --check resources.js` and `node --check generate-site-files.mjs`. Validate `content.json` and local HTML navigation when publishing content or changing links. Links that look like buttons remain anchor elements for navigation and keyboard accessibility; action controls use actual buttons.
