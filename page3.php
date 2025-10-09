<?php
$x = "Студент ІО-33";
$y = "Андреєв Олександр";

$imgage = "https://i.imgur.com/2yaf2wb.png";

$texts = [
    1 => 'Arch Linux — це дистрибутив, орієнтований на досвідчених користувачів, які хочуть повністю контролювати свою систему. 
    <br>Його філософія — "Keep It Simple", тобто надавати мінімальне базове середовище,
    <br>яке користувач сам може налаштувати та розширювати під свої потреби.
    <br>Arch відомий своїм пакетним менеджером pacman та величезним репозиторієм користувацьких пакетів (AUR).',
    
    2 => "NixOS — унікальний дистрибутив, що базується на концепції декларативного керування системою.
    Усі пакети та налаштування визначаються в конфігураційних файлах, а зміни застосовуються атомарно. 
    Це робить систему дуже надійною: у разі помилки можна легко повернутися до попередньої конфігурації.",
    
    3 => "Сторінка №3",
    
    4 => "Linux Mint — це дистрибутив, який робить акцент на простоті використання.
    Він створений на основі Ubuntu (або Debian у деяких редакціях) і орієнтований на новачків у Linux. 
    Mint має знайомий і зручний інтерфейс (Cinnamon, MATE або XFCE), що робить його хорошою альтернативою Windows.",
    
    5 => "Ubuntu — один із найпопулярніших дистрибутивів Linux, розроблений компанією Canonical. 
    Він базується на Debian, але пропонує зручніший процес встановлення та більш сучасні пакети. 
    Ubuntu відомий своєю стабільністю та великою спільнотою, завдяки чому легко знайти підтримку й документацію.",
    
    6 => "Fedora — дистрибутив, який підтримується спільнотою і компанією Red Hat.
    <br>Він орієнтований на сучасні технології та часто слугує тестовим майданчиком 
    <br>для нових рішень, які пізніше потрапляють у Red Hat Enterprise Linux."
];

$menu = [
    "index.php" => "Головна",
    "page1.php" => "Сторінка 1",
    "page2.php" => "Сторінка 2",
    "page3.php" => "Сторінка 3",
    "page4.php" => "Сторінка 4"
];
?>
<!DOCTYPE html>
<html lang="uk">
<head>
    <meta charset="UTF-8">
    <title>Сторінка №3</title>
    <link rel="stylesheet" href="style.css?v=2">
    <script src="script.js" defer></script>
    <script> 
        const pageLoadStartTime = performance.now();
    </script>
</head>
<body>
<div class="container">

    <div class="block block1">
        <div class="label-x"><?= $x ?></div>
        <span class = "editable-content"><?= $texts[1] ?></span>
    </div>

    <div class="block block2">
        <span class = "editable-content"><?= $texts[2] ?></span>
    </div>

    <div class="block block3">
        <h3> <span class = "editable-content"><?= $texts[3] ?></span> </h3>
        <ul>
            <?php foreach ($menu as $link => $label): ?>
                <li><a href="<?= $link ?>"><?= $label ?></a></li>
            <?php endforeach; ?>
        </ul>
    </div>

    <div class="block block4">
        <img src="<?= $imgage ?>" alt="Image" width="150" height="150">
    </div>
    

    <div class="block block5">
        <span class = "editable-content"><?= $texts[5] ?></span>
    </div>

    <div class="block block6">
        <div class="label-y"><?= $y ?></div>
        <span class = "editable-content"><?= $texts[6] ?></span>
    </div>

</div>
</body>
</html>
