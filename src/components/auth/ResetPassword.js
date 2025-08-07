import { useState, useEffect, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { TextField, Button, Box, Typography, Alert, CircularProgress } from "@mui/material";
import { AuthContext } from "../../context/AuthContext";

function ResetPassword() {
    const [searchParams] = useSearchParams();
    const [token, setToken] = useState(""); // ✅ Get reset token from URL
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const { logoutUser } = useContext(AuthContext);
    // const navigate = useNavigate();

    useEffect(() => {
        const urlToken = searchParams.get("token") || new URLSearchParams(window.location.search).get("token");
        if (urlToken) {
            setToken(urlToken);
            localStorage.setItem("resetToken", urlToken);  // ✅ Store in local storage as backup
        } else {
            setToken(localStorage.getItem("resetToken") || "");  // ✅ Retrieve from backup
        }
    }, [searchParams]);

    useEffect(() => {
        console.log("Token from URL:", token);
    }, [token]);

    const handleResetPassword = async () => {
        console.log("Token : ",token)
        if (!token) {
            setError("Invalid or missing reset token.");
            return;
        }
        if (newPassword.length < 8) {
            setError("Password must be at least 8 characters long.");
            return;
        }
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");  // Ensures passwords match
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("token", token);
            formData.append("new_password", newPassword);
            formData.append("confirm_password", confirmPassword);  // Send confirmation password

            const response = await axios.post("http://127.0.0.1:8000/reset-password", formData, {
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
            });

            setMessage(response.data.message);
            setTimeout(() => {
                logoutUser();
                window.location.href = "/home";
            }, 2000); // Redirect to login after success
        } catch (error) {
            setError(error.response?.data?.detail || "Failed to reset password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ p: 4, maxWidth: 400, mx: "auto", textAlign: "center", mt: 10 }}>
            <Typography variant="h5" gutterBottom>
                Reset Your Password
            </Typography>
            {(message || error) && (
                <Alert severity={message ? "success" : "error"}>
                    {message || error}
                </Alert>
            )}

            <TextField
                fullWidth
                label="New Password"
                type="password"
                variant="outlined"
                margin="normal"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
            />
            <TextField
                fullWidth
                label="Confirm Password"
                type="password"
                variant="outlined"
                margin="normal"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                onClick={handleResetPassword}
                disabled={loading}
            >
                {loading ? <CircularProgress size={24} /> : "Reset Password"}
            </Button>
        </Box>
    );
}

export default ResetPassword;
