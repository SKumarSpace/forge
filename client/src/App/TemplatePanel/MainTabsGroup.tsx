import React from 'react';
import { Tabs, TabList, Item, TooltipTrigger, Tooltip } from '@adobe/react-spectrum';
import Edit from '@spectrum-icons/workflow/Edit';
import Preview from '@spectrum-icons/workflow/Preview';
import Code from '@spectrum-icons/workflow/Code';
import Data from '@spectrum-icons/workflow/Data';

import { setSelectedMainTab, useSelectedMainTab } from '../../documents/editor/EditorContext';

export default function MainTabsGroup() {
  const selectedMainTab = useSelectedMainTab();

  const handleChange = (key: React.Key) => {
    switch (key) {
      case 'json':
      case 'preview':
      case 'editor':
      case 'html':
        setSelectedMainTab(key as 'html');
        return;
      default:
        setSelectedMainTab('editor');
    }
  };

  return (
    <Tabs
      aria-label="Main Tabs"
      selectedKey={selectedMainTab}
      onSelectionChange={handleChange}
    >
      <TabList>
        <Item key="editor">
          <TooltipTrigger>
            <span>
              <Edit />
            </span>
            <Tooltip>Edit</Tooltip>
          </TooltipTrigger>
        </Item>
        <Item key="preview">
          <TooltipTrigger>
            <span>
              <Preview />
            </span>
            <Tooltip>Preview</Tooltip>
          </TooltipTrigger>
        </Item>
        <Item key="html">
          <TooltipTrigger>
            <span>
              <Code />
            </span>
            <Tooltip>HTML Output</Tooltip>
          </TooltipTrigger>
        </Item>
        <Item key="json">
          <TooltipTrigger>
            <span>
              <Data />
            </span>
            <Tooltip>JSON Output</Tooltip>
          </TooltipTrigger>
        </Item>
      </TabList>
    </Tabs>
  );
}
