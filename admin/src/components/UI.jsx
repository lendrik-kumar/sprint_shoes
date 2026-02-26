import React from 'react';
import {
  Button as MuiButton,
  TextField,
  Alert as MuiAlert,
  CircularProgress,
  Dialog,
  Select as MuiSelect,
  MenuItem,
  TextareaAutosize,
} from '@mui/material';

export const Button = React.forwardRef(({ children, ...props }, ref) => (
  <MuiButton ref={ref} variant="contained" {...props}>
    {children}
  </MuiButton>
));

Button.displayName = 'Button';

export const Input = React.forwardRef(({ ...props }, ref) => (
  <TextField ref={ref} variant="outlined" size="small" {...props} />
));

Input.displayName = 'Input';

export const Alert = ({ children, ...props }) => <MuiAlert {...props}>{children}</MuiAlert>;

export const Spinner = ({ size = 40 }) => <CircularProgress size={size} />;

export const Modal = ({ open, onClose, children, ...props }) => (
  <Dialog open={open} onClose={onClose} {...props}>
    {children}
  </Dialog>
);

export const Select = ({ children, ...props }) => (
  <MuiSelect variant="outlined" size="small" {...props}>
    {children}
  </MuiSelect>
);

export const Textarea = React.forwardRef(({ ...props }, ref) => (
  <TextareaAutosize ref={ref} style={{ fontFamily: 'inherit' }} {...props} />
));

Textarea.displayName = 'Textarea';

export default {
  Button,
  Input,
  Alert,
  Spinner,
  Modal,
  Select,
  Textarea,
};
