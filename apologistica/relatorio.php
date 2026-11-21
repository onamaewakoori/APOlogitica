<?php
require 'config.php';
require 'vendor/autoload.php';
use Dompdf\Dompdf;

function h($texto) { return htmlspecialchars((string)$texto); }

$data = date('Y-m-d', strtotime($_GET['data'] ?? 'today'));

$sql = $pdo->prepare("SELECT f.id, t.nome AS transportador, o.apelido AS origem, d.apelido AS destino
                      FROM fretes f
                      JOIN transportadores t ON t.id = f.transportador_id
                      JOIN enderecos o ON o.id = f.origem_id
                      JOIN enderecos d ON d.id = f.destino_id
                      WHERE f.data_frete = ? ORDER BY f.id");
$sql->execute([$data]);
$fretes = $sql->fetchAll();

$sqlItens = $pdo->prepare('SELECT p.nome, i.quantidade, p.peso, p.valor
                           FROM frete_itens i JOIN produtos p ON p.id = i.produto_id
                           WHERE i.frete_id = ?');

$html = '<h2>Relatório de fretes - ' . date('d/m/Y', strtotime($data)) . '</h2>';
if (!$fretes) {
    $html .= '<p>Nenhum frete nesta data.</p>';
}
$totalGeral = 0;

foreach ($fretes as $f) {
    $html .= '<h3>Frete #' . $f['id'] . '</h3>';
    $html .= '<p>Transportador: ' . h($f['transportador']) . '<br>Origem: ' . h($f['origem']) . '<br>Destino: ' . h($f['destino']) . '</p>';
    $html .= '<table border="1" cellpadding="5" cellspacing="0" width="100%">
              <tr><th>Produto</th><th>Qtd</th><th>Peso total (kg)</th><th>Valor total</th></tr>';

    $sqlItens->execute([$f['id']]);
    $totalFrete = 0;
    foreach ($sqlItens->fetchAll() as $item) {
        $pesoTotal = $item['peso'] * $item['quantidade'];
        $valorTotal = $item['valor'] * $item['quantidade'];
        $totalFrete += $valorTotal;
        $html .= '<tr><td>' . h($item['nome']) . '</td><td>' . $item['quantidade'] . '</td><td>'
               . number_format($pesoTotal, 3, ',', '.') . '</td><td>R$ ' . number_format($valorTotal, 2, ',', '.') . '</td></tr>';
    }
    $html .= '</table><p><b>Total do frete: R$ ' . number_format($totalFrete, 2, ',', '.') . '</b></p>';
    $totalGeral += $totalFrete;
}
$html .= '<h3>Total do dia: R$ ' . number_format($totalGeral, 2, ',', '.') . '</h3>';

$dompdf = new Dompdf();
$dompdf->loadHtml('<meta charset="UTF-8"><style>body{font-family:sans-serif;font-size:12px}</style>' . $html);
$dompdf->setPaper('A4');
$dompdf->render();
$dompdf->stream('fretes_' . $data . '.pdf', ['Attachment' => true]);