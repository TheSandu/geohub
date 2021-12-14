import Head from 'next/head';
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from 'react';
import { Box, Container, Grid } from '@mui/material';
import { DashboardLayout } from '../components/dashboard-layout';
import UserController from '../rest/controllers/UserController';

const UserInstance = new UserController();

const EsriMap = dynamic(() => import("../components/map/EsriMap"), {
  ssr: false,
});

const MapPage = () => {

  const [ layers, setLayers ] = useState();
  const [ logedUser, setLogedUser ] = useState(null);

  useEffect( async() => {

    let user = await UserInstance.logedUser();
    setLogedUser( user );
    let fetchedLayers = await UserInstance.getUserLayers( user.id );
    setLayers( fetchedLayers );

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

            <EsriMap layers={ layers } />

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
