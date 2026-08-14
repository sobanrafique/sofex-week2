'use strict';

(function markInitStart() {
    if (typeof performance !== 'undefined' && typeof performance.mark === 'function') {
        try { performance.mark('srh-init-start'); } catch (e) {}
    }
})();

const STATE_KEYS = Object.freeze({
    SAVED: 'srh_saved_resources',
    UPVOTED: 'srh_upvoted_resources',
    SUGGESTIONS: 'srh_resource_suggestions',
    VIEW: 'srh_view_mode',
    FILTERS: 'srh_active_filters'
});

const DEBOUNCE_DELAY = 150;
const MAX_SAFE_STRING_LENGTH = 2000;
const STORAGE_WARNING_THRESHOLD = 0.9;
const UNDO_TOAST_DURATION = 4200;
const QUOTA_EXCEEDED_NAME = 'QuotaExceededError';

const DEFAULT_DATA = Object.freeze({
    metadata: Object.freeze({
        title: "Student Resource Hub - Curated Learning Resources",
        version: "1.1.0",
        lastUpdated: "2026-08-13"
    }),
    resources: Object.freeze([
        Object.freeze({id:1,title:"The Odin Project",description:"A free, open-source curriculum for learning full-stack web development. Covers HTML, CSS, JavaScript, Node.js, Ruby on Rails, and React with hands-on projects.",link:"https://www.theodinproject.com/",category:"Web Development",difficulty:"Beginner to Advanced",type:"Course",rating:4.9,upvotes:2847,free:true,verified:true}),
        Object.freeze({id:2,title:"freeCodeCamp - Responsive Web Design",description:"Master HTML and CSS by building 5 certification projects including a survey form, tribute page, landing page, technical doc, and personal portfolio.",link:"https://www.freecodecamp.org/learn/2022/responsive-web-design/",category:"Web Development",difficulty:"Beginner",type:"Course",rating:4.8,upvotes:5120,free:true,verified:true}),
        Object.freeze({id:3,title:"MDN Web Docs - JavaScript Guide",description:"Mozilla's comprehensive, authoritative guide to JavaScript from basics to advanced concepts like closures, promises, async/await, and modules.",link:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide",category:"Web Development",difficulty:"Intermediate",type:"Documentation",rating:4.7,upvotes:3890,free:true,verified:true}),
        Object.freeze({id:4,title:"CS50's Web Programming with Python and JavaScript",description:"Harvard's free course covering Flask, Django, SQL, APIs, JavaScript frontends, React, and CI/CD. Includes 6 hands-on projects.",link:"https://cs50.harvard.edu/web/2020/",category:"Web Development",difficulty:"Intermediate",type:"Course",rating:4.9,upvotes:4210,free:true,verified:true}),
        Object.freeze({id:5,title:"Fireship - React in 100 Seconds",description:"Concise, high-quality YouTube video explaining the fundamentals of React.js including components, JSX, state, and hooks.",link:"https://www.youtube.com/watch?v=Tn6-PIqc4UM",category:"Web Development",difficulty:"Beginner",type:"Video",rating:4.6,upvotes:1850,free:true,verified:true}),
        Object.freeze({id:6,title:"CSS-Tricks - A Complete Guide to Flexbox",description:"Everything you need to know about CSS Flexbox with visual examples, diagrams, and a flexbox playground cheat sheet.",link:"https://css-tricks.com/snippets/css/a-guide-to-flexbox/",category:"Web Development",difficulty:"Beginner",type:"Article",rating:4.5,upvotes:2340,free:true,verified:true}),
        Object.freeze({id:7,title:"Coursera - Machine Learning by Andrew Ng",description:"Stanford's legendary ML course covering supervised learning, unsupervised learning, linear regression, neural networks, and SVMs with MATLAB/Octave exercises.",link:"https://www.coursera.org/learn/machine-learning",category:"AI & Machine Learning",difficulty:"Intermediate",type:"Course",rating:4.9,upvotes:12500,free:true,verified:true}),
        Object.freeze({id:8,title:"fast.ai - Practical Deep Learning for Coders",description:"Top-down approach to deep learning using PyTorch. Build state-of-the-art models for computer vision, NLP, and tabular data from lesson 1.",link:"https://course.fast.ai/",category:"AI & Machine Learning",difficulty:"Intermediate",type:"Course",rating:4.8,upvotes:5670,free:true,verified:true}),
        Object.freeze({id:9,title:"3Blue1Brown - Neural Networks Series",description:"Visually stunning YouTube series explaining what neural networks are, how they learn (gradient descent, backprop), with beautiful animated explanations.",link:"https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi",category:"AI & Machine Learning",difficulty:"Beginner",type:"Video Series",rating:4.9,upvotes:8900,free:true,verified:true}),
        Object.freeze({id:10,title:"Hugging Face - NLP Course",description:"Free hands-on course on modern NLP using transformers, Hugging Face libraries, tokenizers, and building production-ready LLM applications.",link:"https://huggingface.co/learn/nlp-course/",category:"AI & Machine Learning",difficulty:"Advanced",type:"Course",rating:4.7,upvotes:3420,free:true,verified:true}),
        Object.freeze({id:11,title:"OpenAI - Prompt Engineering for Developers",description:"Learn best practices for prompting LLMs, building custom chatbots, and developing AI-powered applications with the OpenAI API.",link:"https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/",category:"AI & Machine Learning",difficulty:"Intermediate",type:"Course",rating:4.6,upvotes:4100,free:true,verified:true}),
        Object.freeze({id:12,title:"Towards Data Science - Understanding LSTMs",description:"In-depth article explaining Long Short-Term Memory networks, RNN architectures, and how they solve the vanishing gradient problem.",link:"https://towardsdatascience.com/understanding-lstm-and-its-quick-implementation-in-keras-for-sentiment-analysis-af410fd85b47",category:"AI & Machine Learning",difficulty:"Advanced",type:"Article",rating:4.4,upvotes:1580,free:true,verified:true}),
        Object.freeze({id:13,title:"TryHackMe - Complete Beginner Learning Path",description:"Guided, gamified cybersecurity path with hands-on labs covering networking basics, Linux, web hacking, cryptography, and real CTF challenges.",link:"https://tryhackme.com/path/outline/beginner",category:"Cybersecurity",difficulty:"Beginner",type:"Course",rating:4.8,upvotes:6780,free:true,verified:true}),
        Object.freeze({id:14,title:"MIT OCW - Introduction to Computer Security",description:"MIT's free graduate-level course covering cryptography, network security, authentication, access control, buffer overflows, and secure software design.",link:"https://ocw.mit.edu/courses/6-858-computer-systems-security-fall-2014/",category:"Cybersecurity",difficulty:"Advanced",type:"Course",rating:4.9,upvotes:3200,free:true,verified:true}),
        Object.freeze({id:15,title:"OWASP Top 10 Official Guide",description:"The definitive guide to the top 10 most critical web application security risks: injection, XSS, CSRF, broken auth, sensitive data exposure, and more.",link:"https://owasp.org/Top10/",category:"Cybersecurity",difficulty:"Intermediate",type:"Documentation",rating:4.8,upvotes:5430,free:true,verified:true}),
        Object.freeze({id:16,title:"Network Chuck - Ethical Hacking Full Course",description:"10-hour YouTube masterclass on ethical hacking: reconnaissance, scanning, enumeration, exploitation, post-exploitation, and report writing with live demos.",link:"https://www.youtube.com/watch?v=fNzpcB7ODxQ",category:"Cybersecurity",difficulty:"Beginner",type:"Video",rating:4.7,upvotes:4560,free:true,verified:true}),
        Object.freeze({id:17,title:"CryptoHack - Cryptography Challenges",description:"Fun, free platform to learn cryptography through interactive CTF-style challenges covering classical ciphers, RSA, AES, elliptic curves, and lattice-based crypto.",link:"https://cryptohack.org/",category:"Cybersecurity",difficulty:"Intermediate",type:"Hands-on Platform",rating:4.6,upvotes:2100,free:true,verified:true}),
        Object.freeze({id:18,title:"PortSwigger - Web Security Academy",description:"Free, comprehensive web security training with labs for every topic: SQLi, XSS, CSRF, SSRF, CORS, JWT attacks, authentication bypass, and more.",link:"https://portswigger.net/web-security",category:"Cybersecurity",difficulty:"Intermediate to Advanced",type:"Course + Labs",rating:4.9,upvotes:7200,free:true,verified:true}),
        Object.freeze({id:19,title:"Coursera - Financial Markets by Robert Shiller",description:"Yale's free course on financial markets, risk management, insurance, banking, stocks, bonds, behavioral finance, and the 2008 crisis by Nobel laureate Robert Shiller.",link:"https://www.coursera.org/learn/financial-markets-global",category:"Business & Entrepreneurship",difficulty:"Beginner to Intermediate",type:"Course",rating:4.8,upvotes:5600,free:true,verified:true}),
        Object.freeze({id:20,title:"The Lean Startup (Eric Ries) - Summary Series",description:"YouTube video series explaining the Build-Measure-Learn loop, MVP, validated learning, innovation accounting, and pivoting strategies from the seminal startup book.",link:"https://www.youtube.com/playlist?list=PLKqWP18U4L76wPwX5y6w3lR6M5w2Pw2Q1",category:"Business & Entrepreneurship",difficulty:"Beginner",type:"Video Series",rating:4.5,upvotes:1890,free:true,verified:true}),
        Object.freeze({id:21,title:"HubSpot Academy - Inbound Marketing Certification",description:"Free industry-recognized certification covering content marketing, SEO, social media, email marketing, conversion optimization, and marketing analytics.",link:"https://academy.hubspot.com/courses/inbound-marketing",category:"Business & Entrepreneurship",difficulty:"Beginner",type:"Certification Course",rating:4.6,upvotes:3200,free:true,verified:true}),
        Object.freeze({id:22,title:"Paul Graham Essays - Startups & Founders",description:"Collection of legendary essays by Y Combinator co-founder Paul Graham on startup ideas, fundraising, hiring, growth, and what makes great founders.",link:"http://www.paulgraham.com/articles.html",category:"Business & Entrepreneurship",difficulty:"Intermediate",type:"Articles",rating:4.8,upvotes:6800,free:true,verified:true}),
        Object.freeze({id:23,title:"Khan Academy - Entrepreneurship Course",description:"Sal Khan's free course covering business plans, competitive analysis, marketing basics, pricing strategy, cash flow, and raising capital for small businesses.",link:"https://www.khanacademy.org/economics-finance-domain/core-finance/stock-and-bonds/entrepreneurship",category:"Business & Entrepreneurship",difficulty:"Beginner",type:"Course",rating:4.7,upvotes:2400,free:true,verified:true}),
        Object.freeze({id:24,title:"Google Digital Garage - Fundamentals of Digital Marketing",description:"Interactive Advertising Bureau-accredited free certification with 26 modules on SEO, SEM, social media, analytics, content strategy, and ecommerce.",link:"https://learndigital.withgoogle.com/digitalgarage/course/digital-marketing",category:"Business & Entrepreneurship",difficulty:"Beginner",type:"Certification Course",rating:4.6,upvotes:4100,free:true,verified:true})
    ])
});

const state = {
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

const CATEGORY_STYLES = Object.freeze({
    'Web Development': 'web-dev',
    'AI & Machine Learning': 'ai-ml',
    'Cybersecurity': 'cyber',
    'Business & Entrepreneurship': 'business'
});

const HTML_ESCAPE_MAP = Object.freeze({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '`': '&#96;',
    '=': '&#61;'
});

function escapeHtml(str) {
    if (str == null) return '';
    const s = String(str).slice(0, MAX_SAFE_STRING_LENGTH);
    let result = '';
    for (let i = 0; i < s.length; i++) {
        const ch = s[i];
        result += HTML_ESCAPE_MAP[ch] || ch;
    }
    return result;
}

function safeUrl(url) {
    try {
        const u = new URL(url);
        if (u.protocol !== 'http:' && u.protocol !== 'https:') {
            return 'about:blank';
        }
        return u.toString();
    } catch {
        return 'about:blank';
    }
}

function getDifficultyClass(difficulty) {
    const d = String(difficulty || '').toLowerCase();
    if (d.includes('advanced')) return 'difficulty-advanced';
    if (d.includes('intermediate')) return 'difficulty-intermediate';
    return 'difficulty-beginner';
}

function formatNumber(n) {
    const num = Number(n) || 0;
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toString();
}

function debounce(fn, delay) {
    let timeoutId = null;
    return function(...args) {
        if (timeoutId !== null) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            timeoutId = null;
            fn.apply(this, args);
        }, delay);
    };
}

let pendingUndoAction = null;
let pendingUndoTimeoutId = null;
let formDirty = false;

const perf = Object.freeze({
    mark(name) {
        if (typeof performance !== 'undefined' && typeof performance.mark === 'function') {
            try { performance.mark('srh-' + name); } catch (e) {}
        }
    },
    measure(name, startMark, endMark) {
        if (typeof performance !== 'undefined' && typeof performance.measure === 'function') {
            try { performance.measure('srh-' + name, 'srh-' + startMark, 'srh-' + endMark); } catch (e) {}
        }
    }
});

const storage = Object.freeze({
    get(key, fallback) {
        if (typeof localStorage === 'undefined') return fallback;
        try {
            const raw = localStorage.getItem(key);
            if (raw === null) return fallback;
            return JSON.parse(raw);
        } catch {
            return fallback;
        }
    },
    set(key, value) {
        if (typeof localStorage === 'undefined') {
            showStorageUnavailableToast();
            return false;
        }
        try {
            localStorage.setItem(key, JSON.stringify(value));
            this._checkQuotaNearLimit();
            return true;
        } catch (err) {
            if (err && (err.name === QUOTA_EXCEEDED_NAME || (err.code && err.code === 22) || /quota|exceed/i.test(String(err.message || '')))) {
                showQuotaExceededDialog(key);
            } else {
                showStorageUnavailableToast();
            }
            return false;
        }
    },
    _checkQuotaNearLimit() {
        try {
            if (typeof navigator !== 'undefined' && navigator.storage && typeof navigator.storage.estimate === 'function') {
                navigator.storage.estimate().then(info => {
                    if (info && info.quota > 0 && info.usage / info.quota > STORAGE_WARNING_THRESHOLD) {
                        showToast('Storage is almost full. Consider removing saved items.', 'warning', 4200);
                    }
                }).catch(() => {});
            }
        } catch (e) {}
    }
});

function showStorageUnavailableToast() {
    showToast("Storage unavailable — your browser blocks localStorage. Use a different browser or enable cookies.", 'error', 6000);
}

function showQuotaExceededDialog(failingKey) {
    if (document.getElementById('quotaWarningDialog')) return;
    const wrap = document.createElement('div');
    wrap.className = 'quota-warning';
    wrap.id = 'quotaWarningDialog';
    wrap.setAttribute('role', 'alertdialog');
    wrap.setAttribute('aria-modal', 'true');
    wrap.setAttribute('aria-labelledby', 'quotaWarnTitle');
    const escapedFailing = escapeHtml(String(failingKey || 'saved resources'));
    wrap.innerHTML = `
        <div class="quota-warning-dialog" role="document">
            <h4 id="quotaWarnTitle">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20" aria-hidden="true" style="color:var(--warning);">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
                Storage Full
            </h4>
            <p>Your browser's storage space is full. We couldn't save your latest action on <strong style="color:var(--text-primary)">${escapedFailing}</strong>. Remove some saved resources or old suggestions to free space, then try again.</p>
            <div class="quota-actions">
                <button class="btn-ghost" type="button" id="quotaCloseBtn">Close</button>
                <button class="btn btn-primary" type="button" id="quotaOpenSavedBtn">Open My Saved</button>
            </div>
        </div>
    `;
    document.body.appendChild(wrap);
    const closeBtn = wrap.querySelector('#quotaCloseBtn');
    const openBtn = wrap.querySelector('#quotaOpenSavedBtn');
    const remove = () => { wrap.parentNode && wrap.parentNode.removeChild(wrap); };
    closeBtn && closeBtn.addEventListener('click', remove);
    openBtn && openBtn.addEventListener('click', () => {
        remove();
        showSavedResources();
    });
    setTimeout(() => {
        wrap.addEventListener('click', (e) => { if (e.target === wrap) remove(); }, { once: true });
    }, 0);
}

function setFormDirty(isDirty) {
    formDirty = Boolean(isDirty);
}

window.addEventListener('beforeunload', (e) => {
    if (!formDirty) return;
    if (typeof e !== 'undefined') {
        e.preventDefault();
        e.returnValue = '';
    }
    return '';
});

async function loadResources() {
    perf.mark('data-load-start');
    try {
        const response = await fetch('resources.json', { cache: 'no-cache' });
        if (!response.ok) throw new Error('Failed to load resources.json');
        const data = await response.json();
        if (Array.isArray(data.resources)) {
            perf.mark('data-load-end-fetch');
            return data.resources.map(r => Object.freeze({ ...r }));
        }
        throw new Error('Invalid resources data');
    } catch {
        perf.mark('data-load-end-fallback');
        return DEFAULT_DATA.resources.map(r => Object.freeze({ ...r }));
    }
}

function initState() {
    perf.mark('state-init-start');
    const rawSaved = storage.get(STATE_KEYS.SAVED, []);
    const savedArr = (Array.isArray(rawSaved) ? rawSaved : [])
        .filter(id => Number.isInteger(Number(id)))
        .map(id => Number(id));
    state.saved = new Set(savedArr);

    const rawUp = storage.get(STATE_KEYS.UPVOTED, []);
    const upArr = (Array.isArray(rawUp) ? rawUp : [])
        .filter(id => Number.isInteger(Number(id)))
        .map(id => Number(id));
    state.upvoted = new Set(upArr);

    const sug = storage.get(STATE_KEYS.SUGGESTIONS, []);
    state.suggestions = Array.isArray(sug) ? sug : [];

    const vm = storage.get(STATE_KEYS.VIEW, 'grid');
    state.viewMode = (vm === 'list' || vm === 'grid') ? vm : 'grid';

    const rawFilters = storage.get(STATE_KEYS.FILTERS, null);
    if (rawFilters && typeof rawFilters === 'object') {
        if (typeof rawFilters.category === 'string') state.filters.category = rawFilters.category;
        if (typeof rawFilters.difficulty === 'string') state.filters.difficulty = rawFilters.difficulty;
        if (typeof rawFilters.search === 'string') state.filters.search = rawFilters.search;
        if (typeof rawFilters.sort === 'string') state.filters.sort = rawFilters.sort;
    }
    perf.mark('state-init-end');
}

function saveState() {
    storage.set(STATE_KEYS.SAVED, Array.from(state.saved));
    storage.set(STATE_KEYS.UPVOTED, Array.from(state.upvoted));
    storage.set(STATE_KEYS.SUGGESTIONS, state.suggestions);
    storage.set(STATE_KEYS.VIEW, state.viewMode);
    storage.set(STATE_KEYS.FILTERS, Object.freeze({
        category: state.filters.category,
        difficulty: state.filters.difficulty,
        search: state.filters.search,
        sort: state.filters.sort
    }));
}

function getFilteredResources() {
    let results = state.resources.slice();

    if (state.filters.category !== 'all') {
        results = results.filter(r => r.category === state.filters.category);
    }

    if (state.filters.difficulty !== 'all') {
        const target = String(state.filters.difficulty).toLowerCase();
        results = results.filter(r => String(r.difficulty || '').toLowerCase().includes(target));
    }

    if (state.filters.search.trim()) {
        const query = String(state.filters.search).toLowerCase().trim();
        results = results.filter(r =>
            String(r.title || '').toLowerCase().includes(query) ||
            String(r.description || '').toLowerCase().includes(query) ||
            String(r.category || '').toLowerCase().includes(query) ||
            String(r.type || '').toLowerCase().includes(query)
        );
    }

    switch (state.filters.sort) {
        case 'rating':
            results.sort((a, b) => (b.rating || 0) - (a.rating || 0) || (b.upvotes || 0) - (a.upvotes || 0));
            break;
        case 'title':
            results.sort((a, b) => String(a.title || '').localeCompare(String(b.title || '')));
            break;
        case 'upvotes':
        default:
            results.sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0) || (b.rating || 0) - (a.rating || 0));
    }

    return results;
}

