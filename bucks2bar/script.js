const MONTHS = [
  'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
  'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
];
const STORAGE_KEY = 'bucks2bar-data';

const euro = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' });

const emptyState = () => ({ income: Array(12).fill(0), expense: Array(12).fill(0) });

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && saved.income?.length === 12 && saved.expense?.length === 12) return saved;
  } catch (error) {
    console.warn('Dati salvati non leggibili, vengono scartati.', error);
    localStorage.removeItem(STORAGE_KEY);
  }
  return emptyState();
}

let state = loadState();
let chart = null;

const rowsEl = document.getElementById('dataRows');

function sum(values) {
  return values.reduce((a, b) => a + b, 0);
}

function updateTotals() {
  const income = sum(state.income);
  const expense = sum(state.expense);
  document.getElementById('totalIncome').textContent = euro.format(income);
  document.getElementById('totalExpense').textContent = euro.format(expense);
  document.getElementById('balance').textContent = euro.format(income - expense);
}

function renderRows() {
  rowsEl.innerHTML = '';
  MONTHS.forEach((month, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <th scope="row">${month}</th>
      <td><input type="number" min="0" step="0.01" class="form-control" data-type="income" data-index="${i}" aria-label="Entrate ${month}"></td>
      <td><input type="number" min="0" step="0.01" class="form-control" data-type="expense" data-index="${i}" aria-label="Uscite ${month}"></td>`;
    tr.querySelectorAll('input').forEach((input) => {
      input.value = state[input.dataset.type][i] || '';
    });
    rowsEl.appendChild(tr);
  });
  updateTotals();
}

rowsEl.addEventListener('input', (e) => {
  const { type, index } = e.target.dataset;
  if (!type) return;
  const value = parseFloat(e.target.value);
  state[type][index] = Number.isFinite(value) && value >= 0 ? value : 0;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  updateTotals();
});

document.getElementById('resetBtn').addEventListener('click', () => {
  state = emptyState();
  localStorage.removeItem(STORAGE_KEY);
  renderRows();
});

function renderChart() {
  const datasets = [
    { label: 'Entrate', data: state.income, backgroundColor: 'rgba(25, 135, 84, 0.8)' },
    { label: 'Uscite', data: state.expense, backgroundColor: 'rgba(220, 53, 69, 0.8)' }
  ];

  if (chart) {
    chart.data.datasets = datasets;
    chart.update();
    return;
  }

  chart = new Chart(document.getElementById('barChart'), {
    type: 'bar',
    data: { labels: MONTHS, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { beginAtZero: true, ticks: { callback: (v) => euro.format(v) } }
      },
      plugins: {
        tooltip: {
          callbacks: { label: (ctx) => `${ctx.dataset.label}: ${euro.format(ctx.parsed.y)}` }
        }
      }
    }
  });
}

document.getElementById('chart-tab').addEventListener('shown.bs.tab', renderChart);

document.getElementById('downloadBtn').addEventListener('click', () => {
  if (!chart) renderChart();
  const { canvas } = chart;
  // Il canvas è trasparente: si disegna su sfondo bianco per un PNG leggibile
  const out = document.createElement('canvas');
  out.width = canvas.width;
  out.height = canvas.height;
  const ctx = out.getContext('2d');
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, out.width, out.height);
  ctx.drawImage(canvas, 0, 0);
  const link = document.createElement('a');
  link.href = out.toDataURL('image/png');
  link.download = 'bucks2bar-grafico.png';
  link.click();
});

renderRows();
