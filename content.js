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

  return createElement('div', `${className} content-image-placeholder`, 'Article cover image');
};

const createArticleCard = article => {
  const card = createElement('article', 'content-card');
  card.append(createImage(article.image, article.imageAlt));
  const copy = createElement('div', 'content-card-copy');
  copy.append(createElement('p', 'content-meta', `${article.category} · ${formatDate(article.date)}`));
  copy.append(createElement('h3', '', article.title));
  copy.append(createElement('p', 'content-excerpt', article.excerpt));

  const link = createElement('a', 'text-link', 'Read article');
  link.href = `blogs.html?post=${encodeURIComponent(article.slug)}`;
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

  const link = createElement('a', 'text-link', 'View original post');
  link.href = post.url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  copy.append(link);
  card.append(copy);
  return card;
};

const createPlaceholderCard = (type, index) => {
  const isArticle = type === 'article';
  const card = createElement('article', `content-card content-placeholder-card${isArticle ? '' : ' social-post-card'}`);
  card.append(createElement('div',
    `content-card-image content-image-placeholder ${isArticle ? 'article-image-slot' : 'linkedin-image-slot'}`,
    isArticle ? 'Article image space' : 'LinkedIn post image space'));
  const copy = createElement('div', 'content-card-copy');
  const label = isArticle ? 'BLOG POST' : 'LINKEDIN POST';
  copy.append(createElement('p', 'content-meta', `${label} SLOT ${String(index).padStart(2, '0')}`));
  copy.append(createElement('h3', '', isArticle ? 'Your next blog post' : 'Your next LinkedIn update'));
  copy.append(createElement('p', 'content-excerpt', isArticle
    ? 'Add an approved article to content.json to publish it here and in the Blogs archive.'
    : 'Add an approved post preview to content.json to feature it here.'));
  copy.append(createElement('span', 'content-placeholder-note', 'Content placeholder'));
  card.append(copy);
  return card;
};

const renderCards = (container, items, renderCard, emptyMessage, placeholderType, showPlaceholders = true) => {
  container.replaceChildren();
  const cards = items.map(renderCard);
  const placeholderCount = Number(container.dataset.placeholderCount) || 0;
  if (showPlaceholders && placeholderType && cards.length < placeholderCount) {
    for (let index = cards.length + 1; index <= placeholderCount; index += 1) {
      cards.push(createPlaceholderCard(placeholderType, index));
    }
  }
  if (!cards.length) container.append(createElement('p', 'content-empty', emptyMessage));
  else container.append(...cards);
};

const renderArticle = (article, listing, reader) => {
  listing.hidden = true;
  reader.hidden = false;
  reader.replaceChildren();

  const back = createElement('a', 'text-link', 'All blogs');
  back.href = 'blogs.html';
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

  const description = article.excerpt;
  document.title = `${article.title} | Itumeleng Kgongwane`;
  document.querySelector('meta[name="description"]')?.setAttribute('content', description);
  document.querySelector('meta[property="og:title"]')?.setAttribute('content', document.title);
  document.querySelector('meta[property="og:description"]')?.setAttribute('content', description);
  const articleUrl = window.location.href;
  document.querySelector('meta[property="og:url"]')?.setAttribute('content', articleUrl);
  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) canonical.href = articleUrl;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description,
    datePublished: `${article.date}T00:00:00Z`,
    author: {
      '@type': 'Person',
      name: 'Itumeleng D. Kgongwane',
      url: new URL('about.html', window.location.href).href
    },
    mainEntityOfPage: window.location.href
  };
  if (article.image) structuredData.image = new URL(article.image, window.location.href).href;
  const schema = createElement('script');
  schema.type = 'application/ld+json';
  schema.id = 'article-structured-data';
  schema.textContent = JSON.stringify(structuredData);
  document.querySelector('#article-structured-data')?.remove();
  document.head.append(schema);
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
      if (url.protocol !== 'https:' || !(url.hostname === 'linkedin.com' || url.hostname.endsWith('.linkedin.com'))) {
        throw new Error(`linkedinPosts[${index}].url must be an HTTPS LinkedIn URL.`);
      }
    });
    const articles = newestFirst(content.articles);
    const linkedinPosts = newestFirst(content.linkedinPosts);

    const articleContainers = [...document.querySelectorAll('[data-articles]')];
    const articleFilter = document.querySelector('[data-article-filter]');
    const categoryFilter = document.querySelector('[data-article-category]');
    if (categoryFilter) {
      [...new Set(articles.map(article => article.category))].sort().forEach(category => {
        const option = createElement('option', '', category);
        option.value = category;
        categoryFilter.append(option);
      });
    }

    const renderArticles = () => {
      articleContainers.forEach(container => {
        const limit = Number(container.dataset.limit);
        const source = Number.isFinite(limit) ? articles.slice(0, limit) : articles;
        const query = articleFilter?.value.trim().toLocaleLowerCase() || '';
        const category = categoryFilter?.value || '';
        const filtered = source.filter(article =>
          (!query || `${article.title} ${article.category} ${article.excerpt} ${(article.body || []).join(' ')}`.toLocaleLowerCase().includes(query))
          && (!category || article.category === category));
        renderCards(container, filtered, createArticleCard,
          query || category ? 'No articles match these filters.' : 'No articles have been published yet.',
          'article', !query && !category && articles.length < Number(container.dataset.placeholderCount));
      });
    };
    articleFilter?.addEventListener('input', renderArticles);
    categoryFilter?.addEventListener('change', renderArticles);
    renderArticles();

    document.querySelectorAll('[data-linkedin-posts]').forEach(container => {
      const limit = Number(container.dataset.limit);
      const posts = Number.isFinite(limit) ? linkedinPosts.slice(0, limit) : linkedinPosts;
      renderCards(container, posts, createLinkedInCard,
        'No LinkedIn post previews have been added yet. Visit the profile for updates.',
        'linkedin', posts.length < Number(container.dataset.placeholderCount));
    });

    const postSlug = new URLSearchParams(window.location.search).get('post');
    if (postSlug) {
      const listing = document.querySelector('[data-article-listing]');
      const reader = document.querySelector('[data-article-reader]');
      const article = articles.find(item => item.slug === postSlug);
      if (listing && reader && article) {
        renderArticle(article, listing, reader);
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
