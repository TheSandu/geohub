import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Box, Card, CardHeader, Divider, IconButton, Typography, ListItemButton, Pagination
} from '@mui/material';
import PerfectScrollbar from 'react-perfect-scrollbar';
import LayersIcon from '@mui/icons-material/Layers';
import SimpleListMenu from '../simple-menu';
import { useEffect, useState } from 'react';
import GroupConroller from '../../rest/controllers/GroupConroller';
import LayerController from '../../rest/controllers/LayerController';

let GroupInstance = new GroupConroller();
let LayerInstance = new LayerController();

export function LayersList({ removeLayer, layersList = [], stickPaginBottom = false ,...props }) {

  const [layers, setLayers] = useState( layersList );

  useEffect(() => {
    setLayers( layersList );
  });

  return (
    <Card {...props}>
      <CardHeader title="Layers" />
      <Divider />
      <Box>
        <PerfectScrollbar >
          <Box sx={{ minHeight: "100%" }}>
            <List >
              { layers.map( ( layer ) => {
                return (
                  <ListItem
                    key={ layer.id }
                    disablePadding
                  >
                    <ListItemIcon>
                      <LayersIcon/>
                    </ListItemIcon>
                    <ListItemText
                      primary={ layer.name }
                      secondary={ layer.type }
                    />
                    <SimpleListMenu>
                      <Typography
                        onClick={ () => {
                          if( layer.pivot )
                            GroupInstance.detachLayerToGroup( layer.pivot )
                              .then(( response ) => {
                                if( removeLayer !== null )
                                  removeLayer( layer.id );
                              });
                        }}
                        variant="body2">
                        Remove Layer
                      </Typography>
                      <Typography
                        onClick={() => {
                          LayerInstance.deleteLayer({ id: layer.id })
                            .then(() => {
                              if( removeLayer !== null )
                                removeLayer( layer.id );
                            });
                        }}
                        variant="body2">
                        Delete Layer
                      </Typography>
                    </SimpleListMenu>
                  </ListItem>
                );
              })

              }
            </List>
          </Box>
        </PerfectScrollbar>
      </Box>
      <Box sx={{
        width: "100%",
        position: stickPaginBottom ? "absolute" : "initial",
        bottom: 2
      }}>
        <Divider />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            p: 2,
          }}
        >
          <Pagination
            color="primary"
            count={3}
            size="small"
          />
        </Box>
      </Box>
    </Card>
  );
}
