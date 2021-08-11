/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";

export type AppCreateScoreMutationVariables = {
    name: string;
    score: number;
};
export type AppCreateScoreMutationResponse = {
    readonly createScore: {
        readonly id: string;
        readonly name: string | null;
        readonly score: number | null;
    };
};
export type AppCreateScoreMutation = {
    readonly response: AppCreateScoreMutationResponse;
    readonly variables: AppCreateScoreMutationVariables;
};



/*
mutation AppCreateScoreMutation(
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
    "name": "AppCreateScoreMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "AppCreateScoreMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "68e340367e763262114b81d7210ab646",
    "id": null,
    "metadata": {},
    "name": "AppCreateScoreMutation",
    "operationKind": "mutation",
    "text": "mutation AppCreateScoreMutation(\n  $name: String!\n  $score: Int!\n) {\n  createScore(name: $name, score: $score) {\n    id\n    name\n    score\n  }\n}\n"
  }
};
})();
(node as any).hash = 'd48dd8fce598c7b9598fe87826575d79';
export default node;
