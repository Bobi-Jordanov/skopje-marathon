import { Alert } from "@mui/material";

interface ApiErrorAlertProps {
    message: string | null;
}

function ApiErrorAlert({ message }: ApiErrorAlertProps) {
    if (!message) {
        return null;
    }

    return (
        <Alert severity="error" sx={{ marginBottom: 2 }}>
            {message}
        </Alert>
    )
}

export default ApiErrorAlert
