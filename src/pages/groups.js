import Head from 'next/head';
import { Box, Card, Container, Divider, Grid } from '@mui/material';
import { DashboardLayout } from '../components/dashboard-layout';
import { GroupsList } from "../components/groups/groups-list";
import { MembersList } from "../components/groups/members-list";
import { AddGroup } from "../components/groups/add-group";
import { AddMember } from "../components/groups/add-member";
import { AttachLayer } from "../components/groups/attach-layer";

import { GroupsListToolbar } from "../components/groups/groups-list-toolbar";
import { LayersList } from "../components/layers/layers-list";
import { useEffect, useState } from 'react';
import Notification from "../utils/notification";
import GroupConroller from '../rest/controllers/GroupConroller';
import UserController from '../rest/controllers/UserController';

let GroupInstance = new GroupConroller();

const Group = () => {
  const [members, setMembers] = useState([]);
  const [layers, setLayers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [groupId, setGroupId] = useState(null);

  const [ logedUser, setLogedUser ] = useState(null);

  let UserInstance = new UserController();

  const NotificationInstance = new Notification();

  useEffect(() => {
    (async () => {

      let user = await UserInstance.logedUser();

      setLogedUser( user );

      const fetchedGroups = await GroupInstance.getGroups();
      setGroups( fetchedGroups );
    })();}, []);

  const setData = ({ fetchedLayers, fetchedMembers, groupId }) => {
    setLayers( fetchedLayers );
    setMembers( fetchedMembers );
    setGroupId( groupId );
  };

  const addMember = async (  ) => {
    const fetchedMembers = await GroupInstance.getMembersByGroup( groupId );
    const fetchedLayers = await GroupInstance.getLayersByGroup( groupId );
    setLayers( fetchedLayers );
    setMembers( fetchedMembers );
  }

  const addGroup = ( group ) => {
    setGroups([ ...groups , group]);
    NotificationInstance.success( "Done" );
  };

  const addLayer = ( layer ) => {
    setLayers([...layers, layer]);
  };

  const removeGroup = ( id ) => {
    setGroups(groups.filter( existingGroup => existingGroup.id != id ) );
    NotificationInstance.success( "Done" );
  };

  const removeMember = ( id ) => {
    setMembers(members.filter( existingMember => existingMember.id != id ) );
    NotificationInstance.success( "Done" );
  };

  const removeLayer = ( id ) => {
    setLayers(layers.filter( existingLayer => existingLayer.id != id ) );
    NotificationInstance.success( "Done" );
  };

  return (<>
    <Head>
      <title>
        { logedUser !== null ? logedUser.name : "GROUP" } | Material Kit
      </title>
    </Head>
    <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
      <Container maxWidth={false}>
        <GroupsListToolbar/>
        <Grid container spacing={0}>
          <Grid item md={4} xs={12}>
            <GroupsList removeGroup={ removeGroup } groups={ groups } onGroupSelectEvent={ setData } stickPaginBottom sx={{ position: "relative", minHeight: "500px", paddingBottom: "54px", borderRadius: 0 }}/>
          </Grid>
          <Divider orientation="vertical" flexItem/>
          <Grid item md={4} xs={12}>
            <MembersList removeMember={ removeMember } membersList={ members } sx={{ position: "relative", minHeight: "100%", borderRadius: 0 }}/>
          </Grid>
          <Divider orientation="vertical" flexItem/>
          <Grid item md={3} xs={12} sx={{
            position: "relative",
            minHeight: "100%",
            borderRadius: 0
          }}>
            <LayersList removeLayer={ removeLayer } layersList={ layers } stickPaginBottom sx={{ position: "relative", minHeight: "100%", borderRadius: 0 }}/>
          </Grid>

          <Grid container spacing={3} item md={12} xs={12} sx={{ paddingTop: "24px" }}>
            <Grid item xs={8}>
              <AttachLayer groupId={ groupId } attachLayer={ addLayer } />
            </Grid>
          </Grid>

          <Grid container spacing={3} item md={12} xs={12} sx={{ paddingTop: "24px" }}>
            <Grid item xs={8}>
              <AddGroup groupId={ groupId } addGroup={ addGroup } />
            </Grid>
          </Grid>

          <Grid container spacing={3} item md={12} xs={12} sx={{ paddingTop: "24px" }}>
            <Grid item md={8} xs={12} >
              <AddMember groupId={ groupId } addMember={ addMember } />
            </Grid>
          </Grid>

          {/*<Grid item md={6} xs={12} sx={{ padding: "24px" }}>*/}
          {/*</Grid>*/}

        </Grid>
      </Container>
    </Box>
  </>);
}

Group.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Group;
