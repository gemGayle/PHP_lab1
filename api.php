<?php
include 'config.php';

header('Content-Type: application/json; charset=utf-8');

$method = $_SERVER['REQUEST_METHOD'];

try {
    switch ($method) {
        case 'GET':
            $stmt = $pdo->query("SELECT id, title, content FROM collapses ORDER BY id");
            $collapses = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($collapses, JSON_UNESCAPED_UNICODE);
            break;

        case 'DELETE':
            try {
                $deleted = $pdo->exec("DELETE FROM collapses");
                if ($deleted === 0) {
                    echo json_encode(['status' => 'success', 'message' => 'Немає елементів для видалення.'], JSON_UNESCAPED_UNICODE);
                } else {
                    echo json_encode(['status' => 'success', 'message' => 'Набір об\'єктів видалено.'], JSON_UNESCAPED_UNICODE);
                }
            } catch (PDOException $e) {
                http_response_code(500);
                echo json_encode(['status' => 'error', 'message' => 'Помилка при видаленні: ' . $e->getMessage()], JSON_UNESCAPED_UNICODE);
            }
            break;

        case 'POST':
            $data = json_decode(file_get_contents('php://input'), true);

            if (is_array($data)) {
                $append = isset($_GET['append']) && ($_GET['append'] === '1' || $_GET['append'] === 'true' || $_GET['append'] === 1);
                $pdo->beginTransaction();

                if (!$append) {
                    $pdo->exec("DELETE FROM collapses");
                }

                $stmt = $pdo->prepare("INSERT INTO collapses (title, content) VALUES (?, ?)");
                foreach ($data as $item) {
                    if (isset($item['title'], $item['content'])) {
                        $stmt->execute([$item['title'], $item['content']]);
                    }
                }

                $pdo->commit();
                if ($append) {
                    echo json_encode(['status' => 'success', 'message' => 'Елемент успішно додано!']);
                } else {
                    echo json_encode(['status' => 'success', 'message' => 'Набір об\'єктів успішно збережено!']);
                }
            } else {
                http_response_code(400);
                echo json_encode(['status' => 'error', 'message' => 'Некоректний формат даних.'], JSON_UNESCAPED_UNICODE);
            }
            break;
            
        default:
            http_response_code(405);
            echo json_encode(['status' => 'error', 'message' => 'Метод не підтримується.'], JSON_UNESCAPED_UNICODE);
            break;
    }
} catch (PDOException $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Помилка бази даних: ' . $e->getMessage()], JSON_UNESCAPED_UNICODE);
}
?>