import { Item, TabList, Tabs, View } from '@adobe/react-spectrum'
import { setSidebarTab, useInspectorDrawerOpen, useSelectedSidebarTab } from '../../documents/editor/EditorContext';

import ConfigurationPanel from './ConfigurationPanel';
import StylesPanel from './StylesPanel';

export const INSPECTOR_DRAWER_WIDTH = 320;

export default function InspectorDrawer() {
  const selectedSidebarTab = useSelectedSidebarTab();
  const inspectorDrawerOpen = useInspectorDrawerOpen();

  const renderCurrentSidebarPanel = () => {
    switch (selectedSidebarTab) {
      case 'block-configuration':
        return <ConfigurationPanel />;
      case 'styles':
        return <StylesPanel />;
    }
  };

  return (
    <View
      UNSAFE_style={{
        width: inspectorDrawerOpen ? INSPECTOR_DRAWER_WIDTH : 0,
        transition: 'width 0.3s ease',
      }}
    >
      <View UNSAFE_style={{ width: INSPECTOR_DRAWER_WIDTH, height: 49, borderBottom: 1, borderColor: 'divider' }}>
        <View UNSAFE_style={{ padding: '0 16px' }}>
          <Tabs onSelectionChange={setSidebarTab as any}>
            <TabList>
              <Item key="styles">Styles</Item>
              <Item key="block-configuration">Inspect</Item>
            </TabList>
          </Tabs>
        </View>
      </View>
      <View UNSAFE_style={{ width: INSPECTOR_DRAWER_WIDTH, height: 'calc(100% - 49px)', overflow: 'auto' }}>
        {renderCurrentSidebarPanel()}
      </View>
    </View>
  );
}
