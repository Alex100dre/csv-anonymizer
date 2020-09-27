import { action } from 'easy-peasy';

const csvSourceModel = {
    // Properties
    loaded: false,
    fileInfo: null,
    data: [],

    // Actions
    setCsvSource: action((state, { fileInfo, data }) => {
        state.loaded = true;
        state.fileInfo = fileInfo;
        state.data = data;
    })
};

export default csvSourceModel;