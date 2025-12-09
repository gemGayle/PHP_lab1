<?php
include 'config.php';

header('Content-Type: application/json; charset=utf-8');
date_default_timezone_set('Europe/Kyiv'); 

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);

$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method === 'POST' && isset($_GET['clear'])) {
        $pdo->exec("DELETE FROM anim_events");
        echo json_encode(['status' => 'success', 'message' => 'Таблицю anim_events очищено'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    if ($method === 'GET' && isset($_GET['list'])) {
        $stmt = $pdo->query("SELECT method, seq, msg, time_server, time_client, storage_time 
                             FROM anim_events ORDER BY id");
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $result = [
            'immediate' => [],
            'local' => []
        ];

        foreach ($rows as $row) {
            $result[$row['method']][] = $row;
        }

        echo json_encode($result, JSON_UNESCAPED_UNICODE);
        exit;
    }

    if ($method === 'POST' && is_array($data)) {
        $serverTime = date('Y-m-d H:i:s');
        
        if (isset($data['mode']) && $data['mode'] === 'immediate' && isset($data['event'])) {
            $e = $data['event'];

            $stmt = $pdo->prepare("
                INSERT INTO anim_events (method, seq, msg, time_server, time_client, storage_time)
                VALUES ('immediate', ?, ?, ?, ?, NULL)
            ");
            $stmt->execute([
                $e['seq'] ?? 0,
                $e['msg'] ?? '',
                $serverTime,
                isset($e['clientTime']) ? $e['clientTime'] : null
            ]);

            echo json_encode(['status' => 'success'], JSON_UNESCAPED_UNICODE);
            exit;
        }

        if (isset($data['mode']) && $data['mode'] === 'local' && isset($data['events']) && is_array($data['events'])) {
            $stmt = $pdo->prepare("
                INSERT INTO anim_events (method, seq, msg, time_server, time_client, storage_time)
                VALUES ('local', ?, ?, ?, ?, ?)
            ");

            foreach ($data['events'] as $e) {
                $serverTimeLocal = date('Y-m-d H:i:s');

                $stmt->execute([
                    $e['seq'] ?? 0,
                    $e['msg'] ?? '',
                    $serverTimeLocal,
                    isset($e['clientTime']) ? $e['clientTime'] : null,
                    isset($e['storageTime']) ? $e['storageTime'] : null
                ]);
            }

            echo json_encode(['status' => 'success'], JSON_UNESCAPED_UNICODE);
            exit;
        }
    }

    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Некоректний запит до anim_events.php'], JSON_UNESCAPED_UNICODE);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'DB error: ' . $e->getMessage()], JSON_UNESCAPED_UNICODE);
}
