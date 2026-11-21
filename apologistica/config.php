<?php
function responder($dados, $status = 200) {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($dados);
    exit;
}

try {
    $pdo = new PDO('mysql:host=127.0.0.1;charset=utf8mb4', 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

    foreach (explode(';', file_get_contents(__DIR__ . '/schema.sql')) as $comando) {
        if (trim($comando) !== '') {
            $pdo->exec($comando);
        }
    }
} catch (PDOException $e) {
    responder(['erro' => 'Sem conexão com o banco. Verifique se o MySQL está iniciado no XAMPP.'], 500);
}