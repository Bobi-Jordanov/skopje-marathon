import { Box, Typography, Button, Stack, Paper } from "@mui/material";
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <Box sx={{
      padding: 4,
      maxWidth: 900,
      margin: "0 auto"
    }}>
      <Paper
        elevation={3}
        sx={{
          padding: 5,
          textAlign: "center",
          background: "linear-gradient(135deg, #650F6D10, #CD2B8610)",
        }}>
        <Typography variant="h3"
          sx={{
            fontWeight: "bold", color: "primary.main", marginBottom: 2
          }}>
          Skopje Marathon
        </Typography>
        <Typography variant="h6" sx={{ color: "text.secondary", marginBottom: 4 }}>
          Register for 5km, 10km, half marathon, or full marathon and join us on race day.
        </Typography>

        <Stack direction="row" spacing={2} sx={{ justifyContent: "center" }}>
          <Button component={Link} to="/register" variant="contained" color="primary" size="large">
            Register Now
          </Button>
          <Button component={Link} to="/status" variant="outlined" color="primary" size="large">
            Check My Status
          </Button>
          <Button component={Link} to="/run-with-us" variant="outlined" color="secondary" size="large">
            Run With Us
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}

export default HomePage;