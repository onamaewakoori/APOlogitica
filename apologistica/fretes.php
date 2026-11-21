<?php
require 'config.php';
$metodo = $_SERVER['REQUEST_METHOD'];
$dados = json_decode(file_get_contents('php://input'), true);

if ($metodo === 'GET') {
    $sql = "SELECT f.id, f.data_frete, t.nome AS transportador, o.apelido AS origem, d.apelido AS destino,
                   GROUP_CONCAT(CONCAT(p.nome, ' x', i.quantidade) SEPARATOR ', ') AS produtos
            FROM fretes f
            JOIN transportadores t ON t.id = f.transportador_id
            JOIN enderecos o ON o.id = f.origem_id
            JOIN enderecos d ON d.id = f.destino_id
            JOIN frete_itens i ON i.frete_id = f.id
            JOIN produtos p ON p.id = i.produto_id
            GROUP BY f.id, f.data_frete, t.nome, o.apelido, d.apelido
            ORDER BY f.id DESC";
    responder($pdo->query($sql)->fetchAll());
}

if ($metodo === 'POST') {
    if ($dados['origem_id'] == $dados['destino_id']) {
        responder(['erro' => 'Origem e destino devem ser diferentes.'], 400);
    }
    if (empty($dados['itens'])) {
        responder(['erro' => 'Inclua ao menos um produto.'], 400);
    }

    $pdo->beginTransaction();
    $sql = $pdo->prepare('INSERT INTO fretes (data_frete, origem_id, destino_id, transportador_id) VALUES (?, ?, ?, ?)');
    $sql->execute([$dados['data_frete'], $dados['origem_id'], $dados['destino_id'], $dados['transportador_id']]);
    $freteId = $pdo->lastInsertId();

    $sqlItem = $pdo->prepare('INSERT INTO frete_itens (frete_id, produto_id, quantidade) VALUES (?, ?, ?)');
    foreach ($dados['itens'] as $item) {
        $sqlItem->execute([$freteId, $item['produto_id'], $item['quantidade']]);
    }
    $pdo->commit();
    responder(['ok' => true]);
}

if ($metodo === 'DELETE') {
    $pdo->prepare('DELETE FROM fretes WHERE id = ?')->execute([$_GET['id']]);
    responder(['ok' => true]);
}