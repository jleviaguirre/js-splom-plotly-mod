import { plotlyParser } from './plotlyParser';

export function plotlySplom(rows, options){ 

  function unpack(rows, key) {
    return rows.map(function(row) { return row[key.replace('.',' ')]; });
  }

  // let colors = []
  // for (let i=0; i < unpack(rows, 'class').length; i++) {
  //   if (unpack(rows, 'class')[i] == "Iris-setosa") {
  //     colors.push(1/3)
  //   } else if (unpack(rows, 'class')[i] == "Iris-versicolor") {
  //     colors.push(2/3)
  //   } else if (unpack(rows, 'class')[i] == "Iris-virginica") {
  //     colors.push(3/3)
  //   }
  // }
  const colors = options.colors

  // var pl_colorscale=[
  //            [0, "RED"],
  //            [1/3, "green"],
  //            [2/3, "yellow"],
  //            [1, "yellow"]
  // ]
  const pl_colorscale = options.colorScale

  //remve this soon
  var axis = () => ({
    showline:false,
    zeroline:false,
    gridcolor:'#ffff',
    ticklen:4
  }) 

  var data = [{
    type: 'splom',
    // dimensions: [
      //   {label:'sepal length', values:unpack(rows,'sepal length')},
      //   {label:'sepal width', values:unpack(rows,'sepal width')},
      //   {label:'petal length', values:unpack(rows,'petal length')},
      //   {label:'petal width', values:unpack(rows,'petal width')}
      // ],
    dimensions: options.dimensions,
    diagonal:{visible:false},
    showupperhalf: false,
    text: unpack(rows, 'class'),
    hoverinfo: 'none',
    marker: {
      color: colors,
      colorscale:pl_colorscale,
      size: 7,
      line: {
        color: 'white',
        width: 0.5
      }
    }
  }]

  var layout = {
    // title:'Iris Data set',
    modebar:{remove:["autoScale2d", "autoscale", "editInChartStudio", "editinchartstudio", "hoverCompareCartesian", "hovercompare", "lasso", "lasso2d", "orbitRotation", "orbitrotation", "pan", "pan2d", "pan3d", "reset", "resetCameraDefault3d", "resetCameraLastSave3d", "resetGeo", "resetSankeyGroup", "resetScale2d", "resetViewMapbox", "resetViews", "resetcameradefault", "resetcameralastsave", "resetsankeygroup", "resetscale", "resetview", "resetviews", "select", "select2d", "sendDataToCloud", "senddatatocloud", "tableRotation", "tablerotation", "toImage", "toggleHover", "toggleSpikelines", "togglehover", "togglespikelines", "toimage", "zoom", "zoom2d", "zoom3d", "zoomIn2d", "zoomInGeo", "zoomInMapbox", "zoomOut2d", "zoomOutGeo", "zoomOutMapbox", "zoomin", "zoomout"]},
    height: visualViewport.height*1,
    width: visualViewport.width,
    autosize: false,
    hovermode:'closest',
    dragmode:'select',
    // font:{color:options.fontColor, family:options.fontFamily, size:options.fontSize},
    paper_bgcolor:options.paper_bgcolor,

    // plot_bgcolor:options.plot_bgcolor,
    plot_bgcolor:'rgba(240,240,240, 0.95)',


    // ...options.axes
    xaxis:axis(),
    yaxis:axis(),
    xaxis2:axis(),
    xaxis3:axis(),
    xaxis4:axis(),
    xaxis5:axis(),
    xaxis6:axis(),
    xaxis7:axis(),
    xaxis8:axis(),
    yaxis2:axis(),
    yaxis3:axis(),
    yaxis4:axis(),
    yaxis5:axis(),
    yaxis6:axis(),
    yaxis7:axis(),
    yaxis8:axis()

  }

  console.log(layout)

  const Plotly = require('plotly.js-dist')
  Plotly.purge("plotyly_plot")
  Plotly.react('plotyly_plot', data, layout)
}