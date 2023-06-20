import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

export const CONTENT_FONTSIZE = 13;

export const MyTypography = styled(Typography)((props) => ({
  display: 'inline-block',
  whiteSpace: 'pre-line',
  fontSize: CONTENT_FONTSIZE
}));

export const InfoText = styled(MyTypography)((props) => ({
  padding: '0px 0px 16px 8px',
  minHeight: 50
}));
