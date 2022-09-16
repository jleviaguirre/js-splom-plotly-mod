import { plotlyParser } from './plotlyParser';

export function plotlySplom(rows, options,preferences){ 

  function unpack(rows, key) {
    return rows.map(function(row) { return row[key.replace('.',' ')]; });
  }

  let colors = []
  for (let i=0; i < unpack(rows, 'class').length; i++) {
    if (unpack(rows, 'class')[i] == "Iris-setosa") {
      colors.push(1/3)
    } else if (unpack(rows, 'class')[i] == "Iris-versicolor") {
      colors.push(2/3)
    } else if (unpack(rows, 'class')[i] == "Iris-virginica") {
      colors.push(3/3)
    }
  }
  // colors = options.colors
  console.log(1,colors)
  console.log(2,options.colors)

//   var pl_colorscale=[
//     [0.0, '#19d3f3'],
//     [0.333, '#19d3f3'],
//     [0.333, '#e763fa'],
//     [0.666, '#e763fa'],
//     [0.666, '#636efa'],
//     [1, '#636efa']
// ]
  let pl_colorscale = options.colorScale

  //remve this soon because it is implemented in plotlyParser to generate the dynamic layout (options.axes), which is hardcoded here
  var axis = () => ({
    showline:options.showAxisLines,
    zeroline:false,
    gridcolor:options.gridLinesColor,
    ticklen:3
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
    diagonal:{visible:options.isDiagonalVisible}, //check if there enough axis to avoid errors
    showupperhalf: options.isUpperHalfVisible,
    text: unpack(rows, 'class'),
    hoverinfo: 'none',
    marker: {
      color: colors,
      colorscale:pl_colorscale,
      size: options.marker.size,
      line: {
        color: options.marker.color,
        width: options.marker.width
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
    //plot_bgcolor:'rgba(240,240,240, 0.95)',
    plot_bgcolor:options.plot_bgcolor + "55", //adding alpha channel
    // plot_bgcolor:options.plog_bgcolor,

    // ...options.axes,
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

  //debug dynamic axes
  // console.log(1,layout)
  // console.log(2,options.axes)
  
  const Plotly = require('plotly.js-dist')
  Plotly.purge("plotyly_plot")
  Plotly.react('plotyly_plot', data, layout)
  console.log(1,data)
  console.log(2,layout)

  //do marking
  let plotDiv = document.getElementById("plotyly_plot")
  plotDiv.on('plotly_selecting', (eventData) => {
    let rgb = "rgb(222,222,222,.5)"
    let element = document.querySelector('.select-outline-1, [class*="select"]')
    // element.style.fill=rgb;
    // console.log(eventData,element);
  })
 


}