import { NumericFormat, NumericFormatProps } from 'react-number-format';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

interface HomeSpaceMonetaryFieldProps extends Omit<NumericFormatProps, 'customInput' | 'onChange'> {
  label: string;
  error?: boolean;
  helperText?: string;
  onChange: (value: number) => void; // Declare onChange prop for handling numeric value changes
}

const HomeSpaceMonetaryField = ({
  label,
  error,
  helperText,
  color,
  onChange,
  ...props
}: HomeSpaceMonetaryFieldProps & { size?: 'small' | 'medium'; color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' }) => {
  return (
    <NumericFormat
      customInput={TextField}
      allowNegative={false}
      decimalScale={2}
      fixedDecimalScale
      thousandSeparator='.'
      decimalSeparator=','
      label={label}
      size='small'
      error={error}
      helperText={helperText}
      color={color}
      {...props} // Spread remaining props, excluding 'onChange'

      onValueChange={(values) => {
        const { floatValue } = values;

        // Pass the float value to the parent component or form handler
        if (floatValue !== undefined) {
          onChange(floatValue); // Use float value (1.00 instead of "1,00")
        }
      }}

      InputProps={{
        startAdornment: (
          <Typography variant='body2' sx={{ mr: 1 }}>
            R$
          </Typography>
        ),
      }}
    />
  );
};

export default HomeSpaceMonetaryField;
