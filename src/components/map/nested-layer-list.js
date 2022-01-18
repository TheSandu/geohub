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
  groups = [],
  layers = [],
  toggleMapLayer = null,
  onEditDisable = null,
  onEditEnable = null,
  ...props }) {
  const [editedLayer, setEditedLayer] = React.useState(null);
  const [editedGroup, setEditedGroup] = React.useState(null);
  const [disabledLayers, setDisabledLayers] = React.useState([]);

  const openGroupCollapse = ( id ) => {
    setEditedGroup( id === editedGroup ? null : id );
    setEditedLayer( null );
    onEditDisable();
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

  const toggleEditLayer = ({ layer_id, group_id }) => () => {

    // editedGroup === group.id && editedLayer == layer.id

    if( editedLayer === layer_id && editedGroup === group_id ) {
      setEditedLayer( null );
      onEditDisable();
    } else {
      setEditedLayer( layer_id );
      onEditEnable({ layer_id: layer_id, group_id: group_id });
    }
  };

  return (
    <List
      sx={{ width: '300px', maxWidth: 360, bgcolor: 'background.paper' }}
      component="nav"
      aria-labelledby="nested-list-subheader"
    >
      {
        groups.map((group) => {
          return(
            <div key={ group.id }>
              <ListItemButton onClick={() => openGroupCollapse( group.id ) }>
                <ListItemIcon>
                  <MapIcon />
                </ListItemIcon>

                <ListItemText primary={ group.name } />

                { editedGroup === group.id ? <ExpandLess /> : <ExpandMore />}

              </ListItemButton>
              {

                <Collapse in={ editedGroup === group.id } timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>

                    { group.layers.map((layer, index) => {
                      return (
                        <ListItem key={ index } sx={{ pl: 4 }}>
                          <ListItemIcon>
                            <IconButton onClick={ toggleLayer( index ) }>
                              { disabledLayers.find( layerId => layerId == index ) !== undefined ? <LayersClearIcon /> : <LayersIcon/>}
                            </IconButton>
                          </ListItemIcon>
                          <ListItemText primary={ layer.name } />

                          <IconButton
                            onClick={ toggleEditLayer({ layer_id: layer.id,group_id: group.id }) }
                            sx={
                              editedGroup === group.id && editedLayer == layer.id ?
                                { backgroundColor: "#ccc", borderRadius: "10px", }
                                : null
                            }>
                            <EditIcon
                              color={ editedGroup === group.id && editedLayer === layer.id ? "primary" : "" }
                            />
                          </IconButton>

                        </ListItem>)
                    })}
                  </List>
                </Collapse>

              }
            </div>
          )
        })
      }
    </List>
  );
}
