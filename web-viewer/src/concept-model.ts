import type {BD} from './json-document';

export type ConceptSource={documentId:string;revision:string;targetType:string;targetId:string;section:string};
export type ConceptSampleCell={columnId:string;value:string|number;linkId?:string};
export type ConceptSample={id:string;name:string;when:string;meaning:string;note?:string;blocks:{card:string;columns:{id:string;name:string;informationId:string}[];rows:{id:string;cells:ConceptSampleCell[]}[];empty?:string}[]};
export type ConceptCapability={id:string;title:string;description:string;meta:unknown;samples:ConceptSample[]};
export type SubsystemViews={nodes:{id:string;conceptId:string;subsystemId:string;name:string;description:string;sources:string[];fields:{name:string;informationId:string}[]}[];edges:{id:string;fromViewId:string;toViewId:string;relationIds:string[];fromLabel:string;toLabel:string;kind:'down'|'reference'}[];handoffIds:string[]};
export type ConceptGroup={id:string;subsystemId:string;title:string;description:string;reviewer:{roleId:string};relatedActivityIds:string[];
 graph:{conceptIds:string[];nodes:{conceptId:string;name:string;description:string;fields:string[];sources:string[];sourceActivityIds:string[]}[];
  edges:{id:string;fromConceptId:string;toConceptId:string;relationIds:string[];scope:string;fromLabel:string;toLabel:string;kind:'down'|'reference'}[];
  subsystemViews?:SubsystemViews};
 structureStatements:{id:string;title:string;description:string;sampleIds:string[];sourceRefs:ConceptSource[]}[];
 capabilities:ConceptCapability[];limitations:{id:string;title:string;description:string;reason:string;meta:unknown}[];meta:{questions:string[];hypotheses?:unknown}};
export type ConceptModel={id:string;kind:'conceptModel';schemaVersion:'0.1';revision:string;basedOn:{documentId:string;revision:string;verification:'unverified'};
 relatedStates:{documentId:string;revision:string;verification:'unverified'}[];
 subsystems:{id:string;name:string;purpose:string;information:string[];reason:string;activityIds:string[];reviewState:string}[];
 concepts:{id:string;name:string;subsystemId:string;information:{id:string;name:string;responsibilityStatus?:string;responsibleSubsystemId?:string}[];reason:string;description:string;businessObjectIds:string[];activityLinks:{activityId:string;uses:string[]}[];sourceRefs:ConceptSource[];reviewState:string}[];
 relations:{id:string;fromConceptId:string;toConceptId:string;fromPerTarget:string;toPerSource:string;condition:string;reviewState:string;sourceRefs:ConceptSource[];fromLabel:string;toLabel:string;kind:'down'|'reference'}[];
 handoffs:{id:string;fromSubsystemId:string;toSubsystemId:string;information:string;description:string;activityIds:string[];flowDirection:'forward'|'return';reviewState:string}[];
 reviewGroups:ConceptGroup[];benefits:string[];considerations:string[];reviewPoints:string[];meta:unknown;
 presentation:{landscapeRelationships:{from:string;to:string}[];reviewBoundaries:{from:string;to:string;label:string;promise:string}[];subsystemViews?:SubsystemViews;sampleCaption?:string;activityViews?:unknown;creatorActivityIds?:unknown}};

export type ConceptContext={model:ConceptModel;business:BD};
