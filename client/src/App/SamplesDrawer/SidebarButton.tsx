import React, { useEffect } from 'react';

import { Button } from '@mui/material';

import { resetDocument } from '../../documents/editor/EditorContext';
import getConfiguration from '../../getConfiguration';
import { useTemplateContent } from './hooks';

export default function SidebarButton({ href, children }: { href: string; children: JSX.Element | string }) {
  const content = useTemplateContent(href);
  const handleClick = () => {
    if (href.startsWith('#template')) {
      if (content) {
        console.log(content);
        resetDocument(content);
      } else {
        alert('Loading');
      }
    } else {
      resetDocument(getConfiguration(href));
    }
  };

  // crude auto-load
  useEffect(() => {
    if (window.location.hash.startsWith('#template') && content) {
      //const filename = window.location.hash.replace("#template?name=", "");

      if (decodeURI(window.location.hash) === href) {
        resetDocument(content);
      }
    }
  }, [content, href]);

  return (
    <Button size="small" href={href} onClick={handleClick}>
      {children}
    </Button>
  );
}
