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

const columns = [
  { id: "name", label: "Center Name", minWidth: 170 },
  { id: "city", label: "City", minWidth: 100 },
  {
    id: "workingHours",
    label: "Working Hours",
    minWidth: 170,
    align: "right",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "slotsLeft",
    label: "Slots Left",
    minWidth: 170,
    align: "right",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "remove",
    label: "Remove",
    minWidth: 170,
    align: "right",
    format: (value) => value.toFixed(2),
  },
];

function createData(id, name, city, workingHours, slotsLeft) {
  return { id, name, city, workingHours, slotsLeft };
}

export default function StickyHeadTable() {
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
          item.workingHours,
          item.slotsLeft
        );
      });
      setRows(data);
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

  const handleRemove = (centerId) => {
    const removeCenter = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          setAuthToken(token);
        }
        const res = await api.delete(`/centers/all?centerId=${centerId}`);
        if (res.status === 200) {
          toast.success("Record deleted successfully!");

          // Remove the deleted record from the state
          setRows((prevRows) => prevRows.filter((row) => row.id !== centerId));
        }
      } catch (error) {
        toast.error("Something went wrong...!");
      }
    };
    removeCenter();
  };

  return (
    <>
      <div className="mt-6">
        <ToastContainer />
        <p className="ml-2 font-bold text-xl text-blue-800 mb-4">
          Remove Centers
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
