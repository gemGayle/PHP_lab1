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
});