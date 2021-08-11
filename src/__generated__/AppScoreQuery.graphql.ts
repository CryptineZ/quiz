/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";

export type AppScoreQueryVariables = {};
export type AppScoreQueryResponse = {
    readonly scores: ReadonlyArray<{
        readonly id: string;
        readonly name: string | null;
        readonly score: number | null;
    } | null> | null;
};
export type AppScoreQuery = {
    readonly response: AppScoreQueryResponse;
    readonly variables: AppScoreQueryVariables;
};



/*
query AppScoreQuery {
  scores {
    id
    name
    score
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "Score",
    "kind": "LinkedField",
    "name": "scores",
    "plural": true,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "id",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "name",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "score",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "AppScoreQuery",
    "selections": (v0/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "AppScoreQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "2603367ac1f386d1e758db7d1bdb5eeb",
    "id": null,
    "metadata": {},
    "name": "AppScoreQuery",
    "operationKind": "query",
    "text": "query AppScoreQuery {\n  scores {\n    id\n    name\n    score\n  }\n}\n"
  }
};
})();
(node as any).hash = '15a303b5b26b8dd92118f90b66866064';
export default node;
