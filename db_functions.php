<?php
$dbQueryTime = 0;

function getContentFromDB($pdo, $pageName, $blockId, $defaultContent) {
    global $dbQueryTime, $dbQueryCount;
    
    $startTime = microtime(true);
    
    try {
        $stmt = $pdo->prepare("SELECT content FROM page_content WHERE page_name = ? AND block_id = ?");
        $stmt->execute([$pageName, $blockId]);
        $result = $stmt->fetch();
        
        $queryTime = (microtime(true) - $startTime) * 1000;
        $dbQueryTime += $queryTime;
        $dbQueryCount++;
        
        return $result ? htmlspecialchars_decode($result['content']) : $defaultContent;
    } catch (PDOException $e) {
        $queryTime = (microtime(true) - $startTime) * 1000;
        $dbQueryTime += $queryTime;
        $dbQueryCount++;
        return $defaultContent;
    }
}

function saveContentToDB($pdo, $pageName, $blockId, $content) {
    global $dbQueryTime, $dbQueryCount;
    
    $startTime = microtime(true);
    
    try {
        $safeContent = htmlspecialchars($content, ENT_QUOTES, 'UTF-8');
        $stmt = $pdo->prepare("INSERT INTO page_content (page_name, block_id, content) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE content = ?");
        $result = $stmt->execute([$pageName, $blockId, $safeContent, $safeContent]);
        
        $queryTime = (microtime(true) - $startTime) * 1000;
        $dbQueryTime += $queryTime;
        $dbQueryCount++;
        
        return $result;
    } catch (PDOException $e) {
        $queryTime = (microtime(true) - $startTime) * 1000;
        $dbQueryTime += $queryTime;
        $dbQueryCount++;
        return false;
    }
}

function getDbStats() {
    global $dbQueryTime;
    return [
        'time' => round($dbQueryTime, 2),
    ];
}
?>