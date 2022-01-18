import Head from 'next/head';
import dynamic from "next/dynamic";
import React, { useEffect, useRef, useState } from 'react';
import { Box, Container, Grid } from '@mui/material';

import { DashboardLayout } from '../components/dashboard-layout';
import UserController from '../rest/controllers/UserController';
import GroupConroller from '../rest/controllers/GroupConroller';

const UserInstance = new UserController();

const GroupInstance = new GroupConroller();

const EsriBorderMap = dynamic(() => import("../components/bordering/BorderMap"), {
  ssr: false,
});

const BorderMap = () => {

  const [ logedUser, setLogedUser ] = useState(null);
  const [ groups, setGroups ] = useState([]);

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

  return (
    <>
      <Head>
        <title>
          Bordering | Material Kit
        </title>
      </Head>
      <Box component="main" sx={{ flexGrow: 1, height: "100%", width: "100%" }}>
        <Container sx={{ height: "100%", padding: 0, width: "100%" }} maxWidth={false}>
          <Grid sx={{ height: "100%", width: "100%" }} container spacing={3}>
            <Grid item xs={12}>

              <EsriBorderMap groups={ groups } />

            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

BorderMap.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default BorderMap;
