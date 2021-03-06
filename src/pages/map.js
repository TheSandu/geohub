import Head from 'next/head';
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from 'react';
import { Box, Container, Grid } from '@mui/material';
import { DashboardLayout } from '../components/dashboard-layout';
import UserController from '../rest/controllers/UserController';
import GroupConroller from '../rest/controllers/GroupConroller';

const UserInstance = new UserController();

const GroupInstance = new GroupConroller();

const EsriMap = dynamic(() => import("../components/map/EsriMap"), {
  ssr: false,
});

const MapPage = () => {

  const [ layers, setLayers ] = useState();
  const [ groups, setGroups ] = useState([]);
  const [ logedUser, setLogedUser ] = useState(null);

  useEffect( async() => {

    let user = await UserInstance.logedUser();
    setLogedUser( user );

    let fetchedGroups = await GroupInstance.getGroups();

    for (let group of fetchedGroups) {
      let layers = await GroupInstance.getLayersByGroup( group.id );
      group.layers = layers;
    }

    setGroups( fetchedGroups );

  }, []);

  return (<>
    <Head>
      <title>
        Map | Material Kit
      </title>
    </Head>
    <Box component="main" sx={{ flexGrow: 1, height: "100%", width: "100%" }}>
      <Container sx={{ height: "100%", padding: 0, width: "100%" }} maxWidth={false}>
        <Grid sx={{ height: "100%", width: "100%" }} container spacing={3}>
          <Grid item xs={12}>

            <EsriMap groups={ groups }  />

          </Grid>
        </Grid>
      </Container>
    </Box>
  </>);
};

MapPage.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default MapPage;
