const form = document.getElementById('form');
let enderecos = [];

async function listar() {
  enderecos = await api('enderecos.php');
  document.getElementById('lista').innerHTML = enderecos.map((e) => `
    <tr>
      <td>#${e.id}</td>
      <td class="fw-semibold">${esc(e.apelido)}</td>
      <td class="small">${esc(e.numero)} ${esc(e.complemento)}<br>
        <span class="text-muted">${esc(e.bairro)} · ${esc(e.cidade)}/${esc(e.uf)} · ${esc(e.cep)}</span></td>
      <td class="text-end">
        <button class="btn btn-sm btn-outline-primary" onclick="editar(${e.id})"><i class="bi bi-pencil"></i></button>
        <button class="btn btn-sm btn-outline-danger" onclick="excluir(${e.id})"><i class="bi bi-trash"></i></button>
      </td>
    </tr>`).join('');
}

function editar(id) {
  const endereco = enderecos.find((e) => e.id == id);
  for (const campo in endereco) {
    form.elements[campo].value = endereco[campo] ?? '';
  }
}

function limpar() {
  form.reset();
  form.elements['id'].value = '';
}

async function excluir(id) {
  if (!confirm('Excluir este endereço?')) return;
  try {
    await api('enderecos.php', 'DELETE', null, id);
    alerta('Endereço excluído.');
    listar();
  } catch (erro) {
    alerta(erro.message, 'danger');
  }
}

form.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  try {
    await api('enderecos.php', 'POST', Object.fromEntries(new FormData(form)));
    limpar();
    alerta('Endereço salvo.');
    listar();
  } catch (erro) {
    alerta(erro.message, 'danger');
  }
});

listar();