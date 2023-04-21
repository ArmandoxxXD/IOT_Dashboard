window.addEventListener('load', onload);

function onload(event){
  chartT = createTemperatureChart();
  chartL = createLuzChart();
  chartP = createProximidadChart();
}

// Create Temperature Chart
function createTemperatureChart() {
  var chart = new Highcharts.Chart({
    chart:{ 
      renderTo:'chart-temperature',
      type: 'spline' 
    },
    series: [
      {
        name: 'BME280'
      }
    ],
    title: { 
      text: undefined
    },
    plotOptions: {
      line: { 
        animation: false,
        dataLabels: { 
          enabled: true 
        }
      }
    },
    xAxis: {
      type: 'datetime',
      dateTimeLabelFormats: { second: '%H:%M:%S' }
    },
    yAxis: {
      title: { 
        text: 'Temperatura en Grados Celcius' 
      }
    },
    credits: { 
      enabled: false 
    }
  });
  return chart;
}

// Create Humidity Chart
function createLuzChart(){
  var chartluz = new Highcharts.Chart({
    chart:{ 
      renderTo:'chart-luz',
      type: 'spline'  
    },
    series: [{
      name: 'BME281'
    }],
    title: { 
      text: undefined
    },    
    plotOptions: {
      line: { 
        animation: false,
        dataLabels: { 
          enabled: true 
        }
      },
      series: { 
        color: '#50b8b4' 
      }
    },
    xAxis: {
      type: 'datetime',
      dateTimeLabelFormats: { second: '%H:%M:%S' }
    },
    yAxis: {
      title: { 
        text: 'Luz (%)' 
      }
    },
    credits: { 
      enabled: false 
    }
  });
  return chartluz;
}

// Create Pressure Chart
function createProximidadChart() {
  var chartProximidad = new Highcharts.Chart({
    chart:{ 
      renderTo:'chart-proximidad',
      type: 'spline'  
    },
    series: [{
      name: 'BME282'
    }],
    title: { 
      text: undefined
    },    
    plotOptions: {
      line: { 
        animation: false,
        dataLabels: { 
          enabled: true 
        }
      },
      series: { 
        color: '#A62639' 
      }
    },
    xAxis: {
      type: 'datetime',
      dateTimeLabelFormats: { second: '%H:%M:%S' }
    },
    yAxis: {
      title: { 
        text: 'Proximidad ' 
      }
    },
    credits: { 
      enabled: false 
    }
  });
  return chartProximidad;
}