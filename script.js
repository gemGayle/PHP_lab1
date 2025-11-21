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

});