import * as React from "react";
import api, { setAuthToken } from "../helper/api";

import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "./Loader";

const columns = [
  { id: "name", label: "Center Name", minWidth: 170 },
  { id: "city", label: "City", minWidth: 100 },
  {
    id: "covaxin",
    label: "Covaxin",
    minWidth: 170,
    align: "right",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "covishield",
    label: "Covishield",
    minWidth: 170,
    align: "right",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "pfizer",
    label: "Pfizer",
    minWidth: 170,
    align: "right",
    format: (value) => value.toFixed(2),
  },
];

function createData(id, name, city, covaxin, covishield, pfizer) {
  return { id, name, city, covaxin, covishield, pfizer };
}

export default function StickyHeadTable() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [rows, setRows] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  React.useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        setAuthToken(token);
      }
      const res = await api.get("/centers/all");
      const newData = res.data;
      const data = newData.map((item, i) => {
        return createData(
          item.id,
          item.centerName,
          item.city,
          item.covaxin,
          item.covishield,
          item.pfizer
        );
      });
      setRows(data);
      setIsLoading(false)
    };

    fetchData();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <>
      <div className="mt-6">
        <ToastContainer />
        <p className="ml-2 font-bold text-xl text-blue-800 mb-4">
          Dosage Details
        </p>
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <TableContainer sx={{ maxHeight: 610 }} className="dark-table">
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow className="">
                  {columns.map((column) => (
                    <TableCell
                      className="dark-table-header"
                      key={column.id}
                      align="left"
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading && <Loader />}
                {rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={row.code}
                      >
                        {columns.map((column) => {
                          const value = row[column.id];
                          return (
                            <TableCell key={column.id} align="left">
                              {column.id === "remove" ? (
                                <button
                                  onClick={() => handleRemove(row.id)}
                                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                >
                                  Remove
                                </button>
                              ) : column.format && typeof value === "number" ? (
                                column.format(value)
                              ) : (
                                value
                              )}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </div>
    </>
  );
}
