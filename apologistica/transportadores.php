<?php
require 'config.php';
$metodo = $_SERVER['REQUEST_METHOD'];
$dados = json_decode(file_get_contents('php://input'), true);

if ($metodo === 'GET') {
    responder($pdo->query('SELECT * FROM transportadores ORDER BY id DESC')->fetchAll());
}

if ($metodo === 'POST') {
    $valores = [$dados['nome'], $dados['tipo_doc'], $dados['documento'], $dados['placa'], $dados['email'], $dados['telefones']];
    if (!empty($dados['id'])) {
        $sql = $pdo->prepare('UPDATE transportadores SET nome = ?, tipo_doc = ?, documento = ?, placa = ?,
                              email = ?, telefones = ? WHERE id = ?');
        $sql->execute([...$valores, $dados['id']]);
    } else {
        $sql = $pdo->prepare('INSERT INTO transportadores (nome, tipo_doc, documento, placa, email, telefones)
                              VALUES (?, ?, ?, ?, ?, ?)');
        $sql->execute($valores);
    }
    responder(['ok' => true]);
}

if ($metodo === 'DELETE') {
    try {
        $pdo->prepare('DELETE FROM transportadores WHERE id = ?')->execute([$_GET['id']]);
        responder(['ok' => true]);
    } catch (PDOException $e) {
        responder(['erro' => 'Este transportador está em uso em algum frete.'], 409);
    }
}