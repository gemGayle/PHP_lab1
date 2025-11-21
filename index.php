<?php include 'header.php'; ?>

    <div class="block block1" data-block-id="block1">
        <div class="label-x"><?=$x ?></div>
        <span class="editable-content"><?= $texts[1] ?></span>
    </div>

    <div class="block block2" data-block-id="block2">
        <span class="editable-content"><?= $texts[2] ?></span>
    </div>

    <div class="block block3" data-block-id="block3">
        <h3><span class="editable-content"><?= $texts[3] ?></span></h3>
        <ul>
            <?php foreach ($menu as $link => $label): ?>
                <li><a href="<?= $link ?>"><?= $label ?></a></li>
            <?php endforeach; ?>
        </ul>
    </div>

    <div class="block block4" data-block-id="block4">
        <span class="editable-content"><?= $texts[4] ?></span>
    </div>

    <div class="block block5" data-block-id="block5">
        <span class="editable-content"><?= $texts[5] ?></span>
    </div>

    <div class="block block6" data-block-id="block6">
        <div class="label-y"><?=$y ?></div>
        <span class="editable-content"><?= $texts[6] ?></span>
    </div>

<?php include 'footer.php'?>