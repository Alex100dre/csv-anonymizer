export default class {
    constructor(csvSource, parameters, csvSeeds) {
        this.csvSource = csvSource;
        this.parameters = parameters;
        this.csvSeeds = csvSeeds;
        this.anonymizedData = [];
        this.state = {
            cells: [],
            currentColumn: null,
            currentRow: null,
        }
    }

    anonymize = () => {
        console.log('ANONYMIZE')
        const { csvSource, anonymizeRow } = this;
        const { data: sourceData } = csvSource;
        console.log(sourceData)

        // Spread row to create a copy & leave the source row clean
        this.anonymizedData = sourceData.map(({...row}, index) => {
            this.state.currentRow = row;
            return anonymizeRow(row, index);
        });
        return this.anonymizedData;
    }

    anonymizeRow = ({...row}, rowIndex) => {
        let anonymizedRow = row;
        const { anonymizeCell, parameters, anonymizeCellsValueOccurrencesThroughRowColumns } = this;
        const { columns, selectedColumns : columnsToAnonymize } = parameters;
        const cells = [];

        columnsToAnonymize.forEach(columnToAnonymize => {
            this.state.currentColumn = columnToAnonymize;
            const cell = this.generateCell(row, rowIndex, columnToAnonymize);
            const anonymizedCell = anonymizeCell(cell)
            cells.push(anonymizedCell);
            anonymizedRow[anonymizedCell.columnName] = anonymizedCell.anonymizedValue;
        });

        this.state.cells = cells;
        /* TODO: check if it's better (in perf) to generate cells for all columns and perform only one
         * anonymization here or leave it like that (generate cells only for columns to anonymize
         * perform two anonymizations, one for the cell and one for the occurrences in other cells)
         */
        anonymizedRow = anonymizeCellsValueOccurrencesThroughRowColumns(cells, columns, row);

        return anonymizedRow;
    }

    // TODO: Maybe rename it To generateCellAnonData
    generateCell = (row, rowIndex, column) => {
        return {
            columnName: column.name,
            rowIndex: rowIndex,
            sourceValue: row[column.name],
            anonymizedValue: null,
            searchOccurrencesThroughColumns: column.searchOccurrencesThroughColumns
        }
    }

    anonymizeCell = (cell) => {
        const {getRandomColumnSeed, hasColumnSeeds, parameters, state} = this;
        const { defaultAnonValue } = parameters;
        const { currentColumn } = state;
        return {
            ...cell,
            anonymizedValue: hasColumnSeeds(currentColumn) ? getRandomColumnSeed(currentColumn) : defaultAnonValue
        };
    }

    anonymizeCellsValueOccurrencesThroughRowColumns = (cells, columns, row) => {
        const anonymizedRow = {...row};
        columns.forEach(column => {
            let cellValue = row[column.name];
            cells.forEach(cell => {
                // TODO: If it's better to perform only one anonymization,
                // check here if the cell should be anonymized before (&& !cell.shouldAnonymize)
                if (!cellValue || !cell.searchOccurrencesThroughColumns) return;

                // TODO: Manage non string replace behavior
                cellValue = `${cellValue}`.replace(
                    new RegExp(`\\b(\\w*${cell.sourceValue}\\w*)\\b`, 'mig'),
                    cell.anonymizedValue
                );
            })
            anonymizedRow[column.name] = cellValue;
        });
        return anonymizedRow;
    }

    hasColumnSeeds = (column) => {
        const { csvSeeds } = this;
        if (!csvSeeds.loaded || !csvSeeds.data) return false;
        return csvSeeds.data[0].hasOwnProperty(column.name);
    };

    getRandomColumnSeed = (column) => {
        const { csvSeeds } = this;
        const randomIndex = Math.floor(Math.random() * csvSeeds.data.length);
        return csvSeeds.data[randomIndex][column.name];
    };
}