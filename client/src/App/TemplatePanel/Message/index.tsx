import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { Message as Msg } from "@chatscope/chat-ui-kit-react";

import { useDocument } from '../../../documents/editor/EditorContext';

export default function Message() {
  const { data } = useDocument().root;
  return (
    "smsContent" in data ?
      <Msg
        model={{
          message: data.smsContent as string,
          direction: 'incoming',
          position: 'last'
        }}
      />
      : null
  )
}