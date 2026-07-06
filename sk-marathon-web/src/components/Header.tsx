import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

function Header() {
    return (

        <AppBar position="static"
            sx={{
                background: "linear-gradient(90deg, #161998 0%, #650F6D 50%, #CD2B86 100%)"
            }}>
            <Toolbar sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between"
            }}>
                <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>

                    <Typography
                        variant="h4"
                        component="div"
                        sx={{
                            px: 2,
                            py: 4,
                            flexGrow: 1,
                            cursor: "pointer",

                        }}>
                        Skopje Marathon
                    </Typography>
                </Link>


                <Box sx={{
                    px: 4,
                    py: 2,
                    minHeight: 60,
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 1
                }}>
                    <Button component={Link} to="/status" color="inherit">
                        Check Status
                    </Button>
                    <Button component={Link} to="/run-with-us" color="inherit">
                        Run With Us
                    </Button>

                    <Button
                        component={Link}
                        to="/register"
                        variant="contained"
                        sx={{
                            ml: "auto",
                            display: "block",
                            borderRadius: "12px",
                            backgroundColor: "white",
                            color: "secondary.main",
                            "&:hover": {
                                backgroundColor: "#f5f5f5",
                            }
                        }}>
                        Register
                    </Button>
                </Box>
            </Toolbar>

        </AppBar>

    )
}

export default Header;


