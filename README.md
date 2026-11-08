# Itumeleng D. Kgongwane — Portfolio Site

Static, responsive multi-page portfolio built with HTML, CSS and JavaScript.

## Pages

- `index.html` — introduction and previews that route visitors to the dedicated pages.
- `about.html` — owner profile and professional perspective.
- `expertise.html` — advisory services and who/what/how/why context.
- `work.html` — six case studies with project context and outcomes.
- `career.html` — education and career timeline with filters.
- `awards.html` — awards and recognition.
- `insights.html` — publication space and testimonial handover.
- `contact.html` — contact details and email-based enquiry form.
- `search.html` — site-wide search across pages, projects, roles and awards.

## Content and assets

All provided career and project information is kept in the relevant page. The site source contains no real photographs; the portrait, project and award visuals are CSS graphics/placeholders. No generic stock or external photos are used. Replace the placeholders only with approved owner, project, mill, study and award images.

The light theme is the default. Visitors can switch to the original navy-and-cyan dark theme from any page; their choice is saved in that browser.

The homepage has an owner portrait space and three labelled photo spaces for research, mill/process and speaking/recognition images. Replace the `.owner-photo-space` placeholder in `index.html` with `<img class="owner-photo-image" src="images/portfolio/itumeleng.jpg" alt="Itumeleng D. Kgongwane">`. Replace each `.photo-slot` with an image such as `<img class="photo-slot-image" src="images/portfolio/lab.jpg" alt="Itumeleng reviewing a laboratory trial">`. Use approved images and descriptive alt text. Article thumbnails use the `image` and `imageAlt` fields in `content.json`.

The primary navigation is intentionally limited to Home, Selected work, Expertise, About and Insights. Career, Awards, Search and Contact are grouped under “More”; the contact call-to-action remains visible on larger screens.

### Publishing articles and LinkedIn posts

This is a static site, so it has no secure admin login or direct file-upload interface. Add approved writing and post previews to `content.json`, add any image files to the site (for example `images/portfolio/`), and redeploy the site. The three newest articles and four newest LinkedIn previews appear on the home page; Insights lists the full article collection and post previews. Articles open on the Insights page.

Add an article to the `articles` array:

```json
{
  "slug": "engineering-commercial-value",
  "title": "Connecting engineering to commercial value",
  "date": "2026-11-08",
  "category": "Engineering & innovation",
  "excerpt": "A short introduction shown on the home page and Insights.",
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

## Validation

Check JavaScript syntax with `node --check script.js`, `node --check search.js`, `node --check theme.js` and `node --check content.js`. Validate `content.json` and local HTML navigation when publishing content or changing links.
