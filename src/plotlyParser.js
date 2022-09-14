//this module is responsible for parsing Spotifre data to accomodate plotly requirements

function unpack(rows, key) {
        return rows.map(function(row) { return row[key.replace('.',' ')]; });
}

function axis(){
        return {showline:false,zeroline:false,gridcolor:'#ffff',ticklen:4}
}
    

export const plotlyParser = {
        //returns [[1.2,"#F0A62D"],[2.5,"#FF5FA0"]] if color is coninuous or [["A","#F0A62D"],["B","#FF5FA0"]]
        getColorScale:async (dataView)=>{

                //get Color axis
                let colorAxis = (await dataView.axes()).filter(ax=>{return ax.name=="Color"})[0];

                
                // get row values
                let arr= (await dataView.allRows()).map((row)=>[
                        colorAxis.isCategorical?
                                row.categorical("Color").formattedValue():
                                row.continuous("Color").value(),
                        row.color().hexCode
                ]) 
                return [[0,arr[0][1]], ...arr, [1,arr[arr.length-1][1]]]
        },

        //returns something like this: [{"col1":row1, col2:row1,..,colN:row1},..,{"col1":rowN, col2:rowN,..,colN:rowN}]
        //dataView must contain a hierarchy of continious values on the  X axis. First level must be rowid to ensure data integrity
        data:async function(dataView){

                let outputData=[];
                let colors=[]
                let colorScale=[];

                const xHierarchy = await dataView.hierarchy("X");
                const cols =  xHierarchy.levels.map(x=>{return x.name} )
                cols.shift(); //removes the rowid
                cols.push("class");//adds color
                const root = await xHierarchy.root();
                const rowCount = await dataView.rowCount();
                let i=0;
                next(root, "");
        
                //traverse the hierarchy
                function next(node) {
                        if(node.children) {
                                node.children.forEach(node => next(node));
                        }
                        else {
                                let aRow={}
                                node.rows().forEach((row) => {

                                        //colors and colorScale
                                        let hex = row.color().hexCode
                                        let val = i++/rowCount;
                                        colorScale.push([val,hex]);
                                        colors.push(val);

                                        //data
                                        let r = row.categorical("X").formattedValue("|").split("|")
                                        r.push(row.categorical("Color").formattedValue()); //add color
                                        r.shift() //remove the rowid from the parsed data
                                        r.forEach((v,i)=>{
                                                aRow[cols[i]]=String(isNaN(v)?v:parseFloat(v));
                                        })
                                        return outputData.push(aRow)
                                })
                        }
                }
                
                colorScale.push([1,colorScale[colorScale.length-1][1]])
                return ({rows:outputData,colors:colors,colorScale:colorScale})
        },

        layout:async function(dataView,rows){

                //dimensions
                const xHierarchy = await dataView.hierarchy("X");
                const cols =  xHierarchy.levels.map(x=>{return x.name} )
                const dimentions =  cols.map(x=>{return {label:x, values:unpack(rows,x)}})
                dimentions.shift()

                //axes
                let axes = {}
                dimentions.forEach((e,i)=>{axes["xaxis"+(i==0?"":i)] = axis();axes["yaxis"+(i==0?"":i)] = axis()})

                return {dimentions:dimentions, axes:axes}
        },

        addTooltips:function(mod){
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

        addModConfigButton:function(){

                function showConfigDialog(){
                        console.log("configDialog")
                }
                

                //replace plotly link with gear
                const btnModConfig = `
                <a rel="tooltip" 
                onclick="showConfigDialog"
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
                
        }

}


