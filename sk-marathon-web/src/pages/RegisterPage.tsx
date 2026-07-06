import { useState } from "react";
import type { ChangeEvent, SyntheticEvent } from "react";

import {
  Box,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Button,
  Stack,
  CircularProgress,
} from "@mui/material";

import api from "../api/axiosInstance";
import { parseApiError } from "../api/errorHelpers";
import ApiErrorAlert from "../components/ApiErrorAlert";

import {
  CATEGORY_OPTIONS,
  CATEGORY_LABELS,
} from "../types/participant";

import type {
  ParticipantRegistrationData,
  ParticipantResponseDto,
  ValidationErrorMap,
} from "../types/participant";

import PaymentPage from "./PaymentPage";

const initialFormData: ParticipantRegistrationData = {
  firstName: "",
  lastName: "",
  email: "",
  age: "",
  category: ""
};



function RegisterPage() {
  const [formData, setFormData] = useState<ParticipantRegistrationData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<ValidationErrorMap | null>(null);
  const [registered, setRegistered] = useState<ParticipantResponseDto | null>(null);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value} = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };


  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setFieldErrors(null);
    setLoading(true);
    
    try{
      const response = await api.post<ParticipantResponseDto>("/participants", {
        ...formData,
        age: Number(formData.age),
      });
      setRegistered(response.data);

    } catch(err) {
      const parsed = parseApiError(err);
      setErrorMessage(parsed.message);
      setFieldErrors(parsed.fieldErrors);

    } finally {
      setLoading(false);
    }
    
  }

  // Once registered go to the payment step for this participant.
  if(registered){
    return (
      <Box sx={{ padding: 4, maxWidth: 500, margin: "0 auto"}}>
        <PaymentPage 
          participantId={registered.id}
          registrationNumber={registered.registrationNumber}
        />
      </Box>
    )
  }
  
  return (
    <Box sx={{ padding: 4, maxWidth: 500, margin: "0 auto" }}>
      <Paper elevation={3} sx={{ padding: 4 }}>
        <Typography variant="h5" sx={{ marginBottom: 3, color: "primary.main" }}>
          Race Registration
        </Typography>

        <ApiErrorAlert message={errorMessage} />

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              error={!!fieldErrors?.firstName}
              helperText={fieldErrors?.firstName}
              fullWidth
              required
            />

            <TextField
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              error={!!fieldErrors?.lastName}
              helperText={fieldErrors?.lastName}
              fullWidth
              required
            />

            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={!!fieldErrors?.email}
              helperText={fieldErrors?.email}
              fullWidth
              required
            />

            <TextField
              label="Age"
              name="age"
              type="number"
              value={formData.age}
              onChange={handleChange}
              error={!!fieldErrors?.age}
              helperText={fieldErrors?.age}
              fullWidth
              required
            />

            <TextField
              select
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              error={!!fieldErrors?.category}
              helperText={fieldErrors?.category}
              fullWidth
              required
            >
              {CATEGORY_OPTIONS.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {CATEGORY_LABELS[cat]}
                </MenuItem>
              ))}
            </TextField>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Register"}
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}

export default RegisterPage
