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
import chunk from '../../utils/chunk-items';

let GroupInstance = new GroupConroller();
let LayerInstance = new LayerController();

export function LayersList({ removeLayer, layersList = [], stickPaginBottom = false ,...props }) {

  const [page, setPage] = useState(1);

  let paginatedLayers = chunk( layersList, 5 );

  return (
    <Card {...props}>
      <CardHeader title={
        <>
          <span className="esri-icon-layers" style={{ paddingRight: "3px" }}></span>
          {'Layers'}
        </>
      }/>
      <Divider />
      <Box>
        <PerfectScrollbar >
          <Box sx={{ minHeight: "100%" }}>
            <List >
              { paginatedLayers[ page - 1 ] ? paginatedLayers[ page - 1 ].map( ( layer ) => {
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
              : null
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
          {
            paginatedLayers.length > 1
              ?
                <Pagination
                  color="primary"
                  page={ page }
                  onChange={ ( event, value ) => { setPage( value ) }}
                  count={ paginatedLayers.length }
                  size="small"
                />
              :
                null
          }
        </Box>
      </Box>
    </Card>
  );
}
