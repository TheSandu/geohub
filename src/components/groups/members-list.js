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
import chunk from '../../utils/chunk-items';

let GroupInstance = new GroupConroller();
export const MembersList = ({ removeMember = null, membersList = [], groupId = null, ...props }) => {

  const [page, setPage] = useState(1);

  let paginatedMembers = chunk( membersList, 5 );

  return(
    <Card {...props}>
      <CardHeader
        title={
          <>
            <span className="esri-icon-user" style={{ paddingRight: "3px" }}></span>
            {'Members'}
          </>
        }/>
      <Divider />
      <Box>
        <PerfectScrollbar >
          <Box sx={{ minHeight: "100%" }}>
            <List>
              {paginatedMembers[ page - 1 ] ? paginatedMembers[ page - 1 ].map((member) => (
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
                              color={ member.pivot.user_role.toLowerCase() === "owner" ? 'primary' : 'secondary' }
                            >
                              { member.pivot.user_role }
                            </SeverityPill>
                          </Grid>
                        </Grid>
                      }
                    />

                      <SimpleListMenu>
                        <Typography
                          disabled={ member.pivot.user_role.toLowerCase() === "owner" }
                          onClick={() => {
                            GroupInstance.detachMemberFromGroup(member.pivot)
                                         .then((response) => {
                                           if (removeMember !== null) {
                                             removeMember(member.id);
                                           }
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
              ))
              :
                null
              }
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
            {
              paginatedMembers.length > 1
                ?
                <Pagination
                  color="primary"
                  page={ page }
                  onChange={ ( event, value ) => { setPage( value ) }}
                  count={ paginatedMembers.length }
                  size="small"
                />
                :
                null
            }
          </Box>
        </Box>

      </Box>
    </Card>
  )
};