function getEffectiveUpvotes(resource) {
    const base = Number(resource.upvotes) || 0;
    return state.upvoted.has(Number(resource.id)) ? base + 1 : base;
}

function renderStars(rating) {
    const r = Math.max(0, Math.min(5, Number(rating) || 0));
    const full = Math.floor(r);
    const half = r - full >= 0.5;
    let html = '';
    for (let i = 0; i < full; i++) {
        html += '<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1" width="13" height="13" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';
    }
    if (half) {
        const gid = 'half-' + Math.round(Math.random() * 1e9);
        html += `<svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true"><defs><linearGradient id="${gid}"><stop offset="50%" stop-color="#F59E0B"/><stop offset="50%" stop-color="#E2E8F0"/></linearGradient></defs><polygon fill="url(#${gid})" stroke="#F59E0B" stroke-width="1" points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
    }
    const empty = 5 - full - (half ? 1 : 0);
    for (let i = 0; i < empty; i++) {
        html += '<svg viewBox="0 0 24 24" fill="#E2E8F0" stroke="#E2E8F0" stroke-width="1" width="13" height="13" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';
    }
    return html;
}

function renderResourceCard(r) {
    const id = Number(r.id);
    const isSaved = state.saved.has(id);
    const isUpvoted = state.upvoted.has(id);
    const upvotes = getEffectiveUpvotes(r);
    const catClass = CATEGORY_STYLES[r.category] || '';
    const diffClass = getDifficultyClass(r.difficulty);
    const safeLink = safeUrl(r.link);
    const titleEsc = escapeHtml(r.title);
    const descEsc = escapeHtml(r.description);
    const catEsc = escapeHtml(r.category);
    const diffEsc = escapeHtml(r.difficulty);
    const typeEsc = escapeHtml(r.type);
    const ratingFormatted = (Number(r.rating) || 0).toFixed(1);

    return `
        <article class="resource-card" data-id="${id}" aria-label="${titleEsc}">
            <div class="card-header">
                <span class="category-badge ${catClass}">${catEsc}</span>
                <button class="save-btn ${isSaved ? 'saved' : ''}"
                        data-action="save"
                        data-id="${id}"
                        title="${isSaved ? 'Remove from saved' : 'Save resource'}"
                        aria-label="${isSaved ? 'Remove ' + titleEsc + ' from saved' : 'Save ' + titleEsc + ' to saved resources'}">
                    <svg viewBox="0 0 24 24" fill="${isSaved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" width="16" height="16" aria-hidden="true">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                    </svg>
                </button>
            </div>
            <h3>${titleEsc}</h3>
            <p class="card-desc">${descEsc}</p>
            <div class="card-meta">
                <span class="meta-tag difficulty ${diffClass}">${diffEsc}</span>
                <span class="meta-tag type">${typeEsc}</span>
                ${r.free ? '<span class="meta-tag free-tag">FREE</span>' : ''}
                ${r.verified ? '<span class="meta-tag verified-tag">✓ Verified</span>' : ''}
            </div>
            <div class="card-footer">
                <div class="rating-area">
                    <div class="rating-score" title="${ratingFormatted} / 5 stars">
                        ${renderStars(r.rating)}
                        <span>${ratingFormatted}</span>
                    </div>
                    <button class="upvote-btn ${isUpvoted ? 'upvoted' : ''}"
                            data-action="upvote"
                            data-id="${id}"
                            title="${isUpvoted ? 'Remove upvote for ' + titleEsc : 'Upvote ' + titleEsc}">
                        <svg viewBox="0 0 24 24" fill="${isUpvoted ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" width="14" height="14" aria-hidden="true">
                            <polyline points="18 15 12 9 6 15"></polyline>
                        </svg>
                        <span>${formatNumber(upvotes)}</span>
                    </button>
                </div>
                <a href="${safeLink}" target="_blank" rel="noopener noreferrer" class="visit-btn" data-action="visit" aria-label="Visit ${titleEsc} (opens in new tab)">
                    Visit
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14" aria-hidden="true">
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
    const skeleton = document.getElementById('skeletonContainer');

    if (skeleton && (skeleton.style.display = 'none'));
    if (grid) grid.setAttribute('aria-busy', 'false');

    const results = getFilteredResources();

    if (state.viewMode === 'list') {
        grid && grid.classList.add('list-view');
    } else if (grid) grid.classList.remove('list-view');

    if (results.length === 0) {
        if (grid) grid.innerHTML = '';
        if (empty) empty.style.display = 'block';
        if (countEl) countEl.innerHTML = '<strong>0</strong> resources found';
    } else {
        if (empty) empty.style.display = 'none';
        if (grid) grid.innerHTML = results.map(renderResourceCard).join('');
        const total = state.resources.length;
        if (countEl && results.length === total) {
            countEl.innerHTML = `Showing all <strong>${total}</strong> resources`;
        } else if (countEl) {
            countEl.innerHTML = `Showing <strong>${results.length}</strong> of ${total} resources`;
        }
    }

    if (savedCountEl) savedCountEl.textContent = String(state.saved.size);
}

function renderSkeletons() {
    const skeleton = document.getElementById('skeletonContainer');
    if (!skeleton) return;
    const count = Math.min(6, state.resources.length || 6);
    let html = '';
    for (let i = 0; i < count; i++) {
        html += `
            <div class="skeleton-card" aria-hidden="true">
                <div class="skeleton-shimmer skeleton-badge"></div>
                <div class="skeleton-shimmer skeleton-title"></div>
                <div class="skeleton-shimmer skeleton-desc"></div>
                <div class="skeleton-shimmer skeleton-desc"></div>
                <div class="skeleton-tags">
                    <div class="skeleton-shimmer skeleton-tag"></div>
                    <div class="skeleton-shimmer skeleton-tag"></div>
                </div>
                <div class="skeleton-footer">
                    <div class="skeleton-shimmer skeleton-rating"></div>
                    <div class="skeleton-shimmer skeleton-btn"></div>
                </div>
            </div>
        `;
    }
    skeleton.innerHTML = html;
    skeleton.style.display = '';
    const grid = document.getElementById('resourcesGrid');
    if (grid) grid.innerHTML = '';
}

function showToast(message, type = 'info', duration = 2800, options) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    if (pendingUndoTimeoutId) {
        clearTimeout(pendingUndoTimeoutId);
        pendingUndoTimeoutId = null;
        pendingUndoAction = null;
    }
    toast.className = `toast show ${type}`;
    const undo = options && typeof options.onUndo === 'function' ? options.onUndo : null;
    const messageText = String(message).slice(0, 200);
    if (undo) {
        toast.classList.add('has-undo');
        toast.innerHTML = `<span class="toast-message"></span><button type="button" class="toast-undo-btn" aria-label="Undo last action">Undo</button>`;
        const msgEl = toast.querySelector('.toast-message');
        if (msgEl) msgEl.textContent = messageText;
        const undoBtn = toast.querySelector('.toast-undo-btn');
        if (undoBtn) {
            pendingUndoAction = undo;
            undoBtn.addEventListener('click', () => {
                try { undo(); } catch (e) {}
                if (pendingUndoTimeoutId) { clearTimeout(pendingUndoTimeoutId); pendingUndoTimeoutId = null; }
                pendingUndoAction = null;
                hide();
                showToast('Action undone.', 'info', 1800);
            });
        }
    } else {
        toast.classList.remove('has-undo');
        toast.textContent = messageText;
    }
    const cleanUp = () => {
        toast.className = `toast ${type}`;
    };
    const hide = () => {
        toast.className = 'toast';
        toast.classList.remove('has-undo');
        pendingUndoAction = null;
    };
    const actual = undo ? Math.max(duration, UNDO_TOAST_DURATION) : duration;
    if (actual > 300) setTimeout(cleanUp, Math.max(0, actual - 300));
    pendingUndoTimeoutId = setTimeout(hide, actual);
}

