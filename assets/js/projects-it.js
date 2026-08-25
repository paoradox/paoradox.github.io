(function () {
  // --- Inject CSS for Tech Cards ---
  const techCardStyles = document.createElement('style');
  techCardStyles.textContent = `
    /* Tech Projects Cards - Subtle White Border */
    .tech-card {
      border: 1px solid rgba(255, 255, 255, 0.12) !important;
      transition: border-color 0.3s ease, box-shadow 0.3s ease;
      background-color: rgba(255, 255, 255, 0.02);
    }

    .tech-card:hover {
      border-color: rgba(255, 255, 255, 0.25) !important;
      box-shadow: 0 0 20px rgba(255, 255, 255, 0.03);
    }

    /* Light theme adjustment */
    [data-bs-theme="light"] .tech-card {
      border: 1px solid rgba(0, 0, 0, 0.08) !important;
    }

    [data-bs-theme="light"] .tech-card:hover {
      border-color: rgba(0, 0, 0, 0.2) !important;
    }

    /* Modal styles – reused from multimedia but included here for completeness */
    .dark-modal .modal-content {
      background-color: #1e1e2e !important;
      color: #e0e0e0 !important;
      border: 1px solid #3a3a4a !important;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.7) !important;
    }
    .dark-modal .modal-header {
      border-bottom: 1px solid #3a3a4a !important;
    }
    .dark-modal .modal-body {
      display: flex;
      justify-content: center;
      padding: 1.5rem 1rem;
    }
    .dark-modal .form-control {
      background-color: #2d2d3d !important;
      color: #f0f0f0 !important;
      border: 1px solid #4a4a5a !important;
    }
    .dark-modal .form-control:focus {
      border-color: #02aaff !important;
      box-shadow: 0 0 0 0.25rem rgba(2, 170, 255, 0.25) !important;
    }
    .dark-modal .btn-outline-secondary {
      color: #c0c0d0 !important;
      border-color: #4a4a5a !important;
    }
    .dark-modal .btn-outline-secondary:hover {
      background-color: #3a3a4a !important;
      color: #ffffff !important;
    }
    .dark-modal .btn-primary {
      background-color: #02aaff !important;
      border-color: #02aaff !important;
      color: #000 !important;
      border-radius: 0.375rem !important;
      margin-left: 0.75rem !important;
    }
    .dark-modal .btn-primary:hover {
      background-color: #0288d0 !important;
      border-color: #0288d0 !important;
    }
    .dark-modal .btn-close {
      filter: brightness(0) saturate(100%) invert(55%) sepia(93%) saturate(1312%) hue-rotate(172deg) brightness(101%) contrast(104%);
      opacity: 1;
    }
    .dark-modal .btn-close:hover {
      filter: brightness(0) saturate(100%) invert(40%) sepia(93%) saturate(1312%) hue-rotate(172deg) brightness(90%) contrast(104%);
    }
    input[type="number"]::-webkit-outer-spin-button,
    input[type="number"]::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    input[type="number"] {
      -moz-appearance: textfield;
    }
    .page-counter {
      background-color: #2d2d3d !important;
      color: #8888aa !important;
      border: 1px solid #4a4a5a !important;
      border-left: none !important;
      font-size: 1rem;
      padding: 0.375rem 0.75rem;
      display: flex;
      align-items: center;
      border-radius: 0 0.375rem 0.375rem 0;
      white-space: nowrap;
    }
    .dark-modal .input-group {
      justify-content: center;
      flex-wrap: nowrap;
    }
    .dark-modal .input-group .form-control {
      flex: 0 1 auto;
      min-width: 3.5em;
      text-align: center;
    }
    .dark-modal .input-group .page-counter {
      flex: 0 0 auto;
    }
    .dark-modal .input-group .btn {
      flex: 0 0 auto;
    }
  `;
  document.head.appendChild(techCardStyles);

  // --- Repo Data ---
  const repos = {
    "Python-Video-Downloader": "Youtube Playlist Downloader",
    "QoL-Scripts": "Quality of Life (QoL) Scripts",
    "Python-Image-Resizer": "Image Resizing Tool",
    "Python-Generate-QR": "QR Generation Tool",
    "PHP-Extract-PDF-Text": "PDF Text Extraction Tool",
    "Python-Tor-Traffic-Stealth": "Tor Browser Net Traffic Stealth Tool",
    "UI-CarrotCakeManila": "Carrot Cake Manila Design",
    "UI-Daily-Time-Record": "Daily Time Record Design",
    "UI-PSA-ePhilID-Check": "PSA ePhilID Checker Design",
    "UI-PSA-Queue": "PSA Queueing System Design",
    "UI-Do-Or-Dice": "Dice Game",
    "UI-Drum-Kit": "Drum Kit Game",
    "UI-Simon-Game": "Simon Game",
    "UI-TinDog": "TinDog Design",
    "UI-EzPz-JS6": "EzPzJS6: JavaScript Cheatsheet",
    "UI-Noobita": "Noobita: Introduction to Web Design",
    "UI-Genie-us": "Genie-us Design",
    "UI-Jhews-Gallery": "Jhew's Gallery",
    "UI-Everyday-Empress": "Everyday Empress Design",
    "Python-PSA-PDS": "PSA Personnel Directory System",
    "Python-PC-Specs": "PC Specs Viewing Tool",
    "Python-PhilSys-Stop-MDS": "PSA-PhilSys MDS Service Tool",
    "Python-PhilSys-Packet-Backup": "PSA-PhilSys Data Packets Backup Tool",
    "Python-PhilSys-DAR-Calculator": "PSA-PhilSys Daily Accomplishment Calculator",
    "Python-Calculator": "Simple Calculator",
    "Python-Deep-Search": "File Deep Search Tool",
    "Python-Search-And-Copy": "File Search & Copy Tool",
    "Python-Spam-Bot": "Spam Bot",
    "CSharp-Human-Resource-System": "Simple Human Resource System",
    "CSharp-Dog-Care-Simulation": "Dog Hut: Dog Care Simulation Game App",
    "Java-Air-Jump": "Air Jump: Flappy Bird Clone Game App",
    "Java-Order-System": "Simple Order System",
    "Java-File-Backup": "File Backup Tool",
    "VBnet-Debt-Tracking-System": "Debt Tracking System",
    "VBnet-Daily-Time-Tracker": "Daily Time Tracking Tool",
    "VBnet-INC-SCN-M201": "INC Form SCN-M201 Records System",
    "VBnet-Basic-Text-Encryption": "Basic Text Encryption",
    "Java-Binary-Search-Tree": "Binary Search Tree Visualizer Tool"
  };

  const repoEntries = Object.entries(repos);
  const ITEMS_PER_PAGE = 9;
  let currentPage = 1;

  function getTotalPages() {
    return Math.ceil(repoEntries.length / ITEMS_PER_PAGE);
  }

  // --- Navigation helper ---
  function navigateToPage(page) {
    const total = getTotalPages();
    if (page < 1 || page > total) return;
    currentPage = page;
    renderRepos(currentPage);
    renderPagination(currentPage);
    document.getElementById('reposGrid').scrollIntoView({ behavior: 'smooth' });
  }

  // --- Render repos ---
  function renderRepos(page) {
    const grid = document.getElementById('reposGrid');
    const start = (page - 1) * ITEMS_PER_PAGE;
    const slice = repoEntries.slice(start, start + ITEMS_PER_PAGE);

    grid.innerHTML = slice.map(([slug, displayName]) => `
      <div class="col">
        <div class="card h-100 tech-card">
          <div class="card-body d-flex flex-column">
            <h6 class="card-title text-center" title="${displayName}">${displayName}</h6>
            <a href="https://github.com/paoradox/${slug}" target="_blank" rel="noopener noreferrer" class="btn btn-outline-primary mt-auto">
              Preview
            </a>
          </div>
        </div>
      </div>
    `).join('');
  }

  // --- Pagination rendering (same logic as multimedia) ---
  function renderPagination(page) {
    const total = getTotalPages();
    const ul = document.getElementById('reposPagination');

    if (total <= 1) {
      ul.innerHTML = `<li class="page-item active"><span class="page-link">1</span></li>`;
      return;
    }

    let html = '';

    // Previous arrow
    html += `
      <li class="page-item ${page === 1 ? 'disabled' : ''}">
        <a class="page-link" href="#" data-page="${page - 1}" aria-label="Previous">
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>
    `;

    // First three pages
    for (let i = 1; i <= Math.min(3, total); i++) {
      html += `
        <li class="page-item ${i === page ? 'active' : ''}">
          <a class="page-link" href="#" data-page="${i}">${i}</a>
        </li>
      `;
    }

    if (total > 4) {
      // Ellipsis and last page
      html += `
        <li class="page-item ellipsis-item">
          <a class="page-link" href="#" id="ellipsisLinkTech" aria-label="Go to page">…</a>
        </li>
        <li class="page-item ${total === page ? 'active' : ''}">
          <a class="page-link" href="#" data-page="${total}">${total}</a>
        </li>
      `;
    } else if (total > 3) {
      // total === 4
      html += `
        <li class="page-item ${4 === page ? 'active' : ''}">
          <a class="page-link" href="#" data-page="4">4</a>
        </li>
      `;
    }

    // Next arrow
    html += `
      <li class="page-item ${page === total ? 'disabled' : ''}">
        <a class="page-link" href="#" data-page="${page + 1}" aria-label="Next">
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>
    `;

    ul.innerHTML = html;

    // Attach click events to all page links (except ellipsis)
    ul.querySelectorAll('.page-link:not(#ellipsisLinkTech)').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const p = parseInt(link.dataset.page);
        if (p >= 1 && p <= total) {
          navigateToPage(p);
        }
      });
    });

    // Ellipsis click – open modal
    const ellipsis = document.getElementById('ellipsisLinkTech');
    if (ellipsis) {
      ellipsis.addEventListener('click', (e) => {
        e.preventDefault();
        const modalEl = document.getElementById('goToPageModalTech');
        const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
        document.getElementById('pageInputTech').value = page;
        modal.show();
      });
    }
  }

  // --- Build the Go‑to‑page modal (Tech version) ---
  function buildGoToModalTech() {
    const totalPages = getTotalPages();
    const digits = String(totalPages).length;

    const modalHTML = `
      <div class="modal fade dark-modal" id="goToPageModalTech" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-sm">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Go to page</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div class="input-group">
                <button class="btn btn-outline-secondary" type="button" id="pageMinusBtnTech">−</button>
                <input type="number" class="form-control text-center" id="pageInputTech"
                       value="1" min="1" max="${totalPages}"
                       size="${digits}" aria-label="Page number">
                <span class="page-counter" id="pageCounterTech">/ ${totalPages}</span>
                <button class="btn btn-outline-secondary" type="button" id="pagePlusBtnTech">+</button>
                <button type="button" class="btn btn-primary" id="goToPageBtnTech">Go</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHTML;
    document.body.appendChild(modalContainer.firstElementChild);

    // Set up event listeners
    const modalElement = document.getElementById('goToPageModalTech');
    const pageInput = document.getElementById('pageInputTech');
    const minusBtn = document.getElementById('pageMinusBtnTech');
    const plusBtn = document.getElementById('pagePlusBtnTech');
    const goBtn = document.getElementById('goToPageBtnTech');

    minusBtn.addEventListener('click', () => {
      let val = parseInt(pageInput.value) || 1;
      if (val > 1) pageInput.value = val - 1;
    });
    plusBtn.addEventListener('click', () => {
      let val = parseInt(pageInput.value) || 1;
      if (val < totalPages) pageInput.value = val + 1;
    });

    goBtn.addEventListener('click', () => {
      const targetPage = parseInt(pageInput.value);
      if (isNaN(targetPage) || targetPage < 1 || targetPage > totalPages) {
        alert(`Please enter a page number between 1 and ${totalPages}.`);
        return;
      }
      const modal = bootstrap.Modal.getInstance(modalElement);
      modal.hide();
      navigateToPage(targetPage);
    });

    pageInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        goBtn.click();
      }
    });
  }

  // --- Initialise ---
  buildGoToModalTech();
  renderRepos(currentPage);
  renderPagination(currentPage);

  // --- Collapsible header (icon rotation + hover) ---
  const techCollapseEl = document.getElementById('techCollapse');
  const techToggleBtn = document.querySelector('[data-bs-target="#techCollapse"]');
  const techIcon = document.getElementById('techIcon');

  techCollapseEl.addEventListener('show.bs.collapse', () => {
    techIcon.style.transform = 'rotate(180deg)';
  });
  techCollapseEl.addEventListener('hide.bs.collapse', () => {
    techIcon.style.transform = 'rotate(0deg)';
  });

  techToggleBtn.addEventListener('mouseover', () => {
    techToggleBtn.style.backgroundColor = 'rgba(0,0,0,0.05)';
  });
  techToggleBtn.addEventListener('mouseout', () => {
    techToggleBtn.style.backgroundColor = 'transparent';
  });
})();