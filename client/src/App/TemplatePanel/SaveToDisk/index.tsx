import { useEffect, useMemo } from 'react';

import { Save } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';

import { setDocument, useDocument } from '../../../documents/editor/EditorContext';
import { renderToStaticMarkup } from '@usewaypoint/email-builder';
import { api } from '../../utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNanoid } from '../../SamplesDrawer/hooks';

export default function SaveToDisk() {
  const queryClient = useQueryClient();
  const generateId = useNanoid();

  const doc = useDocument();
  const block = useDocument().root;
  if (!block) {
    return <p>Block not found</p>;
  }

  const { data, type } = block;

  const code = useMemo(() => renderToStaticMarkup(doc, { rootBlockId: 'root' }), [doc]);
  const json = useMemo(() => JSON.stringify(doc, null, '  '), [doc]);

  const id = "id" in data ? data.id as string : undefined;

  const setId = (id: string) => {
    setDocument({ root: { type, data: { ...data, id } } });
  }

  useEffect(() => {
    if (!id) {
      setId(generateId());
    }
  }, [id, generateId]);

  const { mutate: save } = useMutation({

    mutationFn: async () => {
      // TODO: check if id exists in json...
      //const id = generateId();
      console.log('Saving: ', id);

      const response = await api.post('save', {
        json: {
          filename: id,
          html: code,
          configuration: json,
        },
      });

      if (response.ok) {
        console.log('Saved successfully');
      } else {
        console.error('Failed to save');
      }

      return response;

    },
    onSuccess: () => {
      const filename = id + '.json';
      window.location.hash = '#template?name=' + filename;
      queryClient.invalidateQueries({ queryKey: ['templates'] });
    }
  });

  const handleSave = () => {
    const title = 'title' in doc.root.data ? doc.root.data.title : null;

    if (!title) {
      console.error('Document has no title');
      alert('Document has no title');
      return;
    }

    save();
  }

  return (
    <Tooltip title="Save to disk">
      <IconButton onClick={handleSave}>
        <Save fontSize="small" />
      </IconButton>
    </Tooltip>
  );
}