function toggleSave(id) {
    const resource = state.resources.find(r => Number(r.id) === Number(id));
    if (!resource) return;
    const numId = Number(id);
    const prevSaved = state.saved.has(numId);
    const previousSet = new Set(state.saved);

    if (state.saved.has(numId)) {
        state.saved.delete(numId);
    } else {
        state.saved.add(numId);
    }
    const savedOk = saveState();
    const toastMsg = prevSaved
        ? `Removed "${String(resource.title)}" from saved`
        : `Saved "${String(resource.title)}"`;
    const toastType = prevSaved ? 'info' : 'success';
    const onUndo = () => {
        state.saved = previousSet;
        saveState();
        renderResources();
        updateSavedCount();
    };
    if (savedOk) {
        showToast(toastMsg, toastType, UNDO_TOAST_DURATION, { onUndo });
    }
    renderResources();
    updateSavedCount();
}

function toggleUpvote(id) {
    const resource = state.resources.find(r => Number(r.id) === Number(id));
    if (!resource) return;
    const numId = Number(id);
    const prevUpvoted = state.upvoted.has(numId);
    const previousUpvoted = new Set(state.upvoted);

    if (state.upvoted.has(numId)) {
        state.upvoted.delete(numId);
    } else {
        state.upvoted.add(numId);
    }
    const savedOk = saveState();
    const toastMsg = prevUpvoted
        ? 'Upvote removed'
        : 'Thanks for upvoting!';
    const toastType = prevUpvoted ? 'info' : 'success';
    const onUndo = () => {
        state.upvoted = previousUpvoted;
        saveState();
        renderResources();
    };
    if (savedOk) {
        showToast(toastMsg, toastType, UNDO_TOAST_DURATION, { onUndo });
    } else {
        state.upvoted = previousUpvoted;
    }
    renderResources();
}

