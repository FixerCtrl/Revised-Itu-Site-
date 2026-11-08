let savedTheme;
try {
  savedTheme = localStorage.getItem('portfolio-theme');
} catch (error) {
  console.error('Unable to read the saved theme preference.', error);
}
if (savedTheme === 'dark' || savedTheme === 'light') {
  document.documentElement.dataset.theme = savedTheme;
}

document.addEventListener('DOMContentLoaded', () => {
  const navigation = document.querySelector('.nav .wrap');
  if (!navigation) return;

  const button = document.createElement('button');
  button.className = 'theme-toggle';
  button.type = 'button';
  const isDark = document.documentElement.dataset.theme === 'dark';
  button.addEventListener('click', () => {
    const dark = document.documentElement.dataset.theme !== 'dark';
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    try {
      localStorage.setItem('portfolio-theme', dark ? 'dark' : 'light');
    } catch (error) {
      console.error('Unable to save the theme preference.', error);
    }
    button.setAttribute('aria-pressed', String(dark));
    button.setAttribute('aria-label', `Switch to ${dark ? 'light' : 'dark'} mode`);
    button.querySelector('.theme-toggle-label').textContent = dark ? 'Dark' : 'Light';
    button.querySelector('.theme-toggle-icon').textContent = dark ? '☾' : '☼';
  });

  button.setAttribute(
    'aria-label',
    `Switch to ${isDark ? 'light' : 'dark'} mode`
  );
  button.setAttribute('aria-pressed', String(isDark));
  button.innerHTML = `<span class="theme-toggle-icon" aria-hidden="true">${isDark ? '☾' : '☼'}</span><span class="theme-toggle-label">${isDark ? 'Dark' : 'Light'}</span>`;
  navigation.append(button);
});
