import EditedLayerContext from "../bordering/bordering-edit-context";

const DisplayContext = () => {
  return(
    <EditedLayerContext.Consumer>
      { value => <h1> { value } </h1> }
    </EditedLayerContext.Consumer>
  );
};

export default DisplayContext;
