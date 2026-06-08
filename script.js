const coefA = document.getElementById('coefA');
const coefB = document.getElementById('coefB');
const coefC = document.getElementById('coefC');
const resultado = document.getElementById('resultado');
const calcularBtn = document.getElementById('calcularBtn');
const canvas = document.getElementById('grafico');
const ctx = canvas.getContext('2d');

function formatarNumero(valor) {
  if (!Number.isFinite(valor)) return 'indefinido';
  const arredondado = Math.abs(valor) < 0.000001 ? 0 : valor;
  return Number(arredondado.toFixed(4)).toString().replace('.', ',');
}

function calcular() {
  const a = Number(coefA.value);
  const b = Number(coefB.value);
  const c = Number(coefC.value);

  if (!Number.isFinite(a) || !Number.isFinite(b) || !Number.isFinite(c)) {
    resultado.innerHTML = '<p class="erro">Digite valores numéricos válidos.</p>';
    limparGrafico();
    return;
  }

  if (a === 0) {
    resultado.innerHTML = '<p class="erro">Para ser uma equação do 2º grau, o coeficiente a precisa ser diferente de zero.</p>';
    limparGrafico();
    return;
  }

  const delta = b * b - 4 * a * c;
  const xv = -b / (2 * a);
  const yv = a * xv * xv + b * xv + c;
  const concavidade = a > 0 ? 'para cima' : 'para baixo';

  let raizesTexto = '';

  if (delta > 0) {
    const x1 = (-b + Math.sqrt(delta)) / (2 * a);
    const x2 = (-b - Math.sqrt(delta)) / (2 * a);
    raizesTexto = `<p>Como Δ é positivo, existem duas raízes reais: <span class="destaque">x₁ = ${formatarNumero(x1)}</span> e <span class="destaque">x₂ = ${formatarNumero(x2)}</span>.</p>`;
  } else if (delta === 0) {
    const x = -b / (2 * a);
    raizesTexto = `<p>Como Δ é zero, existe uma raiz real dupla: <span class="destaque">x = ${formatarNumero(x)}</span>.</p>`;
  } else {
    raizesTexto = '<p>Como Δ é negativo, não existem raízes reais. A parábola não cruza o eixo x.</p>';
  }

  resultado.innerHTML = `
    <p>Equação: <span class="destaque">${formatarNumero(a)}x² ${b >= 0 ? '+' : '-'} ${formatarNumero(Math.abs(b))}x ${c >= 0 ? '+' : '-'} ${formatarNumero(Math.abs(c))} = 0</span></p>
    <p>Delta: <span class="destaque">Δ = ${formatarNumero(delta)}</span></p>
    ${raizesTexto}
    <p>Vértice: <span class="destaque">V(${formatarNumero(xv)}, ${formatarNumero(yv)})</span></p>
    <p>Concavidade: <span class="destaque">${concavidade}</span></p>
  `;

  desenharGrafico(a, b, c, xv, yv);
}

function limparGrafico() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function desenharGrafico(a, b, c, xv, yv) {
  const largura = canvas.width;
  const altura = canvas.height;
  const margem = 42;

  ctx.clearRect(0, 0, largura, altura);

  const xMin = xv - 10;
  const xMax = xv + 10;
  const pontos = [];

  for (let i = 0; i <= 240; i++) {
    const x = xMin + (i / 240) * (xMax - xMin);
    const y = a * x * x + b * x + c;
    pontos.push({ x, y });
  }

  const valoresY = pontos.map(p => p.y).concat([0, yv]);
  let yMin = Math.min(...valoresY);
  let yMax = Math.max(...valoresY);
  const folga = Math.max(1, (yMax - yMin) * 0.15);
  yMin -= folga;
  yMax += folga;

  function mapX(x) {
    return margem + ((x - xMin) / (xMax - xMin)) * (largura - 2 * margem);
  }

  function mapY(y) {
    return altura - margem - ((y - yMin) / (yMax - yMin)) * (altura - 2 * margem);
  }

  ctx.strokeStyle = 'rgba(255,255,255,0.12)';
  ctx.lineWidth = 1;
  ctx.font = '12px Arial';
  ctx.fillStyle = 'rgba(229,231,235,0.75)';

  for (let i = 0; i <= 10; i++) {
    const x = xMin + i * (xMax - xMin) / 10;
    const px = mapX(x);
    ctx.beginPath();
    ctx.moveTo(px, margem);
    ctx.lineTo(px, altura - margem);
    ctx.stroke();
    ctx.fillText(formatarNumero(x), px - 10, altura - 16);
  }

  for (let i = 0; i <= 8; i++) {
    const y = yMin + i * (yMax - yMin) / 8;
    const py = mapY(y);
    ctx.beginPath();
    ctx.moveTo(margem, py);
    ctx.lineTo(largura - margem, py);
    ctx.stroke();
    ctx.fillText(formatarNumero(y), 8, py + 4);
  }

  ctx.strokeStyle = 'rgba(255,255,255,0.55)';
  ctx.lineWidth = 2;

  if (xMin <= 0 && xMax >= 0) {
    const eixoY = mapX(0);
    ctx.beginPath();
    ctx.moveTo(eixoY, margem);
    ctx.lineTo(eixoY, altura - margem);
    ctx.stroke();
  }

  if (yMin <= 0 && yMax >= 0) {
    const eixoX = mapY(0);
    ctx.beginPath();
    ctx.moveTo(margem, eixoX);
    ctx.lineTo(largura - margem, eixoX);
    ctx.stroke();
  }

  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 4;
  ctx.beginPath();
  pontos.forEach((p, index) => {
    const px = mapX(p.x);
    const py = mapY(p.y);
    if (index === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  });
  ctx.stroke();

  ctx.fillStyle = '#22c55e';
  ctx.beginPath();
  ctx.arc(mapX(xv), mapY(yv), 6, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#e5e7eb';
  ctx.fillText(`V(${formatarNumero(xv)}, ${formatarNumero(yv)})`, mapX(xv) + 10, mapY(yv) - 10);
}

calcularBtn.addEventListener('click', calcular);
[coefA, coefB, coefC].forEach(input => {
  input.addEventListener('keydown', event => {
    if (event.key === 'Enter') calcular();
  });
});

calcular();
