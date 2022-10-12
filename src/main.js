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

        if (errors.length > 0) {
            // Showing an error overlay will hide the mod iframe.
            // Clear the mod content here to avoid flickering effect of
            // an old configuration when next valid data view is received.
            mod.controls.errorOverlay.show(errors);
            return;
        }
        mod.controls.errorOverlay.hide(); 
        //  console.clear();

        
       //1. get default or saved preferences
       //default popout / plottly preferences 
       //note! when adding new properties, make sure 1.b runs during development at least once to reset mod.property.plotlySettings
       let defaultPreferences = {
        isUpperHalfVisible: !true,
        isDiagonalVisible: !true,
        showAxisLines: false,
        gridLinesColor: "#f5f5f5",
        plot_bgcolor: "#ffffff",
        marker: {
            "size": 8,
            "color": "#000000",
            "width": 0.5
        },
        labels:{
            fontSize:12,
            xLabelRotation:11,
            yLabelRotation:11
        }
       } 

       //1.a read plot settings from mod property
       let plotlySettingsValue = (await mod.property("plotlySettings")).value();
       
       //1.b if mod property not set, set defaults (set true to reset mod property to default )
       let override = !true;
       if (override||plotlySettingsValue=="-") (await mod.property("plotlySettings")).set(JSON.stringify(defaultPreferences)); 

       //1.c read mod property
       let plotlySettings = JSON.parse((await mod.property("plotlySettings")).value());
       let preferences = plotlySettings;


        //check for plot requirements (check for errors)
        // console.log(xAxis.parts);
        if (xAxis.parts.length<2) {
            mod.controls.errorOverlay.show("Please select at least two columns for Dimensions axis");
            return;
        };
        if (xAxis.parts[0].expression!="baserowid()") {
            mod.controls.errorOverlay.show("Please select (Row Number) as the first column for the Dimensions axis");
            return;
        }
        if (!preferences.isDiagonalVisible && xAxis.parts.length<4 )  {
            mod.controls.errorOverlay.show("If Diagonal plots are turned off, you need at least 3 columns for the Dimensions axis in addition to the (Row Number) column");
            return;
        }

        mod.controls.errorOverlay.hide();

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
        let layout = await plotlyParser.layout(dataView, parsedData.rows, preferences)

 
        let options = {
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
     }

       //measure performance
       start = new Date();

       
       

       //render the plot
        plotlySplom(parsedData.rows, options);
        //end parsing data and measuring performance
        //console.log("rendering took ", ((new Date()) - start)/1000," seconds");


        //tooltips and gui stuff
        plotlyGUI.setTooltips(mod);
        let font = {size:context.styling.general.font.fontSize,family:context.styling.general.font.fontFamily}
        plotlyGUI.setConfiguration(mod,preferences,context.isEditing,font);

        //enable spotfire marking (also check splom.plotly.js layout.dragmode.select for plotly marking mode)
        //plotlyGUI.setMarking(dataView,parsedData.rows);


     /*shows a popover TEST*/
    //  document.getElementById("testpopout").onclick= x=>{
    //      let { radioButton, checkbox, button } = mod.controls.popout.components
    //      let { section } = mod.controls.popout
    //      let b1 = radioButton({ enabled: true, name: "myRadio", text: "a radio" })
    //      let b2 = checkbox({ enabled: true, name: "myChk", text: "a checkbox", checked: true })
    //      let b3 = button({ enabled: true, name: "myBtn", text: "a button" })
    //      mod.controls.popout.show({x: 10, y: 10, autoClose: !true}, () => [
    //          section({ heading: "section A", children: [b1, b2] }),
    //          section({ heading: "section B", children: [b3, b3] }) 
    //         ]);
    // }
            
        // console.log(context.styling.general.font.fontFamily) 
        // console.log(context.styling.general.font.fontSize) 


        /**
         * Signal that the mod is ready for export.
         */
        context.signalRenderComplete(); 


    }
});
