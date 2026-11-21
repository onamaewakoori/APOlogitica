const form = document.getElementById('form');
let listaProdutos = [];

function opcoes(lista, texto) {
  return '<option value="">Selecione...</option>' +
    lista.map((item) => `<option value="${item.id}">${esc(texto(item))}</option>`).join('');
}

function adicionarProduto() {
  const div = document.createElement('div');
  div.className = 'row g-2 mb-2 item';
  div.innerHTML = `
    <div class="col-8 col-md-9"><select class="form-select produto">${opcoes(listaProdutos, (p) => p.nome)}</select></div>
    <div class="col-3 col-md-2"><input type="number" min="1" value="1" class="form-control quantidade"></div>
    <div class="col-1"><button type="button" class="btn btn-outline-danger w-100" onclick="this.closest('.item').remove()"><i class="bi bi-x-lg"></i></button></div>`;
  document.getElementById('itens').appendChild(div);
}

function limpar() {
  form.reset();
  document.getElementById('data_frete').value = new Date().toLocaleDateString('en-CA');
  document.getElementById('itens').innerHTML = '';
  adicionarProduto();
}

async function listar() {
  const fretes = await api('fretes.php');
  document.getElementById('lista').innerHTML = fretes.map((f) => `
    <tr>
      <td>#${f.id}</td>
      <td>${f.data_frete.split('-').reverse().join('/')}</td>
      <td>${esc(f.transportador)}</td>
      <td>${esc(f.origem)} <i class="bi bi-arrow-right text-primary"></i> ${esc(f.destino)}</td>
      <td class="small">${esc(f.produtos)}</td>
      <td class="text-end"><button class="btn btn-sm btn-outline-danger" onclick="excluir(${f.id})"><i class="bi bi-trash"></i></button></td>
    </tr>`).join('');
}

async function excluir(id) {
  if (!confirm('Excluir este frete?')) return;
  await api('fretes.php', 'DELETE', null, id);
  alerta('Frete excluído.');
  listar();
}

form.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  const itens = [...document.querySelectorAll('.item')]
    .map((linha) => ({ produto_id: linha.querySelector('.produto').value, quantidade: linha.querySelector('.quantidade').value }))
    .filter((item) => item.produto_id);
  if (itens.length === 0) return alerta('Inclua ao menos um produto.', 'danger');

  const dados = {
    data_frete: document.getElementById('data_frete').value,
    transportador_id: document.getElementById('transportador_id').value,
    origem_id: document.getElementById('origem_id').value,
    destino_id: document.getElementById('destino_id').value,
    itens: itens,
  };
  try {
    await api('fretes.php', 'POST', dados);
    limpar();
    alerta('Frete gerado com sucesso.');
    listar();
  } catch (erro) {
    alerta(erro.message, 'danger');
  }
});

async function iniciar() {
  listaProdutos = await api('produtos.php');
  const enderecos = await api('enderecos.php');
  const transportadores = await api('transportadores.php');
  document.getElementById('transportador_id').innerHTML = opcoes(transportadores, (t) => t.nome);
  document.getElementById('origem_id').innerHTML = opcoes(enderecos, (e) => e.apelido + ' (' + e.cidade + '/' + e.uf + ')');
  document.getElementById('destino_id').innerHTML = opcoes(enderecos, (e) => e.apelido + ' (' + e.cidade + '/' + e.uf + ')');
  limpar();
  listar();
}
iniciar().catch((erro) => alerta(erro.message, 'danger'));