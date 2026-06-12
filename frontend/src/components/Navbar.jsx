import { useAuth } from '../context/AuthContext';
import { AppBar, Toolbar, Typography, Box, Button, Avatar } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <AppBar position="static" elevation={2}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', letterSpacing: 0.5 }}>
          TaskFlow
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar 
            sx={{ 
              bgcolor: 'secondary.main', 
              width: 32, 
              height: 32,
              fontSize: '0.9rem',
              fontWeight: 'bold'
            }}
          >
            {user?.name ? user.name[0].toUpperCase() : 'U'}
          </Avatar>

          <Typography variant="body1" sx={{ display: { xs: 'none', sm: 'block' } }}>
            Hola, <strong>{user?.name}</strong>
          </Typography>

          <Button 
            color="inherit" 
            variant="outlined"
            startIcon={<LogoutIcon />}
            onClick={logout}
            size="small"
            sx={{ 
              borderColor: 'rgba(255, 255, 255, 0.5)',
              '&:hover': {
                borderColor: '#white',
                bgcolor: 'rgba(255, 255, 255, 0.08)'
              }
            }}
          >
            Salir
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;