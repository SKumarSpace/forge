import React, { useState } from 'react';
import { ActionButton, Tooltip, TooltipTrigger, DialogContainer, Heading, Content, ButtonGroup, Button } from '@adobe/react-spectrum';
import Share from '@spectrum-icons/workflow/Share';

import { useDocument } from '../../documents/editor/EditorContext';

export default function ShareButton() {
  const document = useDocument();
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const onClick = async () => {
    const c = encodeURIComponent(JSON.stringify(document));
    location.hash = `#code/${btoa(c)}`;
    setMessage('The URL was updated. Copy it to share your current template.');
    setDialogOpen(true);
  };

  const onClose = () => {
    setMessage(null);
    setDialogOpen(false);
  };

  return (
    <>
      <TooltipTrigger>
        <ActionButton onPress={onClick}>
          <Share />
        </ActionButton>
        <Tooltip>Share current template</Tooltip>
      </TooltipTrigger>

      <DialogContainer onDismiss={onClose}>
        {isDialogOpen && (
          <div>
            <Heading>Share Template</Heading>
            <Content>{message}</Content>
            <ButtonGroup>
              <Button variant="secondary" onPress={onClose}>
                Close
              </Button>
            </ButtonGroup>
          </div>
        )}
      </DialogContainer>
    </>
  );
}
