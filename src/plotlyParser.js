let unpack = (rows, key) => { return rows.map(function(row) { return row[key.replace('.',' ')]; });}
let axis = (preferences) => {
        return {
        showline:preferences.showAxisLines,
        zeroline:false,
        gridcolor:preferences.gridLinesColor,
        ticklen:4
        // tickangle:45
}}


export const plotlyParser = {
        //returns [[1.2,"#F0A62D"],[2.5,"#FF5FA0"]] if color is coninuous or [["A","#F0A62D"],["B","#FF5FA0"]]
        getColorScale:async (dataView)=>{

                //get Color axis
                let colorAxis = (await dataView.axes()).filter(ax=>{return ax.name=="Color"})[0];

               //console.log(colorAxis.length);

                
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
                let colorDict = {};

                const xHierarchy = await dataView.hierarchy("Dimensions");
                const cols =  xHierarchy.levels.map(x=>{return x.name} )
                cols.shift(); //removes the rowid
                cols.push("class");//adds color
                const root = await xHierarchy.root();
                const rowCount = await dataView.rowCount();
                var i=0;
                const dataViewAxes = await dataView.axes()
                next(root, "");

        
                //traverse the hierarchy
                function next(node) {
                        if(node.children) {
                                node.children.forEach(node => next(node)); 
                        } else {
                                let aRow={}
                                node.rows().forEach( (row,k) => {

                                        //add index
                                        aRow["index"] = i

                                        //colors and colorScaleDict
                                        let hex = row.color().hexCode
                                        let val = i++/rowCount;
                                        colorDict[hex]=0;
                                        colors.push(hex);

                                        //data
                                        let r = row.categorical("Dimensions").formattedValue("|").split("|") 
                                        if(dataViewAxes.find(anAxis=>anAxis.name=="Color")) r.push(row.categorical("Color").formattedValue()); //add color
                                        r.shift() //remove the rowid from the parsed data
                                        r.forEach((v,i)=>{
                                                aRow[cols[i]]=String(isNaN(v)?v:parseFloat(v));
                                        })
                                        return outputData.push(aRow)
                                })
                        }
                }


                // console.log(colorDict)
                colorDict=Object.keys(colorDict);
                let colorScale=[];
                colorDict.forEach((x,i)=>{colorScale.push([(1/colorDict.length)*i,x]);colorScale.push([(1/colorDict.length)*(i+1),x])});

                if(colorDict.length==1) colorDict = [...colorDict,...colorDict];
                
                colors = colors.map((x,i)=>{return colorDict.indexOf(x)/(colorDict.length-1)});

                return ({rows:outputData,colors:colors,colorScale:colorScale})
        },

        layout:async function(dataView,rows,preferences){

                //dimensions
                const xHierarchy = await dataView.hierarchy("Dimensions");
                const cols =  xHierarchy.levels.map(x=>{return x.name} )
                const dimentions =  cols.map(x=>{return {label:x, values:unpack(rows,x)}})
                dimentions.shift()

                //axes
                let axes = {}
        
                dimentions.forEach((e,i)=>{
                        axes["xaxis"+(i==0?"":i+1)] = axis(preferences);
                        axes["yaxis"+(i==0?"":i+1)] = axis(preferences)
                })

                return {dimentions:dimentions, axes:axes}
        } 

}


