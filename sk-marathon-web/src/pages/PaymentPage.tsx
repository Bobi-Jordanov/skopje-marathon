import { useState } from "react";
import {
  Paper,
  Typography,
  Button,
  Stack,
  Chip,
  CircularProgress,
  Divider,
} from "@mui/material";

import axios from "axios";

import api from "../api/axiosInstance";

import { parseApiError } from "../api/errorHelpers";
import ApiErrorAlert from "../components/ApiErrorAlert";

import type { ParticipantResponseDto } from "../types/participant";

interface PaymentPageProps {
  participantId: number;
  registrationNumber: string;
}

function PaymentPage({ participantId, registrationNumber }: PaymentPageProps) {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [result, setResult] = useState<ParticipantResponseDto | null>(null);
  const [paymentFailed, setPaymentFailed] = useState(false);

  const handlePay = async () => {
    setLoading(true);
    setErrorMessage(null);
    setPaymentFailed(false);

    try{
      const response = await api.post<ParticipantResponseDto>(
        `/participants/${participantId}/pay`
      );
      setResult(response.data);

    } catch(err){
      // The backend returns 402 with a ParticipantResponseDto body when the
      // simulated payment fails - that's a legitimate outcome, not a real error.
      if(axios.isAxiosError(err) && err.response?.status === 402){
        setResult(err.response.data as ParticipantResponseDto);
        setPaymentFailed(true);

      } else{
        const parsed = parseApiError(err);
        setErrorMessage(parsed.message);
      }

    } finally {
      setLoading(false);
    }
  }

  const paid = result?.paymentStatus === true;

  return (
    <Paper elevation={3} sx={{ padding: 4 }}>
      <Typography variant="h5" sx={{ marginBottom: 1, color: "primary.main" }}>
        Registration Successful
      </Typography>
      <Typography variant="body1" sx={{ marginBottom: 2 }}>
        Your registration number is:
      </Typography>
      <Chip
        label={registrationNumber}
        color="primary"
        sx={{ fontSize: "1.1rem", padding: 2, marginBottom: 3 }}
      />

      <Divider sx={{ marginBottom: 3 }} />

      <ApiErrorAlert message={errorMessage} />

      {!result && (
        <Stack spacing={2}>
          <Typography variant="body2" color="text.secondary">
            Complete your race fee payment to receive your start number.
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={handlePay}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Pay Now"}
          </Button>
        </Stack>
      )}

      {result && paid && (
        <Stack spacing={2}>
          <Typography variant="h6" sx={{ color: "success.main" }}>
            Payment successful!
          </Typography>
          <Typography variant="body1">Your start number is:</Typography>
          <Chip
            label={result.startNumber ?? ""}
            color="success"
            sx={{ fontSize: "1.1rem", padding: 2 }}
          />
        </Stack>
      )}

      {result && paymentFailed && (
        <Stack spacing={2}>
          <Typography variant="h6" sx={{ color: "error.main" }}>
            Payment failed
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {result.message || "Please try again."}
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            onClick={handlePay}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Retry Payment"}
          </Button>
        </Stack>
      )}
    </Paper>
  );
}

export default PaymentPage
