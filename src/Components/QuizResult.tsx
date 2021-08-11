import React, {useState, useCallback} from 'react';
import graphql from 'babel-plugin-relay/macro';
import RelayEnvironment from '../RelayEnvironment';
import {Center, Button, Text, Box, HStack, Input, Accordion, AccordionItem, AccordionButton, AccordionIcon, AccordionPanel} from '@chakra-ui/react';
import {useLazyLoadQuery, commitMutation, FetchPolicy} from 'react-relay/hooks';
import useSessionStorage from '../Helper/useSessionStorage';

import {QuizResultScoreQuery} from './__generated__/QuizResultScoreQuery.graphql';
import {QuizResultCreateScoreMutation} from './__generated__/QuizResultCreateScoreMutation.graphql';

type QuizResultProps = {
  resetQuiz: () => void,
  countCorrectAnswers: number,
  countQuestions: number,
  questionOverview: any,
}

// Quiz Result Screen
const QuizResult = (props: QuizResultProps) => {
  const [scoreBoardInput, setScoreBoardInputs] = useSessionStorage('scoreBoardInput', ''); // User input for scoreboard
  const [scoreBoardSend, setScoreBoardSend] = useSessionStorage('scoreBoardSend', false); // Defines if the user already submitted to the scoreboard
  const [scoardBaordUserId, setScoreBoardUserId] = useSessionStorage('scoardBaordUserId', null); // Saves the id of the users scoreboard entry
  const [queryFetchKey, setQueryFetchKey] = useState(0);
  const [queryPolicy, setQueryPolicy] = useState<FetchPolicy>('store-and-network');

  const refreshScoreboard = useCallback(() => {
    setQueryFetchKey((prev) => (prev+1));
    setQueryPolicy('network-only');
  }, []);

  function ScoreBoardList() {
    const data = useLazyLoadQuery<QuizResultScoreQuery>(
        graphql`
        query QuizResultScoreQuery{
          scores{
            id
            name
            score
          }
        }
      `,
        {},
        {fetchPolicy: queryPolicy, fetchKey: queryFetchKey},
    );

    // Check if there are any scores yet
    if (!data || !data.scores || !data.scores.length) {
      return (
        <Text mb={2}>Noch keine Resultate</Text>
      );
    }

    const scores = data.scores.slice();

    // Sort scores
    scores.sort(function(a, b) {
      if (!a || !a.score || !b || !b.score) {
        return 0;
      }
      return b.score - a.score;
    });

    // Map the data to display scoreboard
    const scoreboardList = scores.map((score, i) => {
      if (score) {
        if (scoardBaordUserId === score.id) {
          return (
            <Text mb={2} key={i}>
              <strong>{score.name}: {score.score}</strong>
            </Text>
          );
        } else {
          return (
            <Text mb={2} key={i}>
              {score.name}: {score.score}
            </Text>
          );
        }
      } else {
        return '';
      }
    });

    return (
      <Center mb={2} flexDirection="column">
        {scoreboardList}
      </Center>
    );
  }

  function renderScoreBoardInput() {
    if (scoreBoardSend) {
      return (
        <Box>
          {scoreBoardInput} eingetragen.
        </Box>
      );
    } else {
      return (
        <HStack spacing="24px" mt={3}>
          <Input placeholder="Dein Name" w="200px" value={scoreBoardInput} onChange={(e) => setScoreBoardInputs(e.target.value)}/>
          <Button onClick={() => addToScoreBoard()}>Eintragen</Button>
        </HStack>
      );
    }
  }

  // Add User to Scoreboard
  function addToScoreBoard() {
    const score = props.countCorrectAnswers;

    const mutation = graphql`
      mutation QuizResultCreateScoreMutation($name: String!, $score: Int!){
        createScore(name: $name, score: $score) {
          id
          name
          score
        }
      }
    `;

    const variables = {
      name: scoreBoardInput,
      score: score,
    };

    commitMutation<QuizResultCreateScoreMutation>(
        RelayEnvironment,
        {
          mutation,
          variables,
          onCompleted: (response) => {
            setScoreBoardSend(true);
            refreshScoreboard();
            setScoreBoardUserId(response.createScore.id);
          },
          onError: (err) => console.error(err),
        },
    );
  }

  const resetQuiz = () => {
    props.resetQuiz();
    setScoreBoardInputs('');
    setScoreBoardSend(false);
    setScoreBoardUserId(null);
  };

  return (
    <Center mt={10} mb={10} flexDirection="column">
      <Text fontSize="2xl" mb={10}>Das Quiz ist abgeschlossen.</Text>
      {/* Display how many questions has been answered correctly and the total number of questions*/}
      <Text mb={10}>Du hast {props.countCorrectAnswers} von {props.countQuestions} Fragen richtig beantwortet.</Text>
      {/* Display an overview of all the questions answered in an accordion*/}
      <Accordion mb={10} allowMultiple>
        <AccordionItem>
          <AccordionButton>
            <Box flex="1" textAlign="left">
                Deine Antworten
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}>
            {props.questionOverview}
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
      {/* Display scoreboard*/}
      <Text mb={2} fontSize="xl">Bestenliste</Text>
      <Center mb={10} flexDirection="column">
        <React.Suspense fallback="Lade Bestenliste...">
          <ScoreBoardList/>
        </React.Suspense>
        {renderScoreBoardInput()}
      </Center>
      {/* Display a button to reset the quiz to start over*/}
      <Button mb={10} onClick={() => resetQuiz()}>Quiz neu starten</Button>
    </Center>
  );
};

export default QuizResult;
