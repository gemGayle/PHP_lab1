document.addEventListener('DOMContentLoaded', function() {
    // load timers 
    const pageLoadEndTime = performance.now();
    const clientLoadTime = (pageLoadEndTime - pageLoadStartTime).toFixed(2);
    const totalLoadTime = (parseFloat(phpGenerationTime) + parseFloat(clientLoadTime)).toFixed(2);
    
    const timerDiv = document.createElement('div');
    timerDiv.innerHTML = `
        <div style="margin-bottom:8px;font-weight:bold;">Час завантаження:</div>
        <div>Сервер: ${phpGenerationTime} мс</div>
        <div>БД: ${phpDbTime || '0'} мс</div>
        <div>Клієнт: ${clientLoadTime} мс</div>
        <div style="font-weight:bold;">Загалом: ${totalLoadTime} мс</div>
    `;
    timerDiv.style.cssText = `
        position:fixed; top:10px; left:10px; padding:15px; 
        background:rgba(0,0,0,0.9); color:white; border-radius:8px;
        font-family:Arial; font-size:14px; z-index:1000;
    `;
    document.body.appendChild(timerDiv);
    setTimeout(() => timerDiv.remove(), 2500);

    // blocks editing
    const blocks = document.querySelectorAll('.block');
    const modal = document.getElementById('editModal');
    const closeBtn = document.querySelector('.close');
    const cancelBtn = document.querySelector('.btn-cancel');
    const form = document.getElementById('editForm');
    const textarea = document.getElementById('editContent');
    const pageNameInput = document.getElementById('editPageName');
    const blockIdInput = document.getElementById('editBlockId');

    // edit window open
    blocks.forEach(block => {
        block.addEventListener('click', function(e) {
            if (e.target.tagName === 'A' || e.target.closest('a')) return;
            
            const content = this.querySelector('.editable-content');
            if (!content) return;

            pageNameInput.value = currentPageName;
            blockIdInput.value = this.dataset.blockId;
            textarea.value = content.innerHTML;
            modal.style.display = 'block';
        });
    });

    // edit window close
    closeBtn.addEventListener('click', () => modal.style.display = 'none');
    cancelBtn.addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
    });

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const response = await fetch('', {
            method: 'POST',
            body: new FormData(this)
        });

        if (response.ok) {
            const block = document.querySelector(`[data-block-id="${blockIdInput.value}"]`);
            const content = block.querySelector('.editable-content');
            content.innerHTML = textarea.value;
            modal.style.display = 'none';
        }
    });

    if (typeof currentPageName !== 'undefined' && currentPageName === 'collapse_creator.php') {
        const itemsContainer = document.getElementById('items-container');
        const addItemBtn = document.getElementById('addItemBtn');
        const saveAllBtn = document.getElementById('saveAllBtn');
        const deleteAllBtn = document.getElementById('deleteAllBtn');
        const statusMessage = document.getElementById('status-message');

        if (addItemBtn && itemsContainer && saveAllBtn && statusMessage) {
            let itemCounter = 0;

            addItemBtn.addEventListener('click', () => {
                itemCounter++;
                const newItem = document.createElement('div');
                newItem.classList.add('collapse-item-form');
                newItem.innerHTML = `
                    <hr>
                    <h4>Елемент ${itemCounter}</h4>
                    <input type="text" placeholder="Заголовок" class="collapse-title-input" required>
                    <textarea placeholder="Вміст, що буде розкриватися" class="collapse-content-input" required></textarea>
                    <button class="btn-remove-item">Видалити</button>
                `;
                itemsContainer.appendChild(newItem);
            });

            itemsContainer.addEventListener('click', async (e) => {
                if (e.target.classList.contains('btn-remove-item')) {
                    e.target.closest('.collapse-item-form').remove();
                    return;
                }
            });
            async function saveAll() {
                const items = Array.from(itemsContainer.querySelectorAll('.collapse-item-form')).map(form => ({
                    title: form.querySelector('.collapse-title-input').value,
                    content: form.querySelector('.collapse-content-input').value
                })).filter(item => item.title && item.content);

                if (items.length === 0) {
                    statusMessage.textContent = 'Додайте хоча б один елемент.';
                    statusMessage.style.color = 'red';
                    return;
                }

                statusMessage.textContent = 'Збереження...';
                statusMessage.style.color = 'orange';

                try {
                    const response = await fetch('api.php', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(items)
                    });
                    const result = await response.json().catch(() => ({}));

                    if (!response.ok || result.status !== 'success') {
                        const msg = (result && (result.message || result.error)) ? (result.message || result.error) : 'Помилка сервера';
                        throw new Error(msg);
                    }

                    statusMessage.textContent = result.message || 'Набір успішно збережено.';
                    statusMessage.style.color = 'green';
                } catch (error) {
                    statusMessage.textContent = 'Не вдалося зберегти дані: ' + error.message;
                    statusMessage.style.color = 'red';
                }
            }

            saveAllBtn.addEventListener('click', saveAll);
            if (deleteAllBtn) {
                deleteAllBtn.addEventListener('click', async () => {
                        try {
                            let resp;
                            try {
                                resp = await fetch('api.php', { method: 'DELETE' });
                            } catch (networkErr) {
                                resp = await fetch('api.php?_method=DELETE', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ action: 'delete' })
                                });
                            }

                            const result = await resp.json().catch(() => ({}));
                            if (!resp.ok || result.status !== 'success') {
                                const msg = (result && (result.message || result.error)) ? (result.message || result.error) : 'Server error';
                                throw new Error(msg);
                            }

                            itemsContainer.innerHTML = '';
                            const msg = result.message || 'Набір видалено.';
                            statusMessage.textContent = msg;
                            if (typeof msg === 'string' && (msg.toLowerCase().includes('нема') || msg.includes('Немає'))) {
                                statusMessage.style.color = 'red';
                            } else {
                                statusMessage.style.color = 'green';
                            }
                            setTimeout(() => { statusMessage.textContent = ''; }, 3000);
                        } catch (err) {
                            console.error('Не вдалося видалити набір:', err);
                            statusMessage.textContent = 'Не вдалося видалити набір: ' + (err.message || '');
                            statusMessage.style.color = 'red';
                            setTimeout(() => { statusMessage.textContent = ''; }, 3000);
                        }
                });
            }
        }
    }

    if (typeof currentPageName !== 'undefined' && currentPageName === 'collapse_viewer.php') {
        const outputContainer = document.getElementById('collapse-items-output');
        const toggleAllBtn = document.getElementById('toggleAllBtn');

        if (outputContainer && toggleAllBtn) {
            let lastDataString = '';

            const renderCollapses = (items) => {
                if (items.length === 0) {
                    outputContainer.innerHTML = '<p>Немає елементів для відображення.</p>';
                    toggleAllBtn.style.display = 'none';
                    return;
                }
                toggleAllBtn.style.display = 'inline-block';
                outputContainer.innerHTML = items.map((item, index) => `
                    <div class="collapse-wrapper">
                        <button class="collapse-toggle" data-target="collapse-${index}">
                            ${item.title}
                        </button>
                        <div id="collapse-${index}" class="collapse-content">
                            <p>${item.content.replace(/\n/g, '<br>')}</p>
                        </div>
                    </div>
                `).join('');
            };

            const fetchAndRender = async () => {
                try {
                    const response = await fetch('api.php');
                    if (!response.ok) throw new Error('Мережева помилка.');

                    const data = await response.json();
                    const currentDataString = JSON.stringify(data);

                    if (currentDataString !== lastDataString) {
                        lastDataString = currentDataString;
                        renderCollapses(data);
                    }
                } catch (error) {
                    outputContainer.innerHTML = `<p style="color:red;">Помилка: ${error.message}</p>`;
                }
            };

            outputContainer.addEventListener('click', (e) => {
                if (e.target.classList.contains('collapse-toggle')) {
                    const targetId = e.target.getAttribute('data-target');
                    const content = document.getElementById(targetId);
                    if (content) content.classList.toggle('active');
                }
            });

            toggleAllBtn.addEventListener('click', () => {
                const allContent = outputContainer.querySelectorAll('.collapse-content');
                if (allContent.length === 0) return;

                const shouldOpen = !allContent[0].classList.contains('active');
                allContent.forEach(content => {
                    if (shouldOpen) content.classList.add('active'); else content.classList.remove('active');
                });
                toggleAllBtn.textContent = shouldOpen ? 'Закрити всі' : 'Відкрити всі';
            });

    
            fetchAndRender();
            setInterval(fetchAndRender, 5000);
        }
    }

    // LAB 5
    if (typeof currentPageName !== 'undefined' && currentPageName === 'lab5.php') {
        const playBtn = document.getElementById('playAnimBtn');
        const workOverlay = document.getElementById('work-overlay');
        const startBtn = document.getElementById('startBtn');
        const stopBtn = document.getElementById('stopBtn');
        const reloadBtn = document.getElementById('reloadBtn');
        const closeBtn = document.getElementById('closeBtn');
        const animArea = document.getElementById('anim-area');
        const msgBox = document.getElementById('work-messages');
        const resultsBox = document.getElementById('lab5-results');
        const resultsWrapper = document.getElementById('lab5-results_wrapper');

        if (!playBtn || !workOverlay || !animArea) return;

        const LS_KEY = 'lab5_anim_events';
        let eventSeq = 0;
        let intervalId = null;
        const stepDelay = 16; //time ms
        const radius = 10;

        // balls
        let red = { x: 0, y: 0, vx: 2, vy: 0 };
        let green = { x: 0, y: 0, vx: 0, vy: 3 };

        const ballRedEl = document.getElementById('ball-red');
        const ballGreenEl = document.getElementById('ball-green');

        function pushMessage(text) {
            const time = new Date().toLocaleTimeString();
            const p = document.createElement('div');
            p.textContent = `${time}: ${text}`;
            msgBox.prepend(p);
        }

        function logToLocalStorage(eventData) {
            const list = JSON.parse(localStorage.getItem(LS_KEY) || '[]');
            const storageTime = new Date().toISOString();
            list.push({
                ...eventData,
                storageTime
            });
            localStorage.setItem(LS_KEY, JSON.stringify(list));
        }

        async function logToServerImmediate(eventData) {
            try {
                await fetch('anim_events.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        mode: 'immediate',
                        event: eventData
                    })
                });
            } catch (e) {
                console.error('Immediate log error:', e);
            }
        }

        function logEvent(message) {
            eventSeq++;
            const clientTime = new Date().toISOString();
            const eventData = {
                seq: eventSeq,
                msg: message,
                clientTime
            };

            pushMessage(message);
            logToLocalStorage(eventData);      // localstorage save
            logToServerImmediate(eventData);   // server save
        }

        function setBallPositions() {
            ballRedEl.style.left = red.x + 'px';
            ballRedEl.style.top = red.y + 'px';
            ballGreenEl.style.left = green.x + 'px';
            ballGreenEl.style.top = green.y + 'px';
        }
        
        // balls setup
        function initBalls() {
            const rect = animArea.getBoundingClientRect();
            const maxX = rect.width - 2 * radius;
            const maxY = rect.height - 2 * radius;

            // red
            red.x = 0;
            red.y = Math.random() * maxY;
            red.vx = 15; 
            red.vy = 0;

            // green
            green.x = Math.random() * maxX; 
            green.y = 0;
            green.vx = 0;
            green.vy = 20;

            setBallPositions();
            logEvent('reload: виставлено нові стартові позиції куль');
        }

        function step() {
            const rect = animArea.getBoundingClientRect();
            const maxX = rect.width - 2 * radius;
            const maxY = rect.height - 2 * radius;

            // move
            red.x += red.vx;
            red.y += red.vy;
            green.x += green.vx;
            green.y += green.vy;

            // vertical collisios 
            if (red.x <= 0) {
                red.x = 0;
                red.vx *= -1;
                logEvent('червоний круг доторкнувся лівої стінки');
            } else if (red.x >= maxX) {
                red.x = maxX;
                red.vx *= -1;
                logEvent('червоний круг доторкнувся правої стінки');
            }

            // horizontal collisions
            if (green.y <= 0) {
                green.y = 0;
                green.vy *= -1;
                logEvent('зелений круг доторкнувся верхньої стінки');
            } else if (green.y >= maxY) {
                green.y = maxY;
                green.vy *= -1;
                logEvent('зелений круг доторкнувся нижньої стінки');
            }

            setBallPositions();

            // ball contact
            const centerRed = { x: red.x + radius, y: red.y + radius };
            const centerGreen = { x: green.x + radius, y: green.y + radius };
            const dx = centerRed.x - centerGreen.x;
            const dy = centerRed.y - centerGreen.y;
            const dist2 = dx * dx + dy * dy;
            const minDist = 2 * radius;

            if (dist2 <= minDist * minDist) {
                stopAnimation();
                logEvent('круги зіткнулись – анімацію зупинено');
                //stop-hide, reload-show
                stopBtn.classList.add('work-hidden');
                reloadBtn.classList.remove('work-hidden');
            } else {
                //every step log
                logEvent('крок анімації');
            }
        }

        function startAnimation() {
            if (intervalId !== null) return;
            intervalId = setInterval(step, stepDelay);
            startBtn.classList.add('work-hidden');
            stopBtn.classList.remove('work-hidden');
            reloadBtn.classList.add('work-hidden');
            logEvent('натиснуто start – анімація запущена');
        }

        function stopAnimation() {
            if (intervalId !== null) {
                clearInterval(intervalId);
                intervalId = null;
                logEvent('натиснуто stop – анімація зупинена');
            }
        }

        async function sendLocalEventsToServer() {
            const list = JSON.parse(localStorage.getItem(LS_KEY) || '[]');
            if (!list.length) return;

            try {
                await fetch('anim_events.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        mode: 'local',
                        events: list
                    })
                });
            } catch (e) {
                console.error('Sending local events error:', e);
            }
        }

        async function loadEventsFromServerAndRender() {
            try {
                const resp = await fetch('anim_events.php?list=1');
                const data = await resp.json();

                const immediate = data.immediate || [];
                const local = data.local || [];

                let html = '<table><thead><tr>' +
                    '<th colspan="3">Дані з сервера</th>' +
                    '<th colspan="3">Дані з LocalStorage</th>' +
                    '</tr><tr>' +
                    '<th>#</th><th>Час сервера</th><th>Повідомлення</th>' +
                    '<th>#</th><th>Час LocalStorage</th><th>Повідомлення</th>' +
                    '</tr></thead><tbody>';

                const maxLen = Math.max(immediate.length, local.length);
                for (let i = 0; i < maxLen; i++) {
                    const im = immediate[i];
                    const lc = local[i];
                    html += '<tr>';
                    if (im) {
                        html += `<td>${im.seq}</td><td>${im.time_server}</td><td>${im.msg}</td>`;
                    } else {
                        html += '<td></td><td></td><td></td>';
                    }
                    if (lc) {
                        html += `<td>${lc.seq}</td><td>${lc.storage_time || ''}</td><td>${lc.msg}</td>`;
                    } else {
                        html += '<td></td><td></td><td></td>';
                    }
                    html += '</tr>';
                }

                html += '</tbody></table>';
                resultsBox.innerHTML = html;
                if (resultsWrapper) {
                    if (immediate.length || local.length) {
                        resultsWrapper.classList.remove('results-hidden');
                    } else {
                        resultsWrapper.classList.add('results-hidden');
                    }
                }
            } catch (e) {
                resultsBox.innerHTML = '<p style="color:red">Помилка отримання даних з сервера</p>';
            }
        }

        // play button
        playBtn.addEventListener('click', async () => {
            // clear db n localstorage
            localStorage.removeItem(LS_KEY);
            eventSeq = 0;
            msgBox.innerHTML = '';
            resultsBox.innerHTML = '';
            if (resultsWrapper) {
                resultsWrapper.classList.add('results-hidden');
            }

            try {
                await fetch('anim_events.php?clear=1', { method: 'POST' });
            } catch (e) {
                console.error('Не вдалося очистити anim_events:', e);
            }

            workOverlay.classList.remove('work-hidden');
            initBalls();
            logEvent('натиснуто play – work відкрито');
        });

        startBtn.addEventListener('click', startAnimation);
        stopBtn.addEventListener('click', () => {
            stopAnimation();
            // stop-hide, start-show
            stopBtn.classList.add('work-hidden');
            startBtn.classList.remove('work-hidden');
        });

        reloadBtn.addEventListener('click', () => {
            initBalls();
            startBtn.classList.remove('work-hidden');
            stopBtn.classList.add('work-hidden');
            reloadBtn.classList.add('work-hidden');
            logEvent('натиснуто reload');
        });

        closeBtn.addEventListener('click', async () => {
            stopAnimation();
            logEvent('натиснуто close – work закрито');
            workOverlay.classList.add('work-hidden');

            //from localstorage to server
            await sendLocalEventsToServer();

            //read both and render
            await loadEventsFromServerAndRender();
        });
    }


});