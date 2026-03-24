const projectIds = [
  230970661, 225380793, 208476411, 206346747, 196081729, 196081733,
  196080609, 196079951, 184805035, 184747109, 177926651, 177926447,
  177926345, 177926131, 177925975, 177925839, 177925491, 177925299,
  177925137, 177924965, 177924849, 177924535, 177924353, 177923969,
  177691863, 177691695, 177691661, 177691369, 177691259, 177690685,
  177690467, 177690297, 177689909, 177689597, 177689311, 177689081,
  177688281, 177167751, 177167595, 177163195, 177163015, 177162943,
  177162605, 177162467, 177162367, 177161983, 177161073, 177160591,
  177160451, 177160265, 177160093, 177159893, 177159779, 177159197,
  177159085, 177158977, 177158875, 177158781, 177158557, 177158409,
  177158323, 177158167, 177157105, 177156951, 177156743, 177156195,
  177156557, 177156035, 177155425, 177089863, 177089745, 177089605,
  177088965, 177088003
];

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
          <div class="ratio ratio-16x9">
            <iframe src="https://www.behance.net/embed/project/${id}?ilo0=1" allowfullscreen></iframe>
          </div>
        </div>
      `).join('');
    }

    function renderPagination(page) {
      const total = getTotalPages();
      const ul = document.getElementById('pagination');

      ul.innerHTML = `
        <li class="page-item ${page === 1 ? 'disabled' : ''}">
          <a class="page-link" href="#" data-page="${page - 1}" aria-label="Previous">
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
        ${Array.from({ length: total }, (_, i) => i + 1).map(p => `
          <li class="page-item ${p === page ? 'active' : ''}">
            <a class="page-link" href="#" data-page="${p}">${p}</a>
          </li>
        `).join('')}
        <li class="page-item ${page === total ? 'disabled' : ''}">
          <a class="page-link" href="#" data-page="${page + 1}" aria-label="Next">
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      `;

      ul.querySelectorAll('.page-link').forEach(link => {
        link.addEventListener('click', e => {
          e.preventDefault();
          const p = parseInt(link.dataset.page);
          if (p >= 1 && p <= total) {
            currentPage = p;
            renderProjects(currentPage);
            renderPagination(currentPage);
            document.querySelector('.projects').scrollIntoView({ behavior: 'smooth' });
          }
        });
      });
    }

    renderProjects(currentPage);
    renderPagination(currentPage);