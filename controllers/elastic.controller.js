const Joi = require('joi');
const path = require('path');
const {axiosElastic} = require(path.join(__dirname, '../utils/axios'));

async function checkES(req, res, next) {
  let success = false
  let data=null
  try {
    const response = await axiosElastic.get()
    data = response?.data 
    success = true
  } catch (error) {
    console.log(error)
  }
  
  res.json({ success:success, data:data });
}

async function getData(req, res, next) {
  let success = false
  let data=[]
  /*
  Joi.alternatives().try(
      schemaCheckin,
	    schemaCheckout,
	)
  */
  const schema =
   Joi.object({
    radius: Joi.number(),
    zoom: Joi.number(),
    longlat: Joi.array().ordered(Joi.number().required(), Joi.number().required()),
    long: Joi.number(),
    lat: Joi.number(),
    /*
    longlat: Joi.array().ordered(Joi.number().required(), Joi.number().required())
      .when('long', { is: Joi.exist(), then: Joi.forbidden() })
      .when('lat', { is: Joi.exist(), then: Joi.forbidden() }),
    long: Joi.number().when('longlat', { is: Joi.forbidden(), then: Joi.number().required() }),
    lat: Joi.number().when('longlat', { is: Joi.forbidden(), then: Joi.number().required() })
    */
  })
  const validate = schema.validate(req.body)
  if(!validate.error){
	console.log(JSON.stringify(validate.value))
    let lat = validate.value.lat
    let long = validate.value.long
    if(validate.value.longlat){
      long = validate.value.longlat[0];
      lat = validate.value.longlat[1];
    }
    try {
      let jsonBody = {
        "query": {
          "bool": {
            "must": {
              "match_all": {}
            },
            "filter": {
              "geo_distance": {
                "distance": `${validate.value.radius}km`,
                "location": {
                  "lat": lat,  
                  "lon": long
                }
              }
            }
          }
        }
      }
  
      const response = await axiosElastic.post(process.env.ELASTICSEARCH_INDEX + `/_search?size=20000` , jsonBody)
      if(response?.data){
        if(response?.data?.hits?.hits){
          for (let i = 0; i < response?.data?.hits?.hits.length; i++) {
            const element = response?.data?.hits?.hits[i];
            const splitLatLong = element._source.location.split(",")
            const obj = {
              "type": "Feature",
              "geometry": { "type": "Point", "coordinates": [parseFloat(splitLatLong[1]), parseFloat(splitLatLong[0])] },
              "properties": {
                "object_id": element._source["Object No"],
              }
            }
            data.push(obj)
          }
          success = true
        }else{
          console.log(response?.data)
        }
      }
      
    } catch (error) {
      console.log(JSON.stringify(error.response?.data))
    }
  }else{
    console.log(validate.error)
  }
  
  const geoJsonData = {
      type: 'FeatureCollection',
      features: data,
    }
  
  // res.json({ success:success, data:data });
  res.json({ success:success, data:geoJsonData });
}


module.exports = { 
  checkES,
  getData,
};