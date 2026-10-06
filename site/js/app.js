document.addEventListener('DOMContentLoaded', () => {
    const TOPICS = {
        stepik: {
            id: 'stepik', name: 'Stepik: Основы C++', icon: '🎓', tier: 0,
            cf: 'Базовый курс', usaco: '—',
            description: 'Переменные, циклы, массивы, функции. Бесплатный курс.',
            url: 'https://stepik.org/course/363/promo',
            requires: [], x: 600, y: 80
        },
        // === EASY (tier 1) ===
        sort: {
            id: 'sort', name: 'Сортировка (STL)', icon: '📶', tier: 1,
            cf: 'CF 800+', usaco: 'Bronze: Sorting',
            description: 'sort(), компараторы, stable_sort. Первый шаг в алгоритмах.',
            requires: ['stepik'], x: 250, y: 220
        },
        brute: {
            id: 'brute', name: 'Полный перебор', icon: '🔄', tier: 1,
            cf: 'CF 800+', usaco: 'Bronze: Complete Search',
            description: 'Перебор всех вариантов. Бинарные строки, маски, подмножества.',
            requires: ['stepik'], x: 550, y: 220
        },
        freq: {
            id: 'freq', name: 'Частотные массивы', icon: '📊', tier: 1,
            cf: 'CF 800+', usaco: 'Bronze/Silver',
            description: 'Подсчёт частот элементов. Основа для многих алгоритмов.',
            requires: ['stepik'], x: 800, y: 220
        },
        mod_arith: {
            id: 'mod_arith', name: 'Модульная арифметика', icon: '🔢', tier: 1,
            cf: 'CF 1000+', usaco: 'Gold: Modular Arithmetic',
            description: 'Операции по модулю, свойства остатков, переполнение.',
            requires: ['stepik'], x: 1050, y: 220
        },
        prefix: {
            id: 'prefix', name: 'Префиксные суммы', icon: '➕', tier: 1,
            cf: 'CF 900+', usaco: 'Silver: Prefix Sums',
            description: 'Сумма на отрезке за O(1). Основа для многих техник.',
            requires: ['sort'], x: 150, y: 350
        },
        two_p: {
            id: 'two_p', name: 'Два указателя', icon: '👆', tier: 1,
            cf: 'CF 1000+', usaco: 'Silver: Two Pointers',
            description: 'Скользящее окно и указатели навстречу. O(N) вместо O(N²).',
            requires: ['sort'], x: 350, y: 350
        },
        greedy: {
            id: 'greedy', name: 'Базовая жадность', icon: '🤑', tier: 1,
            cf: 'CF 1000+', usaco: 'Bronze: Greedy',
            description: 'Локально оптимальный выбор. Сортировка + выбор лучшего.',
            requires: ['sort'], x: 250, y: 480
        },
        basic_dp: {
            id: 'basic_dp', name: 'Базовая динамика', icon: '🧠', tier: 1,
            cf: 'CF 1100+', usaco: 'Silver/Gold: Intro to DP',
            description: 'Кузнечик, лесенки, числа Фибоначчи. Мемоизация.',
            requires: ['brute'], x: 600, y: 350
        },
        // === MEDIUM (tier 2) ===
        bsearch: {
            id: 'bsearch', name: 'Бинарный поиск', icon: '🔍', tier: 2,
            cf: 'CF 1200+', usaco: 'Silver: Binary Search',
            description: 'Поиск в отсортированном массиве за O(log N). lower_bound, upper_bound.',
            requires: ['sort'], x: 80, y: 480
        },
        bsearch_ans: {
            id: 'bsearch_ans', name: 'Бинпоиск по ответу', icon: '🎯', tier: 2,
            cf: 'CF 1300+', usaco: 'Silver: BS on Answer',
            description: 'Бинарный поиск оптимального ответа. Проверка монотонности.',
            requires: ['bsearch', 'prefix', 'greedy'], x: 150, y: 620
        },
        gcd: {
            id: 'gcd', name: 'Евклид (НОД/НОК)', icon: '♻️', tier: 2,
            cf: 'CF 1200+', usaco: 'Gold: Divisibility',
            description: 'Алгоритм Евклида, НОД, НОК, делимость.',
            requires: ['mod_arith'], x: 950, y: 350
        },
        sieve: {
            id: 'sieve', name: 'Решето Эратосфена', icon: '🔬', tier: 2,
            cf: 'CF 1200+', usaco: 'Gold: Divisibility',
            description: 'Нахождение всех простых чисел до N за O(N log log N).',
            requires: ['freq'], x: 800, y: 350
        },
        fastpow: {
            id: 'fastpow', name: 'Быстрое возведение', icon: '⚡', tier: 2,
            cf: 'CF 1300+', usaco: 'Gold: Modular Arithmetic',
            description: 'Возведение в степень за O(log N). Основа для модульной арифметики.',
            requires: ['mod_arith'], x: 1150, y: 350
        },
        dfs: {
            id: 'dfs', name: 'DFS', icon: '🕸️', tier: 2,
            cf: 'CF 1300+', usaco: 'Silver: Graph Traversal',
            description: 'Поиск в глубину. Обход графа, компоненты связности.',
            requires: ['brute'], x: 500, y: 480
        },
        bfs: {
            id: 'bfs', name: 'BFS', icon: '🌊', tier: 2,
            cf: 'CF 1300+', usaco: 'Silver: Graph Traversal',
            description: 'Поиск в ширину. Кратчайший путь в невзвешенном графе.',
            requires: ['dfs'], x: 400, y: 620
        },
        diff: {
            id: 'diff', name: 'Разностный массив', icon: '📉', tier: 2,
            cf: 'CF 1300+', usaco: 'Silver: Difference Array',
            description: 'Массовое прибавление на отрезке за O(1). Обратная операция к преф. суммам.',
            requires: ['prefix'], x: 80, y: 760
        },
        compress: {
            id: 'compress', name: 'Сжатие координат', icon: '📐', tier: 2,
            cf: 'CF 1400+', usaco: 'Silver: Coordinate Compression',
            description: 'Замена больших координат на маленькие индексы.',
            requires: ['sort', 'bsearch'], x: 80, y: 620
        },
        hash_str: {
            id: 'hash_str', name: 'Полином. хеширование', icon: '#️⃣', tier: 2,
            cf: 'CF 1400+', usaco: 'Gold: String Hashing',
            description: 'Хеширование строк для быстрого сравнения подстрок.',
            requires: ['mod_arith'], x: 1050, y: 480
        },
        mid_dp: {
            id: 'mid_dp', name: 'ДП: Рюкзак, НВП, НОП', icon: '💎', tier: 2,
            cf: 'CF 1400+', usaco: 'Gold: Knapsack',
            description: 'Классические задачи ДП. Рюкзак, наибольшая возрастающая/общая подпоследовательность.',
            requires: ['basic_dp'], x: 700, y: 480
        },
        modinv: {
            id: 'modinv', name: 'Обратный по модулю', icon: '🔄', tier: 2,
            cf: 'CF 1500+', usaco: 'Gold: Modular Arithmetic',
            description: 'Обратный элемент. Теорема Ферма. Комбинаторика по модулю.',
            requires: ['fastpow'], x: 1150, y: 480
        },
        // === HARD (tier 3) ===
        dsu: {
            id: 'dsu', name: 'СНМ (DSU)', icon: '🔗', tier: 3,
            cf: 'CF 1500+', usaco: 'Gold: DSU',
            description: 'Система непересекающихся множеств. Сжатие путей, ранговая эвристика.',
            requires: ['dfs'], x: 400, y: 760
        },
        topsort: {
            id: 'topsort', name: 'Топ. сортировка', icon: '📋', tier: 3,
            cf: 'CF 1500+', usaco: 'Gold: Topological Sort',
            description: 'Линейный порядок вершин DAG. Проверка ацикличности.',
            requires: ['dfs'], x: 550, y: 620
        },
        segtree: {
            id: 'segtree', name: 'Дерево отрезков', icon: '🌲', tier: 3,
            cf: 'CF 1600+', usaco: 'Gold/Platinum',
            description: 'Запросы на отрезке и обновление за O(log N). Lazy propagation.',
            requires: ['prefix', 'diff'], x: 80, y: 900
        },
        bit: {
            id: 'bit', name: 'Дерево Фенвика', icon: '🌿', tier: 3,
            cf: 'CF 1600+', usaco: 'Gold: PURS',
            description: 'Компактная структура для преф. сумм с обновлением за O(log N).',
            requires: ['prefix'], x: 250, y: 760
        },
        dijkstra: {
            id: 'dijkstra', name: 'Дейкстра', icon: '🛤️', tier: 3,
            cf: 'CF 1600+', usaco: 'Gold: Shortest Paths',
            description: 'Кратчайшие пути во взвешенном графе. Priority queue.',
            requires: ['bfs', 'greedy'], x: 350, y: 900
        },
        sweep: {
            id: 'sweep', name: 'Сканирующая прямая', icon: '📏', tier: 3,
            cf: 'CF 1600+', usaco: 'Silver/Gold: Line Sweep',
            description: 'Обработка событий слева направо. Геометрические задачи.',
            requires: ['sort'], x: 250, y: 900
        },
        ternary: {
            id: 'ternary', name: 'Тернарный поиск', icon: '🔺', tier: 3,
            cf: 'CF 1600+', usaco: '⚠️ Редко',
            description: 'Поиск экстремума унимодальной функции.',
            requires: ['bsearch'], x: 150, y: 900
        },
        mst: {
            id: 'mst', name: 'МОД (Крускал/Прим)', icon: '🌉', tier: 3,
            cf: 'CF 1600+', usaco: 'Gold: MST',
            description: 'Минимальное остовное дерево. Алгоритмы Крускала и Прима.',
            requires: ['dsu', 'greedy'], x: 450, y: 900
        },
        kmp: {
            id: 'kmp', name: 'КМП (префикс-функция)', icon: '🔤', tier: 3,
            cf: 'CF 1700+', usaco: 'Platinum: String Matching',
            description: 'Поиск подстроки за O(N+M). Префикс-функция.',
            requires: ['hash_str'], x: 1050, y: 620
        },
        trie: {
            id: 'trie', name: 'Бор (Trie)', icon: '🌳', tier: 3,
            cf: 'CF 1700+', usaco: 'Platinum: Tries',
            description: 'Дерево строк. Быстрый поиск по префиксу. XOR задачи.',
            requires: ['dfs'], x: 600, y: 760
        },
        bitmask_dp: {
            id: 'bitmask_dp', name: 'ДП по маскам', icon: '🎭', tier: 3,
            cf: 'CF 1700+', usaco: 'Gold: Bitmask DP',
            description: 'Динамика по подмножествам. Маски битов. O(2^n * n).',
            requires: ['mid_dp'], x: 800, y: 620
        },
        tree_dp: {
            id: 'tree_dp', name: 'ДП на деревьях', icon: '🏔️', tier: 3,
            cf: 'CF 1700+', usaco: 'Gold: DP on Trees',
            description: 'Динамика с обходом дерева. Rerooting technique.',
            requires: ['dfs', 'mid_dp'], x: 750, y: 760
        },
        sparse: {
            id: 'sparse', name: 'Sparse Table', icon: '📊', tier: 3,
            cf: 'CF 1700+', usaco: 'Platinum: Range Queries',
            description: 'Ответ на min/max запрос на отрезке за O(1). Предподсчёт O(N log N).',
            requires: ['bit'], x: 250, y: 1020
        },
        lca: {
            id: 'lca', name: 'LCA', icon: '👑', tier: 3,
            cf: 'CF 1800+', usaco: 'Platinum: Binary Jumping',
            description: 'Наименьший общий предок. Binary lifting. Euler tour.',
            requires: ['dfs', 'sparse'], x: 400, y: 1020
        }
    };

    // --- State ---
    let completedTopics = JSON.parse(localStorage.getItem('cp_roadmap_progress') || '[]');
    let activeTopicId = null;

    // --- DOM Elements ---
    const nodesContainer = document.getElementById('nodes-container');
    const treeSvg = document.getElementById('tree-svg');
    const wrapper = document.getElementById('tree-wrapper');
    const container = document.getElementById('tree-container');
    
    const modal = document.getElementById('node-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const overlay = document.getElementById('close-modal-overlay');
    
    // Controls
    document.getElementById('btn-start').addEventListener('click', () => {
        document.getElementById('skill-tree-section').scrollIntoView({ behavior: 'smooth' });
    });
    
    document.getElementById('btn-reset-progress').addEventListener('click', () => {
        if (confirm('Вы уверены, что хотите сбросить весь прогресс?')) {
            completedTopics = [];
            saveProgress();
            renderTree();
        }
    });

    document.getElementById('btn-reset-view').addEventListener('click', () => {
        resetView();
    });

    // --- Pan & Zoom ---
    let scale = 1;
    let translateX = 0;
    let translateY = 0;
    let isDragging = false;
    let startX, startY;

    function resetView() {
        const rect = wrapper.getBoundingClientRect();
        scale = 1;
        // Center Stepik (x=600) horizontally, put it near top
        translateX = (rect.width / 2) - 600;
        translateY = 50;
        updateTransform();
    }

    function updateTransform() {
        container.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    }

    wrapper.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return; // Only left click
        isDragging = true;
        startX = e.clientX - translateX;
        startY = e.clientY - translateY;
        wrapper.style.cursor = 'grabbing';
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        translateX = e.clientX - startX;
        translateY = e.clientY - startY;
        updateTransform();
    });

    window.addEventListener('mouseup', () => {
        isDragging = false;
        wrapper.style.cursor = 'grab';
    });

    wrapper.addEventListener('wheel', (e) => {
        e.preventDefault();
        const zoomSensitivity = 0.001;
        const delta = -e.deltaY * zoomSensitivity;
        
        const newScale = Math.min(Math.max(0.3, scale + delta), 2);
        
        // Zoom towards mouse pointer
        const rect = wrapper.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        translateX = mouseX - (mouseX - translateX) * (newScale / scale);
        translateY = mouseY - (mouseY - translateY) * (newScale / scale);
        scale = newScale;
        
        updateTransform();
    }, { passive: false });

    // --- Logic ---
    function saveProgress() {
        localStorage.setItem('cp_roadmap_progress', JSON.stringify(completedTopics));
    }

    function checkPrerequisites(topic) {
        return topic.requires.every(reqId => completedTopics.includes(reqId));
    }

    function renderTree() {
        nodesContainer.innerHTML = '';
        treeSvg.innerHTML = '';

        const topicsArray = Object.values(TOPICS);

        // Draw Edges First (so they appear under nodes)
        topicsArray.forEach(topic => {
            topic.requires.forEach(reqId => {
                const reqTopic = TOPICS[reqId];
                if (reqTopic) {
                    const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                    
                    const startX = reqTopic.x;
                    const startY = reqTopic.y + 30; // bottom of parent
                    const endX = topic.x;
                    const endY = topic.y - 30; // top of child
                    
                    // Curvy line
                    const d = `M ${startX} ${startY} C ${startX} ${startY + 40}, ${endX} ${endY - 40}, ${endX} ${endY}`;
                    line.setAttribute('d', d);
                    line.setAttribute('class', `edge from-${reqId} to-${topic.id}`);
                    
                    if (completedTopics.includes(reqId)) {
                        line.classList.add('active');
                    }
                    
                    treeSvg.appendChild(line);
                }
            });
        });

        // Draw Nodes
        topicsArray.forEach(topic => {
            const isCompleted = completedTopics.includes(topic.id);
            const isAvailable = checkPrerequisites(topic);

            const el = document.createElement('div');
            el.className = `node tier-${topic.tier}`;
            
            if (isCompleted) el.classList.add('completed');
            else if (isAvailable) el.classList.add('available');
            else el.classList.add('locked');

            el.style.left = `${topic.x}px`;
            el.style.top = `${topic.y}px`;
            
            el.innerHTML = `
                <div class="node-check">✓</div>
                <div class="node-lock">🔒</div>
                <div class="node-icon">${topic.icon}</div>
                <div class="node-name">${topic.name}</div>
            `;
            
            el.addEventListener('click', (e) => {
                e.stopPropagation(); // prevent dragging click
                openModal(topic, isCompleted, isAvailable);
            });
            
            nodesContainer.appendChild(el);
        });
    }

    // --- Modal Logic ---
    function openModal(topic, isCompleted, isAvailable) {
        activeTopicId = topic.id;
        
        document.getElementById('modal-icon').textContent = topic.icon;
        document.getElementById('modal-title').textContent = topic.name;
        document.getElementById('modal-cf').textContent = topic.cf;
        document.getElementById('modal-usaco').textContent = topic.usaco;
        document.getElementById('modal-desc').textContent = topic.description;
        
        const btnLink = document.getElementById('btn-stepik-link');
        if (topic.url) {
            btnLink.href = topic.url;
            btnLink.classList.remove('hidden');
        } else {
            btnLink.classList.add('hidden');
        }

        // Render Prereqs
        const prereqsDiv = document.getElementById('modal-prereqs');
        prereqsDiv.innerHTML = '';
        if (topic.requires.length === 0) {
            prereqsDiv.innerHTML = '<span class="prereq-tag ok">Нет пререквизитов</span>';
        } else {
            topic.requires.forEach(reqId => {
                const reqTopic = TOPICS[reqId];
                const done = completedTopics.includes(reqId);
                prereqsDiv.innerHTML += `<span class="prereq-tag ${done ? 'ok' : 'missing'}">
                    ${done ? '✅' : '❌'} ${reqTopic.name}
                </span>`;
            });
        }

        // Status & Button
        const statusBox = document.getElementById('modal-status-box');
        const statusText = document.getElementById('modal-status-text');
        const btnComplete = document.getElementById('btn-toggle-complete');
        
        statusBox.className = 'status-box'; // reset
        
        if (isCompleted) {
            statusBox.classList.add('completed');
            statusText.textContent = '✅ Пройдено';
            btnComplete.textContent = 'Отменить прохождение';
            btnComplete.className = 'btn-complete undo';
            btnComplete.disabled = false;
        } else if (isAvailable) {
            statusBox.classList.add('available');
            statusText.textContent = '🚀 Доступно для изучения';
            btnComplete.textContent = 'Отметить как пройденное';
            btnComplete.className = 'btn-complete';
            btnComplete.disabled = false;
        } else {
            statusBox.classList.add('locked');
            statusText.textContent = '🔒 Заблокировано (необходимы пререквизиты)';
            btnComplete.textContent = 'Недоступно';
            btnComplete.className = 'btn-complete';
            btnComplete.disabled = true;
        }

        modal.classList.remove('hidden');
    }

    document.getElementById('btn-toggle-complete').addEventListener('click', () => {
        if (!activeTopicId) return;
        
        if (completedTopics.includes(activeTopicId)) {
            // Remove
            completedTopics = completedTopics.filter(id => id !== activeTopicId);
        } else {
            // Add
            completedTopics.push(activeTopicId);
        }
        
        saveProgress();
        renderTree();
        
        // Update modal state without closing
        const topic = TOPICS[activeTopicId];
        const isCompleted = completedTopics.includes(topic.id);
        const isAvailable = checkPrerequisites(topic);
        openModal(topic, isCompleted, isAvailable);
    });

    closeModalBtn.addEventListener('click', () => modal.classList.add('hidden'));
    overlay.addEventListener('click', () => modal.classList.add('hidden'));

    // Initialize
    resetView();
    renderTree();
});
