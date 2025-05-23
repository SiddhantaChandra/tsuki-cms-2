'use client';

import React from 'react';
import { Box, Drawer, CssBaseline } from '@mui/material';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import AppHeader from '@/components/Layout/AppHeader';
import SidebarNav from '@/components/Layout/SidebarNav';

const drawerWidth = 240;

export default function DashboardLayout({ children }) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const router = useRouter();
  const supabase = createClient();
  const [userEmail, setUserEmail] = React.useState(null);

  React.useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error fetching user in layout:', error);
        return;
      }
      if (user?.email) {
        setUserEmail(user.email);
      }
    };
    fetchUser();
  }, [supabase, router]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <CssBaseline />
      <AppHeader handleDrawerToggle={handleDrawerToggle} userEmail={userEmail} />
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, height: '100%', display: 'flex', flexDirection: 'column' },
          }}
        >
          <SidebarNav handleLogout={handleLogout} />
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, height: '100%', display: 'flex', flexDirection: 'column' },
          }}
          open
        >
          <SidebarNav handleLogout={handleLogout} />
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          marginTop: '64px',
        }}
      >
        {children}
      </Box>
    </Box>
  );
} 