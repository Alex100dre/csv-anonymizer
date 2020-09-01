import React, {useState} from 'react';
import {createMuiTheme, ThemeProvider} from '@material-ui/core/styles';
import FingerprintIcon from '@material-ui/icons/Fingerprint';
import GetAppIcon from '@material-ui/icons/GetApp';
import logo from './logo.png';
import './App.css';
import CSVReader from 'react-csv-reader'
import CssBaseline from "@material-ui/core/CssBaseline";
import Paper from "@material-ui/core/Paper";
import {Appcontainer, Aside, Content, ColumnsCheckBoxList, Form, FormRow} from './App.style'
import Button from "@material-ui/core/Button";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import slug from 'limax';
import { CSVLink } from "react-csv";

const theme = createMuiTheme({
    palette: {
        type: 'dark',
    },
});

const papaparseOptions = {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    transformHeader: header => header.toLowerCase().replace(/\W/g, "_")
};

function App() {

    const [csv, setCsv] = useState({loaded: false, fileInfo: null, data: []});
    const [csvSeed, setCsvSeed] = useState({loaded: false, fileInfo: null, data: []});
    const [anonData, setAnonData] = useState([]);

    const [columns, setColumns] = useState([]);

    const handleCsv = (data, fileInfo) => {
        const cols = Object.keys(data[0]).map((col, i) => {
            const colSlug = slug(col);

            return {
                id: `${i}_${colSlug}`,
                name: col,
                slug: colSlug,
                selected: false
            }
        });

        console.log(fileInfo, cols, data);
        setCsv({loaded: true, fileInfo, data});
        setColumns(cols)
    };

    const handleColumnCheck = (checkedColumn) => {
        setColumns(columns.map(column => {
            if (column.id === checkedColumn.id) column.selected = !column.selected;

            return column;
        }))
    };

    const handleCsvSeed = (data, fileInfo) => {
        console.log(data);
        setCsvSeed({loaded: true, fileInfo, data});
    };

    const handleAnonymize = () => {
        const csvData = csv.data;
        const anonCsvData = csvData.map(row => anonymizeRow(row));

        setAnonData(anonCsvData);
    };

    const anonymizeRow = row => {
        const colsToAnon = columns.filter((column) => column.selected);
        let value = '💩';

        colsToAnon.forEach(colToAnon => {
            if (colHasSeeds(colToAnon)) {
                value = getRandomSeedValueForColumn(colToAnon);
            }
            return row[colToAnon.name] = value;
        });

        return row;
    };

    const colHasSeeds = (column) => {
        return csvSeed.data[0].hasOwnProperty(column.name);
    };

    const getRandomSeedValueForColumn = (column) => {
        const randomIndex = Math.floor(Math.random() * csvSeed.data.length);
        return csvSeed.data[randomIndex][column.name];
    };


    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <Appcontainer className="App">
                <Content>
                    <header className="App-header">
                        <img src={logo} className="App-logo" alt="logo"/>
                        ANONYMIZER
                    </header>

                    <Paper>
                        {anonData.length > 0 && (
                            <>
                                <p>CSV ANONYMIZED SUCCESSFULLY!</p>
                                <CSVLink data={anonData} separator={";"} filename={`${csv.fileInfo.name.slice(0, -4)}_anonymized.csv`}>
                                    <Button
                                        variant="contained"
                                        color="default"
                                        startIcon={<GetAppIcon />}
                                    >
                                        {csv.fileInfo.name.slice(0, -4)}_anonymized.csv
                                    </Button>
                                </CSVLink>
                            </>
                        )}
                    </Paper>
                </Content>

                <Aside>
                    <Form>
                        <FormRow>
                            <fieldset>
                                <legend>CSV to anonymize</legend>
                                <CSVReader className="csv-input" onFileLoaded={handleCsv} parserOptions={papaparseOptions}/>
                            </fieldset>
                        </FormRow>

                        <FormRow>
                            <fieldset>
                                <legend>Columns to anonymize</legend>
                                <ColumnsCheckBoxList>
                                    {csv.loaded && columns.length > 0 && columns.map(column => (
                                        <div key={column.id}>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={column.selected}
                                                        onChange={() => handleColumnCheck(column)}
                                                        value={column.slug}
                                                        color="primary"
                                                    />
                                                }
                                                label={column.name}
                                            />
                                        </div>
                                    ))}
                                </ColumnsCheckBoxList>
                            </fieldset>
                        </FormRow>

                        <FormRow>
                            <fieldset>
                                <legend>Seeds</legend>
                                <CSVReader className="csv-input" onFileLoaded={handleCsvSeed} parserOptions={papaparseOptions}/>
                            </fieldset>
                        </FormRow>

                        <FormRow style={{textAlign: 'center'}}>
                            <Button
                                variant="contained"
                                color="default"
                                startIcon={<FingerprintIcon />}
                                onClick={handleAnonymize}
                            >
                                Anonymize
                            </Button>
                        </FormRow>
                    </Form>
                </Aside>
            </Appcontainer>
        </ThemeProvider>
    );
}

export default App;
