import { Box, Card, CardContent, Typography } from "@mui/material";

function AlertsPage() {
  // Sample alerts (static data for design only)
  const alerts = [
    {
      title: "System Error",
      message: "Temperature exceeded safe limits.",
      timestamp: "2025-08-19T09:30:00Z",
    },
    {
      title: "Warning",
      message: "Battery running low, please check.",
      timestamp: "2025-08-19T08:45:00Z",
    },
    {
      title: "Update",
      message: "System restarted successfully.",
      timestamp: "2025-08-19T08:00:00Z",
    },
  ];

  return (
    <Box
      mt={0.5}
      height="calc(100vh - 126px)"
      display="flex"
      justifyContent="center"
      alignItems="flex-start"
    >
      <Box
        height="calc(100vh - 126px)"
        width="70%"
        borderRadius={2}
        backgroundColor="#f2f2f2ff"
        py={1}
        px={2}
        overflow="auto"
        sx={{
            boxShadow: "inset 0 4px 8px rgba(0, 0, 0, 0.1)"
        }}
      >
        {alerts.map((alert, index) => (
          <Card
            key={index}
            sx={{
              mb: 1,
              backgroundColor: "#e2f3fdff", // dark green background
              borderRadius: 2,
              boxShadow: 3,
            }}
          >
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold">
                {alert.title}
              </Typography>
              <Typography variant="body2">
                {alert.message}
              </Typography>
              <Typography
                variant="caption"
                display="block"
                mt={1}
                sx={{ opacity: 0.8 }}
              >
                {new Date(alert.timestamp).toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}

export default AlertsPage;
