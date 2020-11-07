import React, { useMemo } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Container } from "@material-ui/core";
import DownloadIcon from "@material-ui/icons/GetApp";
import ReportsLayout from "components/ReportsLayout";
import MaterialTable from "material-table";
import useFetchData from "hooks/useFetchData";

const useStyles = makeStyles(({ breakpoints, mixins, spacing }) => ({
  root: {
    overflowX: `hidden`,
    [breakpoints.up("md")]: {
      display: `flex`,
    },
  },
  content: {
    flexGrow: 1,
    overflow: "hidden",
    marginTop: mixins.toolbar as any,
  },
  toolbar: mixins.toolbar,
  container: {
    marginTop: spacing(6),
  },
}));

export type WaterShedReport = {
  Id: string;
  Basin: string;
  SubBasin: string;
  Designation: string;
  reportLink: string | null;
  dataLink: string | null;
};

const Reports: React.FC = (props) => {
  const classes = useStyles();
  const { data, isLoading } = useFetchData<WaterShedReport[]>("wsr", []);

  const Basins = useMemo(() => {
    let converted: { [key: string]: any } = {};
    if (data.length > 0) {
      const basins = [...new Set(data.map((d) => d.Basin).sort())];
      basins.forEach((d) => {
        converted[d] = d;
      });
    }
    return converted;
  }, [data]);
  const SubBasins = useMemo(() => {
    let converted: { [key: string]: any } = {};
    if (data.length > 0) {
      const subbasins = [...new Set(data.map((d) => d.SubBasin).sort())];
      subbasins.forEach((d) => {
        converted[d] = d;
      });
    }
    return converted;
  }, [data]);
  return (
    <ReportsLayout>
      <div className={classes.root}>
        <div className={classes.content}>
          <div className={classes.toolbar} />
          <Container maxWidth="lg" className={classes.container}>
            <MaterialTable
              data={data}
              columns={[
                { field: "Id", title: "WBID" },
                { field: "Basin", title: "Basin", lookup: Basins },
                { field: "SubBasin", title: "Sub Basin", lookup: SubBasins },
                { field: "Designation", title: "Designation" },
                {
                  field: "ReportLink",
                  title: "Report",
                  filtering: false,
                  render: (rowData) => {
                    if (rowData.reportLink) {
                      return (
                        <Button
                          fullWidth
                          size="small"
                          variant="contained"
                          color="secondary"
                          href={rowData.reportLink}
                          target="_blank"
                          rel="noreferrer"
                          startIcon={<DownloadIcon />}
                          disableElevation
                        >
                          Download
                        </Button>
                      );
                    }
                    return (
                      <Button
                        fullWidth
                        size="small"
                        variant="contained"
                        disabled
                        startIcon={<DownloadIcon />}
                        disableElevation
                      >
                        Not Available
                      </Button>
                    );
                  },
                },
                {
                  field: "DataLink",
                  title: "Data",
                  filtering: false,
                  render: (rowData) => {
                    if (rowData.dataLink) {
                      return (
                        <Button
                          fullWidth
                          size="small"
                          variant="contained"
                          color="secondary"
                          href={rowData.dataLink}
                          target="_blank"
                          rel="noreferrer"
                          startIcon={<DownloadIcon />}
                          disableElevation
                        >
                          Download
                        </Button>
                      );
                    }
                    return (
                      <Button
                        fullWidth
                        size="small"
                        variant="contained"
                        disabled
                        startIcon={<DownloadIcon />}
                        disableElevation
                      >
                        Not Available
                      </Button>
                    );
                  },
                },
              ]}
              title="Watershed Reports"
              isLoading={isLoading}
              options={{
                filtering: true,
                emptyRowsWhenPaging: false,
                columnsButton: true,
                exportButton: true,
                exportAllData: true,
                exportFileName: "watershed_reports",
                pageSize: 30,
                pageSizeOptions: [15, 30, 45],
                maxBodyHeight: 625,
                padding: "dense",
              }}
            />
          </Container>
        </div>
      </div>
    </ReportsLayout>
  );
};

export default Reports;
