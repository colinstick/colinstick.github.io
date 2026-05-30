// PROJECT DATA !!!!
import { projects } from './project_info.js';

const grid = document.getElementById('project-grid');
const searchInput = document.getElementById('search-bar');

function renderProjects(data) {
    grid.innerHTML = '';

    data.forEach(project => {
        const card = document.createElement('a');
        card.className = 'card';
        card.href = project.link; // direct navigation

        const tagsHtml = project.tags.map(tag => `<span class="tag">${tag}</span>`).join('');

        card.innerHTML = `
            <img src="${project.image}" class="card-img">
            <div class="card-content">
                <span class="card-date">${project.date}</span>
                <h3 class="card-title">${project.title}</h3>
                <p class="card-flavor">${project.flavor}</p>
                <div class="tags">${tagsHtml}</div>
            </div>
        `;

        grid.appendChild(card);
    });
}

const sortSelect = document.getElementById('sort-select');

// Sort function
function sortProjects(data, sortType) {
    const sorted = [...data]; // copy array

    if (sortType === 'name') {
        sorted.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortType === 'date-old') {
        sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else {
        // default is 'date-new'
        sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    return sorted;
}

// Listen for changes
sortSelect.addEventListener('change', (e) => {
    const sortedData = sortProjects(projects, e.target.value);
    
    // Apply search filter as well
    const searchTerm = searchInput.value.toLowerCase();
    const filtered = sortedData.filter(p =>
        p.title.toLowerCase().includes(searchTerm) ||
        p.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );

    renderProjects(filtered);
});

searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();

    const filtered = projects.filter(p =>
        p.title.toLowerCase().includes(searchTerm) ||
        p.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );

    // Also respect the current sort selection
    const sortedFiltered = sortProjects(filtered, sortSelect.value);
    renderProjects(sortedFiltered);
});

const defaultSorted = sortProjects(projects, 'date-new');
renderProjects(defaultSorted);


// =============================
// TESTS
// =============================
(function testSearch() {
    const result = projects.filter(p => p.title.toLowerCase().includes("pattern"));
    console.assert(result.length === 1, "Search failed");
})();
