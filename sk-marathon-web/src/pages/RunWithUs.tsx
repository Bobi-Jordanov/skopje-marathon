import { useEffect, useState, useMemo } from "react";

import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  CircularProgress,
} from "@mui/material";

import type { SelectChangeEvent } from "@mui/material";

import api from "../api/axiosInstance";
import { parseApiError } from "../api/errorHelpers";

import ApiErrorAlert from "../components/ApiErrorAlert";
import {
  CATEGORY_OPTIONS,
  CATEGORY_LABELS,
} from "../types/participant";

import type { ParticipantPublicDto, RaceCategory } from "../types/participant";

const RunWithUs = () => {
  const [participants, setParticipants] = useState<ParticipantPublicDto[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<RaceCategory | "">("");

  useEffect(() => {
    api
      .get<ParticipantPublicDto[]>("/participants")
      .then((res) => setParticipants(res.data))
      .catch((err) => setErrorMessage(parseApiError(err).message))
      .finally(() => setLoading(false));
  }, []); 

  const handleCategoryChange = (e: SelectChangeEvent) => {
    setCategoryFilter(e.target.value as RaceCategory | "");
  }

  const filteredData = useMemo(() => {
    return (
      participants.filter((p) => {
        const matchesCategory = categoryFilter ? p.category === categoryFilter : true;
        const matchesSearch = search ? `${p.firstName} ${p.lastName}`.toLowerCase().includes(search.toLowerCase()) : true;
      
        return matchesCategory && matchesSearch;
      })
    )
  }, [participants, categoryFilter, search]);


  return (
    <Box sx={{ padding: 4, maxWidth: 900, margin: "0 auto" }}>
      <Typography variant="h5" sx={{ marginBottom: 3, color: "primary.main" }}>
        Run With Us
      </Typography>

      <ApiErrorAlert message={errorMessage} />

      {/* Filtering by Name in a Search Box */}
      <Box sx={{ display: "flex", gap: 2, marginBottom: 3, flexWrap: "wrap" }}>
        <TextField
          label="Search by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ minWidth: 240 }}
        />

        {/* Filtering by Category by choosing from a Select Menu */}
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="category-filter-label">Category</InputLabel>
          <Select
            labelId="category-filter-label"
            value={categoryFilter}
            label="Category"
            onChange={handleCategoryChange}
          >
            <MenuItem value="">All</MenuItem>
            {CATEGORY_OPTIONS.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {CATEGORY_LABELS[cat]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", padding: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "primary.main" }}>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Start Number</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>First Name</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Last Name</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Category</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No participants found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>{p.startNumber}</TableCell>
                    <TableCell>{p.firstName}</TableCell>
                    <TableCell>{p.lastName}</TableCell>
                    <TableCell>{CATEGORY_LABELS[p.category]}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}

export default RunWithUs
