/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type AppCreateScoreMutationVariables = {|
  name: string,
  score: number,
|};
export type AppCreateScoreMutationResponse = {|
  +createScore: {|
    +name: ?string,
    +score: ?number,
  |}
|};
export type AppCreateScoreMutation = {|
  variables: AppCreateScoreMutationVariables,
  response: AppCreateScoreMutationResponse,
|};
*/


/*
mutation AppCreateScoreMutation(
  $name: String!
  $score: Int!
) {
  createScore(name: $name, score: $score) {
    name
    score
    id
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
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
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "score",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "AppCreateScoreMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Score",
        "kind": "LinkedField",
        "name": "createScore",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "AppCreateScoreMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Score",
        "kind": "LinkedField",
        "name": "createScore",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
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
    "cacheID": "bde664fa48e075c8bafb8e321f72b566",
    "id": null,
    "metadata": {},
    "name": "AppCreateScoreMutation",
    "operationKind": "mutation",
    "text": "mutation AppCreateScoreMutation(\n  $name: String!\n  $score: Int!\n) {\n  createScore(name: $name, score: $score) {\n    name\n    score\n    id\n  }\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '858048ada7128347f2c620c464e2ecea';

module.exports = node;
