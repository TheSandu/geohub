import { useState } from 'react';
import {
  TextField,
  Autocomplete
} from '@mui/material';
import UserController from '../../rest/controllers/UserController';

export const AddMemberUserField = ({ onSelectUser = null , ...props }) => {
  const [, setInputValue] = useState("");
  const [options, setOptions] = useState([]);

  let UserInstance = new UserController();

  const handleRoleChange = (event) => {
    setInputValue(event.target.value);

    if( !event.target.value ) {
      setOptions( [] );
      return;
    }

    UserInstance.getUsersByName( event.target.value )
    .then(function (data) {

      setOptions( data );

    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });
  };

  return (
    <Autocomplete
      id="google-map-demo"
      getOptionLabel={ (option) => {
        return option.name;
      }}
      onChange={(event, newValue) => {
        if( onSelectUser !== null )
          onSelectUser( newValue );
      }}
      filterOptions={(x) => {
        return x;
      }}
      options={options}
      autoComplete
      includeInputInList
      freeSolo
      renderInput={(params) => (
        <TextField
          {...params}
          helperText="Please select group"
          label="Select user"
          variant="standard"
          fullWidth
          onChange={handleRoleChange}
        />
      )}
    />
  );
};
