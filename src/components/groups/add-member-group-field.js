import { useState } from 'react';
import {
  TextField,
  Autocomplete
} from '@mui/material';
import GroupConroller from '../../rest/controllers/GroupConroller';

export const AddMemberGroupField = ({ onSelectGroup = null , ...props }) => {
  const [, setInputValue] = useState("");
  const [options, setOptions] = useState([]);

  let GroupInstance = new GroupConroller();

  const handleRoleChange = (event) => {
    setInputValue(event.target.value);

    if( !event.target.value ) {
      setOptions( [] );
      return;
    }

    GroupInstance.getGroupsByName( event.target.value )
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
        if( onSelectGroup !== null )
          onSelectGroup( newValue );
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
          helperText="Please select member"
          label="Select group"
          variant="standard"
          fullWidth
          onChange={handleRoleChange}
        />
      )}
    />
  );
};
