//this module is responsible for all the gui stuff, configuration, tooltips, alerts, etc.
import {JSONEditor} from "@json-editor/json-editor";


//makes a tooltip from axisParts and a plotly point and returns a string in the form of name1:value1\n,..,nameN:valueN\n
function _makeTT(axisParts, text){
        let arr1 = axisParts.map(ap=>{return ap.displayName});
        let arr2 = text.split("»").map(txt=>txt.trim());
        return arr1.map((tt,i)=>{return tt+":"+arr2[i]}).join("\n");
}

export const plotlyGUI = {


        //from this point on, move to another file called plotlyGUI.js
        
        setTooltips:function(mod, colorAxisParts, measureAxisParts){
                //plotly is rendered in plotly_plot, so add spotfire-like tooltips

                let myPlot = document.getElementById("plotly_plot");
                myPlot.on('plotly_hover', function(e){
                        let p = e.points[0]


                        //measures tooltips
//                        let measureTooltips = _makeTT(measuresParts,p)       

                        //row number
                        console.log(measureAxisParts)



                        mod.controls.tooltip.show(
                                measureAxisParts[0].displayName+":"+(p.pointIndex+1)+"\n"+
                                _makeTT(colorAxisParts,p.text)+"\n"+
                                "x:"+p.x+"\n"+
                                "y:"+p.y
                        )
                        console.log(p);
                });
                myPlot.on('plotly_unhover', function(e){
                        mod.controls.tooltip.hide() 
                });
        },

        setConfiguration:async function(mod, preferences, isEditing,font,plotlySettings){  

                //1 show config dialog
                const icon2 = `<svg class="configIcon" xmlns="http://www.w3.org/2000/svg" width="21px" height="21px" viewBox="0 0 54 54"> <path  d="M27,18c-4.962,0-9,4.038-9,9s4.038,9,9,9s9-4.038,9-9S31.962,18,27,18z"/> <path  d="M51.22,21h-2.018c-0.515-1.911-1.272-3.74-2.26-5.457l1.426-1.426c0.525-0.525,0.814-1.224,0.814-1.966 c0-0.743-0.289-1.441-0.814-1.967l-4.553-4.553c-1.05-1.049-2.881-1.051-3.933,0l-1.426,1.426C36.74,6.07,34.911,5.313,33,4.798 V2.78C33,1.247,31.753,0,30.22,0H23.78C22.247,0,21,1.247,21,2.78v2.018c-1.911,0.515-3.74,1.272-5.457,2.26l-1.426-1.426 c-1.051-1.052-2.883-1.05-3.933,0l-4.553,4.553c-0.525,0.525-0.814,1.224-0.814,1.967c0,0.742,0.289,1.44,0.814,1.966l1.426,1.426 C6.07,17.26,5.312,19.089,4.798,21H2.78C1.247,21,0,22.247,0,23.78v6.438C0,31.752,1.247,33,2.78,33h2.018 c0.515,1.911,1.272,3.74,2.26,5.457l-1.426,1.426c-0.525,0.525-0.814,1.224-0.814,1.966c0,0.743,0.289,1.441,0.814,1.967 l4.553,4.553c1.05,1.051,2.882,1.052,3.933,0l1.426-1.426c1.717,0.987,3.546,1.745,5.457,2.26v2.017C21,52.752,22.247,54,23.78,54 h6.439c1.533,0,2.78-1.248,2.78-2.781v-2.017c1.911-0.515,3.74-1.272,5.457-2.26l1.426,1.426c1.052,1.052,2.882,1.05,3.933,0 l4.553-4.553c0.525-0.525,0.814-1.224,0.814-1.967c0-0.742-0.289-1.44-0.814-1.966l-1.426-1.426 c0.987-1.717,1.745-3.546,2.26-5.457h2.018c1.533,0,2.78-1.248,2.78-2.781V23.78C54,22.247,52.753,21,51.22,21z M39,27 c0,6.617-5.383,12-12,12s-12-5.383-12-12s5.383-12,12-12S39,20.383,39,27z"/></svg>`
                const icon1 = `<svg class="configIcon" xmlns="http://www.w3.org/2000/svg" width="21px" height="21px" viewBox="0 0 16 16"><path d="M16 10.66a2.078 2.078 0 0 1-3.63.34h-.47v3.9H9.15l.29-.3-.36-.66-.06-.11-.07-.13-.02-.03a.21.21 0 0 0-.04-.06 1.088 1.088 0 0 0 .08-.31c.03-.01.07-.03.11-.04h.93v-3.15l-.83-.15a3.964 3.964 0 0 1-.43-.11 1.748 1.748 0 0 1 .11-.18l.1-.15.04-.05.02-.05.06-.11.36-.66-.53-.54-.92-.91-.54-.54-.66.37-.11.06-.37.19c-.04-.12-.08-.22-.11-.3l-.01-.02v-.97H2.91v.98l-.1.33-.52-.28-.22-.12H2V5h4v-.26a2.027 2.027 0 0 1-.94-2.25A2.003 2.003 0 1 1 8 4.73V5h3.9v4h.47a1.972 1.972 0 0 1 1.73-1 2.01 2.01 0 0 1 1.9 2.66z"></path><path d="M8.65 10.88c-.1-.03-.21-.06-.34-.1l-.52-.16a2.044 2.044 0 0 0-.28-.64l.33-.58c.05-.09.11-.19.17-.28l.04-.06.08-.12.06-.11-.91-.91-.11.06-.13.07-.95.5a2.99 2.99 0 0 0-.63-.29l-.11-.57a1.275 1.275 0 0 0-.12-.41l-.05-.17V7H3.92v.11l-.33 1.15c-.23.11-.41.17-.64.29l-.28-.18-.01-.01-.05-.02L2 8.02l-.19-.1h-.05l-.51.56-.34.3.06.11.56 1.09a2.39 2.39 0 0 0-.22.58l-.62.16a3.771 3.771 0 0 1-.69.24v1.27l.11.05 1.2.33c.05.19.16.41.22.58l-.56 1.1-.06.11.85.86h.05l.69-.38.45-.22a2.041 2.041 0 0 0 .58.22l.34 1.02.04.07.01.03h1.26l.05-.1.33-1.02a2.594 2.594 0 0 0 .64-.28l.51.28.68.36.61-.63.19-.19-.06-.11-.05-.05a4.025 4.025 0 0 0-.24-.46l-.28-.58a2.242 2.242 0 0 0 .28-.63l.54-.17a3.388 3.388 0 0 0 .51-.17H9v-1.29a3.502 3.502 0 0 1-.35-.08zm-4.12 2.44a1.82 1.82 0 0 1 0-3.64 1.82 1.82 0 0 1 0 3.64z"></path></svg>`

                //1.1 replace plotly icon from toolbar link with gear
                const btnModConfig = `
                <a rel="tooltip" 
                onclick="showConfigDialog()"
                id="btnModConfig"
                class="modebar-btn" 
                tooltip="Splom settings" 
                data-attr="zoom" 
                data-val="reset" 
                data-toggle="false" 
                data-gravity="n">
                ${icon1}
                </a>`

                //1.2 show config dialog icon
                document.querySelector(".modebar-group:last-child").innerHTML = isEditing?btnModConfig  :"";

                //1.3 make the config dialog icon show config dialog when clicked
                if (isEditing) document.getElementById("btnModConfig").onclick = function(){document.getElementById("configDialog").hidden = false;}


                //1.4 show config dialog
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
                                basicCategoryTitle: "Plot",
                                properties: {
                                        isUpperHalfVisible: {
                                                type: "boolean",
                                                format: "checkbox",
                                                options: {tooltip: "Determines whether or not subplots on the upper half from the diagonal are displayed"},
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
                                                options: {"hidden": true},
                                                format: "checkbox",
                                                title: " Show Axis Lines",
                                                default: preferences.showAxisLines
                                        },
                                        showGridlines: {
                                                type: "boolean",
                                                format: "checkbox",
                                                title: " Show gridlines",
                                                default: preferences.showGridlines
                                        },
                                        gridLinesColor: {
                                                type: "string",
                                                options: {"hidden": true},
                                                format: "color",
                                                title: "Grid lines color",
                                                default: preferences.gridLinesColor
                                        },
                                        plot_bgcolor: {
                                                type: "string",
                                                options: {"hidden": true},
                                                format: "color",
                                                title: "Background Color",
                                                default: preferences.plot_bgcolor
                                        },
                                        marker: {
                                                type: "object",
                                                title: "Markers",
                                                //      format: "grid",
                                                properties: {
                                                        size: {
                                                                type: "integer",
                                                                format: "range",
                                                                title:"Marker size",
                                                                minimum:1,
                                                                maximum:50,
                                                                default: preferences.marker.size
                                                        },
                                                        color: {
                                                                type: "string",
                                                                options: {"hidden": true},
                                                                format: "color",
                                                                title: "Border color",
                                                                default: preferences.marker.color
                                                        },
                                                        width: {
                                                                type: "number",
                                                                options: {"hidden": true},
                                                                title: "Border Width",
                                                                format: "range",
                                                                maximum:50,
                                                                step:0.5,
                                                                default: preferences.marker.width
                                                        },
                                                },
                                        },
                                        labels:{
                                                type:"object",
                                                title:"Labels",
                                                properties:{
                                                        fontSize:{
                                                                type: "integer",
                                                                options: {"hidden": true},
                                                                format: "range",
                                                                title:"Font size (px) (0 for default)",
                                                                default: preferences.labels.fontSize
                                                        },
                                                        xLabelRotation:{
                                                                type: "integer",
                                                                format: "range",
                                                                title:"Horizontal labels rotation (deg)",
                                                                minimum:-180,
                                                                maximum:180,
                                                                default: preferences.labels.xLabelRotation
                                                        },
                                                        yLabelRotation:{
                                                                type: "integer",
                                                                format: "range",
                                                                title:"Vertical labels rotation (deg)",
                                                                minimum:-180,
                                                                maximum:180,
                                                                default: preferences.labels.yLabelRotation
                                                        }
                                                }

                                        }
                                }
                        }
                };

                //hide title elements from json-editor
                [...document.querySelectorAll(".card-title")].forEach(x=>{x.hidden=true});


                //2. render form
                //2.1 get target
                var form = document.getElementById("form"); 
                //2.2 clean target
                form.innerHTML="";
                //2.3 render form
                var editor = new JSONEditor(form, options); 

                //remember last tab
                //  console.log((await mod.property("lastSelectedTabIndex")).value());
                let lastTab = (await mod.property("lastSelectedTabIndex")).value();
                document.querySelectorAll("[role='tablist'] li")[lastTab].click();

                //label rotations
                let css = `
                .infolayer g[class*='g-x']{ transform: rotate(${preferences.labels.xLabelRotation}deg);}
                .infolayer g[class*='g-y']{ transform: rotate(${preferences.labels.yLabelRotation}deg);}
                #form{font-family:${font.family};font-size:${font.size}px;}
                `;

                document.getElementById("mod-container-style").innerHTML = css;

                //add config tooltips
                let helpIcon = `<a class="ttip"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="feather feather-help-circle"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg></a>`
                let tt1 = document.querySelector("label[for='root[isUpperHalfVisible]']");
                tt1.insertAdjacentHTML("beforeend",helpIcon);
                tt1.lastChild.setAttribute("tooltip","Determines whether or not subplots on the diagonal are displayed");

                let tt2 = document.querySelector("label[for='root[isDiagonalVisible]']");
                tt2.insertAdjacentHTML("beforeend",helpIcon);
                tt2.lastChild.setAttribute("tooltip","Determines whether or not subplots on the diagonal are displayed");





                //save function
                let saveForm = function(){
                        //remember last tab
                        mod.property("lastSelectedTabIndex").set([...document.querySelectorAll("[role='tablist'] li")].indexOf(document.querySelector("[role='tablist'] li[class='active']")));
                        
                        //save form values
                        plotlySettings.set(JSON.stringify(editor.getValue()))

                }
                
                /*
                //add ok and cancel buttons to form
                let closeForm = function(){document.getElementById("configDialog").hidden=true}

                let center = document.createElement("div")
                center.style.textAlign="center";

                let btnOK = document.createElement("button")
                btnOK.innerHTML="OK"
                btnOK.style.marginRight="10px";
                btnOK.onclick = ()=>{saveForm();closeForm()}
                
                let btnCancel = document.createElement("button")
                btnCancel.innerHTML="Cancel"
                btnCancel.onclick=closeForm;
                btnCancel.style.marginRight="10px";
                
                let btnApply = document.createElement("button")
                btnApply.innerHTML="Apply"
                btnApply.onclick = saveForm;

                center.appendChild(btnOK)
                center.appendChild(btnCancel)
                center.appendChild(btnApply)
                form.appendChild(center) 
                */

                //make editor auto apply changes
                editor.on("change",saveForm);

        },

        setMarking:  (dataView, rows)=>{ //return; //disable marking for now
                //do marking
                let plotDiv = document.getElementById("plotly_plot")
                plotDiv.on('plotly_selected', async (eventData) => {

                        //change marking to look and feel to suit spotfire
                        //you can force these settings via css !important
                        //to hide plotly marking layer after selecting, add to css: .selectionlayer, rect.cursor-ew-resize,rect.cursor-ns-resize  {display: none;}
                        // let selectBox = document.querySelector('.select-outline')
                        // selectBox.style.fill="#4a64cd42";
                        // selectBox.style.stroke = "black"
                        // selectBox.style.strokeDasharray=0;

                        //perform the actual marking
                        (await dataView.allRows()).forEach((row,i)=>{
                                let aRow = row.categorical("Measures")
                                let rowVal = aRow.value()[0].key
                                // console.log("dv",row, rowVal)
                                
                                // console.log("plotly marked", eventData?.points)
                                if( eventData?.points && eventData.points.findIndex(pt=>{
                                        //debug
                                        let r = row.categorical("Measures").formattedValue("|")//.split("|") 
                                        if(rowVal==pt.pointIndex){
                                                // console.log(x, aRow)
                                                console.log("dv",row, rowVal, r)
                                                console.log("ply",pt, pt.pointIndex)
                                        }

                                        return rowVal==pt.pointIndex
                                }) > -1) row.mark()
                                //if(d.category==rowVal) row.mark();


                        })
                        

                })

        }, 

                /**
         * Create a Spotfire-style warning when "Cards by" gets changed from default value.
         * @param {HTMLElement} modDiv The div / text card to have the new button
         * @param {string} textColor
         * @param {Spotfire.Axis} axis
         * @param {Spotfire.ModProperty<boolean>} customExpression
         */
        createWarning: (modDiv, textColor, axis, customExpression) => {
                // get warning div
                var warningDiv = document.querySelector("#warning-message");
        
                // hide text card and show warning
                modDiv.style.display = "none";
                warningDiv.style.display = "block";
                warningDiv.innerHTML = "";
        
                var errorLayout = document.createElement("div");
                errorLayout.setAttribute("class", "error-layout");
        
                var errorContainer = document.createElement("div");
                errorContainer.setAttribute("class", "error-container");
        
                var errorText = document.createElement("div");
                errorText.setAttribute("class", "error-text");
                errorText.style.color = textColor;
                errorText.innerHTML =
                "This visualization is made to show unaggregated data.<br>Not selecting <strong>(Row Number)</strong> as the first measure may display aggregated data";
                errorContainer.appendChild(errorText);
        
                var buttonRow = document.createElement("div");
                buttonRow.setAttribute("class", "warning-row");
        
                var ignoreButton = document.createElement("div");
                var resetButton = document.createElement("div");
        
                const disableUI = function () {
                        ignoreButton.onclick = null;
                        resetButton.onclick = null;
                        errorContainer.style.opacity = "0.5";
                };
        
                // create 'Ignore' button
                if (axis.parts.length>0 && axis.parts[0].expression !== "<>" && axis.parts[0].expression !== "baserowid()") {
                        ignoreButton.setAttribute("class", "spotfire-button-flex spotfire-button-white");
                        var ignoreButtonText = document.createElement("div");
                        ignoreButtonText.setAttribute("class", "spotfire-button-text");
                        ignoreButtonText.textContent = "Keep current setting";
                        ignoreButton.onclick = (e) => {
                        // Allow future custom expressions
                                customExpression.set(true);
                                disableUI();
                                e.stopPropagation();
                        };
                        ignoreButton.appendChild(ignoreButtonText);
                        buttonRow.appendChild(ignoreButton);
                }
        
                // create 'Reset' button
                resetButton.setAttribute("class", "spotfire-button-flex spotfire-button-blue");
                var resetButtonText = document.createElement("div");
                resetButtonText.setAttribute("class", "spotfire-button-text");
                resetButtonText.textContent = "Use '(Row Number)'";
                resetButton.onclick = (e) => {
                        // Change Card By expression to baserowid
                        if (axis.parts.length==0){
                                axis.setExpression("<baserowid()>");
                        } else {
                                axis.parts.unshift({displayName:"(Row Number)", expression:"baserowid()"}) 
                                console.log(axis.parts.map(x=>{return x.displayName}));//CACA
                                let newExpression = axis.parts.map(p=>{return p.expression}).join(" NEST ");
                                axis.setExpression(`<${newExpression}>`);
                        }
                        customExpression.set(false);
                        disableUI();
                        e.stopPropagation();
                };
        
                resetButton.appendChild(resetButtonText);
                buttonRow.appendChild(resetButton);
        
                errorContainer.appendChild(buttonRow);
                errorLayout.appendChild(errorContainer);
                warningDiv.appendChild(errorLayout);
        },

        clearWarning: (modDiv) => {
                // get warning div
                var warningDiv = document.querySelector("#warning-message"); 
                warningDiv.style.display = "none";
                modDiv.style.display = "block";
        }, 

        /**dynamic styles based on canvas
         * @param {context} context the mod context to grab the context.styling information.
         */
        setStyle: (context) =>{
                
                const style = `
                <style>
                body{
                        font-size:${ context.styling.general.font.fontSize.toString()}px;
                        font-family:${context.styling.general.font.fontFamily};
                        font-weight:${context.styling.general.font.fontWeight};
                        background:${context.styling.general.backgroundColor};
                }

                .configIcon {
                        fill:${context.styling.general.font.color}66;
                }
                
                .configIcon:hover{
                        fill:${context.styling.general.font.color}88;
                    }



                </style> 
                `

                document.querySelector("body").insertAdjacentHTML("afterend",style);
        }
    
}