function syncFilterControlsFromState() {
    const catChips = document.querySelectorAll('#categoryFilters .chip');
    catChips.forEach(chip => {
        const isActive = chip.dataset.filter === state.filters.category;
        chip.classList.toggle('active', isActive);
        chip.setAttribute('aria-selected', String(isActive));
    });
    const diffChips = document.querySelectorAll('#difficultyFilters .difficulty-chip');
    diffChips.forEach(chip => {
        const isActive = chip.dataset.difficulty === state.filters.difficulty;
        chip.classList.toggle('active', isActive);
        chip.setAttribute('aria-selected', String(isActive));
    });
    const sortSel = document.getElementById('sortSelect');
    if (sortSel) sortSel.value = state.filters.sort;
    const gBtn = document.getElementById('viewGrid');
    const lBtn = document.getElementById('viewList');
    if (gBtn) {
        const gActive = state.viewMode === 'grid';
        gBtn.classList.toggle('active', gActive);
        gBtn.setAttribute('aria-pressed', String(gActive));
    }
    if (lBtn) {
        const lActive = state.viewMode === 'list';
        lBtn.classList.toggle('active', lActive);
        lBtn.setAttribute('aria-pressed', String(lActive));
    }
}

function setCategoryFilter(category) {
    state.filters.category = String(category);
    syncFilterControlsFromState();
    saveState();
    syncFiltersToUrl();
    renderResources();
}

function setDifficultyFilter(difficulty) {
    state.filters.difficulty = String(difficulty);
    syncFilterControlsFromState();
    saveState();
    syncFiltersToUrl();
    renderResources();
}

