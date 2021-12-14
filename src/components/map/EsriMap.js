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
import BasemapGallery from "@arcgis/core/widgets/BasemapGallery";
import SketchViewModel from "@arcgis/core/widgets/Sketch/SketchViewModel";

import LayerController from '../../rest/controllers/LayerController';

let LayerInstance = new LayerController();

var dataToSave = null;

let EsriMap = ({ layers = [], ...props }) => {
  const mapEl = useRef(null);

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

  const fillSymbol = {
    type: "simple-fill",
    color: [227, 139, 79, 0.8],
    outline: {
      color: [255, 255, 255],
      width: 1
    }
  };

  const editSymbol = {
    type: "simple-fill",
    color: "#ccc",
    outline: {
      color: [0, 0, 0],
      width: 1
    }
  }

  view.when(async () => {

    let layerIds = [];

    map.add( drawingLayer );

    for (const layer of layers) {
      let graphics = await LayerInstance.getLayerGraphics( layer.id );

      const graphicsLayer = new GraphicsLayer({
        title: "Draw",
      });

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

      map.add( graphicsLayer, layer.id );
      layer.mapId = graphicsLayer.id;
    }

    let nestedList = document.createElement("div");

    view.ui.add( nestedList, "top-right");

    let toggleMapLayer = ( id ) => { map.findLayerById( id ).opacity = !map.findLayerById( id ).opacity ? 1 : 0 };

    let sketchVM = null;
    let editedLayer = null;
    let createGraphicEvent = null;
    let updateGraphicEvent = null;

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

        updateGraphicEvent = sketchVM.on("update", (event) => {
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
      } else {
        sketchVM.create( graphicType, {mode: "click"});

        if( createGraphicEvent == null ) {
            createGraphicEvent = sketchVM.on("create", (event) => {
              if (event.state === "complete") {

                // event.graphic.attributes =

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

        });

        return;
      }

      let layer = map.findLayerById( editedLayer.mapId )

      if( layer === null )
        return;

      let popUpFields = [];

      for (const attributesProperty in dataToSave.attributes) {
        popUpFields.push({
          fieldName: attributesProperty,
          label: attributesProperty
        });
      }

      popUpFields.push({
        fieldName: "id",
        label: "id"
      });

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

      await LayerInstance.addGraphicToLayer({
        layer_id: editedLayer.id,
        type: editedLayer.type,
        geometry: JSON.stringify(polygonGraphic.geometry.toJSON()),
        attributes: JSON.stringify( dataToSave.attributes ),
        extent: editedLayer.type === "point" ? JSON.stringify(polygonGraphic.geometry.toJSON()) : JSON.stringify(polygonGraphic.geometry.extent.toJSON()),
      });
    };

    let onLayerEditEnable = ( layerId ) => {

      // let layer = map.findLayerById( layerId );

      sketchVM = new SketchViewModel({
        layer: drawingLayer,
        view: view,
        // pointSymbol: ,
        polygonSymbol: editSymbol,
        // polylineSymbol: ,
      });

      editedLayer = layers.find( layer => layer.mapId === layerId );

      ReactDOM.render( <EditWidget saveGraph={ saveGraph } startDraw={ startDraw } layer={ editedLayer }/>, editWidgetContainer);
    };

    let onLayerEditDisable = () => {
      if( sketchVM != null ) {
        sketchVM.cancel();

        drawingLayer.removeAll();

        sketchVM.destroy();
        ReactDOM.render( null , editWidgetContainer);
        return;
      }
    };

    ReactDOM.render(<NestedList onEditDisable={ onLayerEditDisable } onEditEnable={ onLayerEditEnable } toggleMapLayer={ toggleMapLayer } view={ view } layers={ layers } />, nestedList);

  });

  return <div { ...props } style={{ height: '100%', width: '100%', overflow: 'none' }} ref={mapEl}></div>;
};

export default EsriMap;
