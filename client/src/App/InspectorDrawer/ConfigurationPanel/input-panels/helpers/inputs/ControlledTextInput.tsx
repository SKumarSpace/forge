import { InputProps } from '@mui/material';
import { TextField } from '@adobe/react-spectrum'


type Props = {
  label: string;
  rows?: number;
  placeholder?: string;
  helperText?: string | JSX.Element;
  InputProps?: InputProps;
  onChange: (v: string) => void;
  value: string;
};
export default function ControlledTextInput({ helperText, label, placeholder, rows, InputProps, value, onChange }: Props) {
  return (
    <TextField
      isQuiet
      width={'100%'}
      // fullWidth
      // multiline={isMultiline}
      // minRows={rows}
      // variant={isMultiline ? 'outlined' : 'standard'}
      label={label}
      placeholder={placeholder}
      // helperText={helperText}
      value={value}
      onChange={onChange}
    />
  );
}
