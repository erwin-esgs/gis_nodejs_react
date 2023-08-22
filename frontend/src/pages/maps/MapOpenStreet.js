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
import L, { icon } from 'leaflet';
import 'leaflet/dist/leaflet.css'
// import 'leaflet.vectorgrid/dist/leaflet.vectorgrid.min.css';
import 'leaflet.vectorgrid/dist/Leaflet.VectorGrid.bundled';
import 'leaflet.markercluster/dist/leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import MarkerIcon from 'leaflet/dist/images/marker-icon.png'
import { Map, MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import axios from "../../utils/axios"
import { geoJSON , csvGeoJSON } from "../../utils/util"
import { useDispatch, useSelector } from '../../redux/store';
import { getAll, addOneData} from '../../redux/slices/map_point';
import csvData from './DataDummy-v2.csv';

export default function Maps(props) {
  const dispatch = useDispatch();
  const mapRef = useRef();

  const { map_points, isLoading} = useSelector((state) => state.map_point);

  const [longlat, setLonglat] = useState([106.82152045441632 , -6.152651598929424])
  const [latlong, setLatLong] = useState([-6.152651598929424 , 106.82152045441632 ])
  const [currentZoom, setCurrentZoom] = useState(13);
  const [geojsonLayer, setGeojsonLayer] = useState(null);
  const [clusterLayer, setClusterLayer] = useState(null);
  const radius = 1;

  const [result, setResult] = useState(
    // JsonData
    {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {
            name: 'Marker 1',
          },
          geometry: {
            type: 'Point',
            coordinates: [106.82152045441632 , -6.152651598929424],
          },
        },
        {
          type: 'Feature',
          properties: {
            name: 'Marker 2',
          },
          geometry: {
            type: 'Point',
            coordinates: [106.82252045441632 , -6.152661598929424],
          },
        },
      ],
    }
  );

  const circleMarkerIcon = (feature, latlng) => L.circle(latlng, {
      radius: 2,
      color: 'red',
      weight: 0.5,
      fillOpacity: 0.5,
    })
  

  const customMarkerIcon = new L.Icon({
    iconUrl: MarkerIcon,
    iconSize: [20, 30],
    iconAnchor: [12, 30],
    popupAnchor: [0, -30],
  });

  function initData() {
    dispatch(getAll( radius , longlat))
    // fetch(csvData)
    //   .then( (response) => response.text() )
    //   .then( (data) => {
    //     const geoJsonData = csvGeoJSON(data , ";")
    //     setResult(geoJsonData)
    //   })
    
  }

  
  
  // const geoJsonLayerOptions = {
  //   pointToLayer: (feature, latlng) => { console.log(feature) ; return L.marker(latlng); } ,
  //   onEachFeature: (feature, layer) => layer.bindPopup(feature.properties.name) ,
  // };

  useEffect(() => {
    if(mapRef.current){
      if (geojsonLayer) {
        geojsonLayer.clearLayers();
      }
      const newGeojsonLayer = L.geoJSON(map_points, {
        pointToLayer: circleMarkerIcon , // (feature, latlng) => L.marker(latlng,  { icon: customMarkerIcon } ) ,
      });
      // markerLayer.addTo(mapRef.current);
      setGeojsonLayer(newGeojsonLayer)

      if (clusterLayer) {
        clusterLayer.clearLayers();
      }
      let newClusterLayer = L.markerClusterGroup({
        disableClusteringAtZoom: 17, // maximum zoom level for clustering
      });
      
      newClusterLayer.addLayer(newGeojsonLayer);

      const iconCreateFunction = function (cluster) {
        const childCount = cluster.getChildCount();
      
        let c = 'marker-cluster-';
        if (childCount < 100) {
          c += 'small';
        } else if (childCount < 500) {
          c += 'medium';
        } else {
          c += 'large';
        }
      
        return L.divIcon({ html: `<div><span>${childCount}</span></div>`, className: `marker-cluster ${c}`, iconSize: L.point(40, 40) });
      };
      
      newClusterLayer.options.iconCreateFunction = iconCreateFunction;

      mapRef.current.addLayer(newClusterLayer);
      setClusterLayer(newClusterLayer)
    }
  }, [map_points]);


  useEffect(() => {
    initData()
    if(!mapRef.current){
      mapRef.current = L.map("map",{
        center: latlong,
        zoom : 13,
      })
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current);
      mapRef.current.on('moveend', ()=>{
        const center = mapRef.current.getCenter();
          dispatch(getAll( radius , [center.lng , center.lat] ))
      } );
      // mapRef.current.on('zoomend', () => {
      //   setCurrentZoom(mapRef.current.getZoom())
      // });
      // mapRef.current.on("load", () => {
        // console.log(result)
        // const markerLayer = L.geoJSON(result, {
        //   pointToLayer: (feature, latlng) => L.marker(latlng , { icon: customMarkerIcon }) ,
        // });
        // markerLayer.addTo(mapRef.current);
      // })
    }
    // return () => {
    //   mapRef.current.off('moveend', handleMoveEnd );
    // };
  }, []);

  return (
    <>
      <Grid container spacing={1}>
        <Grid item xs={10}>
          <div
           id="map"
            // ref={mapContainer}
            className="Map"
            style={{ height: window.innerHeight * 0.8, width: "100%" }}
          />
        {/* <MapContainer ref={mapContainer} center={latlong} zoom={zoom}  style={{ height:"80vh" }} >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <GeoJSON data={result} 
            // {...geoJsonLayerOptions}
            // pointToLayer={(feature, latlng) => L.marker(latlng , {icon : customMarkerIcon}) }
          />
        </MapContainer> */}
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
