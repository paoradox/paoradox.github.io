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
  `;
  document.head.appendChild(techCardStyles);

  // --- Repo Data ---
  const repos = {
    "Python-Video-Downloader": "Youtube Playlist Downloader",
    "QoL-Scripts": "Quality of Life (QoL) Scripts",
    "Python-Image-Resizer": "Image Resizing Tool",
    "Python-Generate-QR": "QR Generation Tool",
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
    "Python-PhilSys-Stop-MDS": "PSA-PhilSys MDS Service Reboot Tool",
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
    "VBnet-INC-SCN-M201": "INC SCN-M201 Directory System",
    "VBnet-Basic-Text-Encryption": "Basic Text Encryption",
    "Java-Tree-Structure": "Tree Visualizer Tool"
    // add more as: "repo-slug": "Custom Display Name"
  };

  const repoEntries = Object.entries(repos);

  const ITEMS_PER_PAGE = 9;
  let currentPage = 1;

  function getTotalPages() {
    return Math.ceil(repoEntries.length / ITEMS_PER_PAGE);
  }

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

  function renderPagination(page) {
    const total = getTotalPages();
    const ul = document.getElementById("reposPagination");

    ul.innerHTML = `
      <li class="page-item ${page === 1 ? "disabled" : ""}">
        <a class="page-link" href="#" data-page="${page - 1}" aria-label="Previous">
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>
      ${Array.from({ length: total }, (_, i) => i + 1)
        .map(
          (p) => `
        <li class="page-item ${p === page ? "active" : ""}">
          <a class="page-link" href="#" data-page="${p}">${p}</a>
        </li>
      `,
        )
        .join("")}
      <li class="page-item ${page === total ? "disabled" : ""}">
        <a class="page-link" href="#" data-page="${page + 1}" aria-label="Next">
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>
    `;

    ul.querySelectorAll(".page-link").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const p = parseInt(link.dataset.page);
        if (p >= 1 && p <= total) {
          currentPage = p;
          renderRepos(currentPage);
          renderPagination(currentPage);
          document
            .getElementById("reposGrid")
            .scrollIntoView({ behavior: "smooth" });
        }
      });
    });
  }

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