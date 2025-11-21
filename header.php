<?php
$pageGenerationStart = microtime(true);

include 'config.php';
include 'db_functions.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['content'], $_POST['page_name'], $_POST['block_id'])) {
    $success = saveContentToDB($pdo, $_POST['page_name'], $_POST['block_id'], $_POST['content']);
    echo $success ? "OK" : "ERROR";
    exit;
}

$pageName = basename($_SERVER['PHP_SELF']);
$x = "Студент ІО-33";
$y = "Андреєв Олександр";

$menu = [
    "index.php" => "Головна",
    "page1.php" => "Сторінка 1",
    "page2.php" => "Сторінка 2", 
    "page3.php" => "Сторінка 3",
    "page4.php" => "Сторінка 4",
    "collapse_creator.php" => "Створення Collapse",
    "collapse_viewer.php" => "Перегляд Collapse"
];

$defaultTexts = [
    1 => 'Arch Linux — це дистрибутив, орієнтований на досвідчених користувачів, які хочуть повністю контролювати свою систему.<br>
    Його філософія — "Keep It Simple", тобто надавати мінімальне базове середовище,<br>
    яке користувач сам може налаштувати та розширювати під свої потреби.<br>
    Arch відомий своїм пакетним менеджером pacman та величезним репозиторієм користувацьких пакетів (AUR).',

    2 => "NixOS — унікальний дистрибутив, що базується на концепції декларативного керування системою.
    Усі пакети та налаштування визначаються в конфігураційних файлах, а зміни застосовуються атомарно.
    Це робить систему дуже надійною: у разі помилки можна легко повернутися до попередньої конфігурації.",
    
    3 => "Головна сторінка",
    
    4 => "Linux Mint — це дистрибутив, який робить акцент на простоті використання.
    Він створений на основі Ubuntu (або Debian у деяких редакціях) і орієнтований на новачків у Linux.
    Mint має знайомий і зручний інтерфейс (Cinnamon, MATE або XFCE), що робить його хорошою альтернативою Windows.", 

    5 => "Ubuntu — один із найпопулярніших дистрибутивів Linux, розроблений компанією Canonical.
    Він базується на Debian, але пропонує зручніший процес встановлення та більш сучасні пакети.
    Ubuntu відомий своєю стабільністю та великою спільнотою, завдяки чому легко знайти підтримку й документацію.",
    
    6 => "Ubuntu — один із найпопулярніших дистрибутивів Linux, розроблений компанією Canonical.
    Він базується на Debian, але пропонує зручніший процес встановлення та більш сучасні пакети.
    Ubuntu відомий своєю стабільністю та великою спільнотою, завдяки чому легко знайти підтримку й документацію."

];

$texts = [];
for ($i = 1; $i <= 6; $i++) {
    $blockId = 'block' . $i;
    $texts[$i] = getContentFromDB($pdo, $pageName, $blockId, $defaultTexts[$i]);
}

$dbStats = getDbStats();
$pageGenerationTime = round((microtime(true) - $pageGenerationStart) * 1000, 2);
?>

<!DOCTYPE html>
<html lang="uk">
<head>
    <meta charset="UTF-8">
    <title>Лабораторна робота №3</title>
    <link rel="stylesheet" href="style.css?v=4">
    <script src="script.js?v=4" defer></script>
    <script>
        const phpGenerationTime = <?= $pageGenerationTime ?>;
        const phpDbTime = <?= $dbStats['time'] ?>;
        const currentPageName = "<?= $pageName ?>";
        const pageLoadStartTime = performance.now();
    </script>
</head>
<body>
<div class="container">