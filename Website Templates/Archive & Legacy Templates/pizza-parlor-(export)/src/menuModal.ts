import { Pizza, CartItem } from './types';

interface CustomizationOption {
  id: string;
  name: string;
  price: number;
}

/**
 * Stunning Vanilla JS Acccessible Modal Component
 */
export function openMenuModal(pizza: Pizza, onAddToCart: (item: CartItem) => void) {
  // Store originally focused element to restore it on close
  const originalActiveElement = document.activeElement as HTMLElement;

  // Create Backdrop Overlay
  const backdrop = document.createElement('div');
  backdrop.id = 'pizzeria-menu-modal';
  backdrop.className = 'pizzeria-modal-backdrop';
  backdrop.setAttribute('role', 'dialog');
  backdrop.setAttribute('aria-modal', 'true');
  backdrop.setAttribute('aria-labelledby', 'modal-item-title');
  backdrop.setAttribute('aria-describedby', 'modal-item-desc');

  // Generate dynamic ingredients tags
  const ingredientsHtml = (pizza.ingredients || [])
    .map(ing => `<span class="modal-ingredient-pill">${ing}</span>`)
    .join('');

  // Generate dynamic allergens badges
  const allergensHtml = (pizza.allergens || []).length > 0
    ? (pizza.allergens || []).map(all => `<span class="modal-allergen-tag" data-allergen="${all}">${all}</span>`).join('')
    : '<span class="modal-allergen-tag modal-allergen-tag--none">No Allergens Declared</span>';

  // Customize block HTML based on item category
  let customizationFieldsHtml = '';
  let defaultPriceAddition = 0;

  if (pizza.category === 'pizza') {
    customizationFieldsHtml = `
      <div class="modal-customization-group">
        <label class="modal-group-title">1. Sourdough Crust Base</label>
        <div class="modal-radio-options">
          <label class="modal-option-label" id="lbl-crust-std">
            <input type="radio" name="crust-selection" value="standard" checked data-price="0" data-label="Standard Neapolitan">
            <span>Standard Sourdough (+$0.00)</span>
          </label>
          <label class="modal-option-label" id="lbl-crust-thin">
            <input type="radio" name="crust-selection" value="thin" data-price="0" data-label="Thin & Crackly (Roman)">
            <span>Thin & Crackly Roman (+$0.00)</span>
          </label>
          <label class="modal-option-label" id="lbl-crust-gf">
            <input type="radio" name="crust-selection" value="gf" data-price="3" data-label="Gluten-Free Base">
            <span>Organic Gluten-Free (+$3.00)</span>
          </label>
        </div>
      </div>

      <div class="modal-customization-group">
        <label class="modal-group-title">2. Premium Additions (Multi-select)</label>
        <div class="modal-checkbox-options">
          <label class="modal-option-label" id="lbl-add-burrata">
            <input type="checkbox" name="addon-selection" value="burrata" data-price="2.5" data-label="Extra Burrata">
            <span>Extra Burrata Cream (+$2.50)</span>
          </label>
          <label class="modal-option-label" id="lbl-add-mushrooms">
            <input type="checkbox" name="addon-selection" value="mushrooms" data-price="1.5" data-label="Wild Mushroom Mix">
            <span>Sautéed Wild Mushrooms (+$1.50)</span>
          </label>
          <label class="modal-option-label" id="lbl-add-prosciutto">
            <input type="checkbox" name="addon-selection" value="prosciutto" data-price="3" data-label="Prosciutto di Parma">
            <span>Prosciutto di Parma (+$3.00)</span>
          </label>
          <label class="modal-option-label" id="lbl-add-basil">
            <input type="checkbox" name="addon-selection" value="basil" data-price="1" data-label="Extra Basil Oil">
            <span>Extra Basil Oil Brush (+$1.00)</span>
          </label>
        </div>
      </div>
    `;
  } else if (pizza.category === 'pasta') {
    customizationFieldsHtml = `
      <div class="modal-customization-group">
        <label class="modal-group-title">1. Hand-Crafted Pasta Type</label>
        <div class="modal-radio-options">
          <label class="modal-option-label" id="lbl-pasta-bronze">
            <input type="radio" name="pasta-type" value="bronze" checked data-price="0" data-label="Bronze-Drawn Tagliolini">
            <span>Bronze-Cut Semolina Egg Pasta (+$0.00)</span>
          </label>
          <label class="modal-option-label" id="lbl-pasta-gf">
            <input type="radio" name="pasta-type" value="gf" data-price="2.5" data-label="Gluten-Free Penne">
            <span>Gluten-Free Rice Penne (+$2.50)</span>
          </label>
        </div>
      </div>

      <div class="modal-customization-group">
        <label class="modal-group-title">2. Spice Intricacy level</label>
        <div class="modal-radio-options">
          <label class="modal-option-label" id="lbl-spice-mild">
            <input type="radio" name="pasta-spice" value="mild" data-price="0" data-label="Delicate Mild">
            <span>Delicate Classic Mild (+$0.00)</span>
          </label>
          <label class="modal-option-label" id="lbl-spice-std">
            <input type="radio" name="pasta-spice" value="medium" checked data-price="0" data-label="Standard Spice">
            <span>Standard Recipe (+$0.00)</span>
          </label>
          <label class="modal-option-label" id="lbl-spice-hot">
            <input type="radio" name="pasta-spice" value="hot" data-price="0" data-label="Arrabbiata Infused">
            <span>Arrabbiata Infused Hot (+$0.00)</span>
          </label>
        </div>
      </div>
    `;
  } else if (pizza.category === 'dessert') {
    customizationFieldsHtml = `
      <div class="modal-customization-group">
        <label class="modal-group-title">1. Dolce Enhancements (Multi-select)</label>
        <div class="modal-checkbox-options">
          <label class="modal-option-label" id="lbl-sweet-ricotta">
            <input type="checkbox" name="dessert-addon" value="ricotta" data-price="1" data-label="Extra Ricotta core">
            <span>Sweetened Sheep Ricotta Core (+$1.00)</span>
          </label>
          <label class="modal-option-label" id="lbl-sweet-orange">
            <input type="checkbox" name="dessert-addon" value="orange" data-price="0.75" data-label="Candied Orange peels">
            <span>Vesuvius Candied Orange Slices (+$0.75)</span>
          </label>
          <label class="modal-option-label" id="lbl-sweet-espresso">
            <input type="checkbox" name="dessert-addon" value="espresso" data-price="1.5" data-label="Espresso Gold Shot">
            <span>Add Double Ristretto Cocoa Shot (+$1.50)</span>
          </label>
        </div>
      </div>
    `;
  }

  // Set total modal markup
  backdrop.innerHTML = `
    <div class="pizzeria-modal-card" tabIndex="-1" id="pizzeria-modal-card-element">
      <!-- Close Icon Button -->
      <button class="modal-close-button" id="modal-close-trigger" aria-label="Close dialog">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      <!-- Left Column: Splendid Visual View -->
      <div class="modal-media-pane">
        <img class="modal-hero-image" src="${pizza.image}" alt="${pizza.name}" referrerPolicy="no-referrer" loading="lazy" width="600" height="480">
        <div class="modal-image-gradient"></div>
        <div class="modal-brand-badge">${pizza.category.toUpperCase()} MASTERPIECE</div>
      </div>

      <!-- Right Column: Micro-interactive Controls -->
      <div class="modal-controls-pane">
        <div class="modal-header-intro">
          <span class="modal-italian-subtitle font-sans">${pizza.italianName}</span>
          <h2 class="modal-item-title font-serif" id="modal-item-title">${pizza.name}</h2>
          <p class="modal-item-desc" id="modal-item-desc">${pizza.description}</p>
        </div>

        <div class="modal-divider"></div>

        <!-- Culinary Specifications: Ingredients -->
        <div class="modal-section">
          <span class="modal-section-title">Fresh Ingredients</span>
          <div class="modal-ingredients-wrapper">${ingredientsHtml || '<span class="text-xs text-stone-500">Traditional recipe blend</span>'}</div>
        </div>

        <!-- Allergen Details -->
        <div class="modal-section">
          <span class="modal-section-title">Allergen Declarations</span>
          <div class="modal-allergens-wrapper">${allergensHtml}</div>
        </div>

        <div class="modal-divider"></div>

        <!-- Interactive Customizer Block -->
        <form id="modal-customizer-form" class="modal-options-form">
          ${customizationFieldsHtml}

          <!-- Quantity Selector and Action Trigger -->
          <div class="modal-checkout-dock">
            <div class="modal-quantity-adjuster">
              <button type="button" class="modal-qty-btn" id="modal-qty-minus" aria-label="Decrease quantity">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
              <span class="modal-qty-display" id="modal-qty-value">1</span>
              <button type="button" class="modal-qty-btn" id="modal-qty-plus" aria-label="Increase quantity">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
            </div>

            <button type="submit" class="modal-action-submit" id="modal-add-to-cart-submit">
              <span>Add to Order</span>
              <span id="modal-total-display">$${pizza.price.toFixed(2)}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `;

  // Append to body
  document.body.appendChild(backdrop);

  // Set aria-hidden attributes on secondary DOM elements (like #root) to keep it screen-reader friendly
  const rootNode = document.getElementById('root');
  if (rootNode) rootNode.setAttribute('aria-hidden', 'true');

  const card = backdrop.querySelector('#pizzeria-modal-card-element') as HTMLElement | null;
  const form = backdrop.querySelector('#modal-customizer-form') as HTMLFormElement | null;
  const closeBtn = backdrop.querySelector('#modal-close-trigger') as HTMLButtonElement | null;
  const qtyMinus = backdrop.querySelector('#modal-qty-minus') as HTMLButtonElement | null;
  const qtyPlus = backdrop.querySelector('#modal-qty-plus') as HTMLButtonElement | null;
  const qtyValNode = backdrop.querySelector('#modal-qty-value') as HTMLElement | null;
  const totalDisplay = backdrop.querySelector('#modal-total-display') as HTMLElement | null;

  if (!card || !form || !closeBtn || !qtyMinus || !qtyPlus || !qtyValNode || !totalDisplay) {
    return;
  }

  let quantity = 1;
  const basePrice = pizza.price;

  // Function to re-calculate price dynamically
  function updateModalTotalPrice() {
    let priceCalculated = basePrice;

    // Sum checkboxes
    const checkboxes = form.querySelectorAll('input[type="checkbox"]:checked');
    checkboxes.forEach(chk => {
      const el = chk as HTMLInputElement;
      priceCalculated += parseFloat(el.getAttribute('data-price') || '0');
    });

    // Sum selected radios
    const radios = form.querySelectorAll('input[type="radio"]:checked');
    radios.forEach(rad => {
      const el = rad as HTMLInputElement;
      priceCalculated += parseFloat(el.getAttribute('data-price') || '0');
    });

    const overallTotal = priceCalculated * quantity;
    totalDisplay.textContent = `$${overallTotal.toFixed(2)}`;
  }

  // Add event listeners on input fields to automatically trigger calculations
  form.addEventListener('change', () => {
    updateModalTotalPrice();
  });

  // Quantity controllers
  qtyMinus.addEventListener('click', (e) => {
    e.preventDefault();
    if (quantity > 1) {
      quantity -= 1;
      qtyValNode.textContent = quantity.toString();
      updateModalTotalPrice();
    }
  });

  qtyPlus.addEventListener('click', (e) => {
    e.preventDefault();
    quantity += 1;
    qtyValNode.textContent = quantity.toString();
    updateModalTotalPrice();
  });

  // Handle Close with beautiful transitions
  function closeModal() {
    backdrop.classList.remove('pizzeria-modal-backdrop--visible');
    card.classList.remove('pizzeria-modal-card--visible');

    setTimeout(() => {
      // Remove element completely
      backdrop.remove();
      // Restore aria-hidden
      if (rootNode) rootNode.removeAttribute('aria-hidden');
      // Restore focus
      if (originalActiveElement) {
        originalActiveElement.focus();
      }
    }, 300);
  }

  // Escape key close handler
  const keyHandler = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  };
  window.addEventListener('keydown', keyHandler);

  // Focus trapping logic
  const focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
  
  const getFocusableNodes = (): HTMLElement[] => {
    return Array.from(card.querySelectorAll(focusableSelectors)) as HTMLElement[];
  };

  const trapFocusHandler = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;

    const focusables = getFocusableNodes();
    if (focusables.length === 0) return;

    const firstElement = focusables[0];
    const lastElement = focusables[focusables.length - 1];

    if (e.shiftKey) {
      // Shift + Tab -> Move up
      if (document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      }
    } else {
      // Tab -> Move down
      if (document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    }
  };
  card.addEventListener('keydown', trapFocusHandler);

  // Overlay click close and child stop propagation
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) {
      closeModal();
    }
  });

  closeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    closeModal();
  });

  // Handle Form Submission and callback call
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Compile dynamic custom configurations
    const chosenOptionsList: string[] = [];
    let absolutePizzaPrice = basePrice;

    // Check checkboxes
    const checkedCheckboxes = form.querySelectorAll('input[type="checkbox"]:checked');
    checkedCheckboxes.forEach(chk => {
      const el = chk as HTMLInputElement;
      const label = el.getAttribute('data-label') || '';
      const priceAdd = parseFloat(el.getAttribute('data-price') || '0');
      absolutePizzaPrice += priceAdd;
      if (label) {
        chosenOptionsList.push(`${label} (+$${priceAdd.toFixed(2)})`);
      }
    });

    // Check radios
    const checkedRadios = form.querySelectorAll('input[type="radio"]:checked');
    checkedRadios.forEach(rad => {
      const el = rad as HTMLInputElement;
      const label = el.getAttribute('data-label') || '';
      const priceAdd = parseFloat(el.getAttribute('data-price') || '0');
      absolutePizzaPrice += priceAdd;
      
      // If it's a GF base or GF pasta, append it to options
      if (priceAdd > 0 && label) {
        chosenOptionsList.push(`${label} (+$${priceAdd.toFixed(2)})`);
      } else if (label && label !== 'Standard Neapolitan' && label !== 'Bronze-Drawn Tagliolini' && label !== 'Standard Spice') {
        chosenOptionsList.push(label);
      }
    });

    // Instantiate customized cart item
    const cartItem: CartItem = {
      id: `custom-menu-${Date.now()}-${pizza.id}`,
      pizzaId: pizza.id,
      name: pizza.name,
      italianName: pizza.italianName,
      price: absolutePizzaPrice,
      quantity: quantity,
      customizations: chosenOptionsList.length > 0 ? chosenOptionsList : undefined
    };

    // Forward to callback
    onAddToCart(cartItem);

    // Close
    closeModal();
  });

  // Force synchronous transitions to apply correctly
  requestAnimationFrame(() => {
    backdrop.classList.add('pizzeria-modal-backdrop--visible');
    card.classList.add('pizzeria-modal-card--visible');

    // Focus the first action inside the modal card (e.g. Card frame or close Trigger)
    card.focus();
  });
}
