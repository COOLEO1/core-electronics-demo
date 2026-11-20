(() => {
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".main-nav");
  const cards = [...document.querySelectorAll(".product-card")];
  const filters = [...document.querySelectorAll(".filter-button")];
  const searchInput = document.getElementById("productSearch");
  const noResults = document.getElementById("noResults");
  const dialog = document.getElementById("enquiryDialog");
  const preparedMessage = document.getElementById("preparedMessage");
  let activeFilter = "All";

  // Mobile navigation
  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
    });
    nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
    }));
  }

  // Product filtering and live search
  function filterProducts() {
    const query = (searchInput?.value || "").trim().toLowerCase();
    let visible = 0;
    cards.forEach(card => {
      const categoryMatch = activeFilter === "All" || card.dataset.category === activeFilter;
      const textMatch = !query || (card.dataset.name + " " + card.dataset.category + " " + card.textContent).toLowerCase().includes(query);
      const show = categoryMatch && textMatch;
      card.hidden = !show;
      if (show) visible++;
    });
    if (noResults) noResults.hidden = visible !== 0;
  }

  filters.forEach(button => button.addEventListener("click", () => {
    activeFilter = button.dataset.filter || "All";
    filters.forEach(item => item.classList.toggle("selected", item === button));
    filterProducts();
  }));
  searchInput?.addEventListener("input", filterProducts);

  // Category tiles select their matching product filter
  document.querySelectorAll("[data-category-link]").forEach(link => link.addEventListener("click", () => {
    activeFilter = link.dataset.categoryLink;
    filters.forEach(button => button.classList.toggle("selected", button.dataset.filter === activeFilter));
    filterProducts();
  }));

  // Header search shortcut
  document.querySelector(".search-trigger")?.addEventListener("click", () => {
    document.getElementById("featured")?.scrollIntoView({ behavior: "smooth" });
    window.setTimeout(() => searchInput?.focus(), 350);
  });

  // Product enquiry dialog creates a ready-to-copy message, not a fake checkout
  document.querySelectorAll(".enquire-button").forEach(button => button.addEventListener("click", () => {
    const product = button.dataset.product || "a product";
    document.getElementById("dialogProduct").textContent = product;
    document.getElementById("dialogMessage").textContent = "Copy this message and send it through the store's confirmed contact channel.";
    preparedMessage.value = "Hello Core Electronics, I'm interested in the " + product + ". Could you please share its availability, specifications and current price? Thank you.";
    dialog?.showModal();
  }));
  document.querySelector(".dialog-close")?.addEventListener("click", () => dialog?.close());
  dialog?.addEventListener("click", event => {
    if (event.target === dialog) dialog.close();
  });
  document.getElementById("copyEnquiry")?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(preparedMessage.value);
      document.getElementById("copyEnquiry").innerHTML = "Copied ✓";
    } catch {
      preparedMessage.focus();
      preparedMessage.select();
      document.execCommand("copy");
      document.getElementById("copyEnquiry").textContent = "Select and copy";
    }
  });

  // Generic enquiry form prepares a message for the user to copy
  document.getElementById("enquiryForm")?.addEventListener("submit", async event => {
    event.preventDefault();
    const name = document.getElementById("customerName").value.trim();
    const interest = document.getElementById("interest").value;
    const message = document.getElementById("message").value.trim();
    const draft = "Hello Core Electronics, my name is " + name + ". I'm enquiring about: " + interest + "." + (message ? " " + message : "") + " Please share more information. Thank you.";
    const feedback = document.getElementById("formFeedback");
    try {
      await navigator.clipboard.writeText(draft);
      feedback.textContent = "Your enquiry has been copied. Paste it into your preferred messaging app.";
    } catch {
      feedback.textContent = "Your enquiry is ready, but automatic copying was unavailable on this browser.";
      window.prompt("Copy your enquiry:", draft);
    }
  });

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
  filterProducts();
})();