function setSort(sort) {
    state.filters.sort = String(sort);
    syncFilterControlsFromState();
    saveState();
    syncFiltersToUrl();
    renderResources();
}

function setViewMode(mode) {
    state.viewMode = (mode === 'list') ? 'list' : 'grid';
    syncFilterControlsFromState();
    saveState();
    renderResources();
}

function resetFilters() {
    state.filters = { category: 'all', difficulty: 'all', search: '', sort: 'upvotes' };
    const searchInput = document.getElementById('searchInput');
    const clearBtn = document.getElementById('clearSearch');
    if (searchInput) searchInput.value = '';
    if (clearBtn) clearBtn.style.display = 'none';
    syncFilterControlsFromState();
    saveState();
    syncFiltersToUrl();
    showToast('Filters reset', 'info', 2000);
    renderResources();
}

function filterByCategory(category) {
    setCategoryFilter(String(category));
    const el = document.getElementById('resources');
    if (el && el.scrollIntoView) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

let currentModalBackdrop = null;
let previouslyFocusedElement = null;

function trapFocus(e) {
    if (!currentModalBackdrop) return;
    if (e.key !== 'Tab') return;
    const focusable = currentModalBackdrop.querySelectorAll(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
    }
}

function showSavedResources() {
    const savedNav = document.getElementById('savedNavLink');
    if (savedNav) savedNav.setAttribute('aria-expanded', 'true');
    if (state.saved.size === 0) {
        showToast('No saved resources yet! Click the bookmark icon on cards.', 'info');
        if (savedNav) savedNav.setAttribute('aria-expanded', 'false');
        return;
    }
    const savedResources = state.resources
        .filter(r => state.saved.has(Number(r.id)));
    const listHtml = savedResources.map(r => {
        const id = Number(r.id);
        const titleEsc = escapeHtml(r.title);
        const descEsc = escapeHtml(r.description);
        const linkSafe = safeUrl(r.link);
        const catClass = CATEGORY_STYLES[r.category] || '';
        const catEsc = escapeHtml(r.category);
        return `
            <div class="saved-item">
                <div class="saved-item-header">
                    <span class="category-badge ${catClass} badge-alt">${catEsc}</span>
                    <button class="save-btn saved saved-item-remove" onclick="removeSaved(${id})" aria-label="Remove ${titleEsc} from saved">
                        <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" width="14" height="14" aria-hidden="true">
                            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                        </svg>
                    </button>
                </div>
                <h4 class="saved-item-title">${titleEsc}</h4>
                <p class="saved-item-desc">${descEsc}</p>
                <a href="${linkSafe}" target="_blank" rel="noopener noreferrer" class="saved-item-open" aria-label="Open ${titleEsc} (opens in new tab)">Open Resource →</a>
            </div>
        `;
    }).join('');
    showModal(
        `My Saved Resources (${state.saved.size})`,
        listHtml
    );
}

function removeSaved(id) {
    toggleSave(id);
    setTimeout(showSavedResources, 100);
}

function showModal(title, contentHtml) {
    closeModal();
    previouslyFocusedElement = document.activeElement;

    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    backdrop.setAttribute('role', 'dialog');
    backdrop.setAttribute('aria-modal', 'true');
    backdrop.setAttribute('aria-labelledby', 'modal-title-' + Date.now());
    const titleId = backdrop.getAttribute('aria-labelledby');

    backdrop.innerHTML = `
        <div class="modal" role="document">
            <div class="modal-header">
                <h3 id="${titleId}">${escapeHtml(title)}</h3>
                <button class="modal-close" type="button" aria-label="Close dialog">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18" aria-hidden="true">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M15 9l-6 6M9 9l6 6"></path>
                    </svg>
                </button>
            </div>
            <div class="modal-body">${String(contentHtml).slice(0, 200000)}</div>
        </div>
    `;
    document.body.appendChild(backdrop);
    currentModalBackdrop = backdrop;
    const origOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    requestAnimationFrame(() => {
        backdrop.classList.add('show');
        setTimeout(() => {
            const closeBtn = backdrop.querySelector('.modal-close');
            if (closeBtn) closeBtn.focus();
        }, 30);
    });

    const closeHandler = (e) => {
        if (e.target === backdrop) closeModal();
    };
    const escHandler = (e) => {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', escHandler);
        } else {
            trapFocus(e);
        }
    };
    backdrop.addEventListener('click', closeHandler);
    document.addEventListener('keydown', escHandler);

    const closeBtn = backdrop.querySelector('.modal-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    backdrop._cleanup = () => {
        backdrop.removeEventListener('click', closeHandler);
        document.removeEventListener('keydown', escHandler);
        document.body.style.overflow = origOverflow;
    };
}

function closeModal() {
    if (!currentModalBackdrop) return;
    if (typeof currentModalBackdrop._cleanup === 'function') {
        currentModalBackdrop._cleanup();
    }
    currentModalBackdrop.classList.remove('show');
    const toRemove = currentModalBackdrop;
    currentModalBackdrop = null;
    setTimeout(() => {
        toRemove.parentNode && toRemove.parentNode.removeChild(toRemove);
        if (previouslyFocusedElement && typeof previouslyFocusedElement.focus === 'function') {
            previouslyFocusedElement.focus();
        }
        previouslyFocusedElement = null;
    }, 200);
}

function exportResources() {
    const data = {
        exportedAt: new Date().toISOString(),
        count: state.resources.length,
        resources: state.resources.map(r => ({ ...r }))
    };
    try {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const dateStr = new Date().toISOString().split('T')[0];
        a.download = `student-resource-hub-${dateStr}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        showToast('Resources exported as JSON', 'success');
    } catch (e) {
        showToast('Export failed: ' + String(e && e.message || 'unknown error'), 'error');
    }
}

function showSuggestions() {
    const suggestions = state.suggestions.slice();
    if (suggestions.length === 0) {
        showModal('Submitted Suggestions', `
            <div class="empty-state" style="text-align:center;padding:40px 20px;color:var(--text-muted);">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="56" height="56" aria-hidden="true" style="opacity:0.6;margin-bottom:16px;">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                <h4 style="font-size:18px;margin-bottom:8px;color:var(--text-primary);">No suggestions yet</h4>
                <p style="font-size:14px;">Use the "Suggest a Resource" form below to share a great free learning resource with the community.</p>
            </div>
        `);
        return;
    }
    const listHtml = suggestions.slice().reverse().map((sugg, i) => {
        const sug = suggestions[i] || {};
        const index = suggestions.length - i;
        const dateStr = (function() { try { return new Date(sug.submittedAt).toLocaleString(); } catch { return 'Unknown date'; } })();
        const titleEsc = escapeHtml(sug.title || '(untitled)');
        const descEsc = escapeHtml(sug.description || '');
        const linkSafe = safeUrl(sug.link || '#');
        const linkEsc = escapeHtml(sug.link || '');
        const catEsc = escapeHtml(sug.category || 'Uncategorized');
        const diffEsc = escapeHtml(sug.difficulty || 'Unknown');
        const typeEsc = escapeHtml(sug.type || 'Unknown');
        const submitterEsc = sug.submitterName ? escapeHtml(sug.submitterName) : '';
        const statusEsc = escapeHtml(sug.status || 'pending_review');
        return `
            <div class="suggestion-item">
                <div class="suggestions-container-header">
                    <div>
                        <span class="suggestion-status-badge">#${index} ${statusEsc}</span>
                        <span class="suggestion-date">${dateStr}</span>
                    </div>
                    <span class="suggestion-category-chip">${catEsc}</span>
                </div>
                <h4 class="suggestion-title">${titleEsc}</h4>
                <p class="suggestion-desc">${descEsc}</p>
                <div class="suggestion-meta-tags">
                    <span class="suggestion-meta-tag">${diffEsc}</span>
                    <span class="suggestion-meta-tag">${typeEsc}</span>
                    ${submitterEsc ? `<span class="suggestion-meta-tag">By: ${submitterEsc}</span>` : ''}
                </div>
                <a href="${linkSafe}" target="_blank" rel="noopener noreferrer" class="suggestion-link" aria-label="Open suggested resource ${titleEsc} (opens in new tab)">${linkEsc}</a>
            </div>
        `;
    }).join('');
    const content = `
        <div class="suggestions-container-header">
            <p style="font-size:14px;color:var(--text-secondary);margin:0;"><strong style="color:var(--text-primary);">${suggestions.length}</strong> total suggestion${suggestions.length === 1 ? '' : 's'} (stored locally)</p>
            <button class="btn btn-primary" onclick="exportSuggestionsJSON()" type="button">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14" aria-hidden="true">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Export as JSON File
            </button>
        </div>
        ${listHtml}
    `;
    showModal(`Submitted Suggestions (${suggestions.length})`, content);
}

function exportSuggestionsJSON() {
    const data = {
        exportedAt: new Date().toISOString(),
        source: 'Student Resource Hub - Suggest a Resource Form',
        storage: 'localStorage["srh_resource_suggestions"]',
        count: state.suggestions.length,
        suggestions: state.suggestions.map(s => ({ ...s }))
    };
    try {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const dateStr = new Date().toISOString().split('T')[0];
        a.download = `resource-suggestions-${dateStr}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        showToast(`${state.suggestions.length} suggestion(s) exported to JSON file`, 'success');
    } catch (e) {
        showToast('Export failed', 'error');
    }
}

