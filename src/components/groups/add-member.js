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
} from '@mui/material';
import { AddMemberUserField } from "./add-member-user-field";
import { AddMemberGroupField } from "./add-member-group-field";
import GroupConroller from '../../rest/controllers/GroupConroller';
import Notification from '../../utils/notification';


export const AddMember = ({ onSelectUser = null, addMember = null, groupId = null , ...props }) => {
  const [ user, setUser ] = useState( null );
  const [ group, setGroup ] = useState( null );
  const [ role, setRole ] = useState( null );

  let GroupInstance = new GroupConroller();

  const NotificationInstance = new Notification();

  const addMemberToGroup = () => {

    if( !user )
      return;

    if( !group )
      return;

    GroupInstance.attachMemberToGroup({
      user_id: user.id,
      group_id: group.id,
      role: "editor",
    }).then(( member ) => {
      if( groupId === group.id )
        addMember();

      NotificationInstance.success( "Done" );
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
          title="Add Member"/>
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
              <AddMemberUserField onSelectUser={ ( user ) => {
                if( !user ) return;

                setUser( user );
              }} />
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
              onClick={ addMemberToGroup }
              color="primary" variant="contained">
              Add member
            </Button>
          </Box>
        </Box>

      </Card>
    </form>
  );
};
