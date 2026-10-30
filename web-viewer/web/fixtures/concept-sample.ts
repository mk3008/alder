// Test data only. Production reads the model from the opened document.
import pkg from '../../../work/concept-review/issue-133/versions/purchase-v3-beta.json' with {type:'json'};
import type {BD} from '../../src/json-document';
import type {ConceptContext,ConceptModel} from '../../src/concept-model';
import {createConceptViews} from '../../src/concept-views.ts';
import {createDataExamples} from '../../src/data-examples.ts';

export const business=pkg.documents.find(item=>item.kind==='businessDesign') as unknown as BD;
export const model=pkg.documents.find(item=>item.kind==='conceptModel') as unknown as ConceptModel;
export const context:ConceptContext={business,model};
const views=createConceptViews(context),samples=createDataExamples(context);
export const {tables,edges}=views;
export const reviewGroups=views.groups,reviewGraph=views.graph,reviewBoundaries=model.presentation.reviewBoundaries;
export const findReviewGroup=views.findGroup;
export const {dataExamples,findDataExample,renderDataExample,reviewContents,contentFor,examplesFor,capabilityFor}=samples;
export const sampleIndex=samples;
