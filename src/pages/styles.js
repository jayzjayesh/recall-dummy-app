import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
  filterContainer: {
    marginTop: "20px"
  },
  filterBody: {
    padding: "24px"
  },
  callDataButton: {
    marginTop: "8px"
  },
  inputTextField: {
    "& .MuiFormHelperText-contained": {
      marginLeft: 0
    }
  },
  labelContainer: {
    marginTop: "20px"
  },
  labelBody: {
    padding: "24px"
  },
  addLabelField: {
    width: "100%"
  },
  removeLabelField: {
    "& .MuiFormControl-root": {
      "& .MuiInputBase-root": {
        "& .MuiChip-root": {
          display: "none"
        }
      }
    }
  }
});

export default useStyles;
