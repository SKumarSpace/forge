import { MonitorOutlined, PhoneIphoneOutlined, MarkChatUnread } from '@mui/icons-material';
import { Box, Stack, SxProps, ToggleButton, ToggleButtonGroup, Tooltip } from '@mui/material';
import { Reader } from '@usewaypoint/email-builder';

import EditorBlock from '../../documents/editor/EditorBlock';
import {
  setSelectedScreenSize,
  useDocument,
  useSelectedMainTab,
  useSelectedScreenSize,
} from '../../documents/editor/EditorContext';
import ToggleInspectorPanelButton from '../InspectorDrawer/ToggleInspectorPanelButton';
import ToggleSamplesPanelButton from '../SamplesDrawer/ToggleSamplesPanelButton';

import DownloadJson from './DownloadJson';
import HtmlPanel from './HtmlPanel';
import ImportJson from './ImportJson';
import JsonPanel from './JsonPanel';
import MainTabsGroup from './MainTabsGroup';
import ShareButton from './ShareButton';
import SaveToDisk from './SaveToDisk';
import DeleteFromDisk from './DeleteFromDisk';
import Message from './Message';

const SCREEN_SIZE_COMPONENTS: Record<string, JSX.Element | null> = {
  desktop: null,
  mobile: null,
  message: <Message />,
};

export default function TemplatePanel() {
  const document = useDocument();
  const selectedMainTab = useSelectedMainTab();
  const selectedScreenSize = useSelectedScreenSize();

  const baseBoxStyle: SxProps = {
    margin: selectedScreenSize !== 'desktop' ? '32px auto' : undefined,
    width: selectedScreenSize !== 'desktop' ? 370 : 'auto',
    height: selectedScreenSize !== 'desktop' ? 800 : '100%',
    boxShadow: selectedScreenSize !== 'desktop'
      ? 'rgba(33, 36, 67, 0.04) 0px 10px 20px, rgba(33, 36, 67, 0.04) 0px 2px 6px, rgba(33, 36, 67, 0.04) 0px 0px 1px'
      : undefined,
  };

  const handleScreenSizeChange = (_: unknown, value: 'desktop' | 'mobile' | 'message' | null) => {
    setSelectedScreenSize(value ?? 'desktop');
  };

  const renderMainPanel = () => {
    if (SCREEN_SIZE_COMPONENTS[selectedScreenSize]) {
      return <Box sx={baseBoxStyle}>{SCREEN_SIZE_COMPONENTS[selectedScreenSize]}</Box>;
    }

    const TABS_COMPONENTS: Record<string, JSX.Element> = {
      editor: <EditorBlock id="root" />,
      preview: <Reader document={document} rootBlockId="root" />,
      html: <HtmlPanel />,
      json: <JsonPanel />,
    };

    return <Box sx={baseBoxStyle}>{TABS_COMPONENTS[selectedMainTab]}</Box>;
  };

  return (
    <>
      <Stack
        sx={{
          height: 49,
          borderBottom: 1,
          borderColor: 'divider',
          backgroundColor: 'white',
          position: 'sticky',
          top: 0,
          zIndex: 'appBar',
          px: 1,
        }}
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <ToggleSamplesPanelButton />
        <Stack px={2} direction="row" gap={2} width="100%" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={2}>
            <MainTabsGroup />
          </Stack>
          <Stack direction="row" spacing={2}>
            <DownloadJson />
            <ImportJson />
            <SaveToDisk />
            <DeleteFromDisk />
            <ToggleButtonGroup value={selectedScreenSize} exclusive size="small" onChange={handleScreenSizeChange}>
              <ToggleButton value="desktop">
                <Tooltip title="Desktop view">
                  <MonitorOutlined fontSize="small" />
                </Tooltip>
              </ToggleButton>
              <ToggleButton value="mobile">
                <Tooltip title="Mobile view">
                  <PhoneIphoneOutlined fontSize="small" />
                </Tooltip>
              </ToggleButton>
              <ToggleButton value="message">
                <Tooltip title="Message view">
                  <MarkChatUnread fontSize="small" />
                </Tooltip>
              </ToggleButton>
            </ToggleButtonGroup>
            <ShareButton />
          </Stack>
        </Stack>
        <ToggleInspectorPanelButton />
      </Stack>
      <Box sx={{ height: 'calc(100vh - 49px)', overflow: 'auto', minWidth: 370 }}>{renderMainPanel()}</Box>
    </>
  );
}
