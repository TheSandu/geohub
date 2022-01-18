import * as React from 'react';

import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import GroupsIcon from '@mui/icons-material/Groups';
import BorderStyleIcon from '@mui/icons-material/BorderStyle';

import ModeEditIcon from '@mui/icons-material/ModeEdit';

import CheckIcon from '@mui/icons-material/Check';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import LayersIcon from '@mui/icons-material/Layers';
import { ListItem } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';

import { AddMemberUserField } from '../groups/add-member-user-field';

export default function NestedGroupList({ toggleBorderingLayers, saveBorder, addBorder, clearBorderAdding ,groups = [], ...props }) {
  const [open, setOpen] = React.useState([]);
  const [ selectedLayer, setSelectedLayer ] = React.useState( null);
  const [ selectedUserEnable, setSelectedUserEnable ] = React.useState( false);
  const [ geometry, setGeometry ] = React.useState( null);
  const [ user, setUser ] = React.useState( null);

  const handleClick = ( id ) =>() => {
    setSelectedLayer( null );
    let tempState = open[ id ] !== undefined ? open[ id ] : false;

    open.fill( false );
    open[ id ] = !tempState;

    setOpen([ ...open ]);
  };

  const selectLayerHandle = ( layer_id, group_id ) => () => {
    if( selectedLayer === layer_id ) {
      setSelectedLayer( null );
      toggleBorderingLayers( { layer_id: null, group_id: null, enableUserSelection: null } );
    } else {
      setSelectedLayer( layer_id );
      toggleBorderingLayers({ layer_id: layer_id, group_id: group_id, enableUserSelection } );
    }
  };

  const enableUserSelection = ( geometry ) => {
    if( geometry ) {
      setGeometry( geometry );
      setSelectedUserEnable( true );

      console.log( geometry.toJSON() );

    } else {
      setGeometry( null );
      setSelectedUserEnable( false );
    }
  };

  return (
    <List
      { ...props }
      sx={{ width: '300px', maxWidth: 360, bgcolor: 'background.paper' }}
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
          Groups bordering
        </ListSubheader>
      }
    >

      { groups.length ? groups.map(( group ) => {
        return (
          group.layers.length ?
            <div key={ group.id }>
              <ListItemButton onClick={handleClick( group.id )}>
                <ListItemIcon>

                  <GroupsIcon />

                </ListItemIcon>
                <ListItemText primary={ group.name } />
                {open ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>

              <Collapse in={ open[ group.id ] } timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {
                    group.layers.length ?
                      group.layers.map((layer) =>
                        <div key={ layer.id }>
                          <ListItemButton
                            onClick={ selectLayerHandle( layer.id, group.id ) }

                            sx={{ pl: 4 }}>
                            <ListItemIcon>
                              {
                                selectedLayer === layer.id
                                  ? <CheckIcon />
                                  : <LayersIcon />
                              }
                            </ListItemIcon>
                            <ListItemText primary={ layer.name } />
                          </ListItemButton>

                          <Collapse in={ selectedLayer === layer.id } timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                              <ListItemButton
                                disableRipple
                                sx={{ pl: 6 }}>
                                <ListItemIcon>
                                  <BorderStyleIcon />
                                </ListItemIcon>

                                <ListItemText primary={ `${ layer.name } Borders` } />

                                <IconButton
                                  onClick={() => {
                                    addBorder( enableUserSelection );
                                  }}
                                >
                                  <ModeEditIcon/>
                                </IconButton>

                                <IconButton
                                  onClick={() => {

                                    if( !geometry )
                                      return;

                                    if( !user )
                                      return;

                                    saveBorder({
                                      layerId: selectedLayer,
                                      groupId: group.id,
                                      geometry: geometry.toJSON(),
                                      attributes: user,
                                      extent: geometry.extent.toJSON(),
                                      clearBorderAdding: () => {
                                        setGeometry( null );
                                        setSelectedUserEnable( false );
                                      }
                                    });
                                  }}
                                >
                                  <AddIcon/>
                                </IconButton>

                              </ListItemButton>
                              {
                                selectedUserEnable
                                  ?
                                  <ListItem sx={{ pl: 10, width: "100%" }} dense>
                                    <AddMemberUserField
                                      group={ group.id }
                                      sx={{ width: "100%" }}
                                      onSelectUser={ ( dropdownUser ) => {

                                        if( !dropdownUser ) return;

                                        setUser( dropdownUser );
                                      }} />
                                  </ListItem>
                                  : null
                              }
                            </List>
                          </Collapse>

                        </div>
                      )
                      : null
                  }

                </List>
              </Collapse>
            </div>
            : null
        );
      }) : null
      }

    </List>
  );
}
