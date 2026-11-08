const contentUrl = new URL('content.json', window.location.href);

const createElement = (tag, className, text) => {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text) element.textContent = text;
  return element;
};

const formatDate = date => new Intl.DateTimeFormat('en', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
}).format(new Date(`${date}T00:00:00`));

const newestFirst = items => [...items].sort((a, b) => b.date.localeCompare(a.date));

const validateEntries = (items, type, requiredFields) => {
  if (!Array.isArray(items)) throw new Error(`${type} must be an array.`);
  items.forEach((item, index) => {
    if (!item || typeof item !== 'object') throw new Error(`${type}[${index}] must be an object.`);
    requiredFields.forEach(field => {
      if (typeof item[field] !== 'string' || !item[field].trim()) {
        throw new Error(`${type}[${index}].${field} is required.`);
      }
    });
    if (!/^\d{4}-\d{2}-\d{2}$/.test(item.date) || Number.isNaN(Date.parse(`${item.date}T00:00:00Z`))) {
      throw new Error(`${type}[${index}].date must use YYYY-MM-DD.`);
    }
  });
};

const createImage = (image, alt, className = 'content-card-image') => {
  if (image) {
    const img = createElement('img', className);
    img.src = image;
    img.alt = alt || '';
    img.loading = 'lazy';
    return img;
  }

  return createElement('div', `${className} content-image-placeholder`, 'Add an image in content.json');
};

const createArticleCard = article => {
  const card = createElement('article', 'content-card');
  card.append(createImage(article.image, article.imageAlt));
  const copy = createElement('div', 'content-card-copy');
  copy.append(createElement('p', 'content-meta', `${article.category} · ${formatDate(article.date)}`));
  copy.append(createElement('h3', '', article.title));
  copy.append(createElement('p', 'content-excerpt', article.excerpt));

  const link = createElement('a', 'text-link', 'Read article →');
  link.href = `insights.html?post=${encodeURIComponent(article.slug)}`;
  copy.append(link);
  card.append(copy);
  return card;
};

const createLinkedInCard = post => {
  const card = createElement('article', 'content-card social-post-card');
  const copy = createElement('div', 'content-card-copy');
  copy.append(createElement('p', 'content-meta', `LinkedIn · ${formatDate(post.date)}`));
  copy.append(createElement('h3', '', post.title));
  copy.append(createElement('p', 'content-excerpt', post.excerpt));

  const link = createElement('a', 'text-link', 'View original post ↗');
  link.href = post.url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  copy.append(link);
  card.append(copy);
  return card;
};

const renderCards = (container, items, renderCard, emptyMessage) => {
  container.replaceChildren();
  if (!items.length) {
    container.append(createElement('p', 'content-empty', emptyMessage));
    return;
  }
  items.forEach(item => container.append(renderCard(item)));
};

const renderArticle = (article, listing, reader) => {
  listing.hidden = true;
  reader.hidden = false;
  reader.replaceChildren();

  const back = createElement('a', 'text-link', '← All insights');
  back.href = 'insights.html';
  reader.append(back);

  const header = createElement('header', 'article-reader-header');
  header.append(createElement('p', 'content-meta', `${article.category} · ${formatDate(article.date)}`));
  header.append(createElement('h2', '', article.title));
  header.append(createElement('p', 'content-excerpt', article.excerpt));
  reader.append(header);
  reader.append(createImage(article.image, article.imageAlt, 'article-reader-image'));

  const body = createElement('div', 'article-reader-body');
  (article.body || []).forEach(paragraph => body.append(createElement('p', '', paragraph)));
  reader.append(body);
};

const showContentError = () => {
  document.querySelectorAll('[data-content-error]').forEach(element => {
    element.hidden = false;
  });
};

fetch(contentUrl)
  .then(response => {
    if (!response.ok) throw new Error(`Content request failed: ${response.status}`);
    return response.json();
  })
  .then(content => {
    validateEntries(content.articles, 'articles', ['slug', 'title', 'date', 'category', 'excerpt']);
    validateEntries(content.linkedinPosts, 'linkedinPosts', ['title', 'date', 'excerpt', 'url']);
    content.articles.forEach((article, index) => {
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(article.slug)) {
        throw new Error(`articles[${index}].slug must be a lowercase hyphenated identifier.`);
      }
      if (article.body !== undefined && (!Array.isArray(article.body) || article.body.some(text => typeof text !== 'string'))) {
        throw new Error(`articles[${index}].body must be an array of paragraphs.`);
      }
    });
    content.linkedinPosts.forEach((post, index) => {
      const url = new URL(post.url);
      if (url.protocol !== 'https:' || !url.hostname.endsWith('linkedin.com')) {
        throw new Error(`linkedinPosts[${index}].url must be an HTTPS LinkedIn URL.`);
      }
    });
    const articles = newestFirst(content.articles);
    const linkedinPosts = newestFirst(content.linkedinPosts);

    document.querySelectorAll('[data-articles]').forEach(container => {
      const limit = Number(container.dataset.limit);
      renderCards(container, Number.isFinite(limit) ? articles.slice(0, limit) : articles,
        createArticleCard, 'No articles published yet. Check back soon.');
    });

    document.querySelectorAll('[data-linkedin-posts]').forEach(container => {
      const limit = Number(container.dataset.limit);
      renderCards(container, Number.isFinite(limit) ? linkedinPosts.slice(0, limit) : linkedinPosts,
        createLinkedInCard, 'No recent posts added yet. Visit LinkedIn to see what Itumeleng is sharing.');
    });

    const postSlug = new URLSearchParams(window.location.search).get('post');
    if (postSlug) {
      const listing = document.querySelector('[data-insights-listing]');
      const reader = document.querySelector('[data-article-reader]');
      const article = articles.find(item => item.slug === postSlug);
      if (listing && reader && article) {
        renderArticle(article, listing, reader);
        document.title = `${article.title} | Itumeleng Kgongwane`;
      } else if (listing && reader) {
        listing.hidden = true;
        reader.hidden = false;
        reader.replaceChildren(createElement('p', 'content-empty', 'This article could not be found.'));
      }
    }
  })
  .catch(error => {
    console.error('Unable to load site content.', error);
    showContentError();
  });
