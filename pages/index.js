import * as React from "react";
import api, { setAuthToken } from "../helper/api";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import CameraIcon from "@mui/icons-material/PhotoCamera";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import VaccinesIcon from "@mui/icons-material/Vaccines";
import { Chip, TextField } from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers";
import Loader from "@/Components/Loader";

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Sparsh
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function Album() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [user, setUser] = useState({});
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [timeSlot, setTimeSlot] = useState(null);

  const handleTimeChange = (newTime) => {
    const formattedTime = newTime ? newTime.$H + ":" + newTime.$m : null;
    setTimeSlot(formattedTime);
  };

  // useEffect(()=>{
  //   console.log('time: ', timeSlot);
  // }, [timeSlot])

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = JSON.parse(localStorage.getItem("userData"));

    if (!token) {
      router.push("/login");
    } else {
      setUser(userData);
      setIsLoading(false);
    }
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        setAuthToken(token);
      }
      const res = await api.get(`/centers/all?page=${page}`);
      const newData = res.data;
      setData((prevData) => [...prevData, ...newData]);
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      fetchData();
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });

  // useEffect(() => {
  //   console.log("centres: ", data);
  // }, [data]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    router.push("/login");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { city } = event.currentTarget.elements;

    const userData = {
      city: city.value,
    };

    if (!userData.city) {
      toast.error("Please enter your city");
      return;
    }
    console.log(userData);

    try {
      const token = localStorage.getItem("token");
      if (token) {
        setAuthToken(token);
      }
      const res = await api.get(`/centers/bycity?city=${userData.city}`);
      const newData = res.data;
      console.log("value: ", newData);
      setData(newData);
    } catch (error) {
      console.error(error);
      toast.error(`No Centers found in ${city}`);
    }
  };

  const getDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1; // January is 0, so we add 1
    const day = today.getDate();

    // Format the date as desired
    const formattedDate = `${year}-${month.toString().padStart(2, "0")}-${day
      .toString()
      .padStart(2, "0")}`;

    return formattedDate;
  };

  const handleBookSlot = (vaccinationCenterId) => {
    if (!timeSlot) {
      toast.error("Please select a timeSlot!");
      return;
    }

    const bookSlot = async () => {
      const AppointmentData = {
        userId: user.id,
        vaccinationCenterId,
        timeSlot,
      };
      // console.log(data);
      const token = localStorage.getItem("token");
      if (token) {
        setAuthToken(token);
      }
      const res = await api.post("/bookslot", AppointmentData);
      const result = res.data;
      console.log(result);
      if (res.status != 200) {
        toast.error("Cannot book this slot!");
      } else {
        toast.success("Congratulations!...Slot Booked!");
        const updatedData = data.map((item) => {
          if (item.id === vaccinationCenterId) {
            return { ...item, slotsLeft: item.slotsLeft - 1 };
          }
          return item;
        });

        setData(updatedData);
        setTimeSlot(null);
      }
    };
    bookSlot();
  };
  // console.log(user);
  return (
    <ThemeProvider theme={defaultTheme}>
      <ToastContainer />
      {isLoading && <Loader />}
      <CssBaseline />
      {!isLoading && (
        <>
          {" "}
          <AppBar position="relative">
            <Toolbar>
              <Grid
                container
                justifyContent="space-between"
                alignItems="center"
              >
                <Grid>
                  <VaccinesIcon sx={{ mr: 2 }} />
                  <Typography variant="h6" color="inherit" noWrap>
                    Covid vaccine
                  </Typography>
                </Grid>
                <Grid>
                  Welcome!{" "}
                  <span className="font-bold text-xl"> {user?.username} </span>
                </Grid>
                <Grid>
                  {" "}
                  <button
                    onClick={handleLogout}
                    className="hover:text-blue-600 hover:bg-white py-1.5 px-4 rounded-xl hover:scale-110 duration-300"
                  >
                    {" "}
                    Logout
                  </button>
                </Grid>
              </Grid>
            </Toolbar>
          </AppBar>
          <main className="w-full">
            {/* Hero unit */}
            <Box
              sx={{
                bgcolor: "background.paper",
                pt: 8,
                pb: 6,
              }}
            >
              <Container maxWidth="sm">
                <Typography
                  component="h1"
                  variant="h2"
                  align="center"
                  color="text.primary"
                  gutterBottom
                >
                  Enter your city
                </Typography>
                <Typography
                  variant="h5"
                  align="center"
                  color="text.secondary"
                  paragraph
                >
                  Book slots for covid vaccination with simple steps.
                </Typography>
                <Box
                  component="form"
                  noValidate
                  onSubmit={handleSubmit}
                  sx={{ mt: 1 }}
                >
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="city"
                    label="City"
                    name="city"
                    autoComplete="city"
                    autoFocus
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="outlined"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Search
                  </Button>
                </Box>
              </Container>
            </Box>
            <Container sx={{ py: 8 }} maxWidth="lg">
              {/* End hero unit */}
              <Grid container spacing={4}>
                {data.map((item, index) => (
                  <Grid item key={index} xs={12} sm={6} md={4}>
                    <Card
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <CardMedia
                        component="div"
                        sx={{
                          // 16:9
                          pt: "56.25%",
                        }}
                        image="https://source.unsplash.com/random?wallpapers"
                      />
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography
                          gutterBottom
                          variant="h5"
                          component="h2"
                          color="primary"
                          fontWeight="bold"
                        >
                          {item.centerName}
                        </Typography>
                        <Typography>
                          Location:{" "}
                          <span className="font-bold text-lg">{item.city}</span>{" "}
                        </Typography>
                        <Typography>
                          Working hours:{" "}
                          <span className="font-bold text-lg">
                            {item.workingHours}
                          </span>{" "}
                        </Typography>
                        <Typography>
                          Slots Available on {getDate()}:{" "}
                          <span className="font-bold text-lg">
                            {item.slotsLeft}
                          </span>
                        </Typography>
                        <div className="pt-3">
                          <Stack direction="row" spacing={1}>
                            <Chip
                              label={`Covaxin: ${item.covaxin}`}
                              color="primary"
                            />
                            <Chip
                              label={`Covishield: ${item.covishield}`}
                              color="primary"
                            />
                            <Chip
                              label={`Pfizer: ${item.pfizer}`}
                              color="primary"
                            />
                          </Stack>
                        </div>
                      </CardContent>
                      <CardActions>
                        <Grid
                          container
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Grid item>
                            <button
                              onClick={() => handleBookSlot(item.id)}
                              className="py-1.5 px-4 bg-blue-600 text-white border hover:text-blue-600 hover:bg-white rounded-xl duration-300 hover:scale-105"
                            >
                              Book
                            </button>
                          </Grid>
                          <Grid item>
                            <TimePicker
                              label="Pick slot"
                              sx={{ width: 180 }}
                              value={timeSlot}
                              onChange={handleTimeChange}
                            />
                          </Grid>
                        </Grid>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Container>
          </main>
          {/* Footer */}
          <Box sx={{ bgcolor: "background.paper", p: 6 }} component="footer">
            <Typography variant="h6" align="center" gutterBottom>
              Footer
            </Typography>
            <Typography
              variant="subtitle1"
              align="center"
              color="text.secondary"
              component="p"
            >
              Looking forward to hearing from you soon
            </Typography>
            <Copyright />
          </Box>{" "}
        </>
      )}
      {/* End footer */}
    </ThemeProvider>
  );
}
