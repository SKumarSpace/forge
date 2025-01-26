import { Flex, View } from '@adobe/react-spectrum';
import { useInspectorDrawerOpen, useSamplesDrawerOpen } from '../documents/editor/EditorContext';

import InspectorDrawer from './InspectorDrawer';
import SamplesDrawer from './SamplesDrawer';
import TemplatePanel from './TemplatePanel';

function useDrawerTransition(cssProperty: string, open: boolean) {
  const easing = open ? 'ease-out' : 'ease-in';
  const duration = open ? '300ms' : '200ms';
  return `${cssProperty} ${duration} ${easing}`;
}

export default function App() {
  const inspectorDrawerOpen = useInspectorDrawerOpen();
  const samplesDrawerOpen = useSamplesDrawerOpen();

  const marginLeftTransition = useDrawerTransition('margin-left', samplesDrawerOpen);
  const marginRightTransition = useDrawerTransition('margin-right', inspectorDrawerOpen);

  return (
    <Flex>
      <SamplesDrawer />

      <View
        UNSAFE_style={{
          width: '100%',
          transition: [marginLeftTransition, marginRightTransition].join(', '),
        }}
      >
        <TemplatePanel />
      </View>

      <InspectorDrawer />
    </Flex>
  );
}
