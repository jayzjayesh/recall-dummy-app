import React, { useEffect, useState } from "react";
import axios from "axios";
import { Typography, TextField, Grid, Button } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import useStyles from "./styles";
import CustomChipList from "../components/CustomChipList";
import CustomTable from "../components/CustomTable";
import labelTableHeadEnum from "../enum/labelTableHeadEnum";

const LabelData = () => {
  const classes = useStyles();
  const user_id = "jay101";
  const [inputValue, setInputValue] = useState();
  const [currentLabelList, setCurrentLabelList] = useState();
  const [callData, setCallData] = useState();
  const [addList, setAddList] = useState([]);
  const [removeList, setRemoveList] = useState([]);
  const [callList, setCallList] = useState([]);
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState();
  const [isApplying, setIsApplying] = useState();

  async function fetchLabelData() {
    try {
      const res = await axios.get(
        "https://damp-garden-93707.herokuapp.com/getlistoflabels",
        {
          headers: {
            user_id: user_id
          }
        }
      );
      setCurrentLabelList(res.data?.data?.unique_label_list || null);
      setError(false);
    } catch (error) {
      setError(true);
    }
  }

  async function fetchCallData(body) {
    try {
      setIsLoading(true);
      const res = await axios.get(
        "https://damp-garden-93707.herokuapp.com/getcalllist",
        {
          headers: {
            user_id: user_id
          }
        }
      );
      setIsLoading(false);
      setCallData(res?.data?.data?.call_data);
      setError(false);
    } catch (error) {
      setCallData(null);
      setIsLoading(false);
      setError(true);
    }
  }

  async function applyLabelData(body) {
    try {
      setIsApplying(true);
      const res = await axios.post(
        "https://damp-garden-93707.herokuapp.com/applyLabels",
        body,
        {
          headers: {
            user_id: user_id
          }
        }
      );
      if (res?.data?.status_code === 200 && res?.data?.data === "Applied") {
        setIsApplying(false);
        fetchCallData();
        setRemoveList([]);
        setAddList([]);
        setCallList([]);
        setInputValue("");
        setError(false);
      }
    } catch (error) {
      setIsApplying(false);
      setError(true);
    }
  }

  useEffect(() => {
    fetchLabelData();
    fetchCallData();
  }, []);

  const onInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleRemoveListChange = (e, newValue) => {
    newValue = newValue?.map((item) => {
      const timeStamp = Date.now();
      return {
        text: item,
        key: `${item}_${timeStamp}`
      };
    });
    setRemoveList(newValue);
  };

  const handleAddListChange = (selected) => {
    setAddList(selected);
  };

  const removeListOnChange = (selected) => {
    setRemoveList(selected);
  };

  const addToAddList = (e) => {
    if (inputValue && inputValue?.length > 0) {
      const { key, code, keyCode } = e;
      if (key === "Enter" || code === "Enter" || keyCode === 13) {
        const timeStamp = Date.now();
        setAddList([
          ...addList,
          {
            text: inputValue,
            key: `${inputValue}_${timeStamp}`
          }
        ]);
        setInputValue("");
      }
    }
  };

  const handleTableClick = (selected) => {
    setCallList(selected);
  };

  const handleApply = () => {
    const finalLabelList = [];
    if (addList && addList?.length > 0) {
      addList.forEach((item) => {
        finalLabelList.push({
          name: item?.text,
          op: "add"
        });
      });
    }
    if (removeList && removeList?.length > 0) {
      removeList.forEach((item) => {
        finalLabelList.push({
          name: item?.text,
          op: "remove"
        });
      });
    }

    const body = {
      operation: {
        callList: callList,
        label_ops: finalLabelList
      }
    };
    applyLabelData(body);
  };

  return (
    <div className={classes.labelContainer}>
      <Typography variant="h5">Apply Labels!</Typography>
      <Grid container spacing={4} className={classes.labelBody}>
        <Grid item xs={6}>
          <TextField
            id={"add-labels"}
            label={"Add New Labels"}
            value={inputValue}
            variant={"outlined"}
            onChange={onInputChange}
            onKeyDown={addToAddList}
            className={classes.addLabelField}
            helperText={"Press Enter to add new labels to add to call list!"}
          />
        </Grid>
        <Grid item xs={6}>
          {currentLabelList !== undefined && (
            <Autocomplete
              id={"remove-labels"}
              multiple
              value={removeList.map((item) => item.text)}
              options={currentLabelList}
              getOptionLabel={(option) => option}
              className={classes.removeLabelField}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Remove existing labels"
                  variant="outlined"
                  helperText={
                    "Select existing labels to remove from call list!"
                  }
                />
              )}
              onChange={handleRemoveListChange}
            />
          )}
        </Grid>
        <Grid item xs={6}>
          <CustomChipList
            list={addList}
            onChange={handleAddListChange}
            headerText={"Labels to add"}
          />
        </Grid>
        <Grid item xs={6}>
          <CustomChipList
            list={removeList}
            onChange={removeListOnChange}
            headerText={"Labels to remove"}
          />
        </Grid>
        <Grid item xs={12}>
          {callData && !isApplying && (
            <CustomTable
              loading={isLoading}
              error={error}
              data={callData}
              headCells={labelTableHeadEnum}
              onChange={handleTableClick}
              valueKey={"call_id"}
              selectable={true}
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
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleApply}>
            Apply
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default LabelData;
