<?php
include 'header.php'; 
?>

<div class="block block1" data-block-id="block1">
    <div class="label-x"><?= $x ?></div>
    <span class="editable-content"><?= $texts[1] ?? '' ?></span>
</div>

<div class="block block2" data-block-id="block2">
    <span class="editable-content"><?= $texts[2] ?? '' ?></span>
</div>

<div class="block block3" data-block-id="block3">
    <h3><?= $texts[3] ?? 'Лабораторна робота №5' ?></h3>

    <ul>
        <?php if (!empty($menu)) : ?>
            <?php foreach ($menu as $link => $label): ?>
                <li><a href="<?= $link ?>"><?= $label ?></a></li>
            <?php endforeach; ?>
        <?php endif; ?>
    </ul>

    <div id="lab5-block3-inner">
        <button id="playAnimBtn" class="btn-action">play</button>
        
        <div id="lab5-results_wrapper" class="results-hidden">
            <div id="lab5-results"></div> 
        </div>
    </div>
</div>

<div class="block block4" data-block-id="block4">
    <span class="editable-content"><?= $texts[4] ?? '' ?></span>
</div>

<div class="block block5" data-block-id="block5">
    <span class="editable-content"><?= $texts[5] ?? '' ?></span>
</div>

<div class="block block6" data-block-id="block6">
    <div class="label-y"><?= $y ?></div>
    <span class="editable-content"><?= $texts[6] ?? '' ?></span>
</div>

<div id="work-overlay" class="work-hidden">
    <div id="work-layer">

        <div id="work-controls">
            <div id="work-messages"></div>

            <div id="work-buttons">
                <button id="startBtn" class="btn-action">start</button>
                <button id="stopBtn" class="btn-action work-hidden">stop</button>
                <button id="reloadBtn" class="btn-action work-hidden">reload</button>
                <button id="closeBtn" class="btn-delete-col">close</button>
            </div>
        </div>

        <div id="anim-area">
            <div id="ball-red" class="ball ball-red"></div>
            <div id="ball-green" class="ball ball-green"></div>
        </div>
    </div>
</div>

<?php
include 'footer.php';
