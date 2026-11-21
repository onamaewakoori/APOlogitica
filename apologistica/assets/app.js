async function api(arquivo, metodo = 'GET', dados = null, id = '') {
  const resposta = await fetch(arquivo + (id ? '?id=' + id : ''), {
    method: metodo,
    headers: { 'Content-Type': 'application/json' },
    body: dados ? JSON.stringify(dados) : null,
  });
  const json = await resposta.json();
  if (!resposta.ok) throw new Error(json.erro);
  return json;
}

function esc(texto) {
  const div = document.createElement('div');
  div.textContent = texto ?? '';
  return div.innerHTML;
}

function alerta(mensagem, tipo = 'success') {
  document.getElementById('alerta').innerHTML = `<div class="alert alert-${tipo}">${esc(mensagem)}</div>`;
}