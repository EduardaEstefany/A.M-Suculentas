// public/script.js

// Botão voltar ao topo
const btnTopo = document.getElementById('btn-topo');
btnTopo.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
window.addEventListener('scroll', () => {
  btnTopo.style.display = window.scrollY > 200 ? 'block' : 'none';
});

// Carrossel do catálogo
let slideAtual = 0;

function moverCarrossel(direcao) {
  slideAtual += direcao;
  if (slideAtual < 0) {
    slideAtual = totalSlides - 1;
  } else if (slideAtual >= totalSlides) {
    slideAtual = 0;
  }
  atualizarCarrossel();
}

function irParaSlide(slide) {
  slideAtual = slide;
  atualizarCarrossel();
}

function atualizarCarrossel() {
  const track = document.querySelector('.carrossel-track');
  const indicadores = document.querySelectorAll('.indicador');
  if (track) {
    track.style.transform = `translateX(-${slideAtual * (100 / totalSlides)}%)`;
  }
  indicadores.forEach((indicador, index) => {
    indicador.classList.toggle('active', index === slideAtual);
  });
}

// Auto-play do carrossel
let autoplayInterval;
function iniciarAutoplay() {
  autoplayInterval = setInterval(() => {
    moverCarrossel(1);
  }, 5000);
}

// Carrega produtos ativos do servidor
let totalSlides = 0;

async function carregarProdutos() {
  try {
    const res = await fetch('/produtos/publicos'); // rota pública
    const produtos = await res.json();

    const carrossel = document.getElementById('carrossel-produtos');
    const indicadoresContainer = document.querySelector('.indicadores');

    carrossel.innerHTML = ''; // Limpa o carrossel antes de adicionar itens
    indicadoresContainer.innerHTML = ''; // Limpa indicadores

    produtos.forEach((produto, index) => {
      const item = document.createElement('div');
      item.className = 'carrossel-item';
      // Badge de promoção apenas com a porcentagem
      let badge = '';
      let precoHTML = '';
      
      if (produto.promocao && produto.promocao > 0) {
        badge = `<div class='promo-badge desconto'>- ${produto.promocao}%</div>`;
        // Calcula o preço com desconto
        const precoComDesconto = (produto.preco * (100 - produto.promocao) / 100).toFixed(2);
        precoHTML = `
          <p><span class="preco-original">R$ ${produto.preco}</span></p>
          <p class="preco-desconto">R$ ${precoComDesconto}</p>
        `;
      } else {
        precoHTML = `<p>R$ ${produto.preco}</p>`;
      }
      
      item.innerHTML = `
        <div class="carrossel-img-container" style="position:relative;">
          ${badge}
          <img src="${produto.imagem}" alt="${produto.nome}" />
        </div>
        <div class="item-overlay">
          <h4>${produto.nome}</h4>
          <p>${produto.descricao || ''}</p>
          ${precoHTML}
        </div>
      `;
      carrossel.appendChild(item);

      const indicador = document.createElement('span');
      indicador.className = 'indicador' + (index === 0 ? ' active' : '');
      indicador.onclick = () => irParaSlide(index);
      indicadoresContainer.appendChild(indicador);
    });

    totalSlides = produtos.length;
    atualizarCarrossel();
    iniciarAutoplay();

  } catch (err) {
    console.error('Erro ao carregar produtos:', err);
  }
}

carregarProdutos(); 