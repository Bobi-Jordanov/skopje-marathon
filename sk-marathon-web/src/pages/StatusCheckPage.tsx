import { useState } from "react";
import type { ChangeEvent, SyntheticEvent, MouseEvent } from "react";

import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Chip,
  CircularProgress,
  Divider,
} from "@mui/material";

import api from "../api/axiosInstance";
import { parseApiError } from "../api/errorHelpers";
import ApiErrorAlert from "../components/ApiErrorAlert";
import PaymentPage from "./PaymentPage";

import type { ParticipantStatusDto } from "../types/participant";

type SearchMode = "email" | "registrationNumber";

function StatusCheckPage() {
  const [searchMode, setSearchMode] = useState<SearchMode>("email");
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [result, setResult] = useState<ParticipantStatusDto | null>(null);

  const handleModeChange = (_: MouseEvent<HTMLElement>, newMode: SearchMode | null) => {
    if(newMode){
      setSearchMode(newMode);
      setSearchValue("");
      setResult(null);
      setErrorMessage(null);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  }

  const handleSearch = async (e: SyntheticEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setResult(null);
    setLoading(true);

    try{
      const params = 
        searchMode === "email" ? {email: searchValue} : {registrationNumber: searchValue};
    
      // GET: api/participants/status?email=orregistrationNumber=
      const response = await api.get<ParticipantStatusDto>("/participants/status", {
        params,
      });

      setResult(response.data);

    } catch(err){
      const parsed = parseApiError(err);
      setErrorMessage(parsed.message);

    } finally {
      setLoading(false);
    }
  }

  return (
    <Box sx={{ padding: 4, maxWidth: 500, margin: "0 auto" }}>
      <Paper elevation={3} sx={{ padding: 4 }}>
        <Typography variant="h5" sx={{ marginBottom: 3, color: "primary.main" }}>
          Check Registration Status
        </Typography>

        <ToggleButtonGroup
          value={searchMode}
          exclusive
          onChange={handleModeChange}
          sx={{ marginBottom: 3 }}
          fullWidth
        >
          <ToggleButton value="email">By Email</ToggleButton>
          <ToggleButton value="registrationNumber">By Registration Number</ToggleButton>
        </ToggleButtonGroup>

        <ApiErrorAlert message={errorMessage} />

        <Box component="form" onSubmit={handleSearch}>
          <Stack spacing={2}>
            <TextField
              label={searchMode === "email" ? "Email" : "Registration Number"}
              value={searchValue}
              onChange={handleChange}
              fullWidth
              required
            />
            <Button type="submit" variant="contained" color="primary" size="large" disabled={loading}>
              {loading ? <CircularProgress size={24} color="inherit" /> : "Check Status"}
            </Button>
          </Stack>
        </Box>

        {result && result.status === "PAID" && (
          <>
            <Divider sx={{ marginY: 3 }} />
            <Stack spacing={2}>
              <Typography variant="h6" sx={{ color: "success.main" }}>
                {result.message}
              </Typography>
              <Typography variant="body1">Your start number is:</Typography>
              <Chip label={result.identifier} color="success" sx={{ fontSize: "1.1rem", padding: 2 }} />
            </Stack>
          </>
        )}
      </Paper>

      {result && result.status === "UNPAID" && (
        <Box sx={{ marginTop: 3 }}>
          <PaymentPage participantId={result.id} registrationNumber={result.identifier} />
        </Box>
      )}
    </Box>
  );
}

export default StatusCheckPage
