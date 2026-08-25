const projectIds = [
  247009727, 230970661, 225380793, 208476411, 206346747, 196081729, 196081733,
  196080609, 196079951, 184805035, 184747109, 177926651, 177926447, 177926345,
  177926131, 177925975, 177925839, 177925491, 177925299, 177925137, 177924965,
  177924849, 177924535, 177924353, 177923969, 177691863, 177691695, 177691661,
  177691369, 177691259, 177690685, 177690467, 177690297, 177689909, 177689597,
  177689311, 177689081, 177688281, 177167751, 177167595, 177163195, 177163015,
  177162943, 177162605, 177162467, 177162367, 177161983, 177161073, 177160591,
  177160451, 177160265, 177160093, 177159893, 177159779, 177159197, 177159085,
  177158977, 177158875, 177158781, 177158557, 177158409, 177158323, 177158167,
  177157105, 177156951, 177156743, 177156195, 177156557, 177156035, 177155425,
  177089863, 177089745, 177089605, 177088965, 177088003
];

// --- Inject CSS for Multimedia Cards and Modal ---
const multimediaCardStyles = document.createElement('style');
multimediaCardStyles.textContent = `
  .multimedia-card {
    border: 1px solid rgba(255, 255, 255, 0.08) !important;
    border-radius: 12px !important;
    overflow: hidden;
    transition: border-color 0.3s ease, box-shadow 0.4s ease, transform 0.3s ease;
    background-color: rgba(255, 255, 255, 0.02);
  }
  .multimedia-card:hover {
    border-color: rgba(2, 170, 255, 0.4) !important;
    box-shadow: 0 0 30px rgba(2, 170, 255, 0.08), 0 0 60px rgba(2, 170, 255, 0.04);
    transform: scale(1.01);
  }
  [data-bs-theme="light"] .multimedia-card {
    border: 1px solid rgba(0, 0, 0, 0.06) !important;
  }
  [data-bs-theme="light"] .multimedia-card:hover {
    border-color: rgba(2, 170, 255, 0.3) !important;
    box-shadow: 0 0 30px rgba(2, 170, 255, 0.06), 0 0 60px rgba(2, 170, 255, 0.03);
  }
  .multimedia-card .ratio {
    border-radius: 8px;
    overflow: hidden;
  }

  /* Dark modal styling */
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
    margin-left: 0.75rem !important; /* Added space between + and Go */
  }
  .dark-modal .btn-primary:hover {
    background-color: #0288d0 !important;
    border-color: #0288d0 !important;
  }

  /* Custom close button – blue, normal size */
  .dark-modal .btn-close {
    filter: brightness(0) saturate(100%) invert(55%) sepia(93%) saturate(1312%) hue-rotate(172deg) brightness(101%) contrast(104%);
    opacity: 1;
  }
  .dark-modal .btn-close:hover {
    filter: brightness(0) saturate(100%) invert(40%) sepia(93%) saturate(1312%) hue-rotate(172deg) brightness(90%) contrast(104%);
  }

  /* Hide number spinner arrows */
  input[type="number"]::-webkit-outer-spin-button,
  input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  input[type="number"] {
    -moz-appearance: textfield;
  }

  /* Page counter styling */
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

  /* Input group – center and adapt */
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
document.head.appendChild(multimediaCardStyles);

// --- Build the "Go to page" modal (dark‑theme friendly) ---
function buildGoToModal() {
  const totalPages = getTotalPages();
  const digits = String(totalPages).length; // for input size

  const modalHTML = `
    <div class="modal fade dark-modal" id="goToPageModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-sm">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Go to page</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="input-group">
              <button class="btn btn-outline-secondary" type="button" id="pageMinusBtn">−</button>
              <input type="number" class="form-control text-center" id="pageInput" 
                     value="1" min="1" max="${totalPages}" 
                     size="${digits}" aria-label="Page number">
              <span class="page-counter" id="pageCounter">/ ${totalPages}</span>
              <button class="btn btn-outline-secondary" type="button" id="pagePlusBtn">+</button>
              <button type="button" class="btn btn-primary" id="goToPageBtn">Go</button>
            </div>
          </div>
          <!-- footer removed -->
        </div>
      </div>
    </div>
  `;
  const modalContainer = document.createElement('div');
  modalContainer.innerHTML = modalHTML;
  document.body.appendChild(modalContainer.firstElementChild);

  // Set up event listeners
  const modalElement = document.getElementById('goToPageModal');
  const pageInput = document.getElementById('pageInput');
  const minusBtn = document.getElementById('pageMinusBtn');
  const plusBtn = document.getElementById('pagePlusBtn');
  const goBtn = document.getElementById('goToPageBtn');

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

// --- Navigation helper ---
function navigateToPage(page) {
  const total = getTotalPages();
  if (page < 1 || page > total) return;
  currentPage = page;
  renderProjects(currentPage);
  renderPagination(currentPage);
  document.querySelector('.projects').scrollIntoView({ behavior: 'smooth' });
}

// --- Pagination variables ---
const ITEMS_PER_PAGE = 9;
let currentPage = 1;

function getTotalPages() {
  return Math.ceil(projectIds.length / ITEMS_PER_PAGE);
}

function renderProjects(page) {
  const grid = document.getElementById('projectsGrid');
  const start = (page - 1) * ITEMS_PER_PAGE;
  const slice = projectIds.slice(start, start + ITEMS_PER_PAGE);

  grid.innerHTML = slice.map(id => `
    <div class="col">
      <div class="multimedia-card">
        <div class="ratio ratio-16x9" style="overflow: hidden;">
          <iframe 
            src="https://www.behance.net/embed/project/${id}?ilo0=1" 
            allowfullscreen
            style="border: 0; width: 110%; height: 108%; margin: 0 0 -8% -5%;"
          ></iframe>
        </div>
      </div>
    </div>
  `).join('');
}

function renderPagination(page) {
  const total = getTotalPages();
  const ul = document.getElementById('pagination');

  if (total <= 1) {
    ul.innerHTML = `<li class="page-item active"><span class="page-link">1</span></li>`;
    return;
  }

  let html = '';

  // Previous
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
    // Ellipsis and last
    html += `
      <li class="page-item ellipsis-item">
        <a class="page-link" href="#" id="ellipsisLink" aria-label="Go to page">…</a>
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

  // Next
  html += `
    <li class="page-item ${page === total ? 'disabled' : ''}">
      <a class="page-link" href="#" data-page="${page + 1}" aria-label="Next">
        <span aria-hidden="true">&raquo;</span>
      </a>
    </li>
  `;

  ul.innerHTML = html;

  // Attach events
  ul.querySelectorAll('.page-link:not(#ellipsisLink)').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const p = parseInt(link.dataset.page);
      if (p >= 1 && p <= total) {
        navigateToPage(p);
      }
    });
  });

  const ellipsis = document.getElementById('ellipsisLink');
  if (ellipsis) {
    ellipsis.addEventListener('click', (e) => {
      e.preventDefault();
      const modalEl = document.getElementById('goToPageModal');
      const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
      document.getElementById('pageInput').value = page;
      modal.show();
    });
  }
}

// --- Initialise ---
buildGoToModal();
renderProjects(currentPage);
renderPagination(currentPage);

// --- Collapsible icon rotation ---
const multimediaCollapseEl = document.getElementById('multimediaCollapse');
const multimediaToggleBtn = document.querySelector('[data-bs-target="#multimediaCollapse"]');
const multimediaIcon = document.getElementById('multimediaIcon');

multimediaCollapseEl.addEventListener('show.bs.collapse', () => {
  multimediaIcon.style.transform = 'rotate(180deg)';
});
multimediaCollapseEl.addEventListener('hide.bs.collapse', () => {
  multimediaIcon.style.transform = 'rotate(0deg)';
});

multimediaToggleBtn.addEventListener('mouseover', () => {
  multimediaToggleBtn.style.backgroundColor = 'rgba(0,0,0,0.05)';
});
multimediaToggleBtn.addEventListener('mouseout', () => {
  multimediaToggleBtn.style.backgroundColor = 'transparent';
});