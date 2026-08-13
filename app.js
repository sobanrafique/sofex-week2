const STATE_KEYS = {
    SAVED: 'srh_saved_resources',
    UPVOTED: 'srh_upvoted_resources',
    SUGGESTIONS: 'srh_resource_suggestions',
    VIEW: 'srh_view_mode'
};

const DEFAULT_DATA = {
    metadata: {
        title: "Student Resource Hub - Curated Learning Resources",
        version: "1.0.0",
        lastUpdated: "2026-08-13"
    },
    resources: [
        {id:1,title:"The Odin Project",description:"A free, open-source curriculum for learning full-stack web development. Covers HTML, CSS, JavaScript, Node.js, Ruby on Rails, and React with hands-on projects.",link:"https://www.theodinproject.com/",category:"Web Development",difficulty:"Beginner to Advanced",type:"Course",rating:4.9,upvotes:2847,free:true,verified:true},
        {id:2,title:"freeCodeCamp - Responsive Web Design",description:"Master HTML and CSS by building 5 certification projects including a survey form, tribute page, landing page, technical doc, and personal portfolio.",link:"https://www.freecodecamp.org/learn/2022/responsive-web-design/",category:"Web Development",difficulty:"Beginner",type:"Course",rating:4.8,upvotes:5120,free:true,verified:true},
        {id:3,title:"MDN Web Docs - JavaScript Guide",description:"Mozilla's comprehensive, authoritative guide to JavaScript from basics to advanced concepts like closures, promises, async/await, and modules.",link:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide",category:"Web Development",difficulty:"Intermediate",type:"Documentation",rating:4.7,upvotes:3890,free:true,verified:true},
        {id:4,title:"CS50's Web Programming with Python and JavaScript",description:"Harvard's free course covering Flask, Django, SQL, APIs, JavaScript frontends, React, and CI/CD. Includes 6 hands-on projects.",link:"https://cs50.harvard.edu/web/2020/",category:"Web Development",difficulty:"Intermediate",type:"Course",rating:4.9,upvotes:4210,free:true,verified:true},
        {id:5,title:"Fireship - React in 100 Seconds",description:"Concise, high-quality YouTube video explaining the fundamentals of React.js including components, JSX, state, and hooks.",link:"https://www.youtube.com/watch?v=Tn6-PIqc4UM",category:"Web Development",difficulty:"Beginner",type:"Video",rating:4.6,upvotes:1850,free:true,verified:true},
        {id:6,title:"CSS-Tricks - A Complete Guide to Flexbox",description:"Everything you need to know about CSS Flexbox with visual examples, diagrams, and a flexbox playground cheat sheet.",link:"https://css-tricks.com/snippets/css/a-guide-to-flexbox/",category:"Web Development",difficulty:"Beginner",type:"Article",rating:4.5,upvotes:2340,free:true,verified:true},
        {id:7,title:"Coursera - Machine Learning by Andrew Ng",description:"Stanford's legendary ML course covering supervised learning, unsupervised learning, linear regression, neural networks, and SVMs with MATLAB/Octave exercises.",link:"https://www.coursera.org/learn/machine-learning",category:"AI & Machine Learning",difficulty:"Intermediate",type:"Course",rating:4.9,upvotes:12500,free:true,verified:true},
        {id:8,title:"fast.ai - Practical Deep Learning for Coders",description:"Top-down approach to deep learning using PyTorch. Build state-of-the-art models for computer vision, NLP, and tabular data from lesson 1.",link:"https://course.fast.ai/",category:"AI & Machine Learning",difficulty:"Intermediate",type:"Course",rating:4.8,upvotes:5670,free:true,verified:true},
        {id:9,title:"3Blue1Brown - Neural Networks Series",description:"Visually stunning YouTube series explaining what neural networks are, how they learn (gradient descent, backprop), with beautiful animated explanations.",link:"https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi",category:"AI & Machine Learning",difficulty:"Beginner",type:"Video Series",rating:4.9,upvotes:8900,free:true,verified:true},
        {id:10,title:"Hugging Face - NLP Course",description:"Free hands-on course on modern NLP using transformers, Hugging Face libraries, tokenizers, and building production-ready LLM applications.",link:"https://huggingface.co/learn/nlp-course/",category:"AI & Machine Learning",difficulty:"Advanced",type:"Course",rating:4.7,upvotes:3420,free:true,verified:true},
        {id:11,title:"OpenAI - Prompt Engineering for Developers",description:"Learn best practices for prompting LLMs, building custom chatbots, and developing AI-powered applications with the OpenAI API.",link:"https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/",category:"AI & Machine Learning",difficulty:"Intermediate",type:"Course",rating:4.6,upvotes:4100,free:true,verified:true},
        {id:12,title:"Towards Data Science - Understanding LSTMs",description:"In-depth article explaining Long Short-Term Memory networks, RNN architectures, and how they solve the vanishing gradient problem.",link:"https://towardsdatascience.com/understanding-lstm-and-its-quick-implementation-in-keras-for-sentiment-analysis-af410fd85b47",category:"AI & Machine Learning",difficulty:"Advanced",type:"Article",rating:4.4,upvotes:1580,free:true,verified:true},
        {id:13,title:"TryHackMe - Complete Beginner Learning Path",description:"Guided, gamified cybersecurity path with hands-on labs covering networking basics, Linux, web hacking, cryptography, and real CTF challenges.",link:"https://tryhackme.com/path/outline/beginner",category:"Cybersecurity",difficulty:"Beginner",type:"Course",rating:4.8,upvotes:6780,free:true,verified:true},
        {id:14,title:"MIT OCW - Introduction to Computer Security",description:"MIT's free graduate-level course covering cryptography, network security, authentication, access control, buffer overflows, and secure software design.",link:"https://ocw.mit.edu/courses/6-858-computer-systems-security-fall-2014/",category:"Cybersecurity",difficulty:"Advanced",type:"Course",rating:4.9,upvotes:3200,free:true,verified:true},
        {id:15,title:"OWASP Top 10 Official Guide",description:"The definitive guide to the top 10 most critical web application security risks: injection, XSS, CSRF, broken auth, sensitive data exposure, and more.",link:"https://owasp.org/Top10/",category:"Cybersecurity",difficulty:"Intermediate",type:"Documentation",rating:4.8,upvotes:5430,free:true,verified:true},
        {id:16,title:"Network Chuck - Ethical Hacking Full Course",description:"10-hour YouTube masterclass on ethical hacking: reconnaissance, scanning, enumeration, exploitation, post-exploitation, and report writing with live demos.",link:"https://www.youtube.com/watch?v=fNzpcB7ODxQ",category:"Cybersecurity",difficulty:"Beginner",type:"Video",rating:4.7,upvotes:4560,free:true,verified:true},
        {id:17,title:"CryptoHack - Cryptography Challenges",description:"Fun, free platform to learn cryptography through interactive CTF-style challenges covering classical ciphers, RSA, AES, elliptic curves, and lattice-based crypto.",link:"https://cryptohack.org/",category:"Cybersecurity",difficulty:"Intermediate",type:"Hands-on Platform",rating:4.6,upvotes:2100,free:true,verified:true},
        {id:18,title:"PortSwigger - Web Security Academy",description:"Free, comprehensive web security training with labs for every topic: SQLi, XSS, CSRF, SSRF, CORS, JWT attacks, authentication bypass, and more.",link:"https://portswigger.net/web-security",category:"Cybersecurity",difficulty:"Intermediate to Advanced",type:"Course + Labs",rating:4.9,upvotes:7200,free:true,verified:true},
        {id:19,title:"Coursera - Financial Markets by Robert Shiller",description:"Yale's free course on financial markets, risk management, insurance, banking, stocks, bonds, behavioral finance, and the 2008 crisis by Nobel laureate Robert Shiller.",link:"https://www.coursera.org/learn/financial-markets-global",category:"Business & Entrepreneurship",difficulty:"Beginner to Intermediate",type:"Course",rating:4.8,upvotes:5600,free:true,verified:true},
        {id:20,title:"The Lean Startup (Eric Ries) - Summary Series",description:"YouTube video series explaining the Build-Measure-Learn loop, MVP, validated learning, innovation accounting, and pivoting strategies from the seminal startup book.",link:"https://www.youtube.com/playlist?list=PLKqWP18U4L76wPwX5y6w3lR6M5w2Pw2Q1",category:"Business & Entrepreneurship",difficulty:"Beginner",type:"Video Series",rating:4.5,upvotes:1890,free:true,verified:true},
        {id:21,title:"HubSpot Academy - Inbound Marketing Certification",description:"Free industry-recognized certification covering content marketing, SEO, social media, email marketing, conversion optimization, and marketing analytics.",link:"https://academy.hubspot.com/courses/inbound-marketing",category:"Business & Entrepreneurship",difficulty:"Beginner",type:"Certification Course",rating:4.6,upvotes:3200,free:true,verified:true},
        {id:22,title:"Paul Graham Essays - Startups & Founders",description:"Collection of legendary essays by Y Combinator co-founder Paul Graham on startup ideas, fundraising, hiring, growth, and what makes great founders.",link:"http://www.paulgraham.com/articles.html",category:"Business & Entrepreneurship",difficulty:"Intermediate",type:"Articles",rating:4.8,upvotes:6800,free:true,verified:true},
        {id:23,title:"Khan Academy - Entrepreneurship Course",description:"Sal Khan's free course covering business plans, competitive analysis, marketing basics, pricing strategy, cash flow, and raising capital for small businesses.",link:"https://www.khanacademy.org/economics-finance-domain/core-finance/stock-and-bonds/entrepreneurship",category:"Business & Entrepreneurship",difficulty:"Beginner",type:"Course",rating:4.7,upvotes:2400,free:true,verified:true},
        {id:24,title:"Google Digital Garage - Fundamentals of Digital Marketing",description:"Interactive Advertising Bureau-accredited free certification with 26 modules on SEO, SEM, social media, analytics, content strategy, and ecommerce.",link:"https://learndigital.withgoogle.com/digitalgarage/course/digital-marketing",category:"Business & Entrepreneurship",difficulty:"Beginner",type:"Certification Course",rating:4.6,upvotes:4100,free:true,verified:true}
    ]
};

let state = {
    resources: [],
    saved: new Set(),
    upvoted: new Set(),
    suggestions: [],
    filters: {
        category: 'all',
        difficulty: 'all',
        search: '',
        sort: 'upvotes'
    },
    viewMode: 'grid'
};

const CATEGORY_STYLES = {
    'Web Development': 'web-dev',
    'AI & Machine Learning': 'ai-ml',
    'Cybersecurity': 'cyber',
    'Business & Entrepreneurship': 'business'
};

const getDifficultyClass = (difficulty) => {
    const d = difficulty.toLowerCase();
    if (d.includes('advanced')) return 'difficulty-advanced';
    if (d.includes('intermediate')) return 'difficulty-intermediate';
    return 'difficulty-beginner';
};

const formatNumber = (n) => {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
    return n.toString();
};

const storage = {
    get(key, fallback) {
        try {
            const raw = localStorage.getItem(key);
            if (raw === null) return fallback;
            return JSON.parse(raw);
        } catch {
            return fallback;
        }
    },
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch {
            return false;
        }
    }
};

