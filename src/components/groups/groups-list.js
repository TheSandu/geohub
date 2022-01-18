import { useEffect, useState } from 'react';
import { subHours } from 'date-fns';
import { v4 as uuid } from 'uuid';
import {
  Card,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText, IconButton, Box, Pagination, Typography
} from '@mui/material';

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import GroupConroller from "../../rest/controllers/GroupConroller";
import SimpleListMenu from '../simple-menu';
import Notification from '../../utils/notification';
import chunk from '../../utils/chunk-items';

let GroupInstance = new GroupConroller();

export const GroupsList = ({ removeGroup = null, groups = [],stickPaginBottom, onGroupSelectEvent = null, ...props }) => {
  const [selectedGroup, setSelectedGroup] = useState( null );
  const [selectionGroup, setSelectionGroup] = useState(null);

  const [page, setPage] = useState(1);
  let paginatedGroups = chunk( groups, 5 );

  const NotificationInstance = new Notification();

  const onGroupSelect = (groupId) => () => {
    setSelectionGroup(groupId);
  }

  const onGroupSelected = (groupId) => async () => {
    setSelectedGroup(groupId);
    if( onGroupSelectEvent != null ) {

      const members = await GroupInstance.getMembersByGroup( groupId );
      const layers = await GroupInstance.getLayersByGroup( groupId );

      onGroupSelectEvent({
        fetchedLayers: layers,
        fetchedMembers: members,
        groupId: groupId,
      });
    }
  }

  useEffect(() => {
    if( groups.length === 0 )
      return;

    onGroupSelect( groups[0].id )();
    onGroupSelected( groups[0].id )();
  }, [groups]);

  const onGroupDeselect = () => {
    setSelectionGroup(null);
  }

  return(
    <Card {...props}>
      <CardHeader
        subtitle={`${groups.length} in total`}
        title={
        <>
          <span className="esri-icon-group" style={{ paddingRight: "3px" }}></span>
          {'Groups'}
        </>
        }
      />
      <Divider/>
      <List
        onMouseLeave={ onGroupDeselect }
      >
        {paginatedGroups[ page - 1 ] ? paginatedGroups[ page - 1 ].map((group) => (
          <ListItemButton
            key={ group.id }>
            <ListItem
              onMouseOver={ onGroupSelect( group.id ) }
              onClick={ onGroupSelected( group.id ) }
              disablePadding
              secondaryAction={
                selectedGroup === group.id || selectionGroup === group.id
                ?
                  <IconButton edge="end" aria-label="more">
                    <ArrowForwardIcon />
                  </IconButton>
                : null
              }
            >
              <ListItemText
                primary={group.name}
                // secondary={`Updated ${formatDistanceToNow(product.updatedAt)}`}
              />
            </ListItem>
            <SimpleListMenu>
              <Typography
                onClick={ () => {
                  GroupInstance.deleteGroup( group.id )
                    .then(( response ) => {
                      if( removeGroup !== null )
                        removeGroup( group.id );
                    });

                }}
                variant="body2">
                Remove group
              </Typography>
              <Typography
                variant="body2">
              </Typography>
            </SimpleListMenu>
          </ListItemButton>
        ))
        : null
        }
      </List>
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
            // width: "33%",
            // margin: "0 32%",
          }}
        >
          {
            paginatedGroups.length > 1
              ?
              <Pagination
                color="primary"
                page={ page }
                onChange={ ( event, value ) => { setPage( value ) }}
                count={ paginatedGroups.length }
                size="small"
              />
              :
              null
          }
        </Box>
      </Box>
    </Card>
  )
};
