import { TextField, InputAdornment } from "@mui/material";
import { LucideIcon } from "lucide-react";

interface InputProps {
  label: string;
  icon: LucideIcon;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

export function Input({
  label,
  icon: Icon,
  value,
  onChange,
  required = true,
}: InputProps) {
  return (
    <TextField
      fullWidth
      label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Icon size={20} color="#4f46e5" />
          </InputAdornment>
        ),
      }}
      sx={{ mb: 2 }}
    />
  );
}
