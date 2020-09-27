import { action } from 'easy-peasy';

const csvSeedsModel = {
    // Properties
    loaded: false,
    fileInfo: null,
    data: [],

    // Actions
    setCsvSeeds: action((state, { fileInfo, data }) => {
        state.loaded = true;
        state.fileInfo = fileInfo;
        state.data = data;
    })
};

export default csvSeedsModel;