import axios from "../../utils/axios";

export default class LayerController {
  async getLayers() {
    let layers = await axios.post('http://localhost:8000/api/layer/getLayers', );

    if( !layers.data )
      return false;

    return layers.data.data;
  }

  async getLayer( id ) {
    let layer = await axios.post('http://localhost:8000/api/layer/getLayer', {
      id: id
    });

    if( !layer.data )
      return false;

    return layer.data.data;
  }

  async getLayersByName( name ) {
    let response = await axios.post('http://localhost:8000/api/layer/getLayersByName', {
      name: name
    });

    if( !response.data )
      return false;

    return response.data.data;
  }

  async getLayerGraphics( layerId ) {
    let response = await axios.post('http://localhost:8000/api/layer/getLayerGraphics', {
      id: layerId
    });

    if( !response.data )
      return false;

    return response.data.data;
  }

  async getLayerBordering({ layerId, groupId }) {
    let response = await axios.post('http://localhost:8000/api/layer/getLayerBordering', {
      layer_id: layerId,
      group_id: groupId,
    });

    if( !response.data )
      return false;

    return response.data.data;
  }

  async getUserLayerBordering({ layerId, groupId }) {
    let response = await axios.post('http://localhost:8000/api/layer/getUserLayerBordering', {
      layer_id: layerId,
      group_id: groupId,
    });

    if( !response.data )
      return false;

    return response.data.data;
  }

  async addBorder({ layer_id, group_id, geometry, attributes, extent }) {

    let response = await axios.post( "http://localhost:8000/api/layer/addBorder", {
      layer_id: layer_id,
      group_id: group_id,
      geometry: geometry,
      attributes: attributes,
      extent: extent,
    });

    if( !response.data )
      return false;

    return response.data.data;
  }

  async addGraphicToLayer({ layer_id, type, geometry, attributes, extent, user_id }) {

    let response = await axios.post( "http://localhost:8000/api/layer/addGraphicToLayer", {
      layer_id: layer_id,
      type: type,
      geometry: geometry,
      attributes: attributes,
      extent: extent,
      user_id: user_id,
    });

    if( !response.data )
      return false;

    return response.data.data;
  }

  async addLayer({ name, type, symbol, fields }) {

    let response = await axios.post( "http://localhost:8000/api/layer/addLayer", {
      name: name,
      type: type,
      symbol: symbol,
      fields: fields,
    });

    if( !response.data )
      return false;

    return response.data.data;
  }

  async deleteLayer({ id }) {
    let response = await axios.post( "http://localhost:8000/api/layer/deleteLayer", {
      id: id
    });

    if( !response.data )
      return false;

    return response.data.data;
  }

  async updateLayerGraphic({id, geometry = null, attributes = null, extent = null}) {
    let response = await axios.post( "http://localhost:8000/api/layer/updateLayerGraphic", {
      id: id,
      geometry: geometry,
      attributes: attributes,
      extent: extent,
    });

    if( !response.data )
      return false;

    return response.data.data;
  }

  async deleteLayerGraphic({layer_id, graphic_id}) {
    let response = await axios.post( "http://localhost:8000/api/layer/deleteLayerGraphic", {
      layer_id: layer_id,
      graphic_id: graphic_id,
    });

    if( !response.data )
      return false;

    return response.data.data;
  }
}
