/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type AppQuestionQueryVariables = {};
export type AppQuestionQueryResponse = {
    readonly questions: ReadonlyArray<{
        readonly question: string | null;
        readonly answer: boolean | null;
        readonly trivia: string | null;
    } | null> | null;
};
export type AppQuestionQuery = {
    readonly response: AppQuestionQueryResponse;
    readonly variables: AppQuestionQueryVariables;
};



/*
query AppQuestionQuery {
  questions {
    question
    answer
    trivia
    id
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "question",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "answer",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "trivia",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "AppQuestionQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Question",
        "kind": "LinkedField",
        "name": "questions",
        "plural": true,
        "selections": [
          (v0/*: any*/),
          (v1/*: any*/),
          (v2/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "AppQuestionQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Question",
        "kind": "LinkedField",
        "name": "questions",
        "plural": true,
        "selections": [
          (v0/*: any*/),
          (v1/*: any*/),
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "id",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "fd7eee7d16cc8c0184140acf2cf2c65a",
    "id": null,
    "metadata": {},
    "name": "AppQuestionQuery",
    "operationKind": "query",
    "text": "query AppQuestionQuery {\n  questions {\n    question\n    answer\n    trivia\n    id\n  }\n}\n"
  }
};
})();
(node as any).hash = 'c2cf9d9f22ac645615cddab2a216c9c8';
export default node;
