import Head from 'next/head';
import { Box, Container, Grid } from '@mui/material';
import { DashboardLayout } from '../components/dashboard-layout';
import { LayersList } from "../components/layers/layers-list";
import { LayersListToolbar } from "../components/layers/layers-list-toolbar";
import { AddLayer } from "../components/groups/add-layer";
import { useEffect, useState } from 'react';
import LayerController from '../rest/controllers/LayerController';
import Notification from '../utils/notification';

const LayerInstance = new LayerController();

const Layers = () => {

  const [ layers, setlayers ] = useState();

  const NotificationInstance = new Notification();

  useEffect(() => {
    (async () => {

      const fetchedLayers = await LayerInstance.getLayers();
      setlayers( fetchedLayers );

    })();}, []);

  const addLayer = ( layer ) => {
    setlayers([ ...layers, layer]);
    NotificationInstance.success( "Done" );
  };

  const removeLayer = ( id ) => {
    setlayers(layers.filter( existingLayer => existingLayer.id !== id ) );
    NotificationInstance.success( "Done" );
  };

  return(
    <>
      <Head>
        <title>
          Layers | Material Kit
        </title>
      </Head>
      <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
        <Container maxWidth={false}>
          <LayersListToolbar/>
          <Grid container spacing={0}>
            <Grid item md={12} xs={12} sx={{ paddingTop: "24px" }}>
              <LayersList removeLayer={ removeLayer } layersList={ layers } sx={{ position: "relative", minHeight: "100%" }}/>
            </Grid>
            <Grid item container md={12} xs={12} sx={{ paddingTop: "24px" }}>
              <Grid item md={12}>
                <AddLayer addLayer={ addLayer } />
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

Layers.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Layers;
