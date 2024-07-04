export function PIE_CHART_OPTIONS() {
  return {
    titleTextStyle: {
      fontSize: 18,
      color: '#333',
      fontName: 'Georgia, Times, serif;',
    },
    legend: {
      textStyle: { color: '#333', fontSize: 18, bold: true },
      position: 'bottom',
      alignment: 'center',
    },
    pieHole: 0.4,
  };
}

export function COLUMN_CHART_OPTIONS() {
  return {
    titleTextStyle: {
      fontSize: 18,
      color: '#333',
      fontName: 'Georgia, Times, serif;',
    },
    chartArea: {
      width: '50%',
      textStyle: {
        fontSize: 44,
        color: '#666',
      },
    },
    hAxis: {
      title: '',
      minValue: 0,
      titleTextStyle: {
        fontSize: 17,
      },
    },
    vAxis: {
      title: 'Valor R$',
      titleTextStyle: {
        fontSize: 17,
      },
    },
    legend: {
      textStyle: { color: '#333', fontSize: 18, bold: true },
      position: 'bottom',
      alignment: 'center',
    },
    tooltip: { textStyle: { color: 'blue', fontSize: 18 } },
  };
}

export function COLUMNS_TABLE() {
  return [
    {
      id: 'categoria_despesa',
      numeric: false,
      disablePadding: true,
      Header: 'Categoria',
    },
    {
      id: 'despesa_valor',
      numeric: false,
      disablePadding: false,
      Header: 'Descrição',
    },
    {
      id: 'recorrente',
      numeric: false,
      disablePadding: false,
      Header: 'Recorrente',
    },
    {
      id: 'parcela_atual',
      numeric: true,
      disablePadding: false,
      Header: 'Parcela Atual',
    },
    {
      id: 'parcela_total',
      numeric: true,
      disablePadding: false,
      Header: 'Parcela total',
    },
    {
      id: 'despesa_valor',
      numeric: true,
      disablePadding: false,
      Header: 'Valor',
    },
    {
      id: 'data_despesa',
      numeric: false,
      disablePadding: false,
      Header: 'Data',
    },
  ];
}
