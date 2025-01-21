import { useMemo } from 'react';

import { Save } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';

import { useDocument } from '../../../documents/editor/EditorContext';
import { renderToStaticMarkup } from '@usewaypoint/email-builder';
import { api } from '../../utils';

export default function SaveToDisk() {
  const doc = useDocument();
  const code = useMemo(() => renderToStaticMarkup(doc, { rootBlockId: 'root' }), [doc]);
  const json = useMemo(() => JSON.stringify(doc, null, '  '), [doc]);

  const handleSave = async () => {
    const title = 'title' in doc.root.data ? doc.root.data.title : null;

    if (!title) {
      console.error('Document has no title');
      alert('Document has no title');
      return;
    }
    console.log(title);

    const response = await api.post('save', {
      json: {
        filename: title,
        html: code,
        configuration: json,
      },
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
