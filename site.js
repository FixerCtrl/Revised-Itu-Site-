if (window.location.protocol === 'https:') {
  const canonical = document.createElement('link');
  canonical.rel = 'canonical';
  canonical.href = `${window.location.origin}${window.location.pathname}`;
  document.head.append(canonical);

  let socialUrl = document.querySelector('meta[property="og:url"]');
  if (!socialUrl) {
    socialUrl = document.createElement('meta');
    socialUrl.setAttribute('property', 'og:url');
    document.head.append(socialUrl);
  }
  socialUrl.content = canonical.href;
}
