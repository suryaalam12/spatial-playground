function diagramZNT(layerPoly, znt_baru) {
  let counts = {};
  layerPoly.eachLayer(function (layer) {
    let value = layer.feature.properties[znt_baru];
    counts[value] = (counts[value] || 0) + 1;
  });

  let total = layerPoly.getLayers().length;
  let percentages = {};
  let labels = [];
  let data = [];

  for (let key in counts) {
    let percentage = Math.round((counts[key] / total) * 100 * 100) / 100;
    percentages[key] = percentage;
    labels.push(key);
    data.push(percentage);
  }

  const ctx = document.getElementById("chartZNT").getContext("2d");
  chartZNT = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Presentase Zona",
          data: data,
          backgroundColor: function (context) {
            var label = context.chart.data.labels[context.dataIndex];
            switch (label) {
              case "KA":
                return "yellow";
              case "KC":
                return "blue";
              case "KH":
                return "red";
              case "KD":
                return "green";
              case "KK":
                return "brown";
              case "KJ":
                return "gray";
              case "KM":
                return "purple";
              default:
                return "black";
            }
          },
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
        },
      },
    },
  });
  function tabelZNT(labels, data) {
    let tableHTML = `
    <style>
    table {
        width: 100%;
        border-collapse: collapse;
        margin top: 25px;
    }

    th, td {
        padding: 8px;
        text-align: left;
        border-bottom: 1px solid #ddd;
    }

    th {
        background-color: white;
        text-align: left;
    }

    tr:hover {
        background-color: #f5f5f5;
    }
    </style>
      <thead>
        <tr>
          <th>Presentase Pembayaran</th>
        </tr>
      </thead>
      <tbody>
    `;
    for (let i = 0; i < labels.length; i++) {
      tableHTML += `
        <tr>
        <td style="text-transform: uppercase;">${labels[i]}:</td>
          <td>${data[i]}%</td>
        </tr>
      `;
    }
    tableHTML += `
      </tbody>
    `;
    return tableHTML;
  }

  const tableContainer = document.getElementById("zntTabel");
  tableContainer.innerHTML = tabelZNT(labels, data);
}

function diagramPembayaran(layerPoly, status) {
  let counts = {};
  layerPoly.eachLayer(function (layer) {
    let value = layer.feature.properties[status];
    counts[value] = (counts[value] || 0) + 1;
  });

  let total = layerPoly.getLayers().length;
  let percentages = {};
  let labels = [];
  let data = [];

  for (let key in counts) {
    let percentage = Math.round((counts[key] / total) * 100 * 100) / 100;
    percentages[key] = percentage;
    labels.push(key);
    data.push(percentage);
  }

  const ctx = document.getElementById("chartPembayaran").getContext("2d");
  const chartPembayaran = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Presentase",
          data: data,
          backgroundColor: function (context) {
            var label = context.chart.data.labels[context.dataIndex];
            switch (label) {
              case "lunas":
                return "green";
              case "hutang":
                return "red";
              case "blokir":
                return "black";
              default:
                return "yellow";
            }
          },
        },
      ],
    },
  });
  function tabelPembayaran(labels, data) {
    let tableHTML = `
    <style>
    table {
        width: 100%;
        border-collapse: collapse;
        margin top: 25px;
    }

    th, td {
        padding: 8px;
        text-align: left;
        border-bottom: 1px solid #ddd;
    }

    th {
        background-color: white;
        text-align: left;
    }

    tr:hover {
        background-color: #f5f5f5;
    }
    </style>
      <thead>
        <tr>
          <th>Presentase Pembayaran</th>
        </tr>
      </thead>
      <tbody>
    `;
    for (let i = 0; i < labels.length; i++) {
      tableHTML += `
        <tr>
        <td style="text-transform: uppercase;">${labels[i]}:</td>
          <td>${data[i]}%</td>
        </tr>
      `;
    }
    tableHTML += `
      </tbody>
    `;
    return tableHTML;
  }

  const tableContainer = document.getElementById("bayarTabel");

  // Update the table content
  tableContainer.innerHTML = tabelPembayaran(labels, data);
}
