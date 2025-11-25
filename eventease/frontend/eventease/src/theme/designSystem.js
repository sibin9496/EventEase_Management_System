import { createTheme } from '@mui/material/styles';

export const designSystem = createTheme({
    palette: {
        primary: {
            main: '#7C3AED',
            light: '#8B5CF6',
            dark: '#6D28D9',
            contrastText: '#FFFFFF',
        },
        secondary: {
            main: '#06B6D4',
            light: '#22D3EE',
            dark: '#0891B2',
            contrastText: '#FFFFFF',
        },
        background: {
            default: '#F8FAFC',
            paper: '#FFFFFF',
        },
        text: {
            primary: '#1E293B',
            secondary: '#64748B',
        },
        grey: {
            50: '#F8FAFC',
            100: '#F1F5F9',
            200: '#E2E8F0',
            300: '#CBD5E1',
            400: '#94A3B8',
            500: '#64748B',
            600: '#475569',
            700: '#334155',
            800: '#1E293B',
            900: '#0F172A',
        },
    },
    typography: {
        fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif',
        h1: {
            fontWeight: 800,
            fontSize: '3.5rem',
            lineHeight: 1.1,
        },
        h2: {
            fontWeight: 700,
            fontSize: '2.5rem',
            lineHeight: 1.2,
        },
        h3: {
            fontWeight: 700,
            fontSize: '2rem',
            lineHeight: 1.3,
        },
        h4: {
            fontWeight: 600,
            fontSize: '1.5rem',
            lineHeight: 1.4,
        },
        h5: {
            fontWeight: 600,
            fontSize: '1.25rem',
            lineHeight: 1.5,
        },
        h6: {
            fontWeight: 600,
            fontSize: '1.125rem',
            lineHeight: 1.6,
        },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        html, body, #root {
          height: 100%;
          width: 100%;
        }
        
        body {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: #F8FAFC;
          overflow-x: hidden;
        }
        
        .glass-effect {
          background: rgba(255, 255, 255, 0.25);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.18);
        }
        
        .gradient-bg {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        
        .gradient-text {
          background: linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .hover-lift {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .hover-lift:hover {
          transform: translateY(-8px);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
      `,
        },
        // In the MuiContainer styleOverrides, update to:
        MuiContainer: {
            styleOverrides: {
                root: {
                    maxWidth: '1280px!important',
                    paddingLeft: '16px!important',
                    paddingRight: '16px!important',
                    margin: '0 auto!important',
                    '@media (min-width: 600px)': {
                        paddingLeft: '24px!important',
                        paddingRight: '24px!important',
                    },
                    '@media (min-width: 1200px)': {
                        maxWidth: '1280px!important',
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: 8,
                    padding: '12px 24px',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    border: '1px solid #F1F5F9',
                    overflow: 'hidden',
                },
            },
        },
    },
});

export default designSystem;