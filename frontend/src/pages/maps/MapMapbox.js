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
import axios from "../../utils/axios"
import {geoJSON} from "../../utils/util"
import {MAPBOX_API} from "../../config"
import { useDispatch, useSelector } from '../../redux/store';
import { getAll, addOneData} from '../../redux/slices/map_point';
// import csvData from './DataDummy-v2.csv';
// import csvData from './dummy2juta.csv';

// const JsonData = require('./data.json');

// import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

mapboxgl.accessToken = MAPBOX_API;


export default function Maps(props) {
  const dispatch = useDispatch();

  const mapContainer = useRef(null);
  const map = useRef(null);

  // const [lng, setLng] = useState(116.869976);
  // const [lat, setLat] = useState(-1.261159);
  // const [zoom, setZoom] = useState(4.2);

  const { map_points, isLoading} = useSelector((state) => state.map_point);

  const [longlat, setLonglat] = useState([106.82152045441632 , -6.152651598929424])
  const radius = 1;
  let zoom = 13;


  const [result, setResult] = useState(
    // JsonData
    []
  );
  

  function initData() {
    dispatch(getAll( radius , longlat))
    /*
    fetch(csvData)
      .then( (response) => response.text() )
      .then( (data) => {
        const geoJsonData = csvJSON(data , ";")
        setBulkResult(geoJsonData)
      })
    */
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
    if (map_points?.features?.length > 0) {
      // map.current.getSource("points")?.setData(geoJSON(map_points));
      map.current.getSource("points")?.setData(map_points);
    }
  }, [map_points]);

  useEffect(() => {
    initData()
    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: longlat,
        zoom,
      });
      map.current.addControl(new mapboxgl.NavigationControl());

      map.current.on("load", () => {
        map.current.addSource("points", {
          type: "geojson",
          data: map_points,  // geoJSON(result),
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

        map.current.on('moveend', () => {
          zoom = map.current.getZoom();
          const center = turf.point( [map.current.getCenter().lng , map.current.getCenter().lat] );
          console.log([map.current.getCenter().lng , map.current.getCenter().lat]) 
          setLonglat(center?.geometry?.coordinates)
          // const centerLng = center?.geometry?.coordinates[0] // lng;
          // const centerLat = center?.geometry?.coordinates[1] // lat;
          // const radius = turf.distance(turf.point([106.8714, -6.057597]), turf.point([119.9236, -5.786955]), {units: 'meters'});

          map.current.setPaintProperty('unclustered-point', 'circle-radius', Math.sqrt(zoom / 3) );
          dispatch(getAll( radius , [map.current.getCenter().lng , map.current.getCenter().lat]))
        })


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
