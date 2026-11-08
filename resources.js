const checklist = document.querySelector('[data-resource-checklist]');
if (checklist) {
  const storageKey = 'itumeleng-project-readiness-checklist';
  const checkboxes = [...checklist.querySelectorAll('input[type="checkbox"]')];
  const progress = document.querySelector('[data-resource-progress]');
  const error = document.querySelector('[data-resource-error]');

  const updateProgress = () => {
    const complete = checkboxes.filter(input => input.checked).length;
    progress.textContent = `${complete} of ${checkboxes.length} items marked complete.`;
  };

  try {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const state = JSON.parse(saved);
      if (!state || typeof state !== 'object' || Array.isArray(state)) {
        throw new Error('Saved checklist state must be an object.');
      }
      checkboxes.forEach(input => {
        if (typeof state[input.name] === 'boolean') input.checked = state[input.name];
      });
    }
  } catch (loadError) {
    console.error('Unable to restore the saved checklist.', loadError);
    error.hidden = false;
  }
  updateProgress();

  checklist.addEventListener('change', () => {
    updateProgress();
    try {
      const state = Object.fromEntries(checkboxes.map(input => [input.name, input.checked]));
      localStorage.setItem(storageKey, JSON.stringify(state));
      error.hidden = true;
    } catch (saveError) {
      console.error('Unable to save the checklist.', saveError);
      error.hidden = false;
    }
  });

  document.querySelector('[data-resource-print]').addEventListener('click', () => window.print());
  document.querySelector('[data-resource-clear]').addEventListener('click', () => {
    checkboxes.forEach(input => {
      input.checked = false;
    });
    updateProgress();
    try {
      localStorage.removeItem(storageKey);
      error.hidden = true;
    } catch (clearError) {
      console.error('Unable to clear the saved checklist.', clearError);
      error.hidden = false;
    }
  });
}
