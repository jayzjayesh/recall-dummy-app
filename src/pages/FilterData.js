import React, { useState, useEffect } from "react";
import { Typography, Grid, TextField, Button } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import axios from "axios";
import useStyles from "./styles";
import CustomTable from "../components/CustomTable";
import filterTableHeadEnum from "../enum/filterTableHeadEnum";

const FilterData = () => {
  const classes = useStyles();
  const [agents, setAgents] = useState();
  const [selectedAgents, setSelectedAgents] = useState([]);
  const [timeRangeDuration, setTimeRangeDuration] = useState();
  const [minInputTimeRange, setMinInputTimeRange] = useState("");
  const [maxInputTimeRange, setMaxInputTimeRange] = useState("");
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [filteredCallData, setFilteredCallData] = useState();

  async function fetchAgentData() {
    try {
      const res = await axios.get(
        "https://damp-garden-93707.herokuapp.com/getlistofagents"
      );
      setAgents(res.data.data.listofagents || null);
      setError(false);
    } catch (error) {
      setError(true);
    }
  }

  async function fetchTimeRangeDurationData() {
    try {
      const res = await axios.get(
        "https://damp-garden-93707.herokuapp.com/getdurationrange"
      );
      setTimeRangeDuration(res.data.data || null);
      setError(false);
    } catch (error) {
      setError(true);
    }
  }

  async function fetchCallData(body) {
    try {
      setIsLoading(true);
      const res = await axios.post(
        "https://damp-garden-93707.herokuapp.com/getfilteredcalls",
        body
      );
      setIsLoading(false);
      setFilteredCallData(res.data.data);
    } catch (error) {
      setFilteredCallData(null);
      setIsLoading(false);
      setError(true);
    }
  }

  useEffect(() => {
    fetchAgentData();
    fetchTimeRangeDurationData();
  }, []);

  const onInputChange = (e, setFunction) => {
    setFunction(e.target.value);
  };

  const handleAgentChange = (e, newValue) => {
    setSelectedAgents(newValue);
  };

  const handleCallData = () => {
    const body = {
      info: {
        filter_agent_list: selectedAgents,
        filter_time_range: [
          Number(minInputTimeRange),
          Number(maxInputTimeRange)
        ]
      }
    };
    fetchCallData(body);
  };

  return (
    <div className={classes.filterContainer}>
      <Typography variant="h5">Filter Calls!</Typography>
      <Grid container spacing={1} className={classes.filterBody}>
        <Grid item xs={4}>
          {agents && (
            <Autocomplete
              id={"select-agents"}
              options={agents}
              getOptionLabel={(option) => option}
              multiple
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select agents"
                  variant="outlined"
                />
              )}
              onChange={handleAgentChange}
            />
          )}
        </Grid>
        <Grid item xs={3}>
          {timeRangeDuration?.minimum !== undefined && (
            <TextField
              id={"minimum-time-range"}
              type={"number"}
              label={"Set minimum time range"}
              value={minInputTimeRange}
              variant={"outlined"}
              onChange={(e) => onInputChange(e, setMinInputTimeRange)}
              helperText={`Minimum call range duration is ${timeRangeDuration?.minimum.toFixed(
                2
              )}`}
              className={classes.inputTextField}
            />
          )}
        </Grid>
        <Grid item xs={3}>
          {timeRangeDuration?.maximum !== undefined && (
            <TextField
              id={"maximum-time-range"}
              type={"number"}
              label={"Set maximum time range"}
              value={maxInputTimeRange}
              variant={"outlined"}
              onChange={(e) => onInputChange(e, setMaxInputTimeRange)}
              helperText={`Maximum call range duration is ${timeRangeDuration?.maximum.toFixed(
                2
              )}`}
              className={classes.inputTextField}
            />
          )}
        </Grid>
        <Grid item xs={2}>
          {agents && timeRangeDuration && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleCallData}
              className={classes.callDataButton}
            >
              Get Call Data
            </Button>
          )}
        </Grid>
        <Grid item xs={12}>
          {filteredCallData && (
            <CustomTable
              loading={isLoading}
              error={error}
              data={filteredCallData}
              headCells={filterTableHeadEnum}
              valueKey={"call_id"}
              selectable={false}
            />
          )}
        </Grid>
        {error && (
          <Grid item xs={12}>
            <Typography style={{ color: "red" }}>
              {"Something went wrong. Please try again later."}
            </Typography>
          </Grid>
        )}
      </Grid>
    </div>
  );
};

export default FilterData;