function downloadCSV() {
    const headers = ['ID', 'Title', 'Category', 'Difficulty', 'Type', 'Rating', 'Upvotes', 'Free', 'Verified', 'Link', 'Description'];
    const expectedColumnCount = headers.length;
    const escape = (v) => {
        const s = String(v ?? '').replace(/"/g, '""').replace(/\r/g, '\\r').replace(/\n/g, '\\n').slice(0, 50000);
        return /[",\n\r\\]/.test(s) ? `"${s}"` : s;
    };
    try {
        const rows = state.resources.map(r => [
            r.id, r.title, r.category, r.difficulty, r.type,
            r.rating, getEffectiveUpvotes(r), r.free, r.verified, r.link, r.description
        ]);
        let invalidRowCount = 0;
        rows.forEach((row) => {
            if (row.length !== expectedColumnCount) invalidRowCount++;
        });
        if (invalidRowCount > 0) {
            if (typeof console !== 'undefined' && console.warn) {
                console.warn(`CSV export: ${invalidRowCount} row(s) had unexpected column count`);
            }
        }
        const csv = [headers, ...rows].map(row => {
            while (row.length < expectedColumnCount) row.push('');
            return row.map(escape).join(',');
        }).join('\r\n');
        const bom = '\uFEFF';
        const blob = new Blob([bom + csv], { type: 'text/csv;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const dateStr = new Date().toISOString().split('T')[0];
        a.download = `student-resources-${dateStr}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        showToast(`Resources exported as CSV (${rows.length} rows)`, 'success');
    } catch (e) {
        showToast('CSV download failed', 'error');
    }
}

const VALIDATION_MESSAGES = Object.freeze({
    title: {
        empty: 'Enter a resource title',
        short: 'Title must be at least 3 characters',
        long: 'Title cannot exceed 120 characters'
    },
    link: {
        empty: 'Enter the resource URL',
        invalid: 'Enter a valid URL starting with https:// or http://',
        noTld: 'Include a domain (e.g., example.com) with a valid ending like .com, .org, or .edu'
    },
    category: { empty: 'Choose a category' },
    difficulty: { empty: 'Choose a difficulty level' },
    type: { empty: 'Choose a resource type' },
    description: {
        empty: 'Describe what makes the resource helpful',
        short: 'Description must be at least 10 characters',
        long: 'Description cannot exceed 300 characters'
    },
    submitterName: {
        long: 'Name cannot exceed 80 characters'
    }
});

const TLD_REGEX = /\.[a-z]{2,}?$/i;

function getFieldErrorEl(fieldId) {
    return document.getElementById('err-' + fieldId);
}

function setFieldError(fieldId, message) {
    const input = document.getElementById(fieldId);
    const el = getFieldErrorEl(fieldId);
    if (input) {
        if (message) {
            input.classList.add('is-invalid');
            input.classList.remove('is-valid');
            input.setAttribute('aria-invalid', 'true');
        } else {
            input.classList.remove('is-invalid');
            input.setAttribute('aria-invalid', 'false');
            if (input.value && input.value.trim() && fieldId !== 'submitterName') {
                input.classList.add('is-valid');
            } else {
                input.classList.remove('is-valid');
            }
        }
    }
    if (el) {
        if (message) {
            const dangerIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
            el.innerHTML = dangerIcon + ' <span></span>';
            const span = el.querySelector('span');
            if (span) span.textContent = message;
            el.style.display = 'flex';
        } else {
            el.textContent = '';
            el.style.display = 'none';
        }
    }
}

function validateField(fieldId, value) {
    const trimVal = String(value == null ? '' : value);
    switch (fieldId) {
        case 'resourceTitle': {
            const t = trimVal.trim();
            if (!t) return VALIDATION_MESSAGES.title.empty;
            if (t.length < 3) return VALIDATION_MESSAGES.title.short;
            if (t.length > 120) return VALIDATION_MESSAGES.title.long;
            return '';
        }
        case 'resourceLink': {
            const l = trimVal.trim();
            if (!l) return VALIDATION_MESSAGES.link.empty;
            try {
                const u = new URL(l);
                if (u.protocol !== 'http:' && u.protocol !== 'https:') throw new Error('bad protocol');
                const hostname = String(u.hostname || '');
                if (!hostname || !TLD_REGEX.test(hostname) || hostname.length < 4 || hostname.indexOf('.') === -1) {
                    return VALIDATION_MESSAGES.link.noTld;
                }
                return '';
            } catch (e) {
                return VALIDATION_MESSAGES.link.invalid;
            }
        }
        case 'resourceCategory':
            return trimVal ? '' : VALIDATION_MESSAGES.category.empty;
        case 'resourceDifficulty':
            return trimVal ? '' : VALIDATION_MESSAGES.difficulty.empty;
        case 'resourceType':
            return trimVal ? '' : VALIDATION_MESSAGES.type.empty;
        case 'resourceDescription': {
            const d = trimVal.trim();
            if (!d) return VALIDATION_MESSAGES.description.empty;
            if (d.length < 10) return VALIDATION_MESSAGES.description.short;
            if (d.length > 300) return VALIDATION_MESSAGES.description.long;
            return '';
        }
        case 'yourName':
            return trimVal.length > 80 ? VALIDATION_MESSAGES.submitterName.long : '';
        default:
            return '';
    }
}

function validateAllFieldsAndPopulate(data) {
    const fieldToId = {
        title: 'resourceTitle',
        link: 'resourceLink',
        category: 'resourceCategory',
        difficulty: 'resourceDifficulty',
        type: 'resourceType',
        description: 'resourceDescription',
        submitterName: 'yourName'
    };
    const dataMap = {
        resourceTitle: data.title,
        resourceLink: data.link,
        resourceCategory: data.category,
        resourceDifficulty: data.difficulty,
        resourceType: data.type,
        resourceDescription: data.description,
        yourName: data.submitterName
    };
    const ids = ['resourceTitle', 'resourceLink', 'resourceCategory', 'resourceDifficulty', 'resourceType', 'resourceDescription', 'yourName'];
    let firstInvalidId = null;
    let errorCount = 0;
    ids.forEach(id => {
        const msg = validateField(id, dataMap[id]);
        setFieldError(id, msg);
        if (msg && !firstInvalidId) firstInvalidId = id;
        if (msg) errorCount++;
    });
    return { firstInvalidId, errorCount, fieldToId };
}

function handleFieldBlur(e) {
    const id = e.target && e.target.id;
    if (!id) return;
    const msg = validateField(id, e.target.value);
    setFieldError(id, msg);
}

function setupFormLiveValidation() {
    const form = document.getElementById('suggestForm');
    if (!form) return;
    const ids = ['resourceTitle', 'resourceLink', 'resourceCategory', 'resourceDifficulty', 'resourceType', 'resourceDescription', 'yourName'];
    ids.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.addEventListener('blur', handleFieldBlur);
        el.addEventListener('input', (e) => {
            if (el.classList.contains('is-invalid')) {
                const msg = validateField(id, e.target.value);
                setFieldError(id, msg);
            }
            setFormDirty(Array.from(form.querySelectorAll('input, select, textarea')).some(f => {
                if (f.type && (f.type === 'hidden' || f.type === 'submit')) return false;
                if (f.tagName === 'SELECT') return f.value !== '';
                const trimmed = String(f.value || '').trim();
                if (f.id === 'yourName') return trimmed.length > 0;
                return trimmed.length > 0;
            }));
        });
    });
    const desc = document.getElementById('resourceDescription');
    const cc = document.getElementById('charCount');
    if (desc && cc) {
        const updateCount = () => {
            const len = String(desc.value || '').length;
            cc.textContent = len + '/300';
            if (len > 280) { cc.style.color = 'var(--warning)'; }
            else if (len > 295) { cc.style.color = 'var(--danger)'; }
            else { cc.style.color = ''; }
        };
        desc.addEventListener('input', updateCount);
        updateCount();
    }
    form.addEventListener('reset', () => {
        ids.forEach(id => setFieldError(id, ''));
        setFormDirty(false);
        setTimeout(() => {
            const ccEl = document.getElementById('charCount');
            if (ccEl) ccEl.textContent = '0/300';
        }, 0);
    });
}

function validateSuggestionData(data) {
    const errors = [];
    if (!data.title || String(data.title).trim().length < 3) {
        errors.push({ field: 'title', message: VALIDATION_MESSAGES.title.short });
    }
    if (!data.link) {
        errors.push({ field: 'link', message: VALIDATION_MESSAGES.link.empty });
    } else {
        try {
            const u = new URL(data.link);
            if (u.protocol !== 'http:' && u.protocol !== 'https:') throw new Error('bad protocol');
            const hostname = String(u.hostname || '');
            if (!hostname || !TLD_REGEX.test(hostname) || hostname.length < 4) {
                errors.push({ field: 'link', message: VALIDATION_MESSAGES.link.noTld });
            }
        } catch {
            errors.push({ field: 'link', message: VALIDATION_MESSAGES.link.invalid });
        }
    }
    if (!data.category) errors.push({ field: 'category', message: VALIDATION_MESSAGES.category.empty });
    if (!data.difficulty) errors.push({ field: 'difficulty', message: VALIDATION_MESSAGES.difficulty.empty });
    if (!data.type) errors.push({ field: 'type', message: VALIDATION_MESSAGES.type.empty });
    if (!data.description || String(data.description).trim().length < 10) {
        errors.push({ field: 'description', message: VALIDATION_MESSAGES.description.short });
    }
    return errors;
}

function animateFormInvalid(formEl) {
    if (!formEl) return;
    try {
        formEl.classList.remove('shake-invalid');
        void formEl.offsetWidth;
        formEl.classList.add('shake-invalid');
        setTimeout(() => formEl.classList.remove('shake-invalid'), 400);
    } catch (e) {}
}

function handleFormSubmit(e) {
    e.preventDefault();
    const form = e.target;
    if (!(form instanceof HTMLFormElement)) return;
    const formData = new FormData(form);
    const raw = Object.fromEntries(formData.entries());

    const data = {
        title: String(raw.title || '').trim().slice(0, 120),
        link: String(raw.link || '').trim().slice(0, 500),
        category: String(raw.category || '').trim(),
        difficulty: String(raw.difficulty || '').trim(),
        type: String(raw.type || '').trim(),
        description: String(raw.description || '').trim().slice(0, 300),
        submitterName: String(raw.submitterName || '').trim().slice(0, 80)
    };

    const fieldErrors = validateAllFieldsAndPopulate(data);
    const errors = validateSuggestionData(data);
    if (fieldErrors.errorCount > 0 || errors.length > 0) {
        if (fieldErrors.firstInvalidId) {
            try {
                const el = document.getElementById(fieldErrors.firstInvalidId);
                if (el && typeof el.focus === 'function') {
                    el.focus({ preventScroll: false });
                }
            } catch (err) {}
        }
        animateFormInvalid(form);
        const firstMsg = (errors[0] && errors[0].message) || 'Please fix the highlighted fields';
        showToast(firstMsg, 'error', 4200);
        return;
    }

    const suggestion = Object.freeze({
        id: Date.now(),
        submittedAt: new Date().toISOString(),
        status: 'pending_review',
        ...data
    });

    const prevSuggestions = state.suggestions.slice();
    state.suggestions.push(suggestion);
    const savedOk = saveState();
    if (!savedOk) {
        state.suggestions = prevSuggestions;
        showToast('Could not save your suggestion because storage is full. Remove some saved items and try again.', 'error', 6000);
        return;
    }

    const formSuccess = document.getElementById('formSuccess');
    if (formSuccess) formSuccess.style.display = 'flex';
    form.reset();
    const charCount = document.getElementById('charCount');
    if (charCount) charCount.textContent = '0/300';
    setFormDirty(false);
    const btn = document.getElementById('submitBtn');
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="18" height="18" aria-hidden="true">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span class="btn-text">Submitted!</span>
        `;
        setTimeout(() => {
            if (formSuccess) formSuccess.style.display = 'none';
            btn.disabled = false;
            btn.innerHTML = `
                <span class="btn-text">Submit Suggestion</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18" aria-hidden="true">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
            `;
        }, 4000);
    }

    if (typeof console !== 'undefined' && console.log) {
        console.log('Resource suggestion saved to localStorage:', suggestion);
    }
}

function handleLogoAction() {
    resetFilters();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

let debouncedSearchUpdate = debounce(() => {
    renderResources();
}, DEBOUNCE_DELAY);

function syncFiltersToUrl() {
    if (!window.history || typeof window.history.replaceState !== 'function') return;
    try {
        const params = new URLSearchParams();
        if (state.filters.search) params.set('q', String(state.filters.search).slice(0, 200));
        if (state.filters.category && state.filters.category !== 'all') params.set('category', state.filters.category);
        if (state.filters.difficulty && state.filters.difficulty !== 'all') params.set('difficulty', state.filters.difficulty);
        if (state.filters.sort && state.filters.sort !== 'upvotes') params.set('sort', state.filters.sort);
        const newQuery = params.toString();
        const newUrl = newQuery
            ? window.location.pathname + '?' + newQuery + window.location.hash
            : window.location.pathname + window.location.hash;
        window.history.replaceState({}, document.title, newUrl);
    } catch (e) {}
}

function parseUrlQueryParams() {
    try {
        const params = new URLSearchParams(window.location.search);
        const q = params.get('q');
        if (q && typeof q === 'string') {
            state.filters.search = String(q).slice(0, 200);
        }
        const cat = params.get('category');
        if (typeof cat === 'string' && DEFAULT_DATA.resources.some(r => r.category === cat)) {
            state.filters.category = cat;
        }
        const diff = params.get('difficulty');
        if (typeof diff === 'string' && /^beginner|intermediate|advanced$/i.test(diff)) {
            state.filters.difficulty = String(diff).toLowerCase();
        }
        const sort = params.get('sort');
        if (typeof sort === 'string' && /^rating|title|upvotes$/i.test(sort)) {
            state.filters.sort = String(sort).toLowerCase();
        }
        const searchInput = document.getElementById('searchInput');
        const clearBtn = document.getElementById('clearSearch');
        if (searchInput) searchInput.value = state.filters.search;
        if (clearBtn) clearBtn.style.display = state.filters.search ? 'flex' : 'none';
    } catch {
    }
}

function setupOnlineOfflineDetection() {
    const banner = document.getElementById('offlineBanner');
    const retryBtn = document.getElementById('offlineRetry');
    const updateOnlineUI = () => {
        const online = typeof navigator.onLine === 'boolean' ? navigator.onLine : true;
        if (banner) {
            banner.classList.toggle('visible', !online);
            banner.setAttribute('aria-hidden', String(online));
        }
        document.body.classList.toggle('offline-active', !online);
    };
    window.addEventListener('online', () => {
        updateOnlineUI();
        showToast('Connection restored. Content is up to date.', 'success', 2500);
    });
    window.addEventListener('offline', () => {
        updateOnlineUI();
        showToast('You are offline. Some features may be unavailable.', 'warning', 4200);
    });
    if (retryBtn) {
        retryBtn.addEventListener('click', () => {
            if (navigator.onLine) {
                updateOnlineUI();
                showToast('Connection restored.', 'success', 2500);
            } else {
                showToast('Still offline. Check your internet connection and try again.', 'warning', 3200);
            }
        });
    }
    updateOnlineUI();
}

function setupSWUpdateBanner() {
    const banner = document.getElementById('swUpdateBanner');
    const refreshBtn = document.getElementById('swRefreshBtn');
    const closeBtn = document.getElementById('swCloseBtn');
    if (!banner) return;
    const showBanner = () => banner.classList.add('visible');
    const hideBanner = () => banner.classList.remove('visible');
    refreshBtn && refreshBtn.addEventListener('click', () => {
        if ('serviceWorker' in navigator) {
            try {
                navigator.serviceWorker.getRegistration().then(reg => {
                    if (reg && reg.waiting) {
                        reg.waiting.postMessage({ type: 'SKIP_WAITING' });
                    }
                    setTimeout(() => { window.location.reload(); }, 150);
                }).catch(() => { window.location.reload(); });
            } catch (e) { window.location.reload(); }
        } else {
            window.location.reload();
        }
    });
    closeBtn && closeBtn.addEventListener('click', hideBanner);
    if ('serviceWorker' in navigator) {
        const register = () => {
            navigator.serviceWorker.register('sw.js').then(reg => {
                if (reg.waiting) { showBanner(); }
                reg.addEventListener('updatefound', () => {
                    const newSW = reg.installing;
                    if (newSW) {
                        newSW.addEventListener('statechange', () => {
                            if (newSW.state === 'installed' && navigator.serviceWorker.controller) {
                                showBanner();
                            }
                        });
                    }
                });
            }).catch(() => {});
        };
        if (document.readyState === 'complete') {
            register();
        } else {
            window.addEventListener('load', register, { once: true });
        }
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (!sessionStorage.getItem('srh_sw_reloaded')) {
                try { sessionStorage.setItem('srh_sw_reloaded', '1'); } catch (e) {}
                hideBanner();
            }
        });
    }
}

function registerServiceWorker() {
    setupSWUpdateBanner();
}

function setupEventListeners() {
    const searchInput = document.getElementById('searchInput');
    const clearSearch = document.getElementById('clearSearch');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const val = String(e.target.value || '');
            state.filters.search = val.slice(0, 200);
            if (clearSearch) clearSearch.style.display = val ? 'flex' : 'none';
            debouncedSearchUpdate();
        });
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && searchInput.value) {
                searchInput.value = '';
                state.filters.search = '';
                if (clearSearch) clearSearch.style.display = 'none';
                renderResources();
                searchInput.blur();
            }
        });
    }
    if (clearSearch) {
        clearSearch.addEventListener('click', () => {
            state.filters.search = '';
            if (searchInput) searchInput.value = '';
            clearSearch.style.display = 'none';
            renderResources();
            if (searchInput) searchInput.focus();
        });
    }

    const categoryFilters = document.getElementById('categoryFilters');
    if (categoryFilters) {
        categoryFilters.addEventListener('click', (e) => {
            const chip = e.target.closest('.chip');
            if (chip) setCategoryFilter(String(chip.dataset.filter || 'all'));
        });
    }

    const difficultyFilters = document.getElementById('difficultyFilters');
    if (difficultyFilters) {
        difficultyFilters.addEventListener('click', (e) => {
            const chip = e.target.closest('.difficulty-chip');
            if (chip) setDifficultyFilter(String(chip.dataset.difficulty || 'all'));
        });
    }

    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => setSort(String(e.target.value || 'upvotes')));
    }

    const viewGrid = document.getElementById('viewGrid');
    const viewList = document.getElementById('viewList');
    if (viewGrid) viewGrid.addEventListener('click', () => setViewMode('grid'));
    if (viewList) viewList.addEventListener('click', () => setViewMode('list'));

    const resetFiltersBtn = document.getElementById('resetFiltersBtn');
    if (resetFiltersBtn) resetFiltersBtn.addEventListener('click', resetFilters);

    const savedNavLink = document.getElementById('savedNavLink');
    if (savedNavLink) {
        savedNavLink.addEventListener('click', (e) => {
            e.preventDefault();
            showSavedResources();
        });
    }

    const resourcesGrid = document.getElementById('resourcesGrid');
    if (resourcesGrid) {
        resourcesGrid.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-action]');
            if (!btn) return;
            const id = Number(btn.dataset.id);
            if (!Number.isInteger(id)) return;
            if (btn.dataset.action === 'save') toggleSave(id);
            else if (btn.dataset.action === 'upvote') toggleUpvote(id);
        });
    }

    const desc = document.getElementById('resourceDescription');
    const countEl = document.getElementById('charCount');
    if (desc && countEl) {
        desc.addEventListener('input', () => {
            const len = String(desc.value || '').length;
            countEl.textContent = `${len}/300`;
            if (len > 270) {
                countEl.style.color = 'var(--warning)';
            } else if (len >= 300) {
                countEl.style.color = 'var(--danger)';
            } else {
                countEl.style.color = '';
            }
        });
    }

    const suggestForm = document.getElementById('suggestForm');
    if (suggestForm) suggestForm.addEventListener('submit', handleFormSubmit);

    const logoEl = document.querySelector('.logo');
    if (logoEl) {
        logoEl.addEventListener('click', handleLogoAction);
        logoEl.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleLogoAction();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === '/' && document.activeElement &&
            document.activeElement.tagName !== 'INPUT' &&
            document.activeElement.tagName !== 'TEXTAREA' &&
            document.activeElement.tagName !== 'SELECT') {
            e.preventDefault();
            if (searchInput) searchInput.focus();
        }
    });
}

