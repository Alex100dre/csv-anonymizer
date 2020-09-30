import React /*, {useState, useEffect, useRef} */ from 'react';
// import { Console, Hook, Unhook } from 'console-feed';
import {ColumnParameters, Panel} from "./ColumnsParameters.style";
import {Grid, Typography} from "@material-ui/core";
import {useStoreActions, useStoreState} from "easy-peasy";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";

const ColumnsParameters = () => {
    const selectedColumns = useStoreState(state => state.anonymization.parameters.selectedColumns);
    const updateColumn = useStoreActions(actions => actions.anonymization.updateColumn);

    const handleSearchOccurrencesCheck = (column) => {
        column.searchOccurrencesThroughColumns = !column.searchOccurrencesThroughColumns;
        updateColumn(column);
    };

    return (
        <Panel>
            <Grid container spacing={1}>
                <Grid container item xs={12} spacing={3}>
                    {selectedColumns.map(column => (
                        <Grid item xs={6} md={4} lg={4} xl={2} key={column.id}>
                            <ColumnParameters>
                                <Typography noWrap>{column.name}</Typography>
                                <div>
                                    <Typography noWrap>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={column.searchOccurrencesThroughColumns}
                                                onChange={() => handleSearchOccurrencesCheck(column)}
                                                value={column.slug}
                                                color="primary"
                                            />
                                        }
                                        label="Search occurrences"
                                    />
                                    </Typography>
                                </div>
                            </ColumnParameters>
                        </Grid>
                    ))}
                </Grid>
            </Grid>
        </Panel>
    );
};

export { ColumnsParameters };
