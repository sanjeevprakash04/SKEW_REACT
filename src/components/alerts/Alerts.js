import { Box, Card, CardContent, Typography } from "@mui/material";

function AlertsPage({alerts}) {
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
              <Box sx={{display:'flex', justifyContent:'space-between'}}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Alert : {alert.title}
                </Typography>
                <Typography
                  variant="caption"
                  display="block"
                  mt={1}
                  sx={{ opacity: 0.8 }}
                >
                  {alert.timestamp}
                </Typography>
              </Box>
              <Typography variant="body2">
                Condition : {alert.message}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}

export default AlertsPage;
