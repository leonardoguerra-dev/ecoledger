import * as React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

export default function Home() {
  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          my: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          EcoLedger Welcome Screen
        </Typography>
        <Typography variant="body1">
          Material UI v5 is now successfully integrated with Next.js App Router.
        </Typography>
        {/* Testing MUI component functionality and theme primary color */}
        <Button variant="contained" color="primary">
          Test MUI Button
        </Button>
      </Box>
    </Container>
  );
}
