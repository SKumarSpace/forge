import { useEffect, useMemo } from 'react';

import { Delete } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';

import { setDocument, useDocument } from '../../../documents/editor/EditorContext';
import { api } from '../../utils';
import { useMutation } from '@tanstack/react-query';

export default function DeleteFromDisk() {
  const doc = useDocument();
  const block = doc?.root;

  if (!block) return <p>Block not found</p>;

  const { data, type } = block;

  const id = useMemo(() => {
    return 'id' in data ? (data.id as string) : undefined;
  }, [data]);

  const title = useMemo(() => {
    return 'title' in data ? data.title : null;
  }, [data]);

  useEffect(() => {
    if (!id) {
      setDocument({ root: { type, data: { ...data } } });
    }
  }, [id, type]);

  const { mutate: deleteFromDisk } = useMutation({
    mutationFn: async () => {
      try {
        const response = await api.delete('delete', {
          json: { filename: id },
        });

        if (!response.ok) {
          throw new Error('Failed to delete file from disk');
        }

        console.log('Deleted successfully');
        return response;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    onSuccess: () => {
      window.location.replace('/');
    }
  });

  const handleDelete = () => {
    if (!title) {
      console.error('Document has no title');
      alert('Document has no title');
      return;
    }

    deleteFromDisk();
  }

  return (
    <Tooltip title="Delete from disk">
      <IconButton onClick={handleDelete}>
        <Delete fontSize="small" />
      </IconButton>
    </Tooltip>
  );
}
