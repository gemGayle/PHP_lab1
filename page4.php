<?php
include 'header.php';

$image = "distro.png";
$map_links =[ 
    ["shape" => "rect", "coords" => "0, 0, 170, 150", "href" => "https://archlinux.org/", "title" => "arch"],
    ["shape" => "rect", "coords" => "171, 0, 340, 150", "href" => "https://ubuntu.com/", "title" => "ubuntu"],
    ["shape" => "rect", "coords" => "341, 0, 510, 150", "href" => "https://linuxmint.com/", "title" => "mint"]
];

$links = [
    "mint" => "https://linuxmint.com/"
];

?>
    <div class="block block1" data-block-id="block1">
        <div class="label-x"><?= $x ?></div>
        <span class = "editable-content"><?= $texts[1] ?></span>
    </div>

    <div class="block block2" data-block-id="block2">
        <span class = "editable-content"><?= $texts[2] ?></span>
    </div>

    <div class="block block3" data-block-id="block3">
        <h3> <span class = "editable-content">Сторінка №4</span> </h3>
        <ul>
            <?php foreach ($menu as $link => $label): ?>
                <li><a href="<?= $link ?>"><?= $label ?></a></li>
            <?php endforeach; ?>
        </ul>
    </div>

    <div class="block block4" data-block-id="block4">
        <span class = "editable-content"><?= $texts[4] ?></span>
    </div>
    
    <div class="block block5" data-block-id="block5">
        <a href="https://linuxmint.com/" target="_blank">LINUX MINT</a>
    </div>

    <div class="block block6" data-block-id="block6">
        <div class="label-y"><?= $y ?></div>
        <img src="<?= $image ?>" usemap="#mymap" alt="Test image" width="510" height="150">
        <map name="mymap">
            <?php foreach ($map_links as $link): ?>
                <area shape="<?= $link['shape'] ?>"
                    coords="<?= $link['coords'] ?>"
                    href="<?= $link['href'] ?>"
                    alt="<?= $link['title'] ?>"
                    title="<?= $link['title'] ?>">
            <?php endforeach; ?>
        </map>
    </div>

<?php include 'footer.php'; ?>
