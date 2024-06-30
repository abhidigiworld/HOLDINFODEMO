document.addEventListener('DOMContentLoaded', async () => {
  const response = await fetch('/api/tickers');
  const tickers = await response.json();

  const tableBody = document.querySelector('#tickers-table tbody');
  tickers.forEach(ticker => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${ticker.name}</td>
      <td>${ticker.last}</td>
      <td>${ticker.buy}</td>
      <td>${ticker.sell}</td>
      <td>${ticker.volume}</td>
      <td>${ticker.base_unit}</td>
    `;
    tableBody.appendChild(row);
  });
});
