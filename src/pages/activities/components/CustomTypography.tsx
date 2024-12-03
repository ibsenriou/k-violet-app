// Overwrite MUI Typography component to use custom font

import Typography from "@mui/material/Typography";

const CustomTypography: React.FC = ({ children }) => {
  return (
    <Typography className="font-sans" >
      {children}
    </Typography>
  );
};