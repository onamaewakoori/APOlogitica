<?php
require 'config.php';
$metodo = $_SERVER['REQUEST_METHOD'];
$dados = json_decode(file_get_contents('php://input'), true);

if ($metodo === 'GET') {
    responder($pdo->query('SELECT * FROM produtos ORDER BY id DESC')->fetchAll());
}

if ($metodo === 'POST') {
    $valores = [$dados['nome'], $dados['sku'], $dados['descricao'], $dados['peso'] ?: 0, $dados['valor'] ?: 0];
    if (!empty($dados['id'])) {
        $sql = $pdo->prepare('UPDATE produtos SET nome = ?, sku = ?, descricao = ?, peso = ?, valor = ? WHERE id = ?');
        $sql->execute([...$valores, $dados['id']]);
    } else {
        $sql = $pdo->prepare('INSERT INTO produtos (nome, sku, descricao, peso, valor) VALUES (?, ?, ?, ?, ?)');
        $sql->execute($valores);
    }
    responder(['ok' => true]);
}

if ($metodo === 'DELETE') {
    try {
        $pdo->prepare('DELETE FROM produtos WHERE id = ?')->execute([$_GET['id']]);
        responder(['ok' => true]);
    } catch (PDOException $e) {
        responder(['erro' => 'Este produto está em uso em algum frete.'], 409);
    }
}