async function loadResources() {
    try {
        const response = await fetch('resources.json', { cache: 'no-cache' });
        if (!response.ok) throw new Error('Failed to load');
        const data = await response.json();
        return data.resources || DEFAULT_DATA.resources;
    } catch {
        return DEFAULT_DATA.resources;
    }
}

function initState() {
    state.saved = new Set(storage.get(STATE_KEYS.SAVED, []));
    state.upvoted = new Set(storage.get(STATE_KEYS.UPVOTED, []));
    state.suggestions = storage.get(STATE_KEYS.SUGGESTIONS, []);
    state.viewMode = storage.get(STATE_KEYS.VIEW, 'grid');
}

function saveState() {
    storage.set(STATE_KEYS.SAVED, Array.from(state.saved));
    storage.set(STATE_KEYS.UPVOTED, Array.from(state.upvoted));
    storage.set(STATE_KEYS.SUGGESTIONS, state.suggestions);
    storage.set(STATE_KEYS.VIEW, state.viewMode);
}

function getFilteredResources() {
    let results = [...state.resources];

    if (state.filters.category !== 'all') {
        results = results.filter(r => r.category === state.filters.category);
    }

    if (state.filters.difficulty !== 'all') {
        results = results.filter(r => {
            const d = r.difficulty.toLowerCase();
            const target = state.filters.difficulty.toLowerCase();
            return d.includes(target);
        });
    }

    if (state.filters.search.trim()) {
        const query = state.filters.search.toLowerCase().trim();
        results = results.filter(r =>
            r.title.toLowerCase().includes(query) ||
            r.description.toLowerCase().includes(query) ||
            r.category.toLowerCase().includes(query) ||
            r.type.toLowerCase().includes(query)
        );
    }

    switch (state.filters.sort) {
        case 'rating':
            results.sort((a, b) => b.rating - a.rating || b.upvotes - a.upvotes);
            break;
        case 'title':
            results.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'upvotes':
        default:
            results.sort((a, b) => b.upvotes - a.upvotes || b.rating - a.rating);
    }

    return results;
}

