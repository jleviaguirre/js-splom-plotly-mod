//this module is responsible for all the gui stuff, configuration, tooltips, alerts, etc.
import {JSONEditor} from "@json-editor/json-editor";

export const plotlyGUI = {


        //from this point on, move to another file called plotlyGUI.js
        
        setTooltips:function(mod){
                //plotly is rendered in plotly_plot, so add spotfire like tooltips
                let myPlot = document.getElementById("plotyly_plot")
                myPlot.on('plotly_hover', function(e){
                        let p = e.points[0]
                        mod.controls.tooltip.show(`(${p.x}, ${p.y})`)
                });
                myPlot.on('plotly_unhover', function(e){
                        mod.controls.tooltip.hide() 
                });

                //warning tooltip

                const warn = document.getElementById("warning");
                warn.onmouseover = ()=> mod.controls.tooltip.show("first node of the hierarchy should be the Row Number (baserowid())")
                warn.onmouseout = mod.controls.tooltip.hide
        },

        setConfiguration:async function(mod, preferences){

                //replace plotly icon from toolbar link with gear
                const btnModConfig = `
                <a rel="tooltip" 
                onclick="showConfigDialog()"
                id="btnModConfig"
                class="modebar-btn" 
                data-title="Configgure this Mod" 
                data-attr="zoom" 
                data-val="reset" 
                data-toggle="false" 
                data-gravity="n">
                <svg xmlns="http://www.w3.org/2000/svg"
                width="1em" height="1em"
                viewBox="0 0 54 54">
        <path  d="M27,18c-4.962,0-9,4.038-9,9s4.038,9,9,9s9-4.038,9-9S31.962,18,27,18z"/>
        <path  d="M51.22,21h-2.018c-0.515-1.911-1.272-3.74-2.26-5.457l1.426-1.426c0.525-0.525,0.814-1.224,0.814-1.966
                c0-0.743-0.289-1.441-0.814-1.967l-4.553-4.553c-1.05-1.049-2.881-1.051-3.933,0l-1.426,1.426C36.74,6.07,34.911,5.313,33,4.798
                V2.78C33,1.247,31.753,0,30.22,0H23.78C22.247,0,21,1.247,21,2.78v2.018c-1.911,0.515-3.74,1.272-5.457,2.26l-1.426-1.426
                c-1.051-1.052-2.883-1.05-3.933,0l-4.553,4.553c-0.525,0.525-0.814,1.224-0.814,1.967c0,0.742,0.289,1.44,0.814,1.966l1.426,1.426
                C6.07,17.26,5.312,19.089,4.798,21H2.78C1.247,21,0,22.247,0,23.78v6.438C0,31.752,1.247,33,2.78,33h2.018
                c0.515,1.911,1.272,3.74,2.26,5.457l-1.426,1.426c-0.525,0.525-0.814,1.224-0.814,1.966c0,0.743,0.289,1.441,0.814,1.967
                l4.553,4.553c1.05,1.051,2.882,1.052,3.933,0l1.426-1.426c1.717,0.987,3.546,1.745,5.457,2.26v2.017C21,52.752,22.247,54,23.78,54
                h6.439c1.533,0,2.78-1.248,2.78-2.781v-2.017c1.911-0.515,3.74-1.272,5.457-2.26l1.426,1.426c1.052,1.052,2.882,1.05,3.933,0
                l4.553-4.553c0.525-0.525,0.814-1.224,0.814-1.967c0-0.742-0.289-1.44-0.814-1.966l-1.426-1.426
                c0.987-1.717,1.745-3.546,2.26-5.457h2.018c1.533,0,2.78-1.248,2.78-2.781V23.78C54,22.247,52.753,21,51.22,21z M39,27
                c0,6.617-5.383,12-12,12s-12-5.383-12-12s5.383-12,12-12S39,20.383,39,27z"/>
        </svg></a>`
                document.querySelector(".modebar-group:last-child").innerHTML = btnModConfig   
                const configButton = document.getElementById("btnModConfig")

                configButton.onclick = function(){ 
                        document.getElementById("configDialog").hidden = false;
                }


                //this is the dialog, thanks to the amazing json editor
                //documentation: https://github.com/json-editor/json-editor
                var options = {
                        theme: "bootstrap3",
                        iconlib: "fontawesome5",
                        disable_collapse :true,
                        disable_edit_json: true,
                        disable_properties: true,
                        schema: {
                                title: "Plot options",
                                type: "object",
                                // "format": "grid", //make the form  wider to see grid layout
                                format:"categories", //check css to hide titles ► #form h3{display: none;}  and disable_collapse above
                                basicCategoryTitle: "Plot Options",
                                properties: {
                                        isUpperHalfVisible: {
                                                type: "boolean",
                                                "format": "checkbox",
                                                title: " Upper half",
                                                default: preferences.isUpperHalfVisible
                                        },
                                        isDiagonalVisible: {
                                                type: "boolean",
                                                format: "checkbox",
                                                title: " Diagonal plots",
                                                default: preferences.isDiagonalVisible
                                        },
                                        showAxisLines: {
                                                type: "boolean",
                                                format: "checkbox",
                                                title: " Show Axis Lines",
                                                default: preferences.showAxisLines
                                        },
                                        gridLinesColor: {
                                                type: "string",
                                                format: "color",
                                                title: "Grid lines color",
                                                default: preferences.gridLinesColor
                                        },
                                        plot_bgcolor: {
                                                type: "string",
                                                format: "color",
                                                title: "Plot Background Color",
                                                default: preferences.plot_bgcolor
                                        },
                                        marker: {
                                                type: "object",
                                                title: "Marker options",
                                                //      format: "grid",
                                                properties: {
                                                        size: {
                                                                type: "integer",
                                                                format: "range",
                                                                title:"Marker Size",
                                                                default: preferences.marker.size
                                                        },
                                                        color: {
                                                                type: "string",
                                                                format: "color",
                                                                title: "Border color",
                                                                default: preferences.marker.color
                                                        },
                                                        width: {
                                                                type: "integer",
                                                                title: "Border Width",
                                                                format: "range",
                                                                default: preferences.marker.width
                                                        },
                                                },
                                        }
                                }
                        }
                };

                //hide title elements
                [...document.querySelectorAll(".card-title")].forEach(x=>{x.hidden=true})


                //add additonal buttons to the form
                var element = document.getElementById("form"); 
                element.innerHTML="";
                var editor = new JSONEditor(element, options); 

                //add ok and cancle buttons to form
                let center = document.createElement("div")
                center.style.textAlign="center";
                let btnCancel = document.createElement("button")
                btnCancel.innerHTML="Cancel"
                btnCancel.onclick=function(){document.getElementById("configDialog").hidden=true}
                let btnOK = document.createElement("button")
                btnOK.innerHTML="OK"
                btnOK.style.marginRight="10px";
                btnOK.onclick = function(){
                        const editorValue = editor.getValue()
                        mod.property("plotlySettings").set(JSON.stringify(editorValue))
                }
                center.appendChild(btnOK)
                center.appendChild(btnCancel)
                element.appendChild(center) 

                 
                
        }

}


