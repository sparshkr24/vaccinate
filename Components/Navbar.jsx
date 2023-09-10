import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Hidden from "@mui/material/Hidden";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import VaccinesIcon from "@mui/icons-material/Vaccines";
import Typography from "@mui/material/Typography";
import { Grid } from "@mui/material";
import { useRouter } from "next/router";

export default function ButtonAppBar({ activeOption, setActiveOption }) {
  const router = useRouter()
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (option) => {
    setActiveOption(option);
    handleClose();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    router.push("/login/admin");
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Hidden mdUp>
            <Grid container justifyContent="space-between" alignItems='center'>
              <Grid item>
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  sx={{ mr: 2 }}
                  onClick={handleClick}
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  id="hamburger-menu"
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem
                    onClick={() => handleMenuItemClick("Add Center")}
                    selected={activeOption === "Add Center"}
                  >
                    Add Center
                  </MenuItem>
                  <MenuItem
                    onClick={() => handleMenuItemClick("Remove Center")}
                    selected={activeOption === "Remove Center"}
                  >
                    Remove Center
                  </MenuItem>
                  <MenuItem
                    onClick={() => handleMenuItemClick("Dosage Details")}
                    selected={activeOption === "Dosage Details"}
                  >
                    Dosage Details
                  </MenuItem>
                </Menu>
              </Grid>
              <Grid item> <button onClick={handleLogout} className="hover:bg-white hover:text-blue-800 py-1.5 px-3 rounded-xl hover:scale-105 duration-200"> Logout</button></Grid>
            </Grid>
          </Hidden>
          <Hidden mdDown>
            <Grid container justifyContent="space-between" alignItems="center">
              <Grid item>
                <Grid
                  container
                  gap={6}
                  justifyContent="start"
                  alignItems="center"
                >
                  <Grid item>
                    <VaccinesIcon className="mr-1" />
                    <span className="text-xl mr-8 font-bold">
                      Covid vaccine
                    </span>
                  </Grid>
                  <Grid item>
                    <div className=" py-1.5 px-3 rounded-xl">
                      <button
                        className={`${
                          activeOption === "Add Center"
                            ? "bg-white text-blue-800"
                            : ""
                        } py-1.5 px-3 rounded-xl`}
                        onClick={() => setActiveOption("Add Center")}
                      >
                        Add Center
                      </button>
                    </div>
                  </Grid>
                  <Grid item>
                    <div className=" py-1.5 px-3 rounded-xl">
                      <button
                        className={`${
                          activeOption === "Remove Center"
                            ? "bg-white text-blue-800"
                            : ""
                        } py-1.5 px-3 rounded-xl`}
                        onClick={() => setActiveOption("Remove Center")}
                      >
                        Remove Center
                      </button>
                    </div>
                  </Grid>
                  <Grid item>
                    <div className=" py-1.5 px-3 rounded-xl">
                      <button
                        className={`${
                          activeOption === "Dosage Details"
                            ? "bg-white text-blue-800"
                            : ""
                        } py-1.5 px-3 rounded-xl`}
                        onClick={() => setActiveOption("Dosage Details")}
                      >
                        Dosage Details
                      </button>
                    </div>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <button onClick={handleLogout} className="hover:text-blue-600 hover:bg-white py-1.5 px-3 rounded-xl hover:scale-105 duration-200">
                  Logout
                </button>
              </Grid>
            </Grid>
          </Hidden>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
