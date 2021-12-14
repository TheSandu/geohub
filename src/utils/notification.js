import React from "react";
import { useSnackbar } from 'notistack';

const position = {
  vertical: 'bottom',
  horizontal: 'right',
}

export default class Notification {
  constructor() {
    const { enqueueSnackbar } = useSnackbar();
    this.enqueueSnackbar = enqueueSnackbar;
  }

  success( message ) {
    this.enqueueSnackbar(message, {
      variant: 'success',
      anchorOrigin: position
    });
  }

  error( message ) {
    this.enqueueSnackbar(message, {
      variant: 'error',
      anchorOrigin: position
    });
  }

  warning( message ) {
    this.enqueueSnackbar(message, {
      variant: 'warning',
      anchorOrigin: position
    });
  }

  info( message ) {
    this.enqueueSnackbar(message, {
      variant: 'info',
      anchorOrigin: position
    });
  }
};
