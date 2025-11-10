
// pai chart Expense Summary start
var config = {
  type: 'pie',
  options: {
      legend: {
          display: false
      },
      cutoutPercentage: 0.1,
      animation: {
          animateScale: true
      }
  },
  data: {
      labels: ["Fuel Cost", "Maintenance Cost", "Other Cost"],
      machineLabels: ["Fuel Cost", "Maintenance Cost", "Other Cost"],
      datasets: [{
          borderWidth: 1,  // Set the border width to 1
          backgroundColor: [
              '#26ade2',
              '#97D8F3',
              '#D4F2FF',
          ],
          data: [10, 20, 30]
      }]
  }
};

// Instantiate the pie chart in the canvas element.
var myPie = new Chart(document.getElementById('progress-chart'), config);

// Register click event to log the clicked label (machine name).
document.getElementById('progress-chart').onclick = function(evt) {
  var activePoints = myPie.getElementAtEvent(evt);
  var firstPoint = activePoints[0];
  if (firstPoint !== undefined) {
      var clickedItem = config.data.machineLabels[firstPoint._index];
      console.log(clickedItem);
  }
};

// Add the legend in custom area to allow CSS theming.
document.getElementById('chart-legend').innerHTML = myPie.generateLegend();

let ctx = document.getElementById("chart").getContext('2d');

var gradientStroke = ctx.createLinearGradient(500, 0, 100, 0);
gradientStroke.addColorStop(0, "#26ADE2");
gradientStroke.addColorStop(1, "#26ADE2");

var gradientBkgrd = ctx.createLinearGradient(0, 100, 0, 400);
gradientBkgrd.addColorStop(0, "rgba(244,94,132,0.2)");
gradientBkgrd.addColorStop(1, "rgba(249,135,94,0)");

let draw = Chart.controllers.line.prototype.draw;
Chart.controllers.line = Chart.controllers.line.extend({
  draw: function() {
      draw.apply(this, arguments);
      let ctx = this.chart.chart.ctx;
      let _stroke = ctx.stroke;
      ctx.stroke = function() {
          ctx.save();
          //ctx.shadowColor = 'rgba(244,94,132,0.8)';
          ctx.shadowBlur = 8;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 6;
          _stroke.apply(this, arguments)
          ctx.restore();
      }
  }
});
// pai chart Expense Summary end


// Maintenance Cost bar graph start
var chart = new Chart(ctx, {
  // The type of chart we want to create
  type: 'line',

  // The data for our dataset
  data: {
      labels: ["Aug 16", "Aug 17", "Aug 18", "Aug 19", "Aug 20", "Aug 21", "Aug 22", "Aug 23", "Aug 24", "Aug 25", "Aug 26", "Aug 27", "Aug 28"],
      datasets: [{
          label: "Maintenance Cost",
          backgroundColor: "#F3FCFF",
          borderColor: "#000", // Change to black color
          data: [5500, 2500, 10000, 6000, 14000, 1500, 7000, 16000, 17000, 15000, 14000, 16000, 18000],
          pointBorderColor: "#26ade2",
          pointBackgroundColor: "#26ade2",
          pointBorderWidth: 0,
          pointHoverRadius: 8,
          pointHoverBackgroundColor: gradientStroke,
          pointHoverBorderColor: "#26ade2",
          pointHoverBorderWidth: 4,
          pointRadius: 1,
          borderWidth: 3,
          pointHitRadius: 16,
      }]
  },

  // Configuration options go here
  options: {
      tooltips: {
          backgroundColor: '#fff',
          displayColors: false,
          titleFontColor: '#000',
          bodyFontColor: '#000'
      },
      legend: {
          display: false
      },
      scales: {
          xAxes: [{
              gridLines: {
                  display: false
              }
          }],
          yAxes: [{
              ticks: {
                  // Include a dollar sign in the ticks
                  callback: function(value, index, values) {
                      return (value / 1000) + 'K';
                  }
              }
          }],
      }
  }
});
// Maintenance Cost bar graph end