function applySavedViewMode() {
    const vm = storage.get(STATE_KEYS.VIEW, 'grid');
    state.viewMode = (vm === 'list' || vm === 'grid') ? vm : 'grid';
    const gBtn = document.getElementById('viewGrid');
    const lBtn = document.getElementById('viewList');
    if (gBtn) {
        const gActive = state.viewMode === 'grid';
        gBtn.classList.toggle('active', gActive);
        gBtn.setAttribute('aria-pressed', String(gActive));
    }
    if (lBtn) {
        const lActive = state.viewMode === 'list';
        lBtn.classList.toggle('active', lActive);
        lBtn.setAttribute('aria-pressed', String(lActive));
    }
}

async function init() {
    try {
        initState();
        renderSkeletons();
        parseUrlQueryParams();
        applySavedViewMode();
        setupEventListeners();
        state.resources = await loadResources();
        requestAnimationFrame(() => {
            try {
                renderResources();
            } catch (rafErr) {
                const ce = document.getElementById('resultCount');
                if (ce) ce.textContent = 'Failed to render resources. Please refresh.';
                if (typeof console !== 'undefined' && console.error) {
                    console.error('Render failed inside rAF:', rafErr);
                }
            }
        });
        registerServiceWorker();
    } catch (err) {
        const grid = document.getElementById('resultCount');
        if (grid) grid.textContent = 'Failed to load resources. Please refresh.';
        if (typeof console !== 'undefined' && console.error) {
            console.error('Initialization failed:', err);
        }
    }
}

if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
        init();
    }
}
