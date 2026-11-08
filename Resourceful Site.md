# Making Itumeleng's Site a Resourceful Professional Platform

## What the site should do

The site should quickly answer four questions for a prospective employer, collaborator, client or industry peer:

1. **Who is Itumeleng?** A clear, consistent professional identity and current role.
2. **What has he done?** Evidence-led engineering, research, product and commercial case studies.
3. **What can he contribute?** Specific expertise, leadership strengths and advisory value.
4. **How can someone take the next step?** A clear contact route, profile download or useful resource.

The current site already has a strong foundation: a concise navigation, work case studies, career and awards pages, search, contact details, article and LinkedIn preview areas, and an owner portrait placeholder. The highest-value next step is not adding more menu items; it is replacing placeholders with verified material and strengthening the evidence and reusable resources behind those pages.

## Recommendations

### Priorities for the next release

1. **Complete the identity and trust signals**
   - Add an owner-approved professional portrait and a short, consistent biography.
   - Link to verified professional profiles and identify the current role, education, relevant memberships and awards.
   - Offer a concise, accessible CV or professional profile PDF, with a visible update date. Keep any personal contact details intentional.
   - Use real, approved project, mill, research and speaking photographs, with descriptive alternative text and captions. Do not imply that a placeholder is a real project image.

2. **Make every case study independently convincing**
   - Use a consistent structure: context/problem, Itumeleng's role, approach, constraints, outcome, and what was learned.
   - Give each project a descriptive page heading and a direct URL/anchor that can be shared.
   - Include metric definitions, timeframe, units and context where available. Distinguish team results from individual contributions, and obtain approval before publishing confidential or commercially sensitive details.
   - Link relevant awards, articles and skills to the evidence that supports them.

3. **Build a useful, sustainable Insights area**
   - Publish original, substantive articles with author, publication date, last-updated date where relevant, topic, summary and sources.
   - Keep the current three latest article previews on the homepage, but let the Insights page provide a complete, browsable archive with topic filters and search.
   - Keep LinkedIn previews curated and link to the original post. A static website cannot reliably pull an authenticated LinkedIn feed; keep the current manual publishing approach unless a supported integration is deliberately chosen.
   - Set a realistic publishing cadence. A small archive of durable, useful articles is better than stale promises of frequent updates.

4. **Give visitors a reason to return**
   - Add a **Resources** section with genuinely useful, original material related to engineering and finance—for example, a project-readiness checklist, a technical-to-commercial business-case template, or a guide to evaluating scale-up assumptions.
   - Make each item easy to preview, download and cite. State its intended audience, version/date, limitations and whether it is free to reuse.
   - Consider an RSS feed for new articles. Offer email updates only if there is a plan to maintain them and a consent-based mailing-list service; do not collect email addresses in a static form that cannot securely process them.
   - A practical calculator or short self-assessment can invite repeat use, but should explain assumptions and must not present estimates as guaranteed business outcomes.

### Search visibility and discoverability

- Give every page a unique, descriptive title and meta description, one clear main heading, useful page copy and descriptive internal link text. Keep important information in crawlable HTML rather than image-only content.
- Once the final public domain is known, use HTTPS consistently, set canonical URLs, and publish a correct `sitemap.xml` and `robots.txt`. Verify the domain in Google Search Console and submit the sitemap. A sitemap can help discovery; it does not guarantee indexing or rankings.
- Add relevant `Person` structured data to the owner profile and `Article` structured data to real article pages. Keep the markup consistent with visible, accurate page content. Structured data can clarify meaning but does not guarantee a special search result.
- Provide a polished social preview (Open Graph title, description and approved image) for the homepage and shareable articles/case studies.
- Use a descriptive image filename and useful alt text for meaningful images; compress images and avoid decorative imagery that obscures page meaning.
- Keep Itumeleng's name, role and professional links consistent across the site and public profiles. Search visibility cannot be promised or achieved by metadata alone; useful, credible content and external recognition matter.

### Navigation and interaction

