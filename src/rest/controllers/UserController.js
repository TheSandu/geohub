import axios, { setSession, setUserSession, getAccessUser } from "../../utils/axios";

export default class UserController {

  async login( data ) {
    let users = await axios.post('http://localhost:8000/api/login', {
      email: data.email,
      password: data.password,
    });

    if( !users.data )
      return false;

    setSession( users.data.token );
    setUserSession( users.data.user );

    return users.data;
  }

  async getUsers() {
    let users = await axios.post('http://localhost:8000/api/user/getUsers' );

    if( !users.data )
      return false;

    return users.data.data;
  }

  async getUser( id ) {
    let user = await axios.post('http://localhost:8000/api/user/getUser', {
      id: id
    });

    if( !user.data )
      return false;

    return user.data.data;
  }

  async getUsersByName( name ) {
    let user = await axios.post('http://localhost:8000/api/user/getUsersByName', {
      name: name
    });

    if( !user.data )
      return false;

    return user.data.data;
  }

  async getUserLayers( id ) {
    let layers = await axios.post('http://localhost:8000/api/user/getUserLayers', {
      id: id
    });

    if( !layers.data )
      return false;

    return layers.data.data;
  }

  async logedUser() {
    return getAccessUser();
  }

  async addUser( data ) {
    let response = await axios.post( "http://localhost:8000/api/user/addUser", {
      name: data.name,
    });

    if( !response.data )
      return false;

    return response.data;
  }
}
