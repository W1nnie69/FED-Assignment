document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("dishGrid");
  const searchInput = document.getElementById("searchInput");
  const sortSelect = document.getElementById("sortSelect");
  const chipsWrap = document.getElementById("chips");

  if (!grid || !searchInput || !sortSelect || !chipsWrap) {
    console.warn("Missing elements for view-all filtering/sorting.");
    return;
  }

  const cards = Array.from(grid.querySelectorAll(".grid-card"));
  const originalIndex = new Map(cards.map((c, i) => [c, i]));

  let activeCategory = "All";
  let query = "";
  let sortMode = sortSelect.value || "popular";

  function getPrice(card){
    const p = Number(card.dataset.price);
    return Number.isFinite(p) ? p : 0;
  }

  function getPopular(card){
    const pop = Number(card.dataset.popular);
    return Number.isFinite(pop) ? pop : 0;
  }

  function getCategory(card){
    return (card.dataset.category || "").trim();
  }

  function matchesSearch(card, q){
    if (!q) return true;
    const text = card.textContent.toLowerCase();
    return text.includes(q);
  }

  function matchesCategory(card, cat){
    if (!cat || cat === "All") return true;
    return getCategory(card).toLowerCase() === cat.toLowerCase();
  }

  function applySort(visibleCards){
    const sorted = [...visibleCards];

    if (sortMode === "low"){
      sorted.sort((a, b) => getPrice(a) - getPrice(b));
    } else if (sortMode === "high"){
      sorted.sort((a, b) => getPrice(b) - getPrice(a));
    } else {
      sorted.sort((a, b) => {
        const diff = getPopular(b) - getPopular(a);
        if (diff !== 0) return diff;
        return originalIndex.get(a) - originalIndex.get(b);
      });
    }

    for (const card of sorted) grid.appendChild(card);
  }

  function applyFilters(){
    const visible = [];

    for (const card of cards){
      const ok = matchesCategory(card, activeCategory) && matchesSearch(card, query);
      card.style.display = ok ? "" : "none";
      if (ok) visible.push(card);
    }

    applySort(visible);
  }

  searchInput.addEventListener("input", (e) => {
    query = (e.target.value || "").trim().toLowerCase();
    applyFilters();
  });

  sortSelect.addEventListener("change", (e) => {
    sortMode = e.target.value;
    applyFilters();
  });

  chipsWrap.addEventListener("click", (e) => {
    const btn = e.target.closest(".chip");
    if (!btn) return;

    activeCategory = btn.dataset.category || "All";

    chipsWrap.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
    btn.classList.add("active");

    applyFilters();
  });

  applyFilters(); // initial load
});
