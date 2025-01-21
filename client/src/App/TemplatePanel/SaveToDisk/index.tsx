import React, { useMemo } from 'react';

import { Save } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';

import { useDocument } from '../../../documents/editor/EditorContext';
import { renderToStaticMarkup } from '@usewaypoint/email-builder';

export default function DownloadJson() {
  const doc = useDocument();
  const code = useMemo(() => renderToStaticMarkup(doc, { rootBlockId: 'root' }), [doc]);

  const handleSave = async () => {
    const response = await fetch('http://localhost:8080/save' + '?filename=emailTemplate.html', {
      method: 'POST',
      headers: {
        'Content-Type': 'text/html',
      },
      body: code,
    });
    if (response.ok) {
      console.log('Saved successfully');
    } else {
      console.error('Failed to save');
    }
  };

  return (
    <Tooltip title="Save to disk">
      <IconButton onClick={handleSave}>
        <Save fontSize="small" />
      </IconButton>
    </Tooltip>
  );
}