- Preserve the current compact primary menu. Organize new material under a small number of destinations such as **Work**, **About**, **Insights**, **Resources** and **Contact** rather than adding a top-level item for each content type.
- Keep common tasks within about three deliberate interactions: find a project, read an article, download a profile or contact Itumeleng. This is a useful design target, not a guarantee that every visit takes exactly three clicks.
- Add visible dates and categories, useful search results, and clear empty states. Avoid showing empty social-post placeholders indefinitely; remove or replace them once real posts are available.
- For the requested button-like links, keep links as `<a>` elements and style them as buttons. Do **not** put an `<a>` inside a `<button>`: nested interactive controls are invalid and can impair keyboard and assistive-technology use. Use actual `<button>` elements for actions such as opening a menu or changing a carousel slide. Decorative arrow glyphs can be removed while retaining clear labels and focus states.
- Ensure keyboard access, visible focus, sufficient contrast, reduced-motion support and comfortable touch targets on mobile.

## Benchmark: useful patterns, not templates to copy

These are examples of presentation and publishing patterns observed on public sites. They are not all direct career peers; they are selected for relevant lessons and should not be treated as evidence of what every chemical engineer's site needs. Adapt the patterns to Itumeleng's actual work and voice.

| Site | Observed pattern | Relevance to Itumeleng's site |
|---|---|---|
| [Andrew Ng](https://www.andrewng.org/) | The page leads with a concise identity and current affiliations, then summarizes career history, impact, publications and education. | Make the professional identity and distinctive engineering-plus-finance perspective immediately clear; prioritize verified facts and meaningful evidence over a long résumé on the homepage. |
| [Martin Fowler](https://martinfowler.com/) | A personal expert site connects a clear point of view to a large body of writing, organized subject areas, books and talks. Articles are treated as durable reference material. | Build an Insights archive that remains useful after the homepage's latest-post previews have changed; organize content by enduring themes and connect it to work and expertise. |
| [Without Hot Air](https://www.withouthotair.com/) | A technical reference presents material in a structured, browsable format and connects explanations to supporting detail. | Make any future engineering/business resources understandable and reusable, with clear assumptions, navigation and supporting references—not just promotional excerpts. |
| [OXMAN](https://www.oxman.com/) | The visual presentation is project-led, using strong imagery and concise project narratives to communicate interdisciplinary work. | Replace generic graphics with approved, authentic work imagery and lead case studies with the real problem and outcome. Keep visual storytelling grounded in attributable facts. |

### What this benchmark does and does not establish

The examples show that clear identity, evidence-rich work, durable content and strong visual storytelling can support a professional platform. They do not establish that one site's design or features will improve another person's search rank, nor that any site's claims or results should be copied. The benchmark is intentionally pattern-based rather than a ranking of peers.

## Suggested rollout

**Phase 1 — Credibility and completion:** confirm the public biography, role, dates, metrics and permissions; add the approved portrait and project imagery; replace empty article and LinkedIn placeholders with real content or remove the empty slots; add an updated CV/profile download.

**Phase 2 — Search and shareability:** confirm the domain; review page titles and descriptions; add canonical links, sitemap and robots rules; implement and validate profile/article structured data; add social preview metadata; test the site on mobile, keyboard and screen readers.

**Phase 3 — Return value:** publish a small set of high-quality articles and one genuinely useful resource; add archive categories/search and RSS; measure which pages and resources visitors use, with privacy-conscious analytics if desired.

**Phase 4 — Choose a publishing workflow:** continue editing `content.json` and redeploying while updates remain occasional. If the owner needs frequent publishing, direct browser uploads, drafts or multiple editors, evaluate a CMS with authentication, backups, image handling and an approval workflow. A static site by itself has no secure admin dashboard or upload capability; a visitor-facing upload form should not be added without a trusted backend.

## Sources

- [Google Search Central: SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [Google Search Central: Profile page structured data](https://developers.google.com/search/docs/appearance/structured-data/profile-page)
- [Google Search Central: Article structured data](https://developers.google.com/search/docs/appearance/structured-data/article)
- [Google Search Central: Build and submit a sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Andrew Ng](https://www.andrewng.org/)
- [Martin Fowler](https://martinfowler.com/)
- [Without Hot Air](https://www.withouthotair.com/)
- [OXMAN](https://www.oxman.com/)
