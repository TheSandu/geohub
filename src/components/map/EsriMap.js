import React, { useRef, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import NestedList from "./nested-layer-list";
import EditWidget from "./graphics-editor";

import Map from '@arcgis/core/Map';
import MapView from "@arcgis/core/views/MapView";

import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";

import Expand from "@arcgis/core/widgets/Expand";
import Search from '@arcgis/core/widgets/Search';
import Graphic from "@arcgis/core/Graphic";
import TextSymbol from "@arcgis/core/symbols/TextSymbol";
import BasemapGallery from "@arcgis/core/widgets/BasemapGallery";
import SketchViewModel from "@arcgis/core/widgets/Sketch/SketchViewModel";
import * as geometryEngine from "@arcgis/core/geometry/geometryEngine";
import LayerController from '../../rest/controllers/LayerController';
import Notification from '../../utils/notification';

import UserController from '../../rest/controllers/UserController';

let LayerInstance = new LayerController();

let UserInstance = new UserController();

let dataToSave = null;

import { Manager } from "socket.io-client";

const manager = new Manager("http://localhost:5000");
const socket = manager.socket("/");

console.log( "socket:connecting..." );

let EsriMap = ({ groups = [], ...props }) => {
  const mapEl = useRef(null);
  const NotificationInstance = new Notification();
  const drawingLayer = new GraphicsLayer({
    title: "Draw"
  });

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
    "polygon": {
      type: "simple-fill",
      color: [130, 130, 130, 0.1],
      outline: {
        color: [56, 56, 56],
        width: 2
      }
    },
    "polyline": {
      type: "simple-line",
      color: [56, 56, 56],
      width: 2
    }
  };

  const fillSymbol = {
    type: "simple-fill",
    color: [130, 130, 130, 0.1],
    outline: {
      color: [56, 56, 56],
      width: 2
    }
  };

  const invalidSymbol = {
    "polygon": {
      type: "simple-fill",
      style: "diagonal-cross",
      color: [255, 0, 0],
      outline: {
        color: [255, 0, 0],
        width: 2
      }
    },
    "polyline": {
      type: "simple-line",
      color: [255, 0, 0],
      width: 2
    }
  };

  view.when(async () => {

    map.add( drawingLayer );

    let myUser = await UserInstance.logedUser();

    socket.on("broadcast:startDraw", ( { point, user, socketId, ...rest } ) => {

      let graphicsToRemove = view.graphics.filter(( graphic ) => {
        return graphic.attributes.id === user.id;
      });

      if( graphicsToRemove )
        view.graphics.removeAll( graphicsToRemove );

      let txtSym = new TextSymbol({
        text: user.name,
        color: [255, 255, 255],
        haloColor: [1, 68, 33],
        haloSize: 2,
        yoffset: 8,
        font: {
          family: "Arial Unicode MS",
          size: 12
        }
      });

      let pnt = {
        type: "point",
        x: point.rings ? point.rings[0][0][0] : point.paths[0][0],
        y: point.rings ? point.rings[0][0][1] : point.paths[0][1],
        spatialReference: point.spatialReference
      };

      let lblGra = new Graphic({
        geometry: pnt,
        symbol: txtSym,
        attributes: { ...user, socketId: socketId },
      });

      const markerSymbol = {
        type: "simple-marker",
        color: [1, 68, 33],
      };

      const pointGraphic = new Graphic({
        geometry: pnt,
        symbol: markerSymbol,
        attributes: { ...user, socketId: socketId },
      });

      view.graphics.addMany([lblGra, pointGraphic]);

    });

    socket.on("broadcast:addGraph", ( { graphic, layer, socketId, ...rest } ) => {

      const mapLayer = map.layers.find(function(findLayer) {
        return findLayer.title === layer.name;
      });

      let geometry = graphic.geometry;
      let attributes = graphic.attributes;
      attributes.id = graphic.id;
      let symbol = JSON.parse( layer.symbol );

      let popUpFields = [];

      for (const attributesProperty in attributes) {
        popUpFields.push({
          fieldName: attributesProperty,
          label: attributesProperty
        });
      }

      let fetchedGraphic = null;

      switch (layer.type) {
        case "polygon":
          let polygon = {
            type: "polygon",
            rings: geometry.rings,
            spatialReference: geometry.spatialReference
          };

          fetchedGraphic = new Graphic({
            geometry: polygon,
            symbol: symbol,
            attributes: attributes,
            popupTemplate: {
              title: "Pop up",
              outFields: ["*"],
              content: [{
                type: "fields",
                fieldInfos: popUpFields,
              }]
            }
          });
          break;
        case "line":
          let polyline = {
            type: "polyline",
            paths: geometry.paths,
            spatialReference: geometry.spatialReference
          };

          fetchedGraphic = new Graphic({
            geometry: polyline,
            symbol: symbol,
            attributes: attributes,
            popupTemplate: {
              title: "Pop up",
              outFields: ["*"],
              content: [{
                type: "fields",
                fieldInfos: popUpFields,
              }]
            }
          });

          break;
        case "point":
          let point = {
            type: "point",
            x: geometry.x,
            y: geometry.y,
            spatialReference: geometry.spatialReference
          };

          fetchedGraphic = new Graphic({
            geometry: point,
            symbol: symbol,
            attributes: attributes,
            popupTemplate: {
              title: "Pop up",
              outFields: ["*"],
              content: [{
                type: "fields",
                fieldInfos: popUpFields,
              }]
            }
          });
          break;
        default:
          console.log( "No type" );
          break;
      }

      if( mapLayer )
        mapLayer.add( fetchedGraphic );
    });

    let allLayers = [];

    for (const group of groups) {
      // BORDERING
      for (const layer of group.layers) {

        let graphics = await LayerInstance.getUserLayerBordering({
          layerId: layer.id,
          groupId: group.id,
        });

        if ( !graphics )
          continue;

        let borderingLayer = new GraphicsLayer({
          title: layer.name,
          opacity: 0,
        });

        borderingLayer.layer_id = layer.id;
        borderingLayer.group_id = group.id,
        borderingLayer.isBorder = true;

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

          borderingLayer.add( borderGraphic );
        }

        map.add( borderingLayer, 0 );
      }

      // LAYERS
      for (const layer of group.layers) {
        let graphics = await LayerInstance.getLayerGraphics( layer.id );

        const graphicsLayer = new GraphicsLayer({
          title: layer.name,
        });

        graphicsLayer.isBorder = false;
        graphicsLayer.group_id = group.id;
        graphicsLayer.layer_id = layer.id;

        let fetchedGraphics = [];
        let fetchedGraphic = null;

        for (const graphic of graphics) {

          let geometry = JSON.parse( graphic.geometry );
          let attributes = JSON.parse( graphic.attributes );
          attributes.id = graphic.id;
          let symbol = JSON.parse( layer.symbol );

          let popUpFields = [];

          for (const attributesProperty in attributes) {
            popUpFields.push({
              fieldName: attributesProperty,
              label: attributesProperty
            });
          }

          switch (graphic.type) {
            case "polygon":
              let polygon = {
                type: "polygon",
                rings: geometry.rings,
                spatialReference: geometry.spatialReference
              };

              fetchedGraphic = new Graphic({
                geometry: polygon,
                symbol: symbol,
                attributes: attributes,
                popupTemplate: {
                  title: "Pop up",
                  outFields: ["*"],
                  content: [{
                    type: "fields",
                    fieldInfos: popUpFields,
                  }]
                }
              });
              break;
            case "line":
              let polyline = {
                type: "polyline",
                paths: geometry.paths,
                spatialReference: geometry.spatialReference
              };

              fetchedGraphic = new Graphic({
                geometry: polyline,
                symbol: symbol,
                attributes: attributes,
                popupTemplate: {
                  title: "Pop up",
                  outFields: ["*"],
                  content: [{
                    type: "fields",
                    fieldInfos: popUpFields,
                  }]
                }
              });

              break;
            case "point":
              let point = {
                type: "point",
                x: geometry.x,
                y: geometry.y,
                spatialReference: geometry.spatialReference
              };

              fetchedGraphic = new Graphic({
                geometry: point,
                symbol: symbol,
                attributes: attributes,
                popupTemplate: {
                  title: "Pop up",
                  outFields: ["*"],
                  content: [{
                    type: "fields",
                    fieldInfos: popUpFields,
                  }]
                }
              });
              break;
            default:
              console.log( "No type" );
              break;
          }
          fetchedGraphics.push( fetchedGraphic );
        }

        graphicsLayer.graphics.addMany( fetchedGraphics );

        map.layers.push( graphicsLayer );
        layer.mapId = graphicsLayer.id;
        allLayers.push( layer );
      }
    }

    if( groups.length > 0 )
      socket.emit("init", {
        layers: allLayers,
      });

    const toggleBorderingLayers = ({ layer_id = null, group_id = null }) => {

      map.layers.map( mapLayer => mapLayer.isBorder && mapLayer.layer_id !== -1 ? mapLayer.opacity = 0 : mapLayer );

      if( layer_id !== null && group_id !== null ) {
        let layer = map.layers.find( mapLayer =>
          mapLayer.isBorder &&
          mapLayer.layer_id &&
          mapLayer.group_id &&
          mapLayer.layer_id === layer_id &&
          mapLayer.group_id === group_id );

        if( layer )
          layer.opacity = 1;
      }
    };

    let nestedList = document.createElement("div");

    view.ui.add( nestedList, "top-right");

    let toggleMapLayer = ( id ) => { map.findLayerById( id ).opacity = !map.findLayerById( id ).opacity ? 1 : 0 };

    let sketchVM = null;
    let editedLayer = null;
    let createGraphicEvent = null;
    let updateGraphicEvent = null;
    let deleteGraphicEvent = null;

    let editWidgetContainer = document.createElement("div");
    view.ui.add( editWidgetContainer, "top-right");

    let startDraw = ( graphicType, onDrawEnd = null ) => {
      if( sketchVM === null )
        return

      if( graphicType === null )
        return sketchVM.cancel();

      drawingLayer.removeAll();

      if( graphicType === "edit" ) {
        sketchVM.layer = map.findLayerById( editedLayer.mapId );
        if( updateGraphicEvent !== null )
          return;

        if( deleteGraphicEvent !== null )
          return;

        updateGraphicEvent = sketchVM.on("update", async(event) => {
          if (event.state === "start")  {

            let graphic = event.graphics[0];

            if( onDrawEnd === null )
              return;

            let graphicData = onDrawEnd( graphic, graphic.attributes );
            dataToSave = { ...graphicData };
          }

          if (event.state === "complete") {
            sketchVM.layer = drawingLayer;

            console.log( "update:complete:dataToSave", dataToSave );
          }
        });

        deleteGraphicEvent = sketchVM.on("delete", async( event ) => {
          onLayerEditDisable();
          console.log( 'delete:graphics', event.graphics[0].toJSON() );

          let graphic = event.graphics[0];

          LayerInstance.deleteLayerGraphic({
            layer_id: editedLayer.id,
            graphic_id: graphic.attributes.id,
          }).then(( response ) => {
            console.log( 'delete:deleteLayerGraphic', response );
            NotificationInstance.success( "Done" );
          });

        });
      } else {
        sketchVM.create( graphicType, {mode: "click"});

        let contains = false;

        if( createGraphicEvent == null ) {

          createGraphicEvent = sketchVM.on("create", (event) => {

              let layer = map.layers.find( mapLayer =>
                mapLayer.isBorder &&
                mapLayer.layer_id &&
                mapLayer.layer_id === editedLayer.id );

              if( event.state === "active" ) {

                console.log( layer );

                console.log( event.graphic.geometry.paths && event.graphic.geometry.paths.length,
                  " || " , event.graphic.geometry.rings && event.graphic.geometry.rings[0].length > 3 );


                if( layer ) {

                  let geometries = [];

                  for (const graphic of layer.graphics) {
                    geometries.push( graphic.geometry );
                  }

                  if(
                      ( event.graphic.geometry.paths && event.graphic.geometry.paths.length ) ||
                      ( event.graphic.geometry.rings && event.graphic.geometry.rings[0].length > 3 )
                  ) {

                    contains = !!(geometries.find(( geometry ) => geometryEngine.contains( geometry, event.graphic.geometry) ));

                    console.log( "contains", contains );

                    sketchVM.polygonSymbol = contains ? editSymbol[ graphicType ] : invalidSymbol[ graphicType ];
                    sketchVM.polylineSymbol = contains ? editSymbol[ graphicType ] : invalidSymbol[ graphicType ];

                  }
                }

              }

              if( event.state === "start" ) {
                console.log( event );

                contains = false;

                socket.emit("startDraw", {
                  layer: editedLayer,
                  user: myUser,
                  point: event.graphic.geometry.toJSON(),
                });
              }

              if (event.state === "complete") {

                // event.graphic.attributes =
                console.log( "contains", contains );

                if( !contains ) {
                  NotificationInstance.warning("Out of boundary");

                  sketchVM.cancel();
                  drawingLayer.removeAll();
                  return;
                }

                if( onDrawEnd !== null ) {
                  let graphicData = onDrawEnd( event.graphic );
                  dataToSave = { ...graphicData };

                  console.log( "dataToSave", dataToSave );
                }

                // sketchVM.create( graphicType, {mode: "click"});
              }
            });
          }
      }

    }

    let saveGraph = async ( dataToSave ) => {
      console.log( "saveGraph:dataToSave", dataToSave );

      if( dataToSave.mode === "update" ) {
        console.log( "update:saveGraph:dataToSave", dataToSave );

        let graphic = dataToSave.graphic;

        LayerInstance.updateLayerGraphic({
          id: graphic.attributes.id,
          attributes: JSON.stringify(dataToSave.attributes),
          geometry: JSON.stringify( graphic.geometry.toJSON() ),
          extent: graphic.geometry.type === "point" ? JSON.stringify( graphic.geometry.toJSON() ) : JSON.stringify( graphic.geometry.extent.toJSON() )
        }).then(() => {
          NotificationInstance.success( "Done" );
        });

        return;
      }

      let layer = map.findLayerById( editedLayer.mapId )

      if( layer === null )
        return;

      let popUpFields = [];

      popUpFields.push({
        fieldName: "id",
        label: "id"
      });

      for (const attributesProperty in dataToSave.attributes) {
        popUpFields.push({
          fieldName: attributesProperty,
          label: attributesProperty
        });
      }

      const polygonGraphic = new Graphic({
        geometry: dataToSave.graphic.geometry,
        symbol: JSON.parse( editedLayer.symbol ),
        attributes: dataToSave.attributes,
        popupTemplate: {
          title: "Pop up",
          outFields: ["*"],
          content: [{
            type: "fields",
            fieldInfos: popUpFields,
          }]
        }
      });

      layer.add( polygonGraphic );

      socket.emit("addGraph", {
        layer: editedLayer,
        graphic: polygonGraphic.toJSON(),
      });

      await LayerInstance.addGraphicToLayer({
        layer_id: editedLayer.id,
        type: editedLayer.type,
        geometry: JSON.stringify(polygonGraphic.geometry.toJSON()),
        attributes: JSON.stringify( dataToSave.attributes ),
        extent: editedLayer.type === "point" ? JSON.stringify(polygonGraphic.geometry.toJSON()) : JSON.stringify(polygonGraphic.geometry.extent.toJSON()),
        user_id: myUser.id,
      });

      NotificationInstance.success( "Done" );
    };

    let onLayerEditEnable = ({ layer_id = null, group_id = null }) => {

      // let layer = map.findLayerById( layerId );

      // console.log( layerId );

      sketchVM = new SketchViewModel({
        layer: drawingLayer,
        view: view,
        // pointSymbol: ,
        polygonSymbol: editSymbol["polygon"],
        polylineSymbol: editSymbol["polyline"],
      });

      createGraphicEvent = null;

      editedLayer = allLayers.find( layer => layer.pivot.layer_id === layer_id && layer.pivot.group_id === group_id );

      toggleBorderingLayers( { layer_id: layer_id, group_id: group_id } );

      ReactDOM.render( <EditWidget saveGraph={ saveGraph } startDraw={ startDraw } layer={ editedLayer }/>, editWidgetContainer);
    };

    let onLayerEditDisable = () => {
      if( sketchVM != null ) {
        sketchVM.cancel();

        drawingLayer.removeAll();

        sketchVM.destroy();

        toggleBorderingLayers( { layer_id: null, group_id: null });
        ReactDOM.render( null , editWidgetContainer);
        return;
      }
    };

    ReactDOM.render(<NestedList onEditDisable={ onLayerEditDisable } onEditEnable={ onLayerEditEnable } toggleMapLayer={ toggleMapLayer } view={ view } groups={ groups } layers={ allLayers } />, nestedList);
  });

  return <div { ...props } style={{ height: '100%', width: '100%', overflow: 'none' }} ref={mapEl}></div>;
};

export default EsriMap;
