/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";

export type QuizResultCreateScoreMutationVariables = {
    name: string;
    score: number;
};
export type QuizResultCreateScoreMutationResponse = {
    readonly createScore: {
        readonly id: string;
        readonly name: string | null;
        readonly score: number | null;
    };
};
export type QuizResultCreateScoreMutation = {
    readonly response: QuizResultCreateScoreMutationResponse;
    readonly variables: QuizResultCreateScoreMutationVariables;
};



/*
mutation QuizResultCreateScoreMutation(
  $name: String!
  $score: Int!
) {
  createScore(name: $name, score: $score) {
    id
    name
    score
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "name"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "score"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "name",
        "variableName": "name"
      },
      {
        "kind": "Variable",
        "name": "score",
        "variableName": "score"
      }
    ],
    "concreteType": "Score",
    "kind": "LinkedField",
    "name": "createScore",
    "plural": false,
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "QuizResultCreateScoreMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "QuizResultCreateScoreMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "826b370ab2d68c8bd1919fb9f617d9e2",
    "id": null,
    "metadata": {},
    "name": "QuizResultCreateScoreMutation",
    "operationKind": "mutation",
    "text": "mutation QuizResultCreateScoreMutation(\n  $name: String!\n  $score: Int!\n) {\n  createScore(name: $name, score: $score) {\n    id\n    name\n    score\n  }\n}\n"
  }
};
})();
(node as any).hash = '5ab786be307e93b88b2fd979d654a368';
export default node;
