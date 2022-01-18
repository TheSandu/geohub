import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField
} from '@mui/material';
import GroupConroller from '../../rest/controllers/GroupConroller';
import Notification from '../../utils/notification';

let GroupInstance = new GroupConroller();



export const AddGroup = ({ groupId, addGroup = null ,...props }) => {
  const [values, setValues] = useState("");

  const NotificationInstance = new Notification();

  const handleChange = (event) => {
    setValues( event.target.value );
  };

  const addGroupHandler = async () => {
    let group = await GroupInstance.addGroup({
      name: values
    });

    addGroup( group );

    setValues("");
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
          title="Add Group"/>
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item md={12} xs={12}>
              <TextField
                fullWidth
                helperText="Please specify the group name"
                label="Group name"
                name="groupName"
                onChange={handleChange}
                required
                value={ values }
                variant="standard"
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
              onClick={ addGroupHandler }
              color="primary" variant="contained">
              Add group
            </Button>
          </Box>
        </Box>

      </Card>
    </form>
  );
};