function getEffectiveUpvotes(resource) {
    const base = resource.upvotes || 0;
    return state.upvoted.has(resource.id) ? base + 1 : base;
}

function renderStars(rating) {
    const full = Math.floor(rating);
    const half = rating - full >= 0.5;
    let html = '';
    for (let i = 0; i < full; i++) {
        html += `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1" width="13" height="13"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
    }
    if (half) {
        html += `<svg viewBox="0 0 24 24" width="13" height="13"><defs><linearGradient id="half"><stop offset="50%" stop-color="#F59E0B"/><stop offset="50%" stop-color="#E2E8F0"/></linearGradient></defs><polygon fill="url(#half)" stroke="#F59E0B" stroke-width="1" points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
    }
    const empty = 5 - full - (half ? 1 : 0);
    for (let i = 0; i < empty; i++) {
        html += `<svg viewBox="0 0 24 24" fill="#E2E8F0" stroke="#E2E8F0" stroke-width="1" width="13" height="13"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
    }
    return html;
}

function renderResourceCard(r) {
    const isSaved = state.saved.has(r.id);
    const isUpvoted = state.upvoted.has(r.id);
    const upvotes = getEffectiveUpvotes(r);
    const catClass = CATEGORY_STYLES[r.category] || '';
    const diffClass = getDifficultyClass(r.difficulty);

    return `
        <article class="resource-card" data-id="${r.id}">
            <div class="card-header">
                <span class="category-badge ${catClass}">${r.category}</span>
                <button class="save-btn ${isSaved ? 'saved' : ''}" 
                        data-action="save" 
                        data-id="${r.id}" 
                        title="${isSaved ? 'Remove from saved' : 'Save resource'}"
                        aria-label="${isSaved ? 'Remove from saved' : 'Save resource'}">
                    <svg viewBox="0 0 24 24" fill="${isSaved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" width="16" height="16">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                    </svg>
                </button>
            </div>
            <h3>${r.title}</h3>
            <p class="card-desc">${r.description}</p>
            <div class="card-meta">
                <span class="meta-tag difficulty ${diffClass}">${r.difficulty}</span>
                <span class="meta-tag type">${r.type}</span>
                ${r.free ? '<span class="meta-tag free-tag">FREE</span>' : ''}
                ${r.verified ? '<span class="meta-tag verified-tag">✓ Verified</span>' : ''}
            </div>
            <div class="card-footer">
                <div class="rating-area">
                    <div class="rating-score" title="${r.rating.toFixed(1)} / 5">
                        ${renderStars(r.rating)}
                        <span>${r.rating.toFixed(1)}</span>
                    </div>
                    <button class="upvote-btn ${isUpvoted ? 'upvoted' : ''}" 
                            data-action="upvote" 
                            data-id="${r.id}"
                            title="${isUpvoted ? 'Remove upvote' : 'Upvote this resource'}">
                        <svg viewBox="0 0 24 24" fill="${isUpvoted ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" width="14" height="14">
                            <polyline points="18 15 12 9 6 15"></polyline>
                        </svg>
                        <span>${formatNumber(upvotes)}</span>
                    </button>
                </div>
                <a href="${r.link}" target="_blank" rel="noopener noreferrer" class="visit-btn" data-action="visit">
                    Visit
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                </a>
            </div>
        </article>
    `;
}

function renderResources() {
    const grid = document.getElementById('resourcesGrid');
    const empty = document.getElementById('emptyState');
    const countEl = document.getElementById('resultCount');
    const savedCountEl = document.getElementById('savedCount');

    const results = getFilteredResources();

    if (state.viewMode === 'list') {
        grid.classList.add('list-view');
    } else {
        grid.classList.remove('list-view');
    }

    if (results.length === 0) {
        grid.innerHTML = '';
        empty.style.display = 'block';
        countEl.innerHTML = '<strong>0</strong> resources found';
    } else {
        empty.style.display = 'none';
        grid.innerHTML = results.map(renderResourceCard).join('');
        const total = state.resources.length;
        if (results.length === total) {
            countEl.innerHTML = `Showing all <strong>${total}</strong> resources`;
        } else {
            countEl.innerHTML = `Showing <strong>${results.length}</strong> of ${total} resources`;
        }
    }

    savedCountEl.textContent = state.saved.size;
}

function showToast(message, type = 'info', duration = 2800) {
    const toast = document.getElementById('toast');
    toast.className = `toast show ${type}`;
    toast.textContent = message;
    setTimeout(() => {
        toast.className = `toast ${type}`;
    }, duration - 300);
    setTimeout(() => {
        toast.className = 'toast';
    }, duration);
}

function toggleSave(id) {
    const resource = state.resources.find(r => r.id === id);
    if (!resource) return;

    if (state.saved.has(id)) {
        state.saved.delete(id);
        showToast(`Removed "${resource.title}" from saved`, 'info');
    } else {
        state.saved.add(id);
        showToast(`Saved "${resource.title}"`, 'success');
    }
    saveState();
    renderResources();
}

function toggleUpvote(id) {
    const resource = state.resources.find(r => r.id === id);
    if (!resource) return;

    if (state.upvoted.has(id)) {
        state.upvoted.delete(id);
    } else {
        state.upvoted.add(id);
        showToast('Thanks for upvoting!', 'success');
    }
    saveState();
    renderResources();
}

function setCategoryFilter(category) {
    state.filters.category = category;
    document.querySelectorAll('#categoryFilters .chip').forEach(chip => {
        chip.classList.toggle('active', chip.dataset.filter === category);
    });
    renderResources();
}

function setDifficultyFilter(difficulty) {
    state.filters.difficulty = difficulty;
    document.querySelectorAll('#difficultyFilters .chip').forEach(chip => {
        chip.classList.toggle('active', chip.dataset.difficulty === difficulty);
    });
    renderResources();
}

function setSort(sort) {
    state.filters.sort = sort;
    renderResources();
}

function setViewMode(mode) {
    state.viewMode = mode;
    document.getElementById('viewGrid').classList.toggle('active', mode === 'grid');
    document.getElementById('viewList').classList.toggle('active', mode === 'list');
    saveState();
    renderResources();
}

function resetFilters() {
    state.filters = { category: 'all', difficulty: 'all', search: '', sort: state.filters.sort };
    document.getElementById('searchInput').value = '';
    document.getElementById('clearSearch').style.display = 'none';
    setCategoryFilter('all');
    setDifficultyFilter('all');
    showToast('Filters reset', 'info');
    renderResources();
}

function filterByCategory(category) {
    setCategoryFilter(category);
    document.getElementById('resources').scrollIntoView({ behavior: 'smooth' });
}

function showSavedResources() {
    if (state.saved.size === 0) {
        showToast('No saved resources yet! Click the bookmark icon on cards.', 'info');
        return;
    }
    showModal(
        `My Saved Resources (${state.saved.size})`,
        state.resources
            .filter(r => state.saved.has(r.id))
            .map(r => `
                <div style="border:1px solid var(--border);border-radius:12px;padding:16px;margin-bottom:12px;">
                    <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:8px;">
                        <span class="category-badge ${CATEGORY_STYLES[r.category] || ''}" style="font-size:11px;">${r.category}</span>
                        <button class="save-btn saved" onclick="removeSaved(${r.id})" style="width:30px;height:30px;">
                            <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" width="14" height="14">
                                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                            </svg>
                        </button>
                    </div>
                    <h4 style="font-size:15px;margin-bottom:6px;">${r.title}</h4>
                    <p style="font-size:13px;color:var(--text-secondary);margin-bottom:10px;">${r.description}</p>
                    <a href="${r.link}" target="_blank" rel="noopener noreferrer" style="font-size:13px;font-weight:600;">Open Resource →</a>
                </div>
            `).join('')
    );
}

function removeSaved(id) {
    toggleSave(id);
    setTimeout(showSavedResources, 100);
}

function showModal(title, contentHtml) {
    const existing = document.querySelector('.modal-backdrop');
    if (existing) existing.remove();

    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    backdrop.innerHTML = `
        <div class="modal">
            <div class="modal-header">
                <h3>${title}</h3>
                <button class="modal-close" onclick="this.closest('.modal-backdrop').remove()">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M15 9l-6 6M9 9l6 6"></path>
                    </svg>
                </button>
            </div>
            <div class="modal-body">${contentHtml}</div>
        </div>
    `;
    document.body.appendChild(backdrop);
    requestAnimationFrame(() => backdrop.classList.add('show'));
    backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) backdrop.remove();
    });
    document.addEventListener('keydown', function esc(e) {
        if (e.key === 'Escape') {
            backdrop.remove();
            document.removeEventListener('keydown', esc);
        }
    });
}

function exportResources() {
    const data = {
        exportedAt: new Date().toISOString(),
        count: state.resources.length,
        resources: state.resources
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `student-resource-hub-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Resources exported as JSON', 'success');
}

function downloadCSV() {
    const headers = ['ID', 'Title', 'Category', 'Difficulty', 'Type', 'Rating', 'Upvotes', 'Free', 'Verified', 'Link', 'Description'];
    const escape = (v) => {
        const s = String(v ?? '').replace(/"/g, '""');
        return /[",\n]/.test(s) ? `"${s}"` : s;
    };
    const rows = state.resources.map(r => [
        r.id, r.title, r.category, r.difficulty, r.type,
        r.rating, getEffectiveUpvotes(r), r.free, r.verified, r.link, r.description
    ]);
    const csv = [headers, ...rows].map(row => row.map(escape).join(',')).join('\n');
    const bom = '\uFEFF';
    const blob = new Blob([bom + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `student-resources-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Resources exported as CSV', 'success');
}

function handleFormSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    if (!data.title || !data.link || !data.category || !data.difficulty || !data.type || !data.description) {
        showToast('Please fill in all required fields', 'error');
        return;
    }

    try {
        new URL(data.link);
    } catch {
        showToast('Please enter a valid URL starting with http:// or https://', 'error');
        return;
    }

    const suggestion = {
        id: Date.now(),
        submittedAt: new Date().toISOString(),
        status: 'pending_review',
        ...data
    };

    state.suggestions.push(suggestion);
    saveState();

    document.getElementById('formSuccess').style.display = 'flex';
    form.reset();
    document.getElementById('charCount').textContent = '0/300';
    document.getElementById('submitBtn').disabled = true;
    const btn = document.getElementById('submitBtn');
    btn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="18" height="18">
            <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span class="btn-text">Submitted!</span>
    `;
    setTimeout(() => {
        document.getElementById('formSuccess').style.display = 'none';
        btn.disabled = false;
        btn.innerHTML = `
            <span class="btn-text">Submit Suggestion</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
        `;
    }, 4000);

    console.log('Resource suggestion saved to localStorage:', suggestion);
    console.log('All suggestions:', state.suggestions);
}

function setupEventListeners() {
    document.getElementById('searchInput').addEventListener('input', (e) => {
        state.filters.search = e.target.value;
        document.getElementById('clearSearch').style.display = e.target.value ? 'flex' : 'none';
        renderResources();
    });

    document.getElementById('clearSearch').addEventListener('click', () => {
        state.filters.search = '';
        document.getElementById('searchInput').value = '';
        document.getElementById('clearSearch').style.display = 'none';
        renderResources();
    });

    document.getElementById('categoryFilters').addEventListener('click', (e) => {
        const chip = e.target.closest('.chip');
        if (chip) setCategoryFilter(chip.dataset.filter);
    });

    document.getElementById('difficultyFilters').addEventListener('click', (e) => {
        const chip = e.target.closest('.difficulty-chip');
        if (chip) setDifficultyFilter(chip.dataset.difficulty);
    });

    document.getElementById('sortSelect').addEventListener('change', (e) => setSort(e.target.value));

    document.getElementById('viewGrid').addEventListener('click', () => setViewMode('grid'));
    document.getElementById('viewList').addEventListener('click', () => setViewMode('list'));

    document.getElementById('resetFiltersBtn').addEventListener('click', resetFilters);

    document.getElementById('savedNavLink').addEventListener('click', (e) => {
        e.preventDefault();
        showSavedResources();
    });

    document.getElementById('resourcesGrid').addEventListener('click', (e) => {
        const btn = e.target.closest('[data-action]');
        if (!btn) return;
        const id = Number(btn.dataset.id);
        if (btn.dataset.action === 'save') toggleSave(id);
        else if (btn.dataset.action === 'upvote') toggleUpvote(id);
    });

    const desc = document.getElementById('resourceDescription');
    const countEl = document.getElementById('charCount');
    desc.addEventListener('input', () => {
        countEl.textContent = `${desc.value.length}/300`;
    });

    document.getElementById('suggestForm').addEventListener('submit', handleFormSubmit);

    document.querySelector('.logo').addEventListener('click', () => {
        resetFilters();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

function applySavedViewMode() {
    document.getElementById('viewGrid').classList.toggle('active', state.viewMode === 'grid');
    document.getElementById('viewList').classList.toggle('active', state.viewMode === 'list');
}

async function init() {
    initState();
    state.resources = await loadResources();
    applySavedViewMode();
    setupEventListeners();
    renderResources();
}

document.addEventListener('DOMContentLoaded', init);
