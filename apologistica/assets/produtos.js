const form = document.getElementById('form');
let produtos = [];

async function listar() {
  produtos = await api('produtos.php');
  document.getElementById('lista').innerHTML = produtos.map((p) => `
    <tr>
      <td>#${p.id}</td>
      <td>${esc(p.nome)}<div class="small text-muted">${esc(p.descricao)}</div></td>
      <td>${esc(p.sku)}</td>
      <td>${Number(p.peso).toFixed(3)} kg</td>
      <td>R$ ${Number(p.valor).toFixed(2).replace('.', ',')}</td>
      <td class="text-end">
        <button class="btn btn-sm btn-outline-primary" onclick="editar(${p.id})"><i class="bi bi-pencil"></i></button>
        <button class="btn btn-sm btn-outline-danger" onclick="excluir(${p.id})"><i class="bi bi-trash"></i></button>
      </td>
    </tr>`).join('');
}

function editar(id) {
  const produto = produtos.find((p) => p.id == id);
  for (const campo in produto) {
    form.elements[campo].value = produto[campo] ?? '';
  }
}

function limpar() {
  form.reset();
  form.elements['id'].value = '';
}

async function excluir(id) {
  if (!confirm('Excluir este produto?')) return;
  try {
    await api('produtos.php', 'DELETE', null, id);
    alerta('Produto excluído.');
    listar();
  } catch (erro) {
    alerta(erro.message, 'danger');
  }
}

form.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  try {
    await api('produtos.php', 'POST', Object.fromEntries(new FormData(form)));
    limpar();
    alerta('Produto salvo.');
    listar();
  } catch (erro) {
    alerta(erro.message, 'danger');
  }
});

listar();