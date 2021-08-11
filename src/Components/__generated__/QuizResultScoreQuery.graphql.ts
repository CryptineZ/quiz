/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";

export type QuizResultScoreQueryVariables = {};
export type QuizResultScoreQueryResponse = {
    readonly scores: ReadonlyArray<{
        readonly id: string;
        readonly name: string | null;
        readonly score: number | null;
    } | null> | null;
};
export type QuizResultScoreQuery = {
    readonly response: QuizResultScoreQueryResponse;
    readonly variables: QuizResultScoreQueryVariables;
};



/*
query QuizResultScoreQuery {
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
    "name": "QuizResultScoreQuery",
    "selections": (v0/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "QuizResultScoreQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "75b3f17303b383d8bcc7de02c7c67227",
    "id": null,
    "metadata": {},
    "name": "QuizResultScoreQuery",
    "operationKind": "query",
    "text": "query QuizResultScoreQuery {\n  scores {\n    id\n    name\n    score\n  }\n}\n"
  }
};
})();
(node as any).hash = '7fc6ed4429a8a73f5c4b0f70d71b9bf2';
export default node;
