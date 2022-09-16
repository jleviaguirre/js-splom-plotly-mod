let unpack = (rows, key) => { return rows.map(function(row) { return row[key.replace('.',' ')]; });}
let axis = () => {return {showline:false,zeroline:false,gridcolor:'#ffff',ticklen:4}}
    

export const plotlyParser = {
        //returns [[1.2,"#F0A62D"],[2.5,"#FF5FA0"]] if color is coninuous or [["A","#F0A62D"],["B","#FF5FA0"]]
        getColorScale:async (dataView)=>{

                //get Color axis
                let colorAxis = (await dataView.axes()).filter(ax=>{return ax.name=="Color"})[0];

                console.log(colorAxis.length);

                
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
                var i=0;
                const dataViewAxes = await dataView.axes()
                next(root, "");

                //check if color axis has something
                //const colorAxis = await mod.visualization.axis("Color");

        
                //traverse the hierarchy
                function next(node) {
                        if(node.children) {
                                node.children.forEach(node => next(node)); 
                        } else {
                                let aRow={}
                                node.rows().forEach( (row,k) => {

                                        //colors and colorScale
                                        let hex = row.color().hexCode
                                        let val = i++/rowCount;
                                        colorScale.push([val,hex]);
                                        colors.push(val);
                                        console.log(k,rowCount,val)

                                        //data
                                        let r = row.categorical("X").formattedValue("|").split("|") 
                                        if(dataViewAxes.find(anAxis=>anAxis.name=="Color")) r.push(row.categorical("Color").formattedValue()); //add color
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
        }

}


