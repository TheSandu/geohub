import * as React from 'react';
import List from '@mui/material/List';
import IconButton from '@mui/material/IconButton';
import ListItemButton from '@mui/material/ListItemButton';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import MapIcon from '@mui/icons-material/Map';
import LayersIcon from '@mui/icons-material/Layers';
import LayersClearIcon from '@mui/icons-material/LayersClear';
import EditIcon from '@mui/icons-material/Edit';

export default function NestedList({
  view,
  layers = [],
  toggleMapLayer = null,
  onEditDisable = null,
  onEditEnable = null,
  ...props }) {
  const [open, setOpen] = React.useState(false);
  const [editedLayer, setEditedLayer] = React.useState(null);
  const [disabledLayers, setDisabledLayers] = React.useState([]);


  const handleClick = () => {
    setOpen(!open);
  };

  const toggleLayer = ( index ) => ( ) => {

    if( toggleMapLayer !== null )
      toggleMapLayer( layers[ index ].mapId );

    if( disabledLayers.find( layerId => layerId == index ) !== undefined ) {
      // enable
      setDisabledLayers( disabledLayers.filter( layerId => layerId != index ) );

    } else {
      // disable
      if( index == editedLayer )
        toggleEditLayer( index )();

      if( onEditDisable !== null )
        onEditDisable();

      setDisabledLayers( [ index, ...disabledLayers ] );
    }
  };

  const toggleEditLayer = ( index ) => () => {

    if( editedLayer == index ) {
      setEditedLayer( null );
      onEditDisable();
    } else {
      setEditedLayer( index );
      onEditEnable( layers[ index ].mapId );
    }
  };

  return (
    <List
      sx={{ width: '300px', maxWidth: 360, bgcolor: 'background.paper' }}
      component="nav"
      aria-labelledby="nested-list-subheader"
      { ...props }
    >
      <ListItemButton onClick={handleClick}>
        <ListItemIcon>
          <MapIcon />
        </ListItemIcon>

        <ListItemText primary={ !open && editedLayer != null ? layers[ editedLayer ].name : "Layers" } />

        {open ? <ExpandLess /> : <ExpandMore />}

      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>

          { layers.map((layer, index) => {
            return (
            <ListItem key={ index } sx={{ pl: 4 }}>
              <ListItemIcon>
                <IconButton
                 onClick={ toggleLayer( index ) }
                >
                  { disabledLayers.find( layerId => layerId == index ) !== undefined ? <LayersClearIcon /> : <LayersIcon/>}
                </IconButton>
              </ListItemIcon>
              <ListItemText primary={ layer.name } />

              <IconButton
              onClick={ toggleEditLayer( index ) }
              sx={ editedLayer == index ?
                {
                  backgroundColor: "#ccc",
                  borderRadius: "10px",
                }
              : null}
              >
                <EditIcon
                  color={ editedLayer == index ? "primary" : "" }
                />
              </IconButton>

            </ListItem>)
          })}
        </List>
      </Collapse>
    </List>
  );
}
