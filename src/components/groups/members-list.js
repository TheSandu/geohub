import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { v4 as uuid } from 'uuid';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box,
  Grid,
  Card,
  Typography,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Pagination
} from '@mui/material';
import { SeverityPill } from '../severity-pill';
import SimpleListMenu from "../simple-menu";

import GroupConroller from '../../rest/controllers/GroupConroller';

let GroupInstance = new GroupConroller();
export const MembersList = ({ removeMember = null, membersList = [], groupId = null, ...props }) => {

  const [members, setMembers] = useState(membersList);

  useEffect(() => {
      setMembers( membersList );
  });

  return(
    <Card {...props}>
      <CardHeader title="Members" />
      <Divider />
      <Box>
        <PerfectScrollbar >
          <Box sx={{ minHeight: "100%" }}>
            <List>
              {members.map((member) => (
                <ListItem
                  key={ member.id }
                  disablePadding
                >
                  <ListItemButton>
                    <ListItemText
                      primary={
                        <Grid container>
                          <Grid item xs={6}>
                            { member.name }
                          </Grid>
                          <Grid item xs={6}>
                            <SeverityPill
                              color={ 'success' }
                            >
                              { member.pivot.user_role }
                            </SeverityPill>
                          </Grid>
                        </Grid>
                      }
                    />
                    <SimpleListMenu>
                      <Typography
                        onClick={ () => {
                          GroupInstance.detachMemberFromGroup( member.pivot )
                            .then(( response ) => {
                              if( removeMember !== null )
                                removeMember( member.id );
                            });
                        }}
                        variant="body2">
                        Remove member
                      </Typography>
                      <Typography
                        variant="body2">
                      </Typography>
                    </SimpleListMenu>
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </PerfectScrollbar>
        {/*<Divider variant="middle" sx={{ marginTop: "14%" }}  />*/}
        <Box sx={{
          width: "100%",
          position: "absolute",
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

      </Box>
    </Card>
  )
};
