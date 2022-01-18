import React, { useContext, useRef } from 'react';
import ReactDOM from 'react-dom';

import Map from '@arcgis/core/Map';
import MapView from "@arcgis/core/views/MapView";

import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";

import Expand from "@arcgis/core/widgets/Expand";
import Search from '@arcgis/core/widgets/Search';

import BasemapGallery from "@arcgis/core/widgets/BasemapGallery";

import LayerController from '../../rest/controllers/LayerController';
import Notification from '../../utils/notification';

import UserController from '../../rest/controllers/UserController';
import NestedGroupList from '../bordering/nested-group-list';
import EditedLayerContext from './bordering-edit-context';
import SketchViewModel from '@arcgis/core/widgets/Sketch/SketchViewModel';
import Graphic from '@arcgis/core/Graphic';
import TextSymbol from '@arcgis/core/symbols/TextSymbol';

let LayerInstance = new LayerController();

let UserInstance = new UserController();

let dataToSave = null;

let EsriBorderMap = ({ groups = [], ...props }) => {
  const mapEl = useRef(null);

  let info = useContext( EditedLayerContext );

  const NotificationInstance = new Notification();

  const drawingLayer = new GraphicsLayer({
    title: "Draw"
  });
  drawingLayer.layer_id = -1;

  const map = new Map({
    basemap: "gray-vector",
  });

  const view = new MapView({
    map: map,
    center: [28.69, 46.93],
    zoom: 9,
    container: mapEl.current,
  });

  const searchWidget = new Search({
    view: view
  });

  view.ui.add(searchWidget, {
    position: "top-left",
    index: 0
  });

  const basemapGallery = new BasemapGallery({
    view: view
  });

  const basemapExpand = new Expand({
    expandIconClass: "esri-icon-basemap",
    // expandTooltip: "Expand LayerList", // optional, defaults to "Expand" for English locale
    view: view,
    content: basemapGallery
  });

  view.ui.add(basemapExpand, {
    position: "bottom-left"
  });

  const editSymbol = {
    type: "simple-fill",
    color: "#ccc",
    outline: {
      color: [0, 0, 0],
      width: 1
    }
  }

  map.add( drawingLayer );

  view.when(async () => {

    const fillSymbol = {
      type: "simple-fill",
      color: [130, 130, 130, 0.8],
      outline: {
        color: [56, 56, 56],
        width: 2
      }
    };

    for (const group of groups) {
      for (const layer of group.layers) {

        let graphics = await LayerInstance.getLayerBordering({
          layerId: layer.id,
          groupId: group.id
        });

        if ( !graphics )
          continue;

        let borderingLayer = new GraphicsLayer({
          title: layer.name,
          opacity: 0,
        });

        borderingLayer.layer_id = layer.id;
        borderingLayer.group_id = group.id;

        for (const graphic of graphics) {
          let geometry = JSON.parse( graphic.geometry );
          let attributes = JSON.parse( graphic.attributes );

          const borderGraphic = new Graphic({
            symbol: fillSymbol,
            geometry: {
              type: graphic.type,
              rings: geometry.rings,
              spatialReference: geometry.spatialReference
            },
          });

          let txtSym = new TextSymbol({
            text: attributes.name ,
            color: [255, 255, 255],
            haloColor: [56, 56, 56],
            haloSize: 2,
            font: {
              family: "Arial Unicode MS",
              size: 12
            }
          });

          let lblGra = new Graphic({
            geometry: {
              type: graphic.type,
              rings: geometry.rings,
              spatialReference: geometry.spatialReference
            },
            symbol: txtSym,
          });

          borderingLayer.add( borderGraphic );
          borderingLayer.add( lblGra );
        }

        map.add( borderingLayer );
      }
    }

    let sketch = new SketchViewModel({
      view: view,
      layer: drawingLayer,
      snappingOptions: {
        enabled: true,
        selfEnabled: true,
        featureSources: [{ layer: drawingLayer }],
      }
    });

    let nestedList = document.createElement("div");

    view.ui.add( nestedList, "top-right");

    const toggleBorderingLayers = ({ group_id = null, layer_id = null, enableUserSelection }) => {
      drawingLayer.removeAll();

      if( enableUserSelection )
        enableUserSelection( null );

      console.log( "toggleBorderingLayers" );
      map.layers.map( mapLayer => mapLayer.layer_id !== -1 ? mapLayer.opacity = 0 : mapLayer );

      if( layer_id !== null && group_id !== null ) {
        let layer = map.layers.find( mapLayer =>
          mapLayer.layer_id &&
          mapLayer.layer_id === layer_id &&
          mapLayer.group_id &&
          mapLayer.group_id === group_id
        );
        if( layer )
          layer.opacity = 1;
      }
    };

    const addBorder = ( enableUserSelection ) => {
      console.log( "addBorder" );

      sketch.create("rectangle", {mode: "freehand"});

      if( sketch.hasEventListener("create") || sketch.hasEventListener("update") )
        return;

      sketch.on("create", function(event) {
        if (event.state === "complete") {
          console.log( "addBorder:complete", event.graphic.geometry.toJSON() );
          enableUserSelection( event.graphic.geometry );
        }
      });

      sketch.on("update", ( event ) => {
        if (event.state === "complete") {
          enableUserSelection( event.graphics[0].geometry );
        }
      });
    };

    const saveBorder = ({
      layerId,
      groupId,
      geometry,
      attributes,
      extent,
      clearBorderAdding
    }) => {

      console.log({
        layerId,
        groupId,
        geometry,
        attributes,
        extent,
      });

      LayerInstance.addBorder({
        layer_id: layerId,
        group_id: groupId,
        geometry: JSON.stringify( geometry ),
        attributes: JSON.stringify( attributes ),
        extent: JSON.stringify( extent ),
      }).then(() => {

        let borderingLayer = map.layers.find( mapLayer => mapLayer.layer_id && mapLayer.group_id && mapLayer.layer_id === layerId && mapLayer.group_id === groupId );

        if( !borderingLayer ) {
          borderingLayer = new GraphicsLayer({
            title: layerId,
          });

          borderingLayer.layer_id = layerId;
          borderingLayer.group_id = groupId;

          map.add( borderingLayer );
        }


        const borderGraphic = new Graphic({
          symbol: fillSymbol,
          geometry: {
            type: "polygon",
            rings: geometry.rings,
            spatialReference: geometry.spatialReference
          },
        });

        let txtSym = new TextSymbol({
          text: attributes.name ,
          color: [255, 255, 255],
          haloColor: [56, 56, 56],
          haloSize: 2,
          font: {
            family: "Arial Unicode MS",
            size: 12
          }
        });

        let lblGra = new Graphic({
          geometry: {
            type: "polygon",
            rings: geometry.rings,
            spatialReference: geometry.spatialReference
          },
          symbol: txtSym,
        });

        borderingLayer.add( borderGraphic );
        borderingLayer.add( lblGra );

        drawingLayer.removeAll();
        clearBorderAdding();

        console.log({
          geometry,
          attributes,
          extent,
        });
      });

    };

    const clearBorderAdding = () => {

    };

    const editBorder = () => {
      console.log( "editBorder" );
    };

    const deleteBorder = () => {
      console.log( "deleteBorder" );
    };


    ReactDOM.render( <NestedGroupList
      addBorder={ addBorder }
      clearBorderAdding={ clearBorderAdding }
      saveBorder={ saveBorder }
      toggleBorderingLayers={ toggleBorderingLayers }
      groups={ groups } />,
      nestedList);
  });

  return(
      <div { ...props } style={{ height: '100%', width: '100%', overflow: 'none' }} ref={ mapEl }></div>
  );
};

export default EsriBorderMap;
