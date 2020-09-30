import { action, computed } from 'easy-peasy';

const anonymizationModel = {
    // Properties
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

};

export default anonymizationModel;