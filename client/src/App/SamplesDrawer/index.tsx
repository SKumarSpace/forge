import { Divider, Flex, Heading, Link, View, Text } from '@adobe/react-spectrum';
import { useSamplesDrawerOpen } from '../../documents/editor/EditorContext';

import SidebarButton from './SidebarButton';
import logo from './waypoint.svg';
import { useTemplateStore } from './hooks';
import { LibraryIcon } from 'lucide-react';
export const SAMPLES_DRAWER_WIDTH = 240;

export default function SamplesDrawer() {
  const samplesDrawerOpen = useSamplesDrawerOpen();
  const templates = useTemplateStore();

  return (
    <Flex
      UNSAFE_style={{
        transition: 'width 0.3s ease',
        width: samplesDrawerOpen ? `${SAMPLES_DRAWER_WIDTH}px` : '0',
        overflow: samplesDrawerOpen ? 'visible' : 'hidden',
        padding: samplesDrawerOpen ? '6px 24px' : 0,
        backgroundColor: 'gray-50',
      }}
    >
      <Flex direction="column" width={`${SAMPLES_DRAWER_WIDTH}px`} height="100%" justifyContent='space-between' >
        <Flex direction="column" gap="size-200">
          <Heading level={3} marginStart="size-100" UNSAFE_style={{ display: 'flex', alignItems: 'center' }}>
            <LibraryIcon size={24} />
            <Text marginStart="size-100">Forge</Text>
          </Heading>

          <Flex direction='column' alignItems='self-start'>
            <Text
              UNSAFE_style={{
                fontSize: '0.75rem',
                color: 'var(--spectrum-global-color-gray-500)',
                textTransform: 'uppercase',
                fontWeight: 'bold',
                letterSpacing: '0.5em',
                paddingTop: '0.5rem',
                paddingBottom: '0.5rem',
              }}
            >
              Samples
            </Text>
            <SidebarButton href="#">Empty</SidebarButton>
            <SidebarButton href="#sample/welcome">Welcome email</SidebarButton>
            <SidebarButton href="#sample/one-time-password">One-time passcode (OTP)</SidebarButton>
            <SidebarButton href="#sample/reset-password">Reset password</SidebarButton>
            <SidebarButton href="#sample/order-ecomerce">E-commerce receipt</SidebarButton>
            <SidebarButton href="#sample/subscription-receipt">Subscription receipt</SidebarButton>
            <SidebarButton href="#sample/reservation-reminder">Reservation reminder</SidebarButton>
            <SidebarButton href="#sample/post-metrics-report">Post metrics</SidebarButton>
            <SidebarButton href="#sample/respond-to-message">Respond to inquiry</SidebarButton>
          </Flex>
          <Divider size="S" />
          <Flex direction='column' alignItems='self-start'>
            <Text
              UNSAFE_style={{
                fontSize: '0.75rem',
                color: 'var(--spectrum-global-color-gray-500)',
                textTransform: 'uppercase',
                fontWeight: 'bold',
                letterSpacing: '0.5em',
                paddingTop: '0.5rem',
                paddingBottom: '0.5rem',
              }}
            >
              Templates
            </Text>
            {templates &&
              Object.entries(templates).map(([id, title]) => (
                <SidebarButton key={id} href={`#template?name=${id}`}>
                  <Flex direction="column">
                    <Text>{title}</Text>
                    <Text UNSAFE_style={{ fontSize: '0.5rem' }}>{id.replace('.json', '')}</Text>
                  </Flex>
                </SidebarButton>
              ))}
          </Flex>
          <Divider size="S" />
        </Flex>
        <Flex direction="column" gap="size-200" alignItems="start" UNSAFE_style={{ padding: '24px 6px' }}>
          <Link
            isQuiet
            href="https://usewaypoint.com?utm_source=emailbuilderjs"
            target="_blank"
          >
            <View width="size-400">
              <img src={logo} alt="Waypoint logo" style={{ width: '100%' }} />
            </View>
          </Link>
          <View>
            <Heading level={4} UNSAFE_style={{ marginTop: 0 }}>Looking to send emails?</Heading>
            <Text>
              Waypoint is an end-to-end email API with a &apos;pro&apos; version of this template builder with dynamic
              variables, loops, conditionals, drag and drop, layouts, and more.
            </Text>
          </View>
          <View UNSAFE_style={{ width: '100%', padding: '8px 12px', textAlign: 'center', textDecorationLine: 'none', background: '#1F1F21' }}>
            <Link
              variant="overBackground"
              href="https://usewaypoint.com?utm_source=emailbuilderjs"
              target="_blank"
              width={'100%'}
            >
              Learn more
            </Link>
          </View>
        </Flex>
      </Flex>
    </Flex>
  );
}
