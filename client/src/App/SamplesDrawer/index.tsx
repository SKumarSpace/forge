import { Box, Button, Divider, Drawer, Link, Stack, Typography } from '@mui/material';

import { useSamplesDrawerOpen } from '../../documents/editor/EditorContext';

import SidebarButton from './SidebarButton';
import logo from './waypoint.svg';
import { useTemplateStore } from './hooks';
import { LibraryIcon } from 'lucide-react';
export const SAMPLES_DRAWER_WIDTH = 240;

export default function SamplesDrawer() {
  const samplesDrawerOpen = useSamplesDrawerOpen();
  const templateNames = useTemplateStore();

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={samplesDrawerOpen}
      sx={{
        width: samplesDrawerOpen ? SAMPLES_DRAWER_WIDTH : 0,
      }}
    >
      <Stack spacing={3} py={1} px={2} width={SAMPLES_DRAWER_WIDTH} justifyContent="space-between" height="100%">
        <Stack spacing={2} sx={{ '& .MuiButtonBase-root': { width: '100%', justifyContent: 'flex-start' } }}>
          <Typography variant="h6" component="h1" sx={{ p: 0.75 }} style={{ display: 'flex', alignItems: 'center' }}>
            <LibraryIcon size={24} />
            <span style={{ marginLeft: '0.25rem' }}>Forge</span>
          </Typography>

          <Stack alignItems="flex-start">
            <div
              style={{
                fontSize: '0.75rem',
                color: 'rgba(0, 0, 0, 0.54)',
                textTransform: 'uppercase',
                fontWeight: 'bold',
                letterSpacing: '0.5em',
                paddingTop: '0.5rem',
                paddingBottom: '0.5rem',
              }}
            >
              Samples
            </div>
            <SidebarButton href="#">Empty</SidebarButton>
            <SidebarButton href="#sample/welcome">Welcome email</SidebarButton>
            <SidebarButton href="#sample/one-time-password">One-time passcode (OTP)</SidebarButton>
            <SidebarButton href="#sample/reset-password">Reset password</SidebarButton>
            <SidebarButton href="#sample/order-ecomerce">E-commerce receipt</SidebarButton>
            <SidebarButton href="#sample/subscription-receipt">Subscription receipt</SidebarButton>
            <SidebarButton href="#sample/reservation-reminder">Reservation reminder</SidebarButton>
            <SidebarButton href="#sample/post-metrics-report">Post metrics</SidebarButton>
            <SidebarButton href="#sample/respond-to-message">Respond to inquiry</SidebarButton>
          </Stack>
          <Divider />
          <Stack alignItems="flex-start">
            <div
              style={{
                fontSize: '0.75rem',
                color: 'rgba(0, 0, 0, 0.54)',
                textTransform: 'uppercase',
                fontWeight: 'bold',
                letterSpacing: '0.5em',
                paddingTop: '0.5rem',
                paddingBottom: '0.5rem',
              }}
            >
              Templates
            </div>
            {templateNames &&
              templateNames.map((name) => (
                <SidebarButton key={name} href={`#template?name=${name}`}>
                  {name.replace('.json', '')}
                </SidebarButton>
              ))}
          </Stack>
          <Divider />
        </Stack>
        <Stack spacing={2} px={0.75} py={3}>
          <Link href="https://usewaypoint.com?utm_source=emailbuilderjs" target="_blank" sx={{ lineHeight: 1 }}>
            <Box component="img" src={logo} width={32} />
          </Link>
          <Box>
            <Typography variant="overline" gutterBottom>
              Looking to send emails?
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Waypoint is an end-to-end email API with a &apos;pro&apos; version of this template builder with dynamic
              variables, loops, conditionals, drag and drop, layouts, and more.
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            sx={{ justifyContent: 'center' }}
            href="https://usewaypoint.com?utm_source=emailbuilderjs"
            target="_blank"
          >
            Learn more
          </Button>
        </Stack>
      </Stack>
    </Drawer>
  );
}
