import React, {useEffect, useState} from 'react';
import {DownloadButtonContainer, Panel} from "./Output.style";
import {CSVLink} from "react-csv";
import {useStoreState} from "easy-peasy";
import GetAppIcon from "@material-ui/icons/GetApp";
import Button from "@material-ui/core/Button";

const Output = () => {
    const anonData = useStoreState(state => state.anonymization.data);
    const csvSource = useStoreState(state => state.csvSource);
    const isAnonProcessing = useStoreState(state => state.anonymization.processing);
    const isAnonProcessed = useStoreState(state => state.anonymization.processed);

    const [anonymizedFileName, setAnonymizedFileName] = useState('unnamed_anonymized.csv');
    const [shouldDisplayDownloadButton, setShouldDisplayDownloadButton] = useState(false);

    useEffect(() => {
        setShouldDisplayDownloadButton(!isAnonProcessing && isAnonProcessed)
    }, [isAnonProcessing, isAnonProcessed])

    useEffect(() => {
        if (!csvSource.loaded || !csvSource.fileInfo) return;
        setAnonymizedFileName(`${csvSource.fileInfo.name.slice(0, -4)}_anonymized.csv`)
    }, [csvSource])

    return (
        <Panel>
            Output
            {shouldDisplayDownloadButton && (
                <DownloadButtonContainer>
                    <CSVLink data={anonData} separator={";"} filename={anonymizedFileName}>
                        <Button
                            variant="contained"
                            color="default"
                            startIcon={<GetAppIcon />}
                        >
                            {anonymizedFileName}
                        </Button>
                    </CSVLink>
                </DownloadButtonContainer>
            )}
        </Panel>
    );
};

export { Output };
