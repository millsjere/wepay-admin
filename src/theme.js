import { createTheme } from "@material-ui/core/styles";


export const theme = createTheme({
    typography : {
      fontFamily: 'Poppins',
      fontSize: 13,
    },
    palette : {
      primary: {
          main: '#f6a200'
      },
      secondary : {
          main: '#3f5176'
      }
  },
    backgroundPrimary : '#f6a200',
    backgroundSecondary : '#3f5176',
    contentBackground: '#e3f2fd78'
  })