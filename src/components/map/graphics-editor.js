import * as React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import {
  Container,
  Divider,
  ListItem,
  List,
  TextField,
  Button
} from '@mui/material';
import { useEffect, useState } from 'react';

import EditorToolbar from './editor-toolbar';
import LayerController from '../../rest/controllers/LayerController';

let LayerInstance = new LayerController();
export default function EditWidget({ saveGraph, startDraw = null, onAttributesSet = null, layer = null, ...props }) {

  let fields = JSON.parse( layer.fields );

  const [ geometry, setGeometry ] = useState();
  const [ attributes, setAttributes ] = useState( null );
  const [ mode, setMode ] = useState( "create" );

  // useEffect(() => {
  //
  // });

  const startDrawHandler = async( type ) => {
    startDraw( type, ( graphic, startAttributes ) => {

      if( startAttributes != null ) {
        setAttributes( startAttributes );
        setMode("update");
      } else {
        setMode("create");
      }

      setGeometry( graphic );

      return { graphic: graphic, attributes: attributes };
    });
  }

  return (
    <Container sx={{ bgcolor: 'background.paper' }}>
      <Box { ...props } sx={{ padding: "8px", width: "100%", height: "64px", display: { xs: 'none', md: 'flex' } }}>

        <EditorToolbar startDraw={ startDrawHandler } graphicType={ layer.type } />

      </Box>
      <Divider />
      <Box { ...props } sx={{ minHeight: "64px" }}>
        <List dense>
          { layer && layer.fields
            ?
            fields.map(( field, index ) =>
                <ListItem key={ index }>
                  <TextField
                    label={ field.name }
                    // required
                    value={ attributes != null ? (attributes[ field.name ] != null ? attributes[ field.name ] : "") : "" }
                    onChange={( event ) => {
                      let newAttributes = { ...attributes };
                      newAttributes[ field.name ] = event.target.value ;
                      setAttributes( newAttributes );
                    }}
                    id="standard-required"
                    variant="standard"
                  />
                </ListItem>
            )
            : null
          }
        </List>
      </Box>

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
            onClick={() => {
              saveGraph({ graphic: geometry, attributes: attributes, mode: mode });
              setAttributes({});
            }}
            color="primary"
            variant="contained">
            Add Graphic
          </Button>
        </Box>
      </Box>

    </Container>
  );
}
