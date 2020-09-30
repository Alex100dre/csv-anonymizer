import React, {useEffect} from 'react';
import {createMuiTheme, ThemeProvider} from '@material-ui/core/styles';
import FingerprintIcon from '@material-ui/icons/Fingerprint';
import GetAppIcon from '@material-ui/icons/GetApp';
import logo from './logo.png';
import './App.css';
import CSVReader from 'react-csv-reader'
import CssBaseline from "@material-ui/core/CssBaseline";
import { useStoreActions, useStoreState } from 'easy-peasy';
import {
    Appcontainer,
    Aside,
    Content,
    ColumnsCheckBoxList,
    Form,
    FormRow,
    DownloadButtonContainer
} from './App.style'
import Button from "@material-ui/core/Button";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import slug from 'limax';
import { CSVLink } from "react-csv";
import {LogDisplay} from "./components/LogDisplay/LogDisplay.component";
import TextField from "@material-ui/core/TextField";
import {ColumnsParameters} from "./components/ColumnsParameters/ColumnsParameters.component";
import Anonymizer from './helpers/anonymization'

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
    const csvSource = useStoreState(state => state.csvSource);
    const setCsvSource = useStoreActions(actions => actions.csvSource.setCsvSource);
    const csvSeeds = useStoreState(state => state.csvSeeds);
    const setCsvSeeds = useStoreActions(actions => actions.csvSeeds.setCsvSeeds);
    const anonData = useStoreState(state => state.anonymization.data);
    const anonParams = useStoreState(state => state.anonymization.parameters);
    const setAnonData = useStoreActions(actions => actions.anonymization.setData);
    const columns = useStoreState(state => state.anonymization.parameters.columns);
    const setColumns = useStoreActions(actions => actions.anonymization.setColumns);
    const defaultAnonValue = useStoreState(state => state.anonymization.parameters.defaultAnonValue);
    const setDefaultAnonValue = useStoreActions(actions => actions.anonymization.setDefaultAnonValue);

    // ComponentDidMount
    useEffect(() => {
        console.log('%cApplication initialized...', 'color: #4af626');
        console.info('Please import a CSV file, select columns to anonymize, import seeds if needed and then click to anonymize.');
        console.info('Without any seeds, the data to anonymize will be replaced by the default anon value');
        console.info('Everything is processing on client side, nothing will be uploaded on our servers, your data are safe.');
    }, []);

    const handleCsv = (data, fileInfo) => {
        const cols = Object.keys(data[0]).map((col, i) => {
            const colSlug = slug(col);

            return {
                id: `${i}_${colSlug}`,
                name: col,
                slug: colSlug,
                selected: false,
                searchOccurrencesThroughColumns: false,
            }
        });

        console.log('%cCSV imported successfully ✔', 'color: #4af626');
        console.log('Info:', fileInfo);
        console.log('Data:', data);
        console.log('Columns list:', cols);

        setCsvSource({fileInfo, data});
        setColumns(cols)
    };

    const handleColumnCheck = (checkedColumn) => {
        setColumns(columns.map(column => {
            if (column.id === checkedColumn.id) column.selected = !column.selected;

            return column;
        }))
    };

    const handleCsvSeed = (data, fileInfo) => {
        console.log('%cSeeds imported successfully ✔', 'color: #4af626');
        console.log('Info:', fileInfo);
        console.log('Data:', data);
        setCsvSeeds({fileInfo, data});
    };

    const handleAnonymize = () => {
        console.log('Processing anonymization...');
        const anonymizer = new Anonymizer(csvSource, anonParams, csvSeeds);
        const anonymized = anonymizer.anonymize();
        setAnonData(anonymized)

        console.log('%cAnonymization complete ✔', 'color: #4af626');
        console.info(`You can now download your anonymized CSV file "${csvSource.fileInfo.name.slice(0, -4)}_anonymized.csv" by clicking the button below`)
    };

    const handleDefaultAnonValueInput = (value) => {
        setDefaultAnonValue(value)
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

                    <LogDisplay />

                    <ColumnsParameters />

                    {anonData.length > 0 && (
                        <DownloadButtonContainer>
                            <CSVLink data={anonData} separator={";"} filename={`${csvSource.fileInfo.name.slice(0, -4)}_anonymized.csv`}>
                                <Button
                                    variant="contained"
                                    color="default"
                                    startIcon={<GetAppIcon />}
                                >
                                    {csvSource.fileInfo.name.slice(0, -4)}_anonymized.csv
                                </Button>
                            </CSVLink>
                        </DownloadButtonContainer>
                    )}
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
                                    {csvSource.loaded && columns.length > 0 && columns.map(column => (
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

                        <FormRow>
                            <TextField id="defaultAnonValue" label="Default anon value" defaultValue={defaultAnonValue} onChange={(e) => handleDefaultAnonValueInput(e.target.value)}  />
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
