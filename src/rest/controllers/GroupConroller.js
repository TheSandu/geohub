import axios from "../../utils/axios";

export default class GroupConroller {
  async getGroups() {
    let groups = await axios.post('http://localhost:8000/api/group/getGroups' );

    if( !groups.data )
      return false;

    return groups.data.data;
  }

  async getGroup( id ) {
    let group = await axios.post('http://localhost:8000/api/group/getGroup', {
      id: id
    });

    if( !group.data )
      return false;

    return group.data.data;
  }

  async getLayersByGroup( id ) {
    let response = await axios.post('http://localhost:8000/api/group/getLayersByGroup', {
      id: id
    });

    if( !response.data )
      return false;

    return response.data.data;
  }

  async getMembersByGroup( id ) {
    let response = await axios.post('http://localhost:8000/api/group/getMembersByGroup', {
      id: id
    });

    if( !response.data )
      return false;

    return response.data.data;
  }

  async getGroupsByName( name ) {
    let response = await axios.post('http://localhost:8000/api/group/getGroupsByName', {
      name: name
    });

    if( !response.data )
      return false;

    return response.data.data;
  }

  async attachLayerToGroup( data ) {
    let response = await axios.post('http://localhost:8000/api/group/attachLayerToGroup', {
      layer_id: data.layer_id,
      group_id: data.group_id,
    });

    if( !response.data )
      return false;

    return response.data.data;
  }

  async detachLayerToGroup({ layer_id, group_id }) {
    let response = await axios.post('http://localhost:8000/api/group/detachLayerToGroup', {
      layer_id: layer_id,
      group_id: group_id,
    });

    if( !response.data )
      return false;

    return response.data.data;
  }

  async attachMemberToGroup({ user_id, group_id, role }) {
    let response = await axios.post('http://localhost:8000/api/group/attachMemberToGroup', {
      user_id: user_id,
      group_id: group_id,
      role: role
    });

    if( !response.data )
      return false;

    return response.data.data;
  }

  async detachMemberFromGroup( data ) {
    let response = await axios.post('http://localhost:8000/api/group/detachMemberToGroup', {
      user_id: data.user_id,
      group_id: data.group_id,
    });

    if( !response.data )
      return false;

    return response.data.data;
  }

  async addGroup( data ) {
    let response = await axios.post( "http://localhost:8000/api/group/addGroup", {
      name: data.name,
      owner_id: data.owner_id || 1,
    });

    if( !response.data )
      return false;

    return response.data.data;
  }

  async deleteGroup( id ) {
    let response = await axios.post( "http://localhost:8000/api/group/deleteGroup", {
      id: id,
    });

    if( !response.data )
      return false;

    return response.data.data;
  }
}
