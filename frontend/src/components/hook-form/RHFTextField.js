import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { TextField, styled } from '@mui/material';
// import { makeStyles } from "@mui/material/styles";

// ----------------------------------------------------------------------

RHFTextField.propTypes = {
  name: PropTypes.string,
  customOnChange: PropTypes.func,
};

// const StlyedBackground = makeStyles((theme) => ({
//   input: {
//     background: "rgb(232, 241, 250)"
//   }
// }));
// const StyledTextField = styled(TextField)
//   .MuiInputBase-root {
//     background-color: ${({theme, value}) => 
//       !value && theme.palette.background.grey01};
//   }

export default function RHFTextField({ name, customOnChange=null , ...other }) {
  const { control } = useFormContext();

  return (
    // <Controller
    //   name={name}
    //   control={control}
    //   render={({ field, fieldState: { error } }) => (
    //     <TextField {...field} fullWidth error={!!error} helperText={error?.message} {...other} />
    //   )}
    // />

    <Controller
      name={name}
      control={control}
      render={({ field: {...field}, fieldState: { error } }) => {
        if(customOnChange)customOnChange(field)
        return (
        <TextField {...field} fullWidth error={!!error} helperText={error?.message} {...other} />
      ) } }
    />

    // <Controller
    //   name={name}
    //   control={control}
    //   render={({ field:{value, onChange, ...field}, fieldState: { error } }) => (
    //     <TextField {...field} fullWidth error={!!error} helperText={error?.message} 
    //     onChange={({ target: { value } }) => {
    //       onChange(value);
    //     }} {...other} />
    //   )}
    // />
  );
}
