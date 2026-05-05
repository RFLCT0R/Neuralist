// ============================================

        // ADVANCED SEARCH & FILTER SYSTEM

        // ============================================

        // Global State

        let allTools = [];

        let filteredTools = [];

        let fuse = null;

        let searchTimeout = null;

        let renderTimeout = null;

        // Filter State

        let filters = {

            search: '',

            sort: 'relevance',

            pricing: 'all',

            categories: [],

            platform: 'all',

            freeOnly: false,

            sponsoredFirst: false

        };

        // Pagination State

        let pagination = {

            currentPage: 1,

            itemsPerPage: 28

        };

        // Fuse.js Configuration with Weighted Fields

        const fuseOptions = {

            keys: [

                { name: 'name', weight: 0.4 },

                { name: 'company', weight: 0.2 },

                { name: 'shortDescription', weight: 0.2 },

                { name: 'tags', weight: 0.1 },

                { name: 'categories.function', weight: 0.05 },

                { name: 'categories.industry', weight: 0.03 },

                { name: 'features', weight: 0.02 }

            ],

            threshold: 0.3,

            includeScore: true,

            shouldSort: true

        };

        // DOM Elements Cache

        const DOM = {};

        // ============================================

        // INITIALIZATION

        // ============================================

        document.addEventListener('DOMContentLoaded', () => {

            cacheDOMElements();

            initializeEventListeners();

            loadTools();

            generateSkeletonLoader();

        });

        function cacheDOMElements() {

            DOM.searchInput = document.getElementById('search-input');

            DOM.searchLoading = document.getElementById('search-loading');

            DOM.categoryInputs = document.querySelectorAll('input[name="category"]');

            DOM.pricingInputs = document.querySelectorAll('input[name="pricing"]');

            DOM.platformInputs = document.querySelectorAll('input[name="platform"]');

            DOM.sortInputs = document.querySelectorAll('input[name="sort"]');

            DOM.clearAllBtn = document.getElementById('clear-all-filters');

            DOM.toolsContainer = document.getElementById('tools-container');

            DOM.skeletonLoader = document.getElementById('skeleton-loader');

            DOM.noResults = document.getElementById('no-results');

            DOM.prevPageBtn = document.getElementById('prev-page');

            DOM.nextPageBtn = document.getElementById('next-page');

            DOM.pageIndicator = document.getElementById('page-indicator');

            DOM.pageIndicatorTop = document.getElementById('page-indicator-top');

            DOM.filterToolsCount = document.getElementById('filter-tools-count');

        }

        function initializeEventListeners() {

            // Search with debounce

            DOM.searchInput.addEventListener('input', handleSearchInput);

            // Pricing radio buttons

            DOM.pricingInputs.forEach(input => {

                input.addEventListener('change', (e) => {

                    filters.pricing = e.target.value;

                    applyFilters();

                });

            });

            // Platform radio buttons

            DOM.platformInputs.forEach(input => {

                input.addEventListener('change', (e) => {

                    filters.platform = e.target.value;

                    applyFilters();

                });

            });

            // Sort radio buttons

            DOM.sortInputs.forEach(input => {

                input.addEventListener('change', (e) => {

                    filters.sort = e.target.value;

                    applyFilters(false);

                });

            });

            // Category checkboxes - multiple selection

            DOM.categoryInputs.forEach(input => {

                input.addEventListener('change', () => {

                    const checked = document.querySelectorAll('input[name="category"]:checked');

                    filters.categories = [...checked].map(cb => cb.value);

                    applyFilters();

                });

            });

            // Toggles - add if they exist

            const freeOnlyToggle = document.getElementById('free-only-toggle');

            const sponsoredFirstToggle = document.getElementById('sponsored-first-toggle');

            if (freeOnlyToggle) {

                freeOnlyToggle.addEventListener('change', (e) => {

                    filters.freeOnly = e.target.checked;

                    applyFilters();

                });

            }

            if (sponsoredFirstToggle) {

                sponsoredFirstToggle.addEventListener('change', (e) => {

                    filters.sponsoredFirst = e.target.checked;

                    applyFilters();

                });

            }

            // Clear all

            DOM.clearAllBtn.addEventListener('click', clearAllFilters);

            // Close dropdowns on outside click

            document.addEventListener('click', handleOutsideClick);

            // No results suggestions

            document.getElementById('clear-search-suggestion').addEventListener('click', () => {

                filters.search = '';

                DOM.searchInput.value = '';

                pagination.currentPage = 1;

                applyFilters();

            });

            document.getElementById('broaden-filters-suggestion').addEventListener('click', broadenFilters);

            // Pagination buttons

            DOM.prevPageBtn.addEventListener('click', () => {

                if (pagination.currentPage > 1) {

                    pagination.currentPage--;

                    renderPaginatedTools();

                    updateResultsCount(filteredTools.length);

                    scrollToToolsTop();

                }

            });

            DOM.nextPageBtn.addEventListener('click', () => {

                const totalPages = Math.ceil(filteredTools.length / pagination.itemsPerPage);

                if (pagination.currentPage < totalPages) {

                    pagination.currentPage++;

                    renderPaginatedTools();

                    updateResultsCount(filteredTools.length);

                    scrollToToolsTop();

                }

            });

            // URL change (back/forward buttons)

            window.addEventListener('popstate', () => {

                loadFiltersFromURL();

                applyFilters(false);

            });

        }

        // ============================================

        // DATA LOADING

        // ============================================

        async function loadTools() {

            showSkeletonLoader();

            try {

                                const response = await fetch('assets/data/tools.json');
                allTools = await response.json();
                
                // Update tool count stat dynamically
                const toolsCountStat = document.getElementById('tools-count-stat');
                if (toolsCountStat) {
                    toolsCountStat.textContent = '+' + allTools.length + ' ';
                }

                // Initialize Fuse.js

                fuse = new Fuse(allTools, fuseOptions);

                // Populate filter options

                populateFilters();

                // Load saved filters from localStorage or URL

                const hasSavedFilters = loadFiltersFromStorage();

                if (!hasSavedFilters) {

                    loadFiltersFromURL();

                }

                // Apply filters and render

                applyFilters();

            } catch (error) {

                console.error('Error loading tools:', error);

                DOM.toolsContainer.innerHTML = '<div class="tools-empty">Error loading tools. Please refresh the page.</div>';

                hideSkeletonLoader();

            }

        }

        function populateFilters() {

            // Categories are now hardcoded in HTML

        }

        // ============================================

        // FILTER LOGIC

        // ============================================

        function handleSearchInput(e) {

            clearTimeout(searchTimeout);

            const value = e.target.value.trim();

            DOM.searchLoading.style.display = value ? 'block' : 'none';

            searchTimeout = setTimeout(() => {

                filters.search = value;

                // When searching, default to relevance sort

                if (value && filters.sort !== 'relevance') {

                    const relevanceInput = document.querySelector('input[name="sort"][value="relevance"]');

                    if (relevanceInput) relevanceInput.checked = true;

                    filters.sort = 'relevance';

                }

                applyFilters();

                DOM.searchLoading.style.display = 'none';

            }, 300);

        }

        function handlePricingChipClick(e) {

            if (!e.target.classList.contains('chip')) return;

            DOM.pricingChips.querySelectorAll('.chip').forEach(chip => chip.classList.remove('active'));

            e.target.classList.add('active');

            filters.pricing = e.target.dataset.value;

            applyFilters();

        }

        function applyFilters(updateHistory = true) {

            showSkeletonLoader();

            clearTimeout(renderTimeout);

            renderTimeout = setTimeout(() => {

                performFilterAndRender();

                if (updateHistory) updateURL();

                hideSkeletonLoader();

            }, 50);

        }

        function scrollToToolsTop() {

            const filterSection = document.querySelector('.main-controls-row');

            if (!filterSection) {

                window.scrollTo({ top: 0, behavior: 'smooth' });

                return;

            }

            const offset = 73;

            const targetPosition = filterSection.getBoundingClientRect().top + window.scrollY - offset;

            const startPosition = window.scrollY;

            const distance = targetPosition - startPosition;

            const duration = 800;

            let startTime = null;

            function easeOutCubic(t) {

                return 1 - Math.pow(1 - t, 3);

            }

            function animateScroll(currentTime) {

                if (!startTime) startTime = currentTime;

                const timeElapsed = currentTime - startTime;

                const progress = Math.min(timeElapsed / duration, 1);

                const ease = easeOutCubic(progress);

                window.scrollTo(0, startPosition + distance * ease);

                if (progress < 1) {

                    requestAnimationFrame(animateScroll);

                }

            }

            requestAnimationFrame(animateScroll);

        }

        function performFilterAndRender() {

            let results = [...allTools];

            // 1. Search filter (Fuse.js) - intersection with other filters

            if (filters.search && fuse) {

                const searchResults = fuse.search(filters.search);

                results = searchResults.map(r => r.item);

            }

            // 2. Pricing filter

            if (filters.pricing !== 'all') {

                results = results.filter(t => {

                    const pricing = (t.categories?.pricing?.[0] || '').toLowerCase();

                    if (filters.pricing === 'trial') return pricing.includes('trial');

                    return pricing === filters.pricing;

                });

            }

            // 3. Free Only toggle

            if (filters.freeOnly) {

                results = results.filter(t => (t.categories?.pricing?.[0] || '').toLowerCase() === 'free');

            }

            // 4. Category filter (OR logic - search within tool info)

            if (filters.categories.length > 0) {

                results = results.filter(t => {

                    const toolText = [

                        t.name,

                        ...(t.categories?.function || []),

                        ...(t.categories?.industry || []),

                        t.shortDescription,

                        t.longDescription,

                        ...(t.features || []),

                        ...(t.tags || []),

                        ...(t.categories?.useCase || [])

                    ].join(' ').toLowerCase();

                    return filters.categories.some(cat => toolText.includes(cat.toLowerCase()));

                });

            }

            // 5. Platform filter

            if (filters.platform !== 'all') {

                results = results.filter(t => t.categories?.platform?.some(p => p.toLowerCase() === filters.platform));

            }

            // 6. Sort

            results = sortResults(results);

            // 7. Sponsored first (after sorting)

            if (filters.sponsoredFirst) {

                results.sort((a, b) => {

                    const aSponsored = a.isSponsored ? 1 : 0;

                    const bSponsored = b.isSponsored ? 1 : 0;

                    return bSponsored - aSponsored;

                });

            }

            filteredTools = results;

            pagination.currentPage = 1; // Reset to first page on filter change

            renderPaginatedTools();

            updateResultsCount(filteredTools.length);

            updateActiveFiltersDisplay();

            updateFilterBadge();

        }

        function renderPaginatedTools() {

            const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;

            const endIndex = startIndex + pagination.itemsPerPage;

            const paginatedTools = filteredTools.slice(startIndex, endIndex);

            renderTools(paginatedTools);

            updatePaginationControls();

        }

        function updatePaginationControls() {

            const totalPages = Math.ceil(filteredTools.length / pagination.itemsPerPage) || 1;

            const count = filteredTools.length;

            // Update prev/next buttons

            DOM.prevPageBtn.disabled = pagination.currentPage <= 1 || count === 0;

            DOM.nextPageBtn.disabled = pagination.currentPage >= totalPages || count === 0;

        }

        function sortResults(results) {

            switch (filters.sort) {

                case 'name':

                case 'name-asc':

                    return results.sort((a, b) => a.name.localeCompare(b.name));

                case 'name-desc':

                    return results.sort((a, b) => b.name.localeCompare(a.name));

                case 'popular':

                    return results.sort((a, b) => (b.totalReviews || 0) - (a.totalReviews || 0));

                case 'newest':

                    return results.sort((a, b) => new Date(b.releaseDate || 0) - new Date(a.releaseDate || 0));

                case 'rating-desc':

                    return results.sort((a, b) => (b.rating || 0) - (a.rating || 0));

                case 'rating-asc':

                    return results.sort((a, b) => (a.rating || 0) - (b.rating || 0));

                case 'relevance':

                default:

                    // If searching, Fuse already sorted by relevance

                    // Otherwise, keep original order

                    return results;

            }

        }

        // ============================================

        // RENDERING

        // ============================================

        function renderTools(tools) {

            if (tools.length === 0) {

                DOM.toolsContainer.style.display = 'none';

                DOM.noResults.style.display = 'block';

                return;

            }

            DOM.toolsContainer.style.display = 'grid';

            DOM.noResults.style.display = 'none';

            // Use DocumentFragment for performance

            const fragment = document.createDocumentFragment();

            tools.forEach(tool => {

                const card = createToolCard(tool);

                fragment.appendChild(card);

            });

            DOM.toolsContainer.innerHTML = '';

            DOM.toolsContainer.appendChild(fragment);

        }

        function createToolCard(tool) {

            const card = document.createElement('a');

            card.href = `tool.html?id=${tool.id}`;

            card.className = 'tool-card';

            const pricingClass = getPricingClass(tool.categories?.pricing?.[0] || 'Free');

            const stars = tool.rating ? generateStars(tool.rating) : '';

            const ratingValue = tool.rating ? tool.rating.toFixed(1) : '';

            const reviewCount = tool.totalReviews ? formatReviewCount(tool.totalReviews) : '';

            card.innerHTML = `

                <div class="tool-card__top">

                    <img src="${tool.logo}" alt="${tool.name}" class="tool-card__logo" loading="lazy" onerror="this.src='assets/images/logo.png'">

                    <div class="tool-card__divider-vertical"></div>

                    <div class="tool-card__header">

                        <h3 class="tool-card__name">${tool.name}</h3>

                        <p class="tool-card__company">by ${tool.company}</p>

                    </div>

                </div>

                <p class="tool-card__description">${tool.shortDescription}</p>

                <div class="tool-card__footer">

                    <div class="tool-card__rating">

                        <span class="tool-card__rating-value">${ratingValue}</span>

                        <div class="tool-card__rating-stars">${stars}</div>

                        <span class="tool-card__review-count">(${reviewCount})</span>

                    </div>

                    <span class="tool-card__pricing ${pricingClass}">${tool.categories?.pricing?.[0] || 'Free'}</span>

                </div>

            `;

            return card;

        }

        function formatReviewCount(count) {

            if (count >= 1000000) {

                return (count / 1000000).toFixed(1) + 'M';

            } else if (count >= 1000) {

                return (count / 1000).toFixed(1) + 'K';

            }

            return count.toString();

        }

        function generateStars(rating) {

            const fullStars = Math.floor(rating);

            const decimal = rating % 1;

            let starsHTML = '';

            for (let i = 0; i < fullStars; i++) {

                starsHTML += '<span class="star filled">★</span>';

            }

            if (decimal >= 0.25 && decimal < 0.75) {

                starsHTML += '<span class="star half">★</span>';

            } else if (decimal >= 0.75) {

                starsHTML += '<span class="star filled">★</span>';

            }

            const emptyStars = 5 - Math.ceil(rating);

            for (let i = 0; i < emptyStars; i++) {

                starsHTML += '<span class="star empty">☆</span>';

            }

            return starsHTML;

        }

        function getPricingClass(pricing) {

            const pricingLower = pricing.toLowerCase();

            if (pricingLower === 'free') return 'pricing-free';

            if (pricingLower === 'freemium') return 'pricing-freemium';

            if (pricingLower === 'paid') return 'pricing-paid';

            if (pricingLower.includes('trial')) return 'pricing-trial';

            return 'pricing-paid';

        }

        function generateSkeletonLoader() {

            const skeletonHTML = Array(8).fill(`

                <div class="skeleton-card">

                    <div class="skeleton-header">

                        <div class="skeleton-logo"></div>

                        <div class="skeleton-title">

                            <div class="skeleton-line short"></div>

                            <div class="skeleton-line shorter"></div>

                        </div>

                    </div>

                    <div class="skeleton-line"></div>

                    <div class="skeleton-line medium"></div>

                </div>

            `).join('');

            DOM.skeletonLoader.innerHTML = skeletonHTML;

        }

        function showSkeletonLoader() {

            DOM.skeletonLoader.style.display = 'grid';

            DOM.toolsContainer.style.display = 'none';

        }

        function hideSkeletonLoader() {

            DOM.skeletonLoader.style.display = 'none';

        }

        // ============================================

        // UI UPDATES

        // ============================================

        function updateResultsCount(count) {

            const totalPages = Math.ceil(count / pagination.itemsPerPage) || 1;

            if (count === 0) {

                if (DOM.pageIndicatorTop) DOM.pageIndicatorTop.textContent = 'Page 0 of 0';

                DOM.filterToolsCount.textContent = '0 tools';

            } else {

                if (DOM.pageIndicatorTop) DOM.pageIndicatorTop.textContent = `Page ${pagination.currentPage} of ${totalPages}`;

                DOM.filterToolsCount.textContent = `${count} tools`;

            }

        }

        function updateActiveFiltersDisplay() {

            // Update filter count badges on dropdown buttons

            // Category count (multiple selections)

            const categoryCount = filters.categories.length;

            document.getElementById('category-count').textContent = categoryCount > 0 ? categoryCount : '';

            // Pricing count (0 or 1)

            const pricingCount = filters.pricing !== 'all' ? 1 : 0;

            document.getElementById('pricing-count').textContent = pricingCount > 0 ? pricingCount : '';

            // Platform count (0 or 1)

            const platformCount = filters.platform !== 'all' ? 1 : 0;

            document.getElementById('platform-count').textContent = platformCount > 0 ? platformCount : '';

        }

        function updateFilterBadge() {

            // Badge removed for top bar layout

        }

        // ============================================

        // FILTER MANIPULATION

        // ============================================

        function removeFilter(type, value) {

            switch (type) {

                case 'search':

                    filters.search = '';

                    DOM.searchInput.value = '';

                    break;

                case 'pricing':

                    filters.pricing = 'all';

                    document.querySelector('input[name="pricing"][value="all"]').checked = true;

                    break;

                case 'category':

                    filters.categories = filters.categories.filter(c => c !== value);

                    const catInput = document.querySelector(`input[name="category"][value="${value}"]`);

                    if (catInput) catInput.checked = false;

                    break;

                case 'platform':

                    filters.platform = 'all';

                    document.querySelector('input[name="platform"][value="all"]').checked = true;

                    break;

                case 'freeOnly':

                    filters.freeOnly = false;

                    const freeOnlyToggle = document.getElementById('free-only-toggle');

                    if (freeOnlyToggle) freeOnlyToggle.checked = false;

                    break;

            }

            applyFilters();

        }

        function clearAllFilters() {

            filters = {

                search: '',

                sort: 'relevance',

                pricing: 'all',

                categories: [],

                platform: 'all',

                freeOnly: false,

                sponsoredFirst: false

            };

            // Reset UI

            DOM.searchInput.value = '';

            // Reset radio buttons

            document.querySelector('input[name="pricing"][value="all"]').checked = true;

            document.querySelector('input[name="platform"][value="all"]').checked = true;

            document.querySelector('input[name="sort"][value="relevance"]').checked = true;

            // Uncheck all category checkboxes

            document.querySelectorAll('input[name="category"]:checked').forEach(cb => cb.checked = false);

            // Reset toggles if they exist

            const freeOnlyToggle = document.getElementById('free-only-toggle');

            const sponsoredFirstToggle = document.getElementById('sponsored-first-toggle');

            if (freeOnlyToggle) freeOnlyToggle.checked = false;

            if (sponsoredFirstToggle) sponsoredFirstToggle.checked = false;

            applyFilters();

        }

        function broadenFilters() {

            // Remove the most restrictive filters

            if (filters.platform !== 'all') {

                filters.platform = 'all';

                document.querySelector('input[name="platform"][value="all"]').checked = true;

            } else if (filters.categories.length > 0) {

                filters.categories = [];

                document.querySelectorAll('input[name="category"]:checked').forEach(cb => cb.checked = false);

            } else if (filters.pricing !== 'all') {

                filters.pricing = 'all';

                document.querySelector('input[name="pricing"][value="all"]').checked = true;

            } else if (filters.search) {

                filters.search = '';

                DOM.searchInput.value = '';

            }

            applyFilters();

        }

        // ============================================

        // DROPDOWN HANDLERS

        // ============================================

        function closeAllDropdowns() {

        }

        function handleOutsideClick(e) {

            if (!e.target.closest('.multi-select-dropdown')) {

                closeAllDropdowns();

            }

        }

        // ============================================

        // URL & STORAGE

        // ============================================

        function updateURL() {

            const params = new URLSearchParams();

            if (filters.search) params.set('search', filters.search);

            if (filters.sort !== 'relevance') params.set('sort', filters.sort);

            if (filters.pricing !== 'all') params.set('pricing', filters.pricing);

            if (filters.platform !== 'all') params.set('platform', filters.platform);

            if (filters.categories.length > 0) params.set('categories', filters.categories.join(','));

            if (filters.freeOnly) params.set('freeOnly', 'true');

            if (filters.sponsoredFirst) params.set('sponsoredFirst', 'true');

            const newUrl = params.toString()

                ? `${window.location.pathname}?${params.toString()}`

                : window.location.pathname;

            window.history.pushState({}, '', newUrl);

        }

        function loadFiltersFromURL() {

            const params = new URLSearchParams(window.location.search);

            if (params.has('search')) {

                filters.search = params.get('search');

                DOM.searchInput.value = filters.search;

            }

            if (params.has('sort')) {

                filters.sort = params.get('sort');

                const sortInput = document.querySelector(`input[name="sort"][value="${filters.sort}"]`);

                if (sortInput) sortInput.checked = true;

            }

            if (params.has('pricing')) {

                filters.pricing = params.get('pricing');

                const pricingInput = document.querySelector(`input[name="pricing"][value="${filters.pricing}"]`);

                if (pricingInput) pricingInput.checked = true;

            }

            if (params.has('categories')) {

                filters.categories = params.get('categories').split(',').filter(c => c);

                filters.categories.forEach(cat => {

                    const catInput = document.querySelector(`input[name="category"][value="${cat}"]`);

                    if (catInput) catInput.checked = true;

                });

            }

            if (params.has('platform')) {

                filters.platform = params.get('platform');

                const platformInput = document.querySelector(`input[name="platform"][value="${filters.platform}"]`);

                if (platformInput) platformInput.checked = true;

            }

            if (params.has('freeOnly')) {

                filters.freeOnly = params.get('freeOnly') === 'true';

                const toggle = document.getElementById('free-only-toggle');

                if (toggle) toggle.checked = filters.freeOnly;

            }

            if (params.has('sponsoredFirst')) {

                filters.sponsoredFirst = params.get('sponsoredFirst') === 'true';

                const toggle = document.getElementById('sponsored-first-toggle');

                if (toggle) toggle.checked = filters.sponsoredFirst;

            }

        }

        function saveFiltersToStorage() {

            const filterData = {

                filters: { ...filters },

                timestamp: Date.now()

            };

            localStorage.setItem('allaitools_filters', JSON.stringify(filterData));

            // Save confirmation removed

        }

        function loadFiltersFromStorage() {

            try {

                const saved = localStorage.getItem('allaitools_filters');

                if (!saved) return false;

                const { filters: savedFilters, timestamp } = JSON.parse(saved);

                // Only load if less than 30 days old

                if (Date.now() - timestamp > 30 * 24 * 60 * 60 * 1000) {

                    localStorage.removeItem('allaitools_filters');

                    return false;

                }

                // Apply saved filters (but not search)

                filters.pricing = savedFilters.pricing || 'all';

                filters.categories = savedFilters.categories || [];

                filters.platform = savedFilters.platform || 'all';

                filters.freeOnly = savedFilters.freeOnly || false;

                filters.sponsoredFirst = savedFilters.sponsoredFirst || false;

                // Update UI

                const pricingInput = document.querySelector(`input[name="pricing"][value="${filters.pricing}"]`);

                if (pricingInput) pricingInput.checked = true;

                filters.categories.forEach(cat => {

                    const catInput = document.querySelector(`input[name="category"][value="${cat}"]`);

                    if (catInput) catInput.checked = true;

                });

                const platformInput = document.querySelector(`input[name="platform"][value="${filters.platform}"]`);

                if (platformInput) platformInput.checked = true;

                const sortInput = document.querySelector(`input[name="sort"][value="${filters.sort}"]`);

                if (sortInput) sortInput.checked = true;

                const freeToggle = document.getElementById('free-only-toggle');

                if (freeToggle) freeToggle.checked = filters.freeOnly;

                const sponsoredToggle = document.getElementById('sponsored-first-toggle');

                if (sponsoredToggle) sponsoredToggle.checked = filters.sponsoredFirst;

                return true;

            } catch (e) {

                return false;

            }

        }