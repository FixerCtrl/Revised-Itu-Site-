const siteEntries = [
  { title: 'About Itumeleng', category: 'About', url: 'about.html', text: 'Itumeleng D Kgongwane chemical engineer Wits finance Fordham Gabelli MBA GIBS Pretoria South Africa Sappi R&D scientists manufacturing innovation AI machine learning Institute directors sustainability leadership' },
  { title: 'Technical due diligence', category: 'Expertise', url: 'expertise.html', text: 'technical due diligence process materials technology investment asset decision risk capital engineering' },
  { title: 'R&D commercialisation', category: 'Expertise', url: 'expertise.html', text: 'research development product innovation commercialisation customer market business case stage gate' },
  { title: 'Process, energy and cost optimisation', category: 'Expertise', url: 'expertise.html', text: 'operations manufacturing quality efficiency process energy water steam cost optimisation' },
  { title: 'Sustainability strategy and ESG', category: 'Expertise', url: 'expertise.html', text: 'sustainability strategy EN 13432 portfolio criteria compliance market opportunity ESG' },
  { title: 'Equity and market analysis', category: 'Expertise', url: 'expertise.html', text: 'equity market analysis finance investment industrials strategy' },
  { title: 'Board and speaking engagements', category: 'Expertise', url: 'expertise.html', text: 'board speaking leadership events presentations' },
  { title: 'Sustainable packaging grades', category: 'Case study', url: 'work.html#case-packaging', text: 'Sappi sustainable packaging market share 16% R87M EBITDA digitisation graphic paper COVID global gold 2017 2022' },
  { title: 'MFC scale-up from bagasse pulp', category: 'Case study', url: 'work.html#case-mfc', text: 'microfibrillated cellulose MFC bagasse pulp Stanger Mill R203M NPV R24M EBITDA Sappi Europe 2023' },
  { title: 'MFC in corrugator starch adhesive', category: 'Case study', url: 'work.html#case-corrugator', text: 'corrugator starch adhesive bond strength variability TAM SAM SOM pricing model customer trials 2024 2025' },
  { title: 'Filler chemistry and water efficiency', category: 'Case study', url: 'work.html#case-filler-water', text: 'Sappi Enstra mill operations water 15 9 ML/day R20M savings filler chemistry fibre' },
  { title: 'PGM recycle inventory optimisation', category: 'Case study', url: 'work.html#case-pgm-inventory', text: 'BASF platinum group metal PGM SAP Oracle recycle inventory 45% Germany 2011 2013' },
  { title: 'The two-tank process', category: 'Case study', url: 'work.html#case-two-tank', text: 'BASF asymmetric soot filter back-pressure defects root cause throughput 27% process engineering' },
  { title: 'MS Finance — Summa Cum Laude', category: 'Career', url: 'career.html', text: '2026 Fordham Gabelli GPA 3.94 finance New York agentic AI market intelligence FT Bloomberg WSJ' },
  { title: 'MBA — GIBS', category: 'Career', url: 'career.html', text: '2025 Gordon Institute Business Science Sandton distinctions Decision Making Entrepreneurial Finance Financial Modelling' },
  { title: 'Sappi Global Sustainability Task Force', category: 'Career', url: 'career.html', text: '2023 sustainability EN 13432 portfolio USA EU RSA Sappi strategy' },
  { title: 'Lead Engineer — Sappi R&D', category: 'Career', url: 'career.html', text: '2023 Pretoria lead engineer scientists Stanger MFC R203M R24M' },
  { title: 'Process engineering — Sappi and BASF', category: 'Career', url: 'career.html', text: '2005 2017 Wits Anglo Coal Bank Colliery BASF Port Elizabeth Sappi Enstra Springs process engineer' },
  { title: 'Sappi Global Gold Technical Innovation Award', category: 'Award', url: 'awards.html', text: '2022 Graz Austria May 9 sustainable packaging technical innovation gold' },
  { title: 'Sappi Annual Value Award', category: 'Award', url: 'awards.html', text: '2021 project execution COVID-19' },
  { title: 'General Manager’s Award', category: 'Award', url: 'awards.html', text: '2024 Accolade stage gate financial metrics roll out' },
  { title: 'Global Catalyst Compass Award nominee', category: 'Award', url: 'awards.html', text: '2013 BASF PGM recycle inventory optimisation' },
  { title: 'Insights and Journal', category: 'Insights', url: 'insights.html', text: 'writing articles posts journal reflections engineering finance innovation leadership no published posts' },
  { title: 'Contact and advisory enquiries', category: 'Contact', url: 'contact.html', text: 'email phone advisory board speaking Pretoria technical due diligence commercialisation process sustainability market analysis' }
];

const searchInput = document.querySelector('#site-search-input');
const results = document.querySelector('#search-results');
if (searchInput && results) {
  const normalize = value => value.toLocaleLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\p{L}\p{N}%]+/gu, ' ').trim();
  const query = new URLSearchParams(window.location.search).get('q') || '';
  searchInput.value = query;

  function showResults() {
    const terms = normalize(searchInput.value).split(/\s+/).filter(Boolean);
    results.replaceChildren();
    if (!terms.length) {
      const prompt = document.createElement('p');
      prompt.textContent = 'Enter a topic to search this site.';
      results.append(prompt);
      return;
    }

    const matches = siteEntries.filter(entry => {
      const content = normalize(`${entry.title} ${entry.category} ${entry.text}`);
      return terms.every(term => content.includes(term));
    }).slice(0, 20);
    const heading = document.createElement('p');
    heading.className = 'search-result-count';
    heading.textContent = matches.length
      ? `${matches.length} ${matches.length === 1 ? 'result' : 'results'}${matches.length === 20 ? ' · showing first 20' : ''}`
      : 'No matches. Try a broader search such as “finance”, “engineering” or “award”.';
    results.append(heading);
    if (!matches.length) return;

    const list = document.createElement('ul');
    matches.forEach(entry => {
      const item = document.createElement('li');
      const link = document.createElement('a');
      const label = document.createElement('span');
      const title = document.createElement('strong');
      label.textContent = entry.category;
      title.textContent = entry.title;
      link.href = entry.url;
      link.append(label, title);
      item.append(link);
      list.append(item);
    });
    results.append(list);
  }

  searchInput.addEventListener('input', showResults);
  document.querySelector('.search-page-form').addEventListener('submit', event => {
    event.preventDefault();
    const url = new URL(window.location.href);
    url.searchParams.set('q', searchInput.value);
    window.history.replaceState({}, '', url);
    showResults();
  });
  showResults();
}
