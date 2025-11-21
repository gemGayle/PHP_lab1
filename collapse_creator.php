<?php
include 'header.php';
?>

    <div class="block block1" data-block-id="block1">
        <div class="label-x"><?=$x ?></div>
        <div class="block1-nav">
            <a href="collapse_viewer.php">Перейти до перегляду &raquo;</a>
            <a href="index.php">&laquo; На головну</a>
        </div>
    </div>

    <div class="block block2" data-block-id="block2"><span class="editable-content"><?= $texts[2] ?? '' ?></span></div>

    <div class="block block3" data-block-id="block3">
        <div id="collapse-creator-container">
            <h3>Конструктор об'єктів Collapse</h3>
            <div id="items-container"></div>
            <div class="creator-actions">
                <button id="addItemBtn" class="btn-action">Додати елемент</button>
                <button id="saveAllBtn" class="btn-save-col">Зберегти набір</button>
                <button id="deleteAllBtn" class="btn-delete-col">Видалити набір</button>
            </div>
            <p id="status-message"></p>
        </div>
    </div>

    <div class="block block4" data-block-id="block4"><span class="editable-content"><?= $texts[4] ?? '' ?></span></div>
    <div class="block block5" data-block-id="block5"><span class="editable-content"><?= $texts[5] ?? '' ?></span></div>
    <div class="block block6" data-block-id="block6"><div class="label-y"><?=$y ?></div><span class="editable-content"><?= $texts[6] ?? '' ?></span></div>

<?php include 'footer.php'; ?>