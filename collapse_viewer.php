<?php
include 'header.php';
?>

    <div class="block block1" data-block-id="block1">
        <div class="label-x"><?=$x ?></div>
        <div class="block1-nav">
            <a href="collapse_creator.php">&laquo; Перейти до створення</a>
            <a href="index.php">&laquo; На головну</a>
        </div>
    </div>

    <div class="block block2" data-block-id="block2"><span class="editable-content"><?= $texts[2] ?? '' ?></span></div>

    <div class="block block3" data-block-id="block3">
        <div id="collapse-viewer-container">
            <h3>Згенерований набір об'єктів</h3>
            <div class="viewer-actions">
                <button id="toggleAllBtn" class="btn-action">Відкрити всі</button>
            </div>
            <div id="collapse-items-output">Завантаження...</div>
        </div>
    </div>
    
    <div class="block block4" data-block-id="block4"><span class="editable-content"><?= $texts[4] ?? '' ?></span></div>
    <div class="block block5" data-block-id="block5"><span class="editable-content"><?= $texts[5] ?? '' ?></span></div>
    <div class="block block6" data-block-id="block6"><div class="label-y"><?=$y ?></div><span class="editable-content"><?= $texts[6] ?? '' ?></span></div>

<?php include 'footer.php'; ?>