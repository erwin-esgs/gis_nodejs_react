export function csvJSON(csv , delimiter = "," , long = "Longitude" , lat = "Latitude"){
    const lines=csv.split("\n");
    let result = [];
    let headers=lines[0].replace(`\r`,'').split(delimiter);
    
    const longIndex = headers.findIndex((value) => value === long)
    const latIndex = headers.findIndex((value) => value === lat)


    for(let i=1;i<lines.length;i++){
        const currentline = lines[i].replace(`\r`,'').split(delimiter);
        if( currentline[longIndex] && currentline[latIndex]){
            let obj = {
                "type": "Feature",
                "geometry": { "type": "Point", "coordinates": [ parseFloat(currentline[longIndex]), parseFloat(currentline[latIndex])] },
                "properties": {}
            };
            result.push(obj);
        }
    }
    // console.log(result)
    return result; // JavaScript object
    // return JSON.stringify(result); //JSON
}

export function csvGeoJSON(csv , delimiter = "," , long = "Longitude" , lat = "Latitude"){
    const lines=csv.split("\n");
    
    let result = {
        "type": "FeatureCollection",
        "features": [],
    };
    let headers=lines[0].replace(`\r`,'').split(delimiter);
    
    const longIndex = headers.findIndex((value) => value === long)
    const latIndex = headers.findIndex((value) => value === lat)


    for(let i=1;i<lines.length;i++){
        const currentline = lines[i].replace(`\r`,'').split(delimiter);
        if( currentline[longIndex] && currentline[latIndex]){
            let obj = {
                "type": "Feature",
                "geometry": { "type": "Point", "coordinates": [ parseFloat(currentline[longIndex]), parseFloat(currentline[latIndex])] },
                "properties": {
                    "id": currentline[0]
                }
            };
            result.features.push(obj);
        }
    }
    // console.log(result)
    return result; // JavaScript object
    // return JSON.stringify(result); //JSON
}

export function csvGeoJsonFeatures(csv , delimiter = "," , long = "Longitude" , lat = "Latitude"){
    const lines=csv.split("\n");
    
    let result = [];
    let headers=lines[0].replace(`\r`,'').split(delimiter);
    
    const longIndex = headers.findIndex((value) => value === long)
    const latIndex = headers.findIndex((value) => value === lat)


    for(let i=1;i<lines.length;i++){
        const currentline = lines[i].replace(`\r`,'').split(delimiter);
        if( currentline[longIndex] && currentline[latIndex]){
            let obj = {
                "type": "Feature",
                "geometry": { "type": "Point", "coordinates": [ parseFloat(currentline[longIndex]), parseFloat(currentline[latIndex])] },
                "properties": {
                    "id": currentline[0]
                }
            };
            result.push(obj);
        }
    }
    return result; // JavaScript object
}

export function arrayUniqueByKey(array , key) {
    return [...new Map(array.map(item =>
        [item[key], item])).values()];
} 

export function geoJSON(features) {
    return {
      type: "FeatureCollection",
      features,
    }
  }