import React, { useState, useEffect } from "react";
import { Chip, Typography, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  chipListHeader: {
    marginTop: "10px"
  },
  chipListBody: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    listStyle: "none",
    padding: "4px",
    margin: 0
  },
  chip: {
    margin: "4px"
  },
  noLabelText: {
    padding: "8px"
  }
});

const CustomChipList = ({ list, onChange, headerText }) => {
  const classes = useStyles();
  const [chipListData, setChipListData] = useState(list);

  useEffect(() => {
    setChipListData(list);
  }, [list]);

  const handleDelete = (chipToDelete) => () => {
    setChipListData((chips) =>
      chips.filter((chip) => chip.key !== chipToDelete.key)
    );
  };

  useEffect(() => {
    if (chipListData) {
      onChange(chipListData);
    }
  }, [chipListData]);

  return (
    <div className={classes.chipListHeader}>
      <Typography variant={"h6"}>{headerText}</Typography>
      <Paper component="ul" className={classes.chipListBody}>
        {chipListData?.length == 0 && (
          <Typography className={classes.noLabelText}>
            {"No labels selected"}
          </Typography>
        )}
        {chipListData?.map((data, index) => {
          return (
            <li key={data.key}>
              <Chip
                label={data.text}
                onDelete={handleDelete(data)}
                className={classes.chip}
              />
            </li>
          );
        })}
      </Paper>
    </div>
  );
};

export default CustomChipList;
