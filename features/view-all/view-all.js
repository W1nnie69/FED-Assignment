// Wait until page fully loads
document.addEventListener("DOMContentLoaded", () => {

  // ==============================
  // GET IMPORTANT HTML ELEMENTS
  // ==============================

  const grid = document.getElementById("dishGrid");       // Container holding all dish cards
  const searchInput = document.getElementById("searchInput"); // Search input field
  const sortSelect = document.getElementById("sortSelect");   // Sort dropdown
  const chipsWrap = document.getElementById("chips");     // Category filter buttons container

  // If any important element is missing, stop script
  if (!grid || !searchInput || !sortSelect || !chipsWrap) {
    console.warn("Missing elements for view-all filtering/sorting.");
    return;
  }

  // Get all dish cards inside grid
  const cards = Array.from(grid.querySelectorAll(".grid-card"));

  // Store original position of each card (used for default sorting)
  const originalIndex = new Map(cards.map((c, i) => [c, i]));


  // ==============================
  // FILTER/SORT STATE VARIABLES
  // ==============================

  let activeCategory = "All";             // Currently selected category
  let query = "";                         // Current search text
  let sortMode = sortSelect.value || "popular";  // Current sort option


  // ==============================
  // HELPER FUNCTIONS
  // ==============================

  // Get price from data-price attribute
  function getPrice(card){
    const p = Number(card.dataset.price);
    return Number.isFinite(p) ? p : 0;
  }

  // Get popularity score from data-popular attribute
  function getPopular(card){
    const pop = Number(card.dataset.popular);
    return Number.isFinite(pop) ? pop : 0;
  }

  // Get category from data-category attribute
  function getCategory(card){
    return (card.dataset.category || "").trim();
  }

  // Check if card matches search text
  function matchesSearch(card, q){
    if (!q) return true;  // If no search query, allow all
    const text = card.textContent.toLowerCase();
    return text.includes(q);
  }

  // Check if card matches selected category
  function matchesCategory(card, cat){
    if (!cat || cat === "All") return true; // If "All", allow all
    return getCategory(card).toLowerCase() === cat.toLowerCase();
  }


  // ==============================
  // SORT FUNCTION
  // ==============================

  function applySort(visibleCards){

    // Make a copy of visible cards
    const sorted = [...visibleCards];

    // Sort by price (low → high)
    if (sortMode === "low"){
      sorted.sort((a, b) => getPrice(a) - getPrice(b));

    // Sort by price (high → low)
    } else if (sortMode === "high"){
      sorted.sort((a, b) => getPrice(b) - getPrice(a));

    // Default sort: popularity
    } else {
      sorted.sort((a, b) => {

        // Compare popularity first
        const diff = getPopular(b) - getPopular(a);
        if (diff !== 0) return diff;

        // If same popularity, use original position
        return originalIndex.get(a) - originalIndex.get(b);
      });
    }

    // Re-append sorted cards to grid
    // (This visually changes order)
    for (const card of sorted){
      grid.appendChild(card);
    }
  }


  // ==============================
  // FILTER FUNCTION
  // ==============================

  function applyFilters(){

    const visible = [];

    for (const card of cards){

      // Check if card matches category AND search
      const ok =
        matchesCategory(card, activeCategory) &&
        matchesSearch(card, query);

      // Show or hide card
      card.style.display = ok ? "" : "none";

      // If visible, add to list for sorting
      if (ok) visible.push(card);
    }

    // Apply sorting to visible cards
    applySort(visible);
  }


  // ==============================
  // EVENT LISTENERS
  // ==============================

  // When user types in search box
  searchInput.addEventListener("input", (e) => {
    query = (e.target.value || "").trim().toLowerCase();
    applyFilters();
  });

  // When user changes sort dropdown
  sortSelect.addEventListener("change", (e) => {
    sortMode = e.target.value;
    applyFilters();
  });

  // When user clicks category chip
  chipsWrap.addEventListener("click", (e) => {

    // Find nearest element with class "chip"
    const btn = e.target.closest(".chip");
    if (!btn) return;

    // Update active category
    activeCategory = btn.dataset.category || "All";

    // Remove active class from all chips
    chipsWrap
      .querySelectorAll(".chip")
      .forEach(c => c.classList.remove("active"));

    // Add active class to clicked chip
    btn.classList.add("active");

    applyFilters();
  });


  // Run once on initial page load
  applyFilters();

});
