import * as React from 'react';
import { styled } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { Box, Button, Card } from '@mui/material';

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  '& .MuiToggleButtonGroup-grouped': {
    margin: theme.spacing(0.5),
    border: 0,
    '&.Mui-disabled': {
      border: 0,
    },
    '&:not(:first-of-type)': {
      borderRadius: theme.shape.borderRadius,
    },
    '&:first-of-type': {
      borderRadius: theme.shape.borderRadius,
    },
  },
}));

export default function EditorToolbar({ startDraw = null, graphicType = null , ...props}) {
  const [type, setType] = React.useState();
  const [formats, setFormats] = React.useState(() => []);

  const handleFormat = (event, newFormats) => {
    setFormats(newFormats);
  };

  const handleType = (event, newType) => {
    setType(newType);

    if( startDraw !== null ) {
      startDraw( newType === "line" ? "polyline" : newType );
      setType( null );
    }
  };

  return (
    <div>
      <Paper
        elevation={0}
        sx={{
          display: 'flex',
          border: (theme) => `1px solid ${theme.palette.divider}`,
          flexWrap: 'wrap',
        }}
      >
        <StyledToggleButtonGroup
          size="small"
          value={type}
          exclusive
          onChange={handleType}
          aria-label="text alignment"
        >
          <ToggleButton value="edit" aria-label="edit">
            <span className={'esri-icon-edit'}/>
          </ToggleButton>

          <ToggleButton value="point" aria-label="point" disabled={ graphicType !== "point" }>
            <span className={'esri-icon-map-pin'}/>
          </ToggleButton>

          <ToggleButton value="line" aria-label="left aligned" disabled={ graphicType !== "line" } >
            <span className={'esri-icon-polyline'}/>
          </ToggleButton>

          <ToggleButton value="polygon" aria-label="left aligned" disabled={ graphicType !== "polygon" } >
            <span className={'esri-icon-polygon'}/>
          </ToggleButton>

        </StyledToggleButtonGroup>
        <Divider flexItem orientation="vertical" sx={{ mx: 0.5, my: 1 }} />
        <StyledToggleButtonGroup
          size="small"
          value={formats}
          exclusive

          onChange={handleFormat}
          aria-label="text formatting"
        >
          <ToggleButton value="undo" aria-label="undo">
            <span className={"esri-icon-undo"} ></span>
          </ToggleButton>

          <ToggleButton value="redo" aria-label="redo">
            <span className={"esri-icon-redo"} ></span>
          </ToggleButton>

          <ToggleButton value="close" aria-label="close">
            <span className={"esri-icon-close"} ></span>
          </ToggleButton>

        </StyledToggleButtonGroup>
      </Paper>
    </div>
  );
}
