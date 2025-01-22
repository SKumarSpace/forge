import { InputProps, TextField } from '@mui/material';

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
  const isMultiline = typeof rows === 'number' && rows > 1;
  return (
    <TextField
      fullWidth
      multiline={isMultiline}
      minRows={rows}
      variant={isMultiline ? 'outlined' : 'standard'}
      label={label}
      placeholder={placeholder}
      helperText={helperText}
      InputProps={InputProps}
      value={value}
      onChange={(ev) => {
        const v = ev.target.value;
        onChange(v);
      }}
    />
  );
}
