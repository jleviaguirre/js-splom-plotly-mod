import { plotlyParser } from './plotlyParser';

export function plotlySplom(rows, options){ 

  function unpack(rows, key) {
    return rows.map(function(row) { return row[key.replace('.',' ')]; });
  }


  //using computed colors
  let colors = options.colors

  let pl_colorscale = options.colorScale

  var data = [{
    type: 'splom',
    dimensions: options.dimensions,
    diagonal:{visible:options.isDiagonalVisible}, //check if there enough axis to avoid errors
    showupperhalf: options.isUpperHalfVisible,
    text: unpack(rows, 'class'),
    hoverinfo: 'none',
    marker: {
      color: colors,
      colorscale:pl_colorscale,
      size: options.marker.size * (window.innerHeight * window.innerWidth)/(1024*768), //dynamic marker size
      line: {
        color: options.marker.color,
        width: options.marker.width
      }
    }
  }]


  var layout = {
    // title:'Iris Data set',
    modebar:{remove:["autoScale2d", "autoscale", "editInChartStudio", "editinchartstudio", "hoverCompareCartesian", "hovercompare", "lasso", "lasso2d", "orbitRotation", "orbitrotation", "pan", "pan2d", "pan3d", "reset", "resetCameraDefault3d", "resetCameraLastSave3d", "resetGeo", "resetSankeyGroup", "resetScale2d", "resetViewMapbox", "resetViews", "resetcameradefault", "resetcameralastsave", "resetsankeygroup", "resetscale", "resetview", "resetviews", "select", "select2d", "sendDataToCloud", "senddatatocloud", "tableRotation", "tablerotation", "toImage", "toggleHover", "toggleSpikelines", "togglehover", "togglespikelines", "toimage", "zoom", "zoom2d", "zoom3d", "zoomIn2d", "zoomInGeo", "zoomInMapbox", "zoomOut2d", "zoomOutGeo", "zoomOutMapbox", "zoomin", "zoomout"]},
    height: visualViewport.height,
    width: visualViewport.width,
    showlegend:false,
    margin:{t:0},
    font:{size:options.labels.fontSize},
    autosize: false,
    hovermode:'closest',
    dragmode:false, //"select" activates marking | false disables marking
    // dragmode:"select", //"zoom" | "pan" | "select" | "lasso" | "drawclosedpath" | "drawopenpath" | "drawline" | "drawrect" | "drawcircle" | "orbit" | "turntable" | false
    // font:{color:options.fontColor, family:options.fontFamily, size:options.fontSize},
    
    paper_bgcolor:options.paper_bgcolor,
    //plot_bgcolor:'rgba(240,240,240, 0.95)',
    plot_bgcolor:options.plot_bgcolor + "55", //adding alpha channel
    // plot_bgcolor:options.plog_bgcolor,

    ...options.axes,
  }
  
  const Plotly = require('plotly.js-dist')
  Plotly.purge("plotyly_plot")
  Plotly.react('plotyly_plot', data, layout)

}