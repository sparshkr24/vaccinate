import * as React from "react";
import api from "../../helper/api";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useRouter } from "next/router";

import PersonIcon from '@mui/icons-material/Person';

function SignInSide() {
  const router = useRouter();
  const handleSubmit = async (event) => {
    event.preventDefault();

    const { username, email, password, password2, mobile, city, age } =
      event.currentTarget.elements;

    const userData = {
      username: username.value,
      email: email.value,
      password: password.value,
      password2: password2.value,
      role: "client",
      mobile: mobile.value,
      city: city.value,
      age: parseInt(age.value, 10),
    };
    console.log(userData);

    if (userData.age > 150) {
      toast.error("Age must be less than or equal to 150.");
      return;
    }

    if (userData.mobile.length !== 10) {
      toast.error("Mobile number must be exactly 10 characters long.");
      return;
    }

    if (!userData.password || !userData.email || !userData.username) {
      toast.error("All fields are required");
      return;
    }

    toast.success("Form submitted successfully");

    try {
      const res = await api.post("/register", userData);
      const { message, user } = res.data;
      console.log(message);

      const { newUser, token } = user;
      localStorage.setItem("token", token);
      localStorage.setItem("userData", JSON.stringify(newUser));

      if (token) {
        toast.success("User Registered Succesfully!");
        router.push("/");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error registering user");
    }
  };

  return (
    <ThemeProvider theme={createTheme()}>
      <ToastContainer />
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage:
              "url(https://source.unsplash.com/random?wallpapers)",
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
              <PersonIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign Up
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
            >
              <TextField
                fullWidth
                margin="normal"
                required
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                inputProps={{ minLength: 3 }} // Minimum length of 3 characters
              />
              <TextField
                sx={{ mr: 4 }}
                margin="normal"
                required
                id="age"
                label="Age"
                name="age"
                type="number" // Set input type to "number"
                autoComplete="age"
                autoFocus
                inputProps={{ min: 0 }} // Minimum value of 0
              />
              <TextField
                margin="normal"
                required
                id="mobile"
                label="Mobile No."
                name="mobile"
                autoComplete="tel" // Set input type to "tel"
                autoFocus
                pattern="[0-9]{10}" // 10-digit numeric pattern
                type="number"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                type="email"
              />
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

              <TextField
                sx={{ mr: 4 }}
                margin="normal"
                required
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password" // Set autocomplete to "new-password"
              />
              <TextField
                margin="normal"
                required
                name="password2"
                label="Confirm password"
                type="password"
                id="password2"
              />

              <Button
                type="submit"
                fullWidth
                variant="outlined"
                sx={{ mt: 3, mb: 2 }}
              >
                Register
              </Button>
              <Grid container>
                <Grid item xs></Grid>
                <Grid item>
                  <Link href="/login" variant="body2">
                    {"Already have an account? Login"}
                  </Link>
                </Grid>
              </Grid>
              <Typography
                variant="body2"
                color="text.secondary"
                align="center"
                sx={{ mt: 5 }}
              >
                {`Copyright © `}
                <Link color="inherit" href="https://mui.com/">
                  Sparsh
                </Link>{" "}
                {new Date().getFullYear()}
                {"."}
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default SignInSide;
