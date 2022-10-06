/*
 * Copyright © 2020. TIBCO Software Inc.
 * This file is subject to the license terms contained
 * in the license file that is distributed with this file.
 */

//@ts-check - Get type warnings from the TypeScript language server. Remove if not wanted.

//these two imports are for dev and hard coded stuff
import * as d3 from "d3";  
import {irisCSVData} from "./irisData";

import {plotlySplom} from "./splom.plotly";
import {plotlyParser} from "./plotlyParser"; 
import {plotlyGUI} from "./plotlyGUI"; 


/**
 * Get access to the Spotfire Mod API by providing a callback to the initialize method.
 * @param {Spotfire.Mod} mod - mod api!
 */
Spotfire.initialize(async (mod) => {
    /**
     * Create the read function.
     */
    const reader = mod.createReader(mod.visualization.data(), mod.windowSize(), mod.property("plotlySettings"));

    /**
     * Store the context.
     */
    const context = mod.getRenderContext();

    /**
     * Initiate the read loop
     */
    reader.subscribe(render);

    /**
     * @param {Spotfire.DataView} dataView
     * @param {Spotfire.Size} windowSize
     * @param {Spotfire.ModProperty<string>} prop
     */
    async function render(dataView, windowSize, prop) {

        //error handling starts here
        let errors = await dataView.getErrors();

        //if nothing is selected for x axis Hierarchy, show error
        let xAxis = await mod.visualization.axis("Dimensions")
        // if(!xAxis.parts.length) errors.push("Please add a hierarchy to the X Axis. First node should be (Row Number)")

        //if first node is not row number, show warning
        document.getElementById("warning").hidden = !(xAxis.parts.length>0 && xAxis.parts[0].expression != "baserowid()")
        
        if (errors.length > 0) {
            // Showing an error overlay will hide the mod iframe.
            // Clear the mod content here to avoid flickering effect of
            // an old configuration when next valid data view is received.
            mod.controls.errorOverlay.show(errors);
            return;
        }
        // mod.controls.errorOverlay.hide();
        // console.clear();
        

        const xHierarchy = await dataView.hierarchy("Dimensions");
        const xRoot = await xHierarchy.root();
        

        if (!xAxis.parts.length) return;

        //get data from spotfire
        //plotlyParser parses the hierarchy from X axis containing continous measures. 
        //first level must be rowid. Example:
        //<baserowid() NEST [measure1] NEST [measure2] NEST [measure3] NEST [measureN]>
        let start = new Date();
        const parsedData = await plotlyParser.data(dataView).then((theParsedData)=>{
            //console.log("parsing took ", ((new Date()) - start)/1000," seconds");
            return theParsedData;
        });
        
        //or use demo data from irisCSVData
        // parsedData.rows = d3.csvParse(irisCSVData);

        //get layout options
        let layout = await plotlyParser.layout(dataView, parsedData.rows)


       //default popout / plottly preferences 
       let defaultPreferences = {
        "isUpperHalfVisible": false,
        "isDiagonalVisible": false,
        "showAxisLines": false,
        "gridLinesColor": "#f5f5f5",
        "plot_bgcolor": "#ffffff",
        "marker": {
            "size": 8,
            "color": "#000000",
            "width": 0.5
            }
        } 


       //read plot settings from mod property
       let plotlySettingsValue = (await mod.property("plotlySettings")).value();
       
       //if mod property not set, set defaults
       if (plotlySettingsValue=="-") (await mod.property("plotlySettings")).set(JSON.stringify(defaultPreferences));

       let plotlySettings = JSON.parse((await mod.property("plotlySettings")).value());
       //read mod property
       let preferences = plotlySettings;



 
 

 

       //measure performance
       start = new Date();

       //parse data
        plotlySplom(parsedData.rows, {
            colorScale:parsedData.colorScale,
            colors:parsedData.colors,
            fontColor:context.styling.general.font.color,
            fontFamily:context.styling.general.font.fontFamily,
            fontSize:context.styling.general.font.fontSize,
            paper_bgcolor:context.styling.general.backgroundColor,
            plot_bgcolor:context.styling.general.backgroundColor,
            dimensions:layout.dimentions,
            axes:layout.axes,
            ...preferences
        },preferences);
        //end parsing data and measuring performance
        //console.log("rendering took ", ((new Date()) - start)/1000," seconds");


        //tooltips and gui stuff
        plotlyGUI.setTooltips(mod);
        plotlyGUI.setConfiguration(mod,preferences);

        //enable marking
        plotlyGUI.setMarking(dataView,parsedData.rows);



        /**
         * Signal that the mod is ready for export.
         */
        context.signalRenderComplete(); 


    }
});
