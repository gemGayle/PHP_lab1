document.addEventListener('DOMContentLoaded', function() {

    const editableBlocks = document.querySelectorAll('.block');

    function getPageName() {
        let pageName = window.location.pathname.split('/').pop();
        if (pageName === '') {
            pageName = 'index.php';
        }
        return pageName;
    }    

    function loadContentFromStorage() {
        const pageName = getPageName();

        editableBlocks.forEach((block, index) => {
            const editableSpan = block.querySelector('.editable-content');
            
            if (editableSpan) {
                const key = `${pageName}-block-${index}`;
                const savedContent = localStorage.getItem(key);

                if (savedContent) {
                    editableSpan.innerHTML = savedContent;
                }
            }
        });
    }

    function handleBlockClick(event) {
        const block = event.currentTarget;
        
        const editableSpan = block.querySelector('.editable-content');
        
        if (!editableSpan) {
            return;
        }
        
        if (event.target.tagName === 'A' || event.target.closest('a')) {
            return;
        }

        const pageName = getPageName();
        const blockIndex = Array.from(editableBlocks).indexOf(block);
        const key = `${pageName}-block-${blockIndex}`;

        const newContent = prompt("Введіть новий вміст:", editableSpan.innerHTML);

        if (newContent !== null) {
            editableSpan.innerHTML = newContent;
            localStorage.setItem(key, newContent);
        }
    }

    editableBlocks.forEach(block => {
        block.addEventListener('click', handleBlockClick);
    });

    loadContentFromStorage();

    function showPageLoadTime() {
        const pageLoadEndTime = performance.now();
        const totalLoadTime = (pageLoadEndTime - pageLoadStartTime).toFixed(2);
        const timerDiv = document.createElement('div');
        timerDiv.style.position = 'fixed';
        timerDiv.style.top = '10px';
        timerDiv.style.left = '10px';
        timerDiv.style.padding = '5px 10px';
        timerDiv.style.backgroundColor = 'rgba(0,0,0,0.7)';
        timerDiv.style.color = 'white';
        timerDiv.style.borderRadius = '5px';
        timerDiv.style.fontSize = '14px';
        timerDiv.textContent = `Час формування сторінки: ${totalLoadTime} мс`;
        document.body.appendChild(timerDiv);
    }
    showPageLoadTime();
});