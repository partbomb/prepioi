document.addEventListener('DOMContentLoaded', async () => {
    // --- Elements ---
    const btnStart = document.getElementById('btn-start');
    const treeSection = document.getElementById('skill-tree-section');
    const nodesContainer = document.getElementById('nodes-container');
    const treeSvg = document.getElementById('tree-svg');
    const modal = document.getElementById('lesson-modal');
    const modalOverlay = document.getElementById('modal-overlay');
    const closeModalBtn = document.getElementById('close-modal');
    
    // Stats elements
    const levelIcon = document.getElementById('level-icon');
    const levelName = document.getElementById('level-name');
    const xpBar = document.getElementById('player-xp-bar');
    const xpText = document.getElementById('player-xp-text');

    // --- State ---
    let skillTreeData = null;
    let progress = loadProgress();
    
    // --- Initialization ---
    init();

    async function init() {
        btnStart.addEventListener('click', () => {
            treeSection.scrollIntoView({ behavior: 'smooth' });
        });

        closeModalBtn.addEventListener('click', closeModal);
        modalOverlay.addEventListener('click', closeModal);

        try {
            // Fetch main data
            const treeResponse = await fetch('./skill_tree.json');
            skillTreeData = await treeResponse.json();
            
            updatePlayerStatsUI();
            renderTree();
            
            const contestResponse = await fetch('./contests/starting_contest.json');
            const contestData = await contestResponse.json();
            renderContest(contestData);
            
        } catch (error) {
            console.error("Error loading data:", error);
        }
    }

    // --- Data & Progress ---
    function loadProgress() {
        const saved = localStorage.getItem('cp_roadmap_progress');
        if (saved) return JSON.parse(saved);
        return { completedTasks: [], currentXP: 0, levelId: 1 };
    }

    function saveProgress() {
        localStorage.setItem('cp_roadmap_progress', JSON.stringify(progress));
        updatePlayerStatsUI();
        updateNodeStates();
    }

    function updatePlayerStatsUI() {
        if (!skillTreeData) return;
        
        // Recalculate level based on XP
        let currentLevel = skillTreeData.levels[0];
        let nextLevel = skillTreeData.levels[1];
        
        for (let i = 0; i < skillTreeData.levels.length; i++) {
            if (progress.currentXP >= skillTreeData.levels[i].xpRequired) {
                currentLevel = skillTreeData.levels[i];
                nextLevel = skillTreeData.levels[i + 1] || currentLevel;
            }
        }
        progress.levelId = currentLevel.id;
        
        levelIcon.textContent = currentLevel.icon;
        levelName.textContent = currentLevel.name;
        levelName.style.color = currentLevel.color;
        
        if (currentLevel.id === nextLevel.id) {
            xpText.textContent = `${progress.currentXP} XP (Максимум)`;
            xpBar.style.width = '100%';
        } else {
            const xpInLevel = progress.currentXP - currentLevel.xpRequired;
            const xpNeeded = nextLevel.xpRequired - currentLevel.xpRequired;
            const percent = Math.min(100, Math.max(0, (xpInLevel / xpNeeded) * 100));
            
            xpText.textContent = `${progress.currentXP} / ${nextLevel.xpRequired} XP`;
            xpBar.style.width = `${percent}%`;
        }
    }

    // --- Tree Rendering ---
    function renderTree() {
        nodesContainer.innerHTML = '';
        treeSvg.innerHTML = '';
        
        const svgLines = [];

        skillTreeData.nodes.forEach(node => {
            // Draw Node
            const el = document.createElement('div');
            el.className = 'node';
            el.id = `node-${node.id}`;
            el.style.left = `${node.position.x}px`;
            el.style.top = `${node.position.y}px`;
            
            el.innerHTML = `
                <div class="node-icon">${node.icon}</div>
                <div class="node-name">${node.name}</div>
                <div class="node-badge">${node.platform}</div>
            `;
            
            el.addEventListener('click', () => handleNodeClick(node));
            nodesContainer.appendChild(el);

            // Draw Lines
            node.requires.forEach(reqId => {
                const reqNode = skillTreeData.nodes.find(n => n.id === reqId);
                if (reqNode) {
                    const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                    // Draw bezier curve
                    const startX = reqNode.position.x;
                    const startY = reqNode.position.y + 40; // bottom of parent
                    const endX = node.position.x;
                    const endY = node.position.y - 40; // top of child
                    
                    const d = `M ${startX} ${startY} C ${startX} ${startY + 50}, ${endX} ${endY - 50}, ${endX} ${endY}`;
                    line.setAttribute('d', d);
                    line.setAttribute('stroke-width', '3');
                    line.setAttribute('fill', 'none');
                    line.setAttribute('class', `edge from-${reqId} to-${node.id}`);
                    
                    treeSvg.appendChild(line);
                    svgLines.push({ el: line, from: reqId, to: node.id });
                }
            });
        });
        
        updateNodeStates();
    }

    function updateNodeStates() {
        if (!skillTreeData) return;

        skillTreeData.nodes.forEach(node => {
            const el = document.getElementById(`node-${node.id}`);
            if (!el) return;
            
            el.classList.remove('locked', 'available', 'in-progress', 'completed', 'mastered');
            
            // Check requirements
            const prereqsMet = node.requires.every(reqId => isNodeCompleted(reqId));
            
            if (!prereqsMet && node.requires.length > 0) {
                el.classList.add('locked');
            } else {
                // If prereqs met, evaluate state based on tasks
                checkNodeTaskState(node, el);
            }
        });
        
        // Update lines colors
        skillTreeData.nodes.forEach(node => {
            node.requires.forEach(reqId => {
                const line = document.querySelector(`.edge.from-${reqId}.to-${node.id}`);
                if (line) {
                    if (isNodeCompleted(reqId)) {
                        line.setAttribute('stroke', '#10B981'); // Green
                    } else {
                        line.setAttribute('stroke', 'rgba(255,255,255,0.1)'); // Grey
                    }
                }
            });
        });
    }
    
    // We can only accurately know completion if we fetched the topic files.
    // For simplicity, we just check local storage if ANY task from this node's scope is done.
    // To make it robust without fetching 15 files at load, we map node ID to its state dynamically,
    // or we store node completion state directly in progress.
    // Let's add a helper function for node completion.
    
    function isNodeCompleted(nodeId) {
        // We consider a node completed if it's explicitly tracked, or by tasks.
        // Let's store node completion in progress for easy access.
        if (!progress.completedNodes) progress.completedNodes = [];
        return progress.completedNodes.includes(nodeId);
    }
    
    function checkNodeTaskState(node, el) {
        if (isNodeCompleted(node.id)) {
            // Check if mastered (has bonus tasks done) - simplistic implementation
            // For now just mark completed
            el.classList.add('completed');
        } else {
            // Could check if ANY task related to this node is done to mark 'in-progress'
            // For now, mark 'available'
            el.classList.add('available');
        }
    }

    // --- Modal & Lessons ---
    async function handleNodeClick(node) {
        const el = document.getElementById(`node-${node.id}`);
        if (el.classList.contains('locked')) {
            alert('Сначала завершите предыдущие темы!');
            return;
        }
        
        try {
            const resp = await fetch(`./${node.topicFile}`);
            if (!resp.ok) throw new Error("File not found");
            const topicData = await resp.json();
            openModal(node, topicData);
        } catch (e) {
            console.error(e);
            alert('Модуль находится в разработке.');
        }
    }

    function openModal(node, data) {
        document.getElementById('modal-icon').textContent = data.icon || node.icon;
        document.getElementById('modal-title').textContent = data.name;
        document.getElementById('modal-platform').textContent = data.platform;
        
        // Theory
        if (data.theory) {
            document.getElementById('theory-title').textContent = data.theory.title;
            // Basic markdown parse
            let htmlDesc = data.theory.explanation.replace(/\\n/g, '<br>');
            htmlDesc = htmlDesc.replace(/\\*\\*(.*?)\\*\\*/g, '<strong>$1</strong>');
            document.getElementById('theory-explanation').innerHTML = `<p>${htmlDesc}</p>`;
            
            const ul = document.getElementById('key-points-list');
            ul.innerHTML = '';
            data.theory.keyPoints.forEach(kp => {
                const li = document.createElement('li');
                li.textContent = kp;
                ul.appendChild(li);
            });
            
            // Code Highlighting (naive)
            const codeEl = document.getElementById('code-template');
            let codeText = data.theory.codeTemplate;
            codeText = codeText.replace(/</g, '&lt;').replace(/>/g, '&gt;');
            // Add some simple color spans
            codeText = codeText.replace(/#(include)/g, '<span style="color:#F43F5E;">#$1</span>');
            codeText = codeText.replace(/(using namespace std|int main|return)/g, '<span style="color:#8B5CF6;">$1</span>');
            codeText = codeText.replace(/(cin|cout|endl)/g, '<span style="color:#06B6D4;">$1</span>');
            codeEl.innerHTML = codeText;
        }

        // Tasks
        const tasksList = document.getElementById('tasks-list');
        tasksList.innerHTML = '';
        
        let completedCount = 0;
        const requiredCount = data.tasksToComplete || data.tasks.filter(t => t.required).length || data.tasks.length;
        
        data.tasks.forEach(task => {
            const isCompleted = progress.completedTasks.includes(task.id);
            if (isCompleted && task.required) completedCount++;
            
            const tEl = document.createElement('div');
            tEl.className = 'task-item glass-panel';
            tEl.innerHTML = `
                <div class="task-item-header">
                    <label class="task-checkbox-label">
                        <input type="checkbox" class="task-checkbox" data-task-id="${task.id}" ${isCompleted ? 'checked' : ''}>
                        <span>${task.name} ${task.required ? '<span style="color:var(--tier3-color)">*</span>' : '(Бонус)'}</span>
                    </label>
                    <span class="task-rating green">${task.difficulty}</span>
                </div>
                <div class="task-item-actions">
                    <a href="${task.url}" target="_blank" class="btn-link">Решать на ${task.platform}</a>
                    ${task.hint ? `<button class="btn-hint" data-hint="${task.id}">Подсказка</button>` : ''}
                </div>
                ${task.hint ? `<div class="hint-text" id="hint-${task.id}">${task.hint}</div>` : ''}
            `;
            tasksList.appendChild(tEl);
        });
        
        updateTaskProgress(completedCount, requiredCount, node, data);

        // Bind events
        tasksList.querySelectorAll('.task-checkbox').forEach(cb => {
            cb.addEventListener('change', (e) => {
                const tId = e.target.getAttribute('data-task-id');
                const tData = data.tasks.find(t => t.id === tId);
                
                if (e.target.checked) {
                    if (!progress.completedTasks.includes(tId)) {
                        progress.completedTasks.push(tId);
                        // Add XP
                        progress.currentXP += (tData.required ? 50 : 20); 
                    }
                } else {
                    progress.completedTasks = progress.completedTasks.filter(id => id !== tId);
                    progress.currentXP -= (tData.required ? 50 : 20);
                }
                
                // Recalculate completion
                completedCount = data.tasks.filter(t => t.required && progress.completedTasks.includes(t.id)).length;
                updateTaskProgress(completedCount, requiredCount, node, data);
                
                saveProgress();
            });
        });

        tasksList.querySelectorAll('.btn-hint').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const hintId = e.target.getAttribute('data-hint');
                const hintEl = document.getElementById(`hint-${hintId}`);
                hintEl.style.display = hintEl.style.display === 'block' ? 'none' : 'block';
            });
        });

        modal.classList.remove('hidden');
    }
    
    function updateTaskProgress(completed, required, node, data) {
        const pBar = document.getElementById('task-progress-bar');
        const pText = document.getElementById('task-progress-text');
        
        const percentage = Math.min(100, (completed / required) * 100);
        pBar.style.width = `${percentage}%`;
        pText.textContent = `${completed} / ${required} обязательных выполнено`;
        
        if (!progress.completedNodes) progress.completedNodes = [];
        
        if (completed >= required) {
            pBar.style.backgroundColor = 'var(--tier1-color)';
            if (!progress.completedNodes.includes(node.id)) {
                progress.completedNodes.push(node.id);
                progress.currentXP += node.xpReward; // Reward for node completion
                saveProgress(); // This will trigger UI updates
            }
        } else {
            pBar.style.backgroundColor = 'var(--accent-cyan)';
            if (progress.completedNodes.includes(node.id)) {
                progress.completedNodes = progress.completedNodes.filter(id => id !== node.id);
                progress.currentXP -= node.xpReward;
                saveProgress();
            }
        }
    }

    function closeModal() {
        modal.classList.add('hidden');
    }

    // --- Diagnostic Contest ---
    function renderContest(data) {
        document.getElementById('diagnostic-desc').textContent = data.description;
        const grid = document.getElementById('contest-grid');
        grid.innerHTML = '';
        
        data.tasks.forEach(task => {
            // Determine color by rating
            let ratingColor = 'grey';
            if (task.rating >= 1200) ratingColor = 'cyan';
            if (task.rating >= 1400) ratingColor = 'green';
            if (task.rating >= 1500) ratingColor = 'purple';
            
            const card = document.createElement('div');
            card.className = 'task-card glass-panel';
            card.innerHTML = `
                <div class="task-header">
                    <span class="task-index">${task.id}</span>
                    <span class="task-rating ${ratingColor}">* ${task.rating}</span>
                </div>
                <h3>${task.name}</h3>
                <div class="task-topic">${task.topic}</div>
                <p class="task-desc">${task.description}</p>
                <a href="${task.url}" target="_blank" class="task-link">Решать задачу</a>
            `;
            grid.appendChild(card);
        });
    }
});
