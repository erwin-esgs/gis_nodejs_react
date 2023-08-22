import { useState, useEffect, useRef } from "react";
import {
  Box,
  Link,
  Grid,
  Stack,
  Button,
  Drawer,
  Tooltip,
  Typography,
  CardActionArea,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControlLabel,
  Checkbox,
  Slider,
} from '@mui/material';
import * as turf from '@turf/turf'
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import shipblack from "../../assets/shipblack.png"
import { csvJSON , arrayUniqueByKey } from "../../utils/util"
import axios from "../../utils/axios"
// import csvData from './DataDummy-v2.csv';
// import csvData from './dummy2juta.csv';

// const JsonData = require('./data.json');

// import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

mapboxgl.accessToken = "pk.eyJ1IjoiZXJ3aW5lc2dzIiwiYSI6ImNrc2Uyc3pyejBkMHAyb29mOThjMTNobDIifQ.DdJbMrINoGVHWZSF8bYm8g";


export default function Maps(props) {

  const mapContainer = useRef(null);
  const map = useRef(null);

  // const [lng, setLng] = useState(116.869976);
  // const [lat, setLat] = useState(-1.261159);
  // const [zoom, setZoom] = useState(4.2);

  const [longlat, setLonglat] = useState([106.82152045441632 , -6.152651598929424])
  const radius = 25;
  let zoom = 13;

  function geoJSON(features) {
    return {
      type: "FeatureCollection",
      features,
    }
  }
  
  const [bulkResult, setBulkResult] = useState(
    // JsonData
    []
  );

  const [result, setResult] = useState(
    // JsonData
    []
  );
  
  // console.log(csvGeoJSON(csvData))

  function initData() {
    
    fetch(csvData)
      .then( (response) => response.text() )
      .then( (data) => {
        const geoJsonData = csvJSON(data , ";")
        setBulkResult(geoJsonData)
      })

    // await axios
    //   .get("/p05")
    //   .then((response) => {
    //     if (Object.getOwnPropertyNames(response.data).length > 0) {
    //       setResult(response.data);
    //       // console.log(JSON.stringify(response.data));
    //     }
    //     // console.log(response.data.hits.hits);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  }

  function filterResult(results , longlat , distanceRange) {
    let filteredFeatures = []
    if (results.length > 0) {
      // console.log(resultGeoJson.features.length)
      filteredFeatures = results.filter((feature) => {
          const center = turf.point( longlat );
          const point = turf.point(feature.geometry.coordinates);
          const distance = turf.distance(center, point, {units: 'kilometers'});
          return distance <= distanceRange;
        });
      // console.log(filteredFeatures)
    }
    return filteredFeatures 
  }

  useEffect(() => {
    if (bulkResult.length > 0) {
        // console.log(bulkResult)
        setResult(filterResult(bulkResult , longlat , radius))
        // setResult(previousState => new Set([...previousState, filterResult(bulkResult , longlat , radius)]))
    }
  }, [bulkResult]);

  useEffect(() => {
    if (result.length > 0) {
      map.current.getSource("points")?.setData(geoJSON(result));
    }
  }, [result]);

  useEffect(() => {
    if (bulkResult.length > 0) {
      // console.log(bulkResult.length)
      setResult(filterResult(bulkResult , longlat , radius))
      // setResult((previousState) =>  arrayUniqueByKey(Array.from(previousState).concat(filterResult(bulkResult , longlat , radius)) , "properties")  ) 
      // setResult(previousState => new Set([...previousState, filterResult(bulkResult , longlat , radius)])) .concat(filterResult(bulkResult , longlat , radius)).unique()
  }
  }, [longlat]);

  useEffect(() => {
    
    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: longlat,
        zoom,
      });
      map.current.addControl(new mapboxgl.NavigationControl());
      // map.current.loadImage(
      //   // "https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png",
      //   "../../assets/shipblack.png",
      //   (error, image) => {
      //     if (error) throw error;
      //     map.current.addImage("shipblack", image);
      //     // Add a GeoJSON source with 2 points
      //   }
      // );
      // map.current.loadImage(
      //   // "https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png",
      //   `/assets/shipred.png`,
      //   (error, image) => {
      //     if (error) throw error;
      //     map.current.addImage("shipred", image);
      //     // Add a GeoJSON source with 2 points
      //   }
      // );
      // map.current.loadImage(
      //   // "https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png",
      //   `/assets/shippurple.png`,
      //   (error, image) => {
      //     if (error) throw error;
      //     map.current.addImage("shippurple", image);
      //     // Add a GeoJSON source with 2 points
      //   }
      // );

      map.current.on("load", () => {
        map.current.addSource("points", {
          type: "geojson",
          data: geoJSON(result),
          cluster: true,
          clusterMaxZoom: 14, // Max zoom to cluster points on
          clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
        });

        map.current.addLayer({
          id: 'clusters',
          type: 'circle',
          source: 'points',
          filter: ['has', 'point_count'],
          paint: {
          // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
          // with three steps to implement three types of circles:
          //   * Blue, 20px circles when point count is less than 100
          //   * Yellow, 30px circles when point count is between 100 and 750
          //   * Pink, 40px circles when point count is greater than or equal to 750
          'circle-color': [
          'step',
          ['get', 'point_count'],
          '#51bbd6',
          100,
          '#f1f075',
          750,
          '#f28cb1'
          ],
          'circle-radius': [
            'step',
            ['get', 'point_count'],
              20,
              100,
              30,
              750,
              40
          ]
          }
          });
           
          map.current.addLayer({
          id: 'cluster-count',
          type: 'symbol',
          source: 'points',
          filter: ['has', 'point_count'],
          layout: {
          'text-field': ['get', 'point_count_abbreviated'],
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 12
          }
          });
           
          map.current.addLayer({
          id: 'unclustered-point',
          type: 'circle',
          source: 'points',
          filter: ['!', ['has', 'point_count']],
          paint: {
          'circle-color': '#11b4da',
          'circle-radius':  Math.sqrt(zoom / 3),
          'circle-stroke-width': 1,
          'circle-stroke-color': '#fff'
          }
          });

        // map.current.addLayer({
        //   id: 'point',
        //   type: 'circle',
        //   source: 'points',
        //   paint: {
        //     'circle-radius': Math.sqrt(zoom / 3),
        //     'circle-color': '#ff0000'
        //   }
        // });

        initData()

        map.current.on('moveend', () => {
          zoom = map.current.getZoom();
          const center = turf.point( [map.current.getCenter().lng , map.current.getCenter().lat] );
          // console.log(center) 
          setLonglat(center?.geometry?.coordinates)
          // const centerLng = center?.geometry?.coordinates[0] // lng;
          // const centerLat = center?.geometry?.coordinates[1] // lat;
          // const radius = turf.distance(turf.point([106.8714, -6.057597]), turf.point([119.9236, -5.786955]), {units: 'meters'});
          // const filteredFeatures = result.features.filter((feature) => {
          //   console.log(feature)
          //   const point = turf.point(feature.geometry.coordinates);
          //   const distance = turf.distance(center, point, {units: 'kilometers'});
          //   return distance <= 100;
          // });
          // console.log(filteredFeatures)
          // setResult(
          //   {
          //     type: "FeatureCollection",
          //     features: filteredFeatures,
          //   }
          // )
          map.current.setPaintProperty('unclustered-point', 'circle-radius', Math.sqrt(zoom / 3) );
          // setResult(filterResult(bulkResult , centerLng , centerLat , radius))
          // console.log('Current zoom:', zoom);
          // console.log('Center longitude:', centerLng);
          // console.log('Center latitude:', centerLat);
          // console.log('Radius:', radius);
        })

        // Add a symbol layer
        // map.current.addLayer({
        //   id: "point",
        //   type: "symbol",
        //   source: "points",
        //   layout: {
        //     "icon-image": [
        //       "case",
        //       [">", ["get", "STATUS"], 10],
        //       "shippurple",
        //       [">", ["get", "STATUS"], 0],
        //       "shipred",
        //       "shipblack",
        //     ],
        //     "icon-allow-overlap": true,
        //     "icon-rotate": ["get", "HEADING"],
        //     // "text-field": ["get", "title"],
        //     // "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
        //     // "text-offset": [0, 1.25],
        //     // "text-anchor": "top",
        //   },
        //   filter: ["==", "$type", "Point"],
        // });

        // map.current.addLayer({
        //   id: "route",
        //   type: "line",
        //   source: "points",
        //   layout: {
        //     "line-join": "round",
        //     "line-cap": "round",
        //   },
        //   paint: {
        //     "line-color": "#59ff00",
        //     "line-width": 8,
        //   },
        //   filter: ["==", "$type", "LineString"],
        // });
        map.current.on("click", "point", (e) => {
          // console.log(e.features[0].properties.SHIP_ID);
          // getData(e.features[0].properties.SHIP_ID);
          const coordinates = e.features[0].geometry.coordinates.slice();
          const description =
            '<div style="color:black"><strong>Kapal</strong><p>.</p>';

          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          }

          let popup = new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(description)
            .addTo(map.current);

          map.current.flyTo({
            center: e.features[0].geometry.coordinates,
            zoom: map.current.getZoom() + 10,
          });
          popup.on("close", (e) => {
            // initData();
            map.current.flyTo({
              center: longlat,
              zoom,
            });
          });
        });
        // initData();
      });
    } // initialize map only once

    // if (result.features.length === 0) {
    // }
  }, []);



  const [fontSizeHeader, setFontSizeHeader] = useState(12);
  const [fontSize, setFontSize] = useState(11);

  const [expanded, setExpanded] = useState(false);
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <>
      <Grid container spacing={1}>
        <Grid item xs={10}>
          <div
            ref={mapContainer}
            className="map-container"
            style={{ height: window.innerHeight * 0.8, width: "100%" }}
          />
        </Grid>
        <Grid item xs={2}>
          <Box padding="0 5px" sx={{ width: "100%" }}>
            MENU
          </Box>
        </Grid>
      </Grid>
    </>
  );
}
