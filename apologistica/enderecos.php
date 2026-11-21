<?php
require 'config.php';
$metodo = $_SERVER['REQUEST_METHOD'];
$dados = json_decode(file_get_contents('php://input'), true);

if ($metodo === 'GET') {
    responder($pdo->query('SELECT * FROM enderecos ORDER BY id DESC')->fetchAll());
}

if ($metodo === 'POST') {
    $valores = [$dados['apelido'], $dados['cep'], $dados['numero'],
                $dados['complemento'], $dados['bairro'], $dados['cidade'], strtoupper($dados['uf'])];
    if (!empty($dados['id'])) {
        $sql = $pdo->prepare('UPDATE enderecos SET apelido = ?, cep = ?, numero = ?,
                              complemento = ?, bairro = ?, cidade = ?, uf = ? WHERE id = ?');
        $sql->execute([...$valores, $dados['id']]);
    } else {
        $sql = $pdo->prepare('INSERT INTO enderecos (apelido, cep, numero, complemento, bairro, cidade, uf)
                              VALUES (?, ?, ?, ?, ?, ?, ?)');
        $sql->execute($valores);
    }
    responder(['ok' => true]);
}

if ($metodo === 'DELETE') {
    try {
        $pdo->prepare('DELETE FROM enderecos WHERE id = ?')->execute([$_GET['id']]);
        responder(['ok' => true]);
    } catch (PDOException $e) {
        responder(['erro' => 'Este endereço está em uso em algum frete.'], 409);
    }
}