const form = document.getElementById('form');
let transportadores = [];

function adicionarTelefone(valor = '') {
  const div = document.createElement('div');
  div.className = 'input-group';
  div.innerHTML = `
    <input class="form-control telefone">
    <button type="button" class="btn btn-outline-danger" onclick="this.parentElement.remove()"><i class="bi bi-x-lg"></i></button>`;
  div.querySelector('input').value = valor;
  document.getElementById('telefones').appendChild(div);
}

async function listar() {
  transportadores = await api('transportadores.php');
  document.getElementById('lista').innerHTML = transportadores.map((t) => `
    <tr>
      <td>#${t.id}</td>
      <td class="fw-semibold">${esc(t.nome)}<div class="small text-muted">${esc(t.tipo_doc)} ${esc(t.documento)} · ${esc(t.placa)}</div></td>
      <td class="small">${esc(t.telefones)}<br>${esc(t.email)}</td>
      <td class="text-end">
        <button class="btn btn-sm btn-outline-primary" onclick="editar(${t.id})"><i class="bi bi-pencil"></i></button>
        <button class="btn btn-sm btn-outline-danger" onclick="excluir(${t.id})"><i class="bi bi-trash"></i></button>
      </td>
    </tr>`).join('');
}

function editar(id) {
  const t = transportadores.find((x) => x.id == id);
  for (const campo in t) {
    if (form.elements[campo]) form.elements[campo].value = t[campo] ?? '';
  }
  document.getElementById('telefones').innerHTML = '';
  (t.telefones ? t.telefones.split(' / ') : ['']).forEach((tel) => adicionarTelefone(tel));
}

function limpar() {
  form.reset();
  form.elements['id'].value = '';
  document.getElementById('telefones').innerHTML = '';
  adicionarTelefone();
}

async function excluir(id) {
  if (!confirm('Excluir este transportador?')) return;
  try {
    await api('transportadores.php', 'DELETE', null, id);
    alerta('Transportador excluído.');
    listar();
  } catch (erro) {
    alerta(erro.message, 'danger');
  }
}

form.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  const dados = Object.fromEntries(new FormData(form));
  dados.telefones = [...document.querySelectorAll('.telefone')].map((i) => i.value.trim()).filter((t) => t).join(' / ');
  try {
    await api('transportadores.php', 'POST', dados);
    limpar();
    alerta('Transportador salvo.');
    listar();
  } catch (erro) {
    alerta(erro.message, 'danger');
  }
});

limpar();
listar();