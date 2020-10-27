import {action, computed, thunk} from 'easy-peasy';
import Anonymizer from "../../helpers/anonymization";

const anonymizationModel = {
    // Properties
    processing: false,
    processed: false,
    data: [],
    parameters: {
        columns: [],
        selectedColumns: computed(state => state.columns.filter((column) => column.selected)),
        defaultAnonValue: 'anon',
    },

    // Actions
    setData: action((state, payload) => {
        state.data = payload;
    }),

    setColumns: action((state, payload) => {
        state.parameters.columns = payload;
    }),

    updateColumn: action((state, payload) => {
        const columnIndex = state.parameters.columns.findIndex( column => column.id === payload.id);
        state.parameters.columns[columnIndex] = {...payload};
    }),

    setDefaultAnonValue: action((state, payload) => {
        state.parameters.defaultAnonValue = payload;
    }),

    setProcessing: action((state, payload) => {
        state.processing = payload;
    }),

    setProcessed: action((state, payload) => {
        state.processed = payload;
    }),

    anonymize: thunk(async (actions, payload, {getState, getStoreState}) => {
        actions.setProcessed(false);
        actions.setProcessing(true);
        const anonParams = getState().parameters;
        const { csvSource, csvSeeds} = getStoreState()
        const anonymizer = new Anonymizer(csvSource, anonParams, csvSeeds);
        const anonymized = anonymizer.anonymize();
        actions.setData(anonymized);
        actions.setProcessing(false);
        actions.setProcessed(true);
    })
};

export default anonymizationModel;