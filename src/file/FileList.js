import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Container, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import axios from 'axios';

const defaultTheme = createTheme();

export default function FileList() {
    const nav = useNavigate();
    const columns = [
        { field: 'originalFileName', headerName: '파일명', width: 440 },
        { field: 'fileSize', headerName: '파일 크기', width: 160 }
      ];
    const [fileList, setFileList] = React.useState([]);

    React.useEffect(() => {
        axios.get('/file')
        .then(response => {
            const newFileList = response.data.map(data => ({
                id: data.fileSn,
                originalFileName: data.originalFileName,
                fileSize: data.fileSize
            }));
            setFileList(newFileList);
        })
        .catch(error => {
            console.log(error);
        });

        
    }, []);
    return(
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <DataGrid
                        rows={fileList}
                        columns={columns}
                        initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 5 },
                        },
                        }}
                        pageSizeOptions={[5, 10]}
                        checkboxSelection
                    />
                </Box>
            </Container>
        </ThemeProvider>
    );
}