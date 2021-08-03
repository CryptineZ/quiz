/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type AppScoreQueryVariables = {||};
export type AppScoreQueryResponse = {|
  +scores: ?$ReadOnlyArray<?{|
    +name: ?string,
    +score: ?number,
  |}>
|};
export type AppScoreQuery = {|
  variables: AppScoreQueryVariables,
  response: AppScoreQueryResponse,
|};
*/


/*
query AppScoreQuery {
  scores {
    name
    score
    id
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "score",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "AppScoreQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Score",
        "kind": "LinkedField",
        "name": "scores",
        "plural": true,
        "selections": [
          (v0/*: any*/),
          (v1/*: any*/)
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
    "name": "AppScoreQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Score",
        "kind": "LinkedField",
        "name": "scores",
        "plural": true,
        "selections": [
          (v0/*: any*/),
          (v1/*: any*/),
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
    "cacheID": "c623c66540c0368eda185c1df022c004",
    "id": null,
    "metadata": {},
    "name": "AppScoreQuery",
    "operationKind": "query",
    "text": "query AppScoreQuery {\n  scores {\n    name\n    score\n    id\n  }\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'beab6ccc6c8eb928ecad37cdd433f9a0';

module.exports = node;
