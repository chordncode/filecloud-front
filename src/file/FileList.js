import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Container, Box, Grid, Button, Snackbar, IconButton, Alert } from '@mui/material';
import { CloseIcon } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';

const defaultTheme = createTheme();
export default function FileList() {
    const nav = useNavigate();
    const columns = [
        { field: 'originalFileName', headerName: '파일명', minWidth: 300, flex: 1 },
        { field: 'fileSize', headerName: '파일 크기', minWidth: 150, flex: 0.4 }
      ];
    const [fileList, setFileList] = React.useState([]);
    const logout = () => {
        axios.post('/signout')
         .then(response => {
            nav('/');
         })
         .catch(error => {
            openToast();
         });
    };

    React.useEffect(() => {
        axios.get('/file')
        .then(response => {
            const newFileList = response.data.map(data => ({
                id: data.fileSn,
                originalFileName: data.originalFileName ? data.originalFileName : data.savedFileName,
                fileSize: data.fileSize
            }));
            setFileList(newFileList);
        })
        .catch(error => {
            if(error.response.status === 401) {
                nav('/');
            }
        });
    }, []);

    const [open, setOpen] = React.useState(false);
    const openToast = () => {
        setOpen(true);
    };
    const closeToast = () => {
        setOpen(false);
    };

    return(
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="lg">
                <CssBaseline />
                <Grid
                    container
                    justifyContent="flex-end"
                >
                    <Button
                        type="submit"
                        variant="contained"
                        sx={{ my: 2 }}
                        onClick={logout}
                        >
                        로그아웃
                    </Button>
                </Grid>
                <Grid>
                    <Button>
                        다운로드
                    </Button>
                </Grid>
                <Box
                    sx={{
                        my: 2,
                        alignItems: 'center'
                    }}
                >
                    <DataGrid
                        autoHeight
                        rows={fileList}
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: { page: 0, pageSize: 10 },
                            },
                        }}
                        pageSizeOptions={[5, 10]}
                        checkboxSelection
                    />
                </Box>
            </Container>
            <Snackbar open={open} autoHideDuration={3000} onClose={closeToast}>
                <Alert onClose={closeToast} severity="error" sx={{ width: '100%' }}>
                    잠시 후 다시 시도해주세요.
                </Alert>
            </Snackbar>
        </ThemeProvider>
    );
}