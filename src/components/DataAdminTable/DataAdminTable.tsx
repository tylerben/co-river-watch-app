import React, { useState } from "react";
import axios from "axios";
import { Paper, makeStyles } from "@material-ui/core";
import CopyIcon from "@material-ui/icons/FileCopy";
import MaterialTable, {
  Action,
  Column,
  Components,
  MTableBodyRow,
  Options,
  Query,
  QueryResult,
} from "material-table";
import { useAuth0 } from "../../hooks/useAuth0";
import useFormSubmitStatus from "../../hooks/useFormSubmitStatus";
import FormSnackbar from "../FormSnackbar";
import useVisibility from "../../hooks/useVisibility";
import { copyToClipboard } from "../../utils";
import { Dispatcher } from "hooks/useFetchData";

export type RowData = {
  [key: string]: any;
};

export type DataAdminTableProps = {
  title: string;
  data: RowData[] | ((query: Query<RowData>) => Promise<QueryResult<RowData>>);
  columns: Column<RowData>[];
  loading: boolean;
  updateHandler: Dispatcher<RowData>;
  endpoint: string;
  ndxField: string;
  options?: Options<RowData>;
  components?: Components;
  actions?: (Action<RowData> | ((rowData: RowData) => Action<RowData>))[];
  handleRefresh: () => void;
};

const useStyles = makeStyles((theme) => ({
  table: {
    "& th": {
      paddingLeft: theme.spacing(2),
    },
    "& td": {
      paddingLeft: `${theme.spacing(2)}px!important`,
    },
  },
}));

/**
 * This component is used has a shortcut for creating a data management
 * table using the Material Table library.
 * For more information on the Material Table library, please visit
 * https://material-table.com/#/
 */
const DataAdminTable: React.FC<DataAdminTableProps> = ({
  title,
  data,
  columns,
  loading,
  updateHandler,
  endpoint,
  ndxField,
  options = {},
  components = {},
  actions = [],
  handleRefresh = () => {},
}) => {
  const classes = useStyles();
  const [copySnackbarOpen, handleCopySnackbarOpen] = useVisibility(false);
  const {
    setWaitingState,
    snackbarOpen,
    snackbarError,
    handleSnackbarClose,
  } = useFormSubmitStatus();
  const { getTokenSilently } = useAuth0();
  const [selectedRow, setSelectedRow] = useState<RowData | null>(null);

  /**
   * Utility function used to set the exported CSV files name
   * using the table title
   * Strips out spaces and replaces with "_" and makes
   * file name lower case
   * @param {string} title
   */
  const setFileName = (title = "") => {
    return title.toLowerCase().replace(/ /gi, "_");
  };

  /**
   * Event handler for when the user adds and saves a new record
   * @param {object} newData
   */
  const handleAdd = (newData: RowData) => {
    return (async () => {
      setWaitingState("in progress", false);
      try {
        const token = await getTokenSilently();
        const headers = { Authorization: `Bearer ${token}` };
        const addedRec = await axios.post(
          `${process.env.REACT_APP_ENDPOINT}/api/${endpoint}`,
          newData,
          { headers }
        );
        updateHandler((prevState: RowData[]) => {
          let data = [...prevState];
          data.push(addedRec.data);
          return data;
        });
        handleRefresh();
        setWaitingState("complete", "no error");
      } catch (err) {
        console.error(err);
        setWaitingState("complete", "error");
      }
    })();
  };

  /**
   * Event handler for when the user edits existing data
   * @param {object} newData
   * @param {object} oldData
   */
  const handleUpdate = (newData: RowData, oldData?: RowData): Promise<void> => {
    return (async () => {
      setWaitingState("in progress", false);
      try {
        if (oldData) {
          const token = await getTokenSilently();
          const headers = { Authorization: `Bearer ${token}` };
          await axios.put(
            `${process.env.REACT_APP_ENDPOINT}/api/${endpoint}/${newData[ndxField]}`,
            newData,
            { headers }
          );
          updateHandler((prevState: RowData[]) => {
            const data = [...prevState];
            data[data.indexOf(oldData)] = newData;
            return data;
          });
          handleRefresh();
          setWaitingState("complete", "no error");
        } else {
          setWaitingState("complete", "error");
        }
      } catch (err) {
        console.error(err);
        setWaitingState("complete", "error");
      }
    })();
  };

  return (
    <div className={classes.table}>
      <MaterialTable
        data={data}
        columns={columns}
        title={title}
        isLoading={loading}
        onRowClick={(evt, selectedRow) => {
          setSelectedRow(selectedRow as React.SetStateAction<null>);
        }}
        editable={{
          onRowAdd: handleAdd,
          onRowUpdate: handleUpdate,
        }}
        components={{
          Row: (props) => <MTableBodyRow {...props} />,
          Container: (props) => <Paper variant="outlined" {...props}></Paper>,
          ...components,
        }}
        options={{
          emptyRowsWhenPaging: false,
          columnsButton: true,
          exportButton: true,
          exportAllData: true,
          exportFileName: setFileName(title),
          addRowPosition: "first",
          actionsCellStyle: { justifyContent: "center" },
          actionsColumnIndex: 0,
          pageSize: options.pageSize || 30,
          pageSizeOptions: options.pageSizeOptions || [15, 30, 45],
          maxBodyHeight: data.length < 20 ? 525 : 625,
          padding: "dense",
          ...options,
          rowStyle: (rowData: RowData) => ({
            backgroundColor:
              selectedRow && selectedRow?.tableData?.id === rowData.tableData.id
                ? "#EEE"
                : "#FFF",
          }),
        }}
        actions={[
          {
            icon: CopyIcon,
            tooltip: "Copy Data",
            isFreeAction: true,
            onClick: (event) => {
              copyToClipboard(data, columns, () =>
                handleCopySnackbarOpen(true)
              );
            },
          },
          ...actions,
        ]}
      />
      <FormSnackbar
        open={snackbarOpen}
        error={snackbarError}
        handleClose={handleSnackbarClose}
        successMessage="Success"
        errorMessage="Error"
      />
      <FormSnackbar
        open={copySnackbarOpen}
        error={false}
        handleClose={() => handleCopySnackbarOpen(false)}
        successMessage="Copied to Clipboard"
      />
    </div>
  );
};

export default DataAdminTable;
