import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider, FormControl, FormHelperText,
  Grid, InputLabel, MenuItem, Select,
  TextField, Typography, IconButton
} from '@mui/material';

import LayerController from '../../rest/controllers/LayerController';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

import ColorPicker from 'material-ui-color-picker';

let LayerInstance = new LayerController();

export const AddLayer = ({ addLayer = null ,...props }) => {
  const [values, setValues] = useState("");
  const [fillColor, setFillColor] = useState("#ccc");
  const [borderColor, setBorderColor] = useState("#000");
  const [layerType, setLayerType] = useState("point");
  const [fieldList, setFieldList] = useState([{ name: "", type: "string" }]);

  const handleChange = (event) => {
    setValues( event.target.value );
  };

  const addLayerHandler = async () => {

    if( fieldList.length == 0 )
      return;

    let point = {
      type: "simple-marker",
      color: fillColor,
      outline: {
        color: borderColor,
        width: 2
      }
    };

    let line = {
      type: "simple-line",
      color: borderColor,
      width: 4
    };

    const fillSymbol = {
      type: "simple-fill",
      color: fillColor,
      outline: {
        color: borderColor,
          width: 2
      }
    }

    let symbol = layerType === "point" ? point : layerType === "line" ? line : layerType === "polygon" ? fillSymbol : null;

    let layer = await LayerInstance.addLayer({
      name: values,
      type: layerType,
      symbol: JSON.stringify( symbol ),
      fields: JSON.stringify( fieldList ),
    });

    if( addLayer !== null )
      addLayer( layer );
    setValues("");
    setFieldList([{ name: "", type: "string" }]);
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
            <Grid item md={3}>
              <Typography variant="h6" gutterBottom component="div">
                Layer Info
              </Typography>
              <Grid item md={12} xs={12}>
                <TextField
                  fullWidth
                  helperText="Please specify the group name"
                  label="Layer name"
                  name="groupName"
                  onChange={handleChange}
                  required
                  value={ values }
                  variant="standard"
                />
              </Grid>

              <Grid item md={12} xs={12}>
                <FormControl variant="standard" sx={{ minWidth: "100% !important" }}>
                  <InputLabel id="demo-simple-select-standard-label">Layer type</InputLabel>
                  <Select
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={ layerType }
                    onChange={ ( event ) => setLayerType( event.target.value ) }
                    label="Type"
                  >
                    <MenuItem value={'point'}>Point</MenuItem>
                    <MenuItem value={'line'}>Line</MenuItem>
                    <MenuItem value={'polygon'}>Polygon</MenuItem>
                  </Select>
                  <FormHelperText>Please specify the layer type</FormHelperText>
                </FormControl>
              </Grid>
            </Grid>

            <Divider orientation="vertical" variant="middle" flexItem />

            <Grid item md={5}>
              <Typography variant="h6" gutterBottom component="div">
                Layer Fields
              </Typography>

              {
                fieldList.map(( element, index ) =>
                  <Grid key={ index } item container md={12}>
                    <Grid item md={5}>
                      <TextField
                        fullWidth
                        label="Field name"
                        name="groupName"
                        onChange={( event ) => {
                          fieldList[ index ].name = event.target.value;
                          setFieldList( [ ...fieldList ] );
                        }}
                        value={ element.name }
                        variant="standard"
                      />
                    </Grid>

                    <Grid item md={5}>
                      <FormControl variant="standard" sx={{ margin: "13px !important", minWidth: "100% !important" }}>
                        <Select
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={ element.type }
                          onChange={ ( event ) => {
                            fieldList[ index ].type = event.target.value;
                            setFieldList( [ ...fieldList ] );
                          }}
                          label="Type"
                        >
                          <MenuItem value={'string'}>String</MenuItem>
                          <MenuItem value={'number'}>Number</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item md={1}>
                      <IconButton onClick={() => { setFieldList( fieldList.filter( (field, fieldIndex) => fieldIndex !== index ) ) }} sx={{ margin: "16px" }}>
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                )
              }

              <Button onClick={() => { setFieldList( [ ...fieldList, { name: "", type: "string" } ] ) }} sx={{ width: '100%' }} size="large">
                <AddIcon/>
              </Button>

            </Grid>

            <Divider orientation="vertical" variant="middle" flexItem />

            <Grid item md={3}>
              <Typography variant="h6" gutterBottom component="div">
                Layer Symbol
              </Typography>

              <Grid item container md={12}>
                <Grid item md={6}>
                  Border
                </Grid>

                <Grid item md={6}>
                  <ColorPicker
                    name='borderColor'
                    defaultValue={ borderColor }
                    value={ borderColor }
                    onChange={color => setBorderColor( color )}
                  />
                </Grid>
              </Grid>

              <Grid item container md={12}>
                <Grid item md={6}>
                  Fill
                </Grid>
                <Grid item md={6}>
                  <ColorPicker
                    name='fillColor'
                    defaultValue={ fillColor }
                    value={ fillColor }
                    onChange={color => setFillColor(color)}
                  />
                </Grid>
              </Grid>

              {
                layerType == "polygon"
                  ?
                    <Grid item container md={12}>
                    <Grid sx={{
                      display:"flex",
                      justifyContent:"center",
                      width: "100%",
                    }} item md={12}>
                      <Grid
                        item
                        md={6}
                      >
                        <Box sx={{
                          backgroundColor: borderColor,
                          '&::after': {
                            borderTopColor: borderColor,
                            borderBottomColor: borderColor,
                          },
                          '&::before': {
                            borderTopColor: borderColor,
                            borderBottomColor: borderColor,
                          },
                        }} className="hex">
                          <Box sx={{
                            backgroundColor: fillColor + " !important",
                            '&::after': {
                              borderTopColor: fillColor + " !important",
                              borderBottomColor: fillColor + " !important",
                            },
                            '&::before': {
                              borderTopColor: fillColor + " !important",
                              borderBottomColor: fillColor + " !important",
                            },
                          }} className="hex inner"></Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid>
                  :
                  layerType == "point"
                    ?
                      <Grid item container md={12}>
                      <Grid sx={{
                        display:"flex",
                        justifyContent:"center",
                        width: "100%",
                      }} item md={12}>
                        <Grid
                          item
                          md={6}
                        >
                          <Box sx={{
                            marginTop: "35px",
                            height: "20px",
                            width: "20px",
                            borderRadius: "50%",
                            backgroundColor: borderColor,
                            border: "3px solid " + borderColor,
                          }}>
                            <Box sx={{
                              height: "100%",
                              width: "100%",
                              transform: "scale(.8, .8)",
                              borderRadius: "50%",
                              border: "3px solid " + fillColor,
                              backgroundColor: fillColor,
                            }}></Box>
                          </Box>
                        </Grid>
                      </Grid>
                    </Grid>
                    : layerType == "line"
                        ?
                          <Grid item container md={12}>
                            <Grid sx={{
                              display:"flex",
                              justifyContent:"center",
                              width: "100%",
                            }} item md={12}>
                              <Grid
                                item
                                md={6}
                              >
                                <Box sx={{
                                  marginTop: "35px",
                                  height: "0px",
                                  width: "100px",
                                  backgroundColor: borderColor,
                                  border: "3px solid " + borderColor,
                                }}>
                                </Box>
                              </Grid>
                            </Grid>
                          </Grid>
                        : null
              }

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
            <Button
              onClick={ addLayerHandler }
              color="primary" variant="contained">
              Add Layer
            </Button>
          </Box>
        </Box>

      </Card>
    </form>
  );
};
