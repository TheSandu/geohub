import { useState } from 'react';
import {
  TextField,
  Autocomplete
} from '@mui/material';
import LayerController from '../../rest/controllers/LayerController';

export const AddMemberLayerField = ({ onSelectLayer = null , ...props }) => {
  const [, setInputValue] = useState("");
  const [options, setOptions] = useState([]);


  let LayerInstance = new LayerController();

  const handleRoleChange = (event) => {
    setInputValue(event.target.value);

    if( !event.target.value ) {
      setOptions( [] );
      return;
    }

    LayerInstance.getLayersByName( event.target.value )
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
      { ...props }
      id="google-map-demo"
      getOptionLabel={ (option) => {
        return option.name;
      }}
      onChange={(event, newValue) => {
        if( onSelectLayer !== null )
          onSelectLayer( newValue );
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
          helperText="Please select layer"
          label="Select layer"
          variant="standard"
          fullWidth
          onChange={handleRoleChange}
        />
      )}
    />
  );
};
