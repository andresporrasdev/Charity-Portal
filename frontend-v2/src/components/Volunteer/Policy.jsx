import React from "react";
import { Container, Typography, Paper, Box } from "@mui/material";

const Policy = () => {
  const terms = [
    "You must be at least 18 years old to use this website.",
    "You must not use this website in any way that causes, or may cause, damage to the website or impairment of the availability or accessibility of the website.",
    "You must not use this website in any way that is unlawful, illegal, fraudulent, or harmful.",
    "You must not use this website to copy, store, host, transmit, send, use, publish, or distribute any material that consists of (or is linked to) any spyware, computer virus, Trojan horse, worm, keystroke logger, rootkit, or other malicious computer software.",
    "You must not conduct any systematic or automated data collection activities (including without limitation scraping, data mining, data extraction, and data harvesting) on or in relation to this website without the Charity Organization Portal's express written consent.",
    "You must not use this website to transmit or send unsolicited commercial communications.",
    "You must not use this website for any purposes related to marketing without the Charity Organization Portal's express written consent.",
    "You must not use this website to engage in any advertising or marketing.",
    "You must not use this website to promote or sell any products or services.",
    "You must not use this website to engage in any data mining, data harvesting, data extracting, or any other similar activity.",
    "You must not use this website to engage in any illegal or unlawful activity.",
    "You must not use this website to engage in any activity that is harmful to the Charity Organization Portal or any other person.",
  ];

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>Terms and Conditions</Typography>
        <Typography variant="body1" paragraph>
          By using the Charity Organization Portal, you agree to the following terms and conditions:
        </Typography>
        <Box component="ol" sx={{ pl: 2 }}>
          {terms.map((term, i) => (
            <Box component="li" key={i} sx={{ mb: 1 }}>
              <Typography variant="body1">{term}</Typography>
            </Box>
          ))}
        </Box>
      </Paper>
    </Container>
  );
};

export default Policy;
