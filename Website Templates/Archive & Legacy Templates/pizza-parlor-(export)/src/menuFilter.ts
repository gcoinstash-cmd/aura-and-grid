/**
 * Vanilla JavaScript Filtering Utility for Artisan Menu
 * Handles category clicks, updates active styles, and triggers smooth fade animations.
 */
export function initMenuFilters() {
  const filterButtons = document.querySelectorAll('.artisan-menu__filter-btn');
  const cards = document.querySelectorAll('.pizza-card');

  if (!filterButtons.length || !cards.length) {
    return;
  }

  filterButtons.forEach(button => {
    const el = button as HTMLButtonElement;
    
    // Clone and replace to prevent multiple event listeners stacking on re-renders
    const newEl = el.cloneNode(true) as HTMLButtonElement;
    el.parentNode?.replaceChild(newEl, el);
    
    const filterValue = newEl.getAttribute('data-filter') || 'all';

    newEl.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Update active visual states on filter buttons
      const currentActive = document.querySelectorAll('.artisan-menu__filter-btn');
      currentActive.forEach(btn => btn.classList.remove('artisan-menu__filter-btn--active'));
      newEl.classList.add('artisan-menu__filter-btn--active');

      // Loop through all menu cards and animate visibility
      const allCards = document.querySelectorAll('.pizza-card');
      allCards.forEach(cardRaw => {
        const card = cardRaw as HTMLElement;
        const cardCategory = card.getAttribute('data-category');

        if (filterValue === 'all' || cardCategory === filterValue) {
          // Fade in and show card
          card.style.display = 'flex';
          // Force a browser reflow or layout recalculation so the display style update is registered instantly
          void card.offsetHeight;
          card.classList.remove('pizza-card--hidden');
        } else {
          // Trigger the fade-out scaling animation
          card.classList.add('pizza-card--hidden');
          
          // Wait for the CSS transition (350ms) to complete before using display none to clear space
          setTimeout(() => {
            if (card.classList.contains('pizza-card--hidden')) {
              const activeBtn = document.querySelector('.artisan-menu__filter-btn--active');
              const activeFilter = activeBtn ? activeBtn.getAttribute('data-filter') : 'all';
              if (activeFilter !== 'all' && card.getAttribute('data-category') !== activeFilter) {
                card.style.display = 'none';
              }
            }
          }, 350);
        }
      });
    });
  });
}
