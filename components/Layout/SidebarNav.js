'use client';

import React from 'react';
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography, Divider } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import CategoryIcon from '@mui/icons-material/Category';
import StyleIcon from '@mui/icons-material/Style';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import ExtensionIcon from '@mui/icons-material/Extension';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';

export default function SidebarNav({ handleLogout }) {
  const navItemsGroups = [
    [
      { text: 'Dashboard', icon: <HomeIcon />, href: '/dashboard' },
    ],
    [
      { text: 'Cards', icon: <CreditCardIcon />, href: '/dashboard/cards' },
      { text: 'Slabs', icon: <VerifiedUserIcon />, href: '/dashboard/slabs' },
      { text: 'Accessories', icon: <ExtensionIcon />, href: '/dashboard/accessories' },
    ],
    [
      { text: 'Categories', icon: <CategoryIcon />, href: '/dashboard/categories' },
      { text: 'Sets', icon: <StyleIcon />, href: '/dashboard/sets' },
      { text: 'Subsets', icon: <CollectionsBookmarkIcon />, href: '/dashboard/subsets' },
    ],
  ];

  return (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Tsuki CMS
        </Typography>
      </Toolbar>
      <Divider />
      {navItemsGroups.map((group, groupIndex) => (
        <React.Fragment key={`group-${groupIndex}`}>
          <List>
            {group.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton component="a" href={item.href}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          {groupIndex < navItemsGroups.length - 1 && <Divider />}
        </React.Fragment>
      ))}
      {/* Sign Out button at the bottom */}
      <List sx={{ marginTop: 'auto' }}>
        <Divider />
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Sign Out" />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );
} 