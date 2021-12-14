import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { AddMemberGroupField } from '../groups/add-member-group-field';

export const AddLayer = (props) => {
  const [values, setValues] = useState({
    firstName: '',
    lastName: 'Smith',
    email: 'demo@devias.io',
    phone: '',
    state: 'Alabama',
    country: 'USA'
  });

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  return (
    <form
      autoComplete="off"
      noValidate
      {...props}
    >
      <Card>
        <CardHeader
          // subheader="The information can be edited"
          title="Add Layer"/>
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item md={12} xs={12}>
              <TextField
                fullWidth
                helperText="Please specify the layer name"
                label="Layer name"
                name="layerName"
                onChange={handleChange}
                required
                value={values.firstName}
                variant="standard"
              />
            </Grid>

            <Grid item md={12} xs={12}>
              <AddMemberGroupField
                onSelectGroup={ ( group ) => {

                  if( !group )
                    return;

                  setGroup( group );
                }}
              />
            </Grid>

            <Grid item md={12} xs={12}>
              <FormControl variant="standard" sx={{ m: 1, minWidth: "100%" }}>
                <InputLabel id="demo-simple-select-standard-label">Layer type</InputLabel>
                <Select
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  value={10}
                  label="Age"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={10}>Point</MenuItem>
                  <MenuItem value={20}>Line</MenuItem>
                  <MenuItem value={30}>Polygon</MenuItem>
                  <MenuItem value={40}>Combined</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
        <Box>
          <Divider />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              p: 2
            }}
          >
            <Button color="primary" variant="contained">
              Save layer
            </Button>
          </Box>
        </Box>

      </Card>
    </form>
  );
};
