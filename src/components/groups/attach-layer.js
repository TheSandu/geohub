import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider, FormControl, FormHelperText,
  Grid, InputLabel, MenuItem, Select,
  TextField
} from '@mui/material';
import LayerController from '../../rest/controllers/LayerController';
import { AddMemberGroupField } from './add-member-group-field';
import { AddMemberLayerField } from './add-member-layer-field';
import GroupConroller from '../../rest/controllers/GroupConroller';
import Notification from '../../utils/notification';

let LayerInstance = new LayerController();
let GroupInstance = new GroupConroller();


export const AttachLayer  = ({ groupId, attachLayer = null ,...props }) => {
  const [group, setGroup] = useState();
  const [layer, setLayer] = useState();

  const NotificationInstance = new Notification();

  const addLayerHandler = async () => {

    let serverResponse = await GroupInstance.attachLayerToGroup({
      layer_id: layer.id,
      group_id: group.id,
    });

    if( attachLayer !== null && groupId === group.id)
      attachLayer( layer );

    NotificationInstance.success( "Done" );
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
          title="Attach Layer"/>
        <Divider />
        <CardContent>
          <Grid container spacing={3}>

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
              <AddMemberLayerField
                onSelectLayer={ ( layer ) => {

                  if( !layer )
                    return;

                  setLayer( layer );
                }}
              />
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
              Attach Layer
            </Button>
          </Box>
        </Box>

      </Card>
    </form>
  );
};
