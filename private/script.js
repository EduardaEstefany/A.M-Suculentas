//private/script.js
const form = document.getElementById('form-produto');
const tabela = document.querySelector('#tabela-produtos tbody');
const cellFileInput = document.getElementById('cell-file-input');

// Funções para formatar moeda
function parseMoeda(valor) {
  if (!valor) return 0;
  return parseFloat(valor.replace(/\./g, '').replace(',', '.'));
}

function formatMoeda(valor) {
  return Number(valor).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Mensagens tipo toast
function mostrarMensagem(texto, tipo = 'success') {
  const toast = document.createElement('div');
  toast.className = 'toast' + (tipo === 'error' ? ' error' : '');
  toast.innerText = texto;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => document.body.removeChild(toast), 300);
  }, 2500);
}

// Listar produtos
async function listarProdutos() {
  try {
    const res = await fetch('/produtos');
    const produtos = await res.json();
    tabela.innerHTML = '';

    produtos.forEach(p => {
  console.log('Valor do campo imagem:', p.imagem);
      const imgValido = p.imagem && typeof p.imagem === 'string' && p.imagem.trim() !== '' && p.imagem.trim().toLowerCase() !== 'null';
      const imgSrc = imgValido
        ? (p.imagem.startsWith('/assets/produtosImg/') ? p.imagem : '/assets/produtosImg/' + p.imagem)
        : '/assets/produtosImg/sem-imagem.png';
      // Adiciona parâmetro único para evitar cache
      const imgSrcNoCache = `${imgSrc}?t=${Date.now()}`;
      tabela.innerHTML += `
        <tr data-id="${p.id}">
          <td>${p.id}</td>
          <td contenteditable="true" class="editable" data-field="nome">${p.nome}</td>
          <td contenteditable="true" class="editable" data-field="preco">${formatMoeda(p.preco)}</td>
          <td contenteditable="true" class="editable" data-field="estoque">${p.estoque}</td>
          <td contenteditable="true" class="editable" data-field="promocao">${p.promocao ? formatMoeda(p.promocao) : ''}</td>
          <td>
            <select class="ativo">
              <option value="true" ${p.ativo ? 'selected' : ''}>Ativado</option>
              <option value="false" ${!p.ativo ? 'selected' : ''}>Desativado</option>
            </select>
          </td>
          <td class="img-cell">
            <img src="${imgSrcNoCache}" alt="Produto ${p.id}" class="mini-img" onerror="this.onerror=null;this.src='/assets/produtosImg/sem-imagem.png';">
          </td>
        </tr>`;
    });

    // Clique na imagem para upload
    document.querySelectorAll('.img-cell img').forEach(img => {
      img.addEventListener('click', () => {
        const id = img.closest('tr').dataset.id;
        cellFileInput.dataset.produtoId = id;
        cellFileInput.click();
      });
    });

    // Edição de campos
    document.querySelectorAll('.editable').forEach(td => {
      td.addEventListener('focus', () => {
        td.dataset.valorAnterior = td.innerText;
        td.innerText = '';
      });
      td.addEventListener('blur', async () => {
        const id = td.parentElement.dataset.id;
        const field = td.dataset.field;
        let value = td.innerText;
        if (value.trim() === '') {
          td.innerText = td.dataset.valorAnterior;
          return;
        }
        if (field === 'preco' || field === 'promocao') value = parseMoeda(value);
        else if (field === 'estoque') value = parseInt(value);

        try {
          await fetch(`/produtos/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ [field]: value })
          });
          mostrarMensagem(`${field.charAt(0).toUpperCase() + field.slice(1)} salvo!`);
        } catch {
          mostrarMensagem('Erro ao atualizar!', 'error');
          td.innerText = td.dataset.valorAnterior;
        }
        if (field === 'preco' || field === 'promocao') td.innerText = formatMoeda(value);
      });
      td.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
          e.preventDefault();
          td.blur();
        }
      });
    });

    // Atualizar status
    document.querySelectorAll('.ativo').forEach(select => {
      select.addEventListener('change', async () => {
        const tr = select.closest('tr');
        const id = tr.dataset.id;
        const ativo = select.value === 'true';
        try {
          await fetch(`/produtos/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ativo })
          });
          mostrarMensagem('Status salvo!');
        } catch {
          mostrarMensagem('Erro ao atualizar status!', 'error');
        }
      });
    });

  } catch {
    mostrarMensagem('Erro ao carregar produtos!', 'error');
  }
}

// Criar produto
form.addEventListener('submit', async e => {
  e.preventDefault();
  const produto = {
    nome: document.getElementById('nome').value,
    preco: parseMoeda(document.getElementById('preco').value),
    estoque: parseInt(document.getElementById('estoque').value),
    promocao: parseMoeda(document.getElementById('promocao').value),
    ativo: document.getElementById('ativo').value === 'true'
  };

  try {
    const res = await fetch('/produtos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(produto)
    });
    const data = await res.json();
    document.getElementById('produto-id').value = data.id;
    form.reset();
    listarProdutos();
    mostrarMensagem('Produto criado!');
  } catch {
    mostrarMensagem('Erro ao criar produto!', 'error');
  }
});

// Upload de imagem
cellFileInput.addEventListener('change', async () => {
  const id = cellFileInput.dataset.produtoId;
  const arquivo = cellFileInput.files[0];
  if (!arquivo) return;

  const formData = new FormData();
  formData.append('imagem', arquivo);

  try {
    await fetch(`/produtos/${id}/imagem`, {
      method: 'POST',
      body: formData
    });
    mostrarMensagem('Imagem atualizada!');
    // Atualiza a tabela para mostrar a nova imagem
    listarProdutos();
  } catch {
    mostrarMensagem('Erro ao enviar imagem', 'error');
  }

  cellFileInput.value = ''; 
});

// Inicializa tabela
listarProdutos();
