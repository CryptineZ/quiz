/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type AppQuestionQueryVariables = {||};
export type AppQuestionQueryResponse = {|
  +questions: ?$ReadOnlyArray<?{|
    +question: ?string,
    +answer: ?boolean,
    +trivia: ?string,
  |}>
|};
export type AppQuestionQuery = {|
  variables: AppQuestionQueryVariables,
  response: AppQuestionQueryResponse,
|};
*/


/*
query AppQuestionQuery {
  questions {
    question
    answer
    trivia
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "Question",
    "kind": "LinkedField",
    "name": "questions",
    "plural": true,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "question",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "answer",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "trivia",
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
    "name": "AppQuestionQuery",
    "selections": (v0/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "AppQuestionQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "14fb9307c6010c7998bc254cef9e39fb",
    "id": null,
    "metadata": {},
    "name": "AppQuestionQuery",
    "operationKind": "query",
    "text": "query AppQuestionQuery {\n  questions {\n    question\n    answer\n    trivia\n  }\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'c2cf9d9f22ac645615cddab2a216c9c8';

module.exports = node;
