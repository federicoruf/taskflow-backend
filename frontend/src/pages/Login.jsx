// src/pages/Login.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Paper,
  Link,
} from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";

const Login = (props) => {
  const { onNavigateToRegister } = props;
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validación básica en el cliente antes de golpear el backend
    if (!email || !password) {
      setError("Por favor, rellena todos los campos");
      return;
    }

    setSubmitting(true);
    const result = await login(email, password);
    setSubmitting(false);

    if (!result.success) {
      setError(result.error);
    }
    // Si tiene éxito, el contexto cambiará el estado 'user' y
    // nuestro App.jsx se encargará de moverlo de pantalla automáticamente.
  };

  return (
    <Container component="main" maxWidth="xs">
      {/* Box centrado verticalmente para dar el diseño amigable y responsivo */}
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderRadius: 2,
            width: "100%",
          }}
        >
          <Typography
            component="h1"
            variant="h5"
            sx={{ mb: 3, fontWeight: "bold", color: "primary.main" }}
          >
            Iniciar Sesión en TaskFlow
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ width: "100%" }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Correo Electrónico"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={submitting}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Contraseña"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={submitting}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              startIcon={<LoginIcon />}
              disabled={submitting}
              sx={{ mt: 3, mb: 2, padding: 1.2, fontWeight: "bold" }}
            >
              {submitting ? "Abriendo sesión..." : "Ingresar"}
            </Button>
            <Box sx={{ textAlign: 'center', mt: 1, display: 'flex', justifyContent: 'center' }}>
              <Link href="#" onClick={onNavigateToRegister} variant="body2" sx={{ underline: 'hover' }}>
                ¿No tienes cuenta? Regístrate aquí
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
