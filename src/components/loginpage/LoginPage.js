import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Box, IconButton, Typography, TextField, Button, Divider } from "@mui/material";
import { Google, GitHub, Facebook, Close } from "@mui/icons-material";
import Logo from './skew-logo-horizontal.png';

// SIGN-UP FORM COMPONENT (inside Modal)
const LoginPage = ({ onClose }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { user, loginUser, requiresPasswordReset, resetToken } = useContext(AuthContext);
    const navigate = useNavigate();
  
    const handleLogin = async (e) => {
      e.preventDefault();

      if (!email || !password) {
          alert("Please enter email and password.");
          return;
      }
      try {
        await loginUser(email, password);
      } catch (err) {
        alert(err.message);
      }
    };

    useEffect(() => {
      if (user) {
        if (requiresPasswordReset && resetToken) {
          navigate(`/reset-password?token=${resetToken}`);
        } 
      }
    }, [user, requiresPasswordReset, resetToken, navigate, onClose]);

    const handleClose = ()=> {
        onClose();
    };
  
    return (
      <Box
        sx={{
          width: "90%",
          maxWidth: 450,
          bgcolor: "background.paper",
          alignItems: 'center',
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
          textAlign: "center",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <IconButton
          onClick={handleClose}
          sx={{ position: "absolute", top: 10, right: 10 }}
        >
          <Close />
        </IconButton>
  
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", borderRadius: 1, p: 1 }}>
            <img src={Logo} alt="Logo" style={{ height: 40, objectFit: "contain" }} />
        </Box>
        <Typography variant="body2" color="textSecondary" mb={1} mt={1}>
          Log in with
        </Typography>

        <Box display="flex" justifyContent="center" gap={2}>
          <IconButton color="inherit">
            <Google fontSize="large" />
          </IconButton>
          <IconButton color="inherit">
            <GitHub fontSize="large" />
          </IconButton>
          <IconButton color="inherit">
            <Facebook fontSize="large" />
          </IconButton>
        </Box>
  
        <Divider sx={{ my: 3, fontSize: 13 }}>OR</Divider>
  
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          autoComplete="off"
          type="email"
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          autoComplete="off"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Typography
          variant="body2"
          color="primary"
          sx={{ display: 'inline', cursor: "pointer" }}
          onClick={() => alert("Forgot Password?")}
        >
          Forgot password?
        </Typography>
  
        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2, py: 1.2, textTransform: 'none' }}
          onClick={handleLogin}
        >
            Log in
        </Button>
      </Box>
    );
  };

  export default LoginPage;