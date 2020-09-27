import { action } from 'easy-peasy';

const anonymizationModel = {
    // Properties
    data: [],
    parameters: {
        columns: [],
        defaultAnonValue: 'anon',
    },

    // Actions
    setData: action((state, payload) => {
        state.data = payload;
    }),

    setColumns: action((state, payload) => {
        state.parameters.columns = payload;
    }),

    setDefaultAnonValue: action((state, payload) => {
        state.parameters.defaultAnonValue = payload;
    }),

};

export default anonymizationModel;