import React, { useState } from "react";
import {
  AppBar,
  Container,
  Tabs,
  Tab,
  Toolbar,
  Typography
} from "@material-ui/core";
import tabEnum from "../enum/tabEnum";
import useStyles from "./styles";
import FilterData from "../pages/FilterData";
import LabelData from "../pages/LabelData";

const MainContainer = () => {
  const [tabPosition, setTabPosition] = useState(tabEnum[0]);
  const classes = useStyles();

  const handleTabChange = (e, newValue) => {
    setTabPosition(tabEnum[newValue]);
  };

  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h5">Re-Call</Typography>
        </Toolbar>
        <Tabs value={tabPosition?.position} onChange={handleTabChange}>
          {tabEnum.map((item) => {
            return <Tab label={item.value} key={item.position} />;
          })}
        </Tabs>
      </AppBar>
      <Container maxWidth="lg">{<tabPosition.component />}</Container>
    </>
  );
};

export default MainContainer;
