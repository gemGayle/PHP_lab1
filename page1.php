<?php
include 'header.php';

$defaultTexts = [
    1 => 'Нумерований список:',
    
    2 => "NixOS — унікальний дистрибутив, що базується на концепції декларативного керування системою.
    Усі пакети та налаштування визначаються в конфігураційних файлах, а зміни застосовуються атомарно. 
    Це робить систему дуже надійною: у разі помилки можна легко повернутися до попередньої конфігурації.",
    
    3 => "Сторінка №1",
    
    4 => "Linux Mint — це дистрибутив, який робить акцент на простоті використання.
    Він створений на основі Ubuntu (або Debian у деяких редакціях) і орієнтований на новачків у Linux. 
    Mint має знайомий і зручний інтерфейс (Cinnamon, MATE або XFCE), що робить його хорошою альтернативою Windows.",
    
    5 => "Ubuntu — один із найпопулярніших дистрибутивів Linux, розроблений компанією Canonical. 
    Він базується на Debian, але пропонує зручніший процес встановлення та більш сучасні пакети. 
    Ubuntu відомий своєю стабільністю та великою спільнотою, завдяки чому легко знайти підтримку й документацію.",
    
    6 => "Fedora — дистрибутив, який підтримується спільнотою і компанією Red Hat.
    <br>Він орієнтований на сучасні технології та часто слугує тестовим майданчиком 
    <br>для нових рішень, які пізніше потрапляють у Red Hat Enterprise Linux.",
];

$texts = [];
for ($i = 1; $i <= 6; $i++) {
    $blockId = 'block' . $i;
    $texts[$i] = getContentFromDB($pdo, $pageName, $blockId, $defaultTexts[$i]);
}

$list_ol = ["Arch", "NixOS", "Mint", "Fedora"];

$pageGenerationTime = round((microtime(true) - $pageGenerationStart) * 1000, 2);

?>

<div class="block block1" data-block-id="block1">
    <div class="label-x"><?= $x ?></div>
    <h3><span class="editable-content"><?= $texts[1] ?></span></h3> 
    <ol>
        <?php foreach ($list_ol as $item): ?>
            <li><?= $item ?></li>
        <?php endforeach; ?>
    </ol>
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
    <div class="label-y"><?= $y ?></div>
    <span class="editable-content"><?= $texts[6] ?></span>
</div>

<?php include 'footer.php'; ?>