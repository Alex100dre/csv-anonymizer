import { createStore } from 'easy-peasy';
import anonymizationModel from "./models/anonimization";
import csvSeedsModel from "./models/csvSeeds";
import csvSourceModel from "./models/csvSource";

const storeModel = {
    anonymization: anonymizationModel,
    csvSeeds: csvSeedsModel,
    csvSource: csvSourceModel,
};

export default createStore(storeModel);