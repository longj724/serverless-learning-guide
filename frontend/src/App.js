import { Button, Flex, Heading, Input } from '@chakra-ui/react';
import axios from 'axios';
import { useState } from 'react';

const PRODUCTION_URL =
  'https://us-central1-cloud-function-tutorial-58f26.cloudfunctions.net/url/';

function App() {
  const [shortenedURL, setShortenedURL] = useState('');
  const [originalUrl, setOriginalUrl] = useState('');

  const submitForm = async () => {
    const res = await axios.post(
      'https://us-central1-cloud-function-tutorial-58f26.cloudfunctions.net/url',
      {
        originalUrl: originalUrl,
      },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    setShortenedURL(res.data);
  };
  return (
    <Flex width="100vw" height="100vh">
      <Flex
        direction="column"
        justifyContent="center"
        width="inherit"
        alignItems="center"
        gap="20px"
      >
        <Heading>Enter the URL you want to convert</Heading>
        <Input
          placeholder="URL"
          onChange={(e) => setOriginalUrl(e.target.value)}
          width="50%"
        />
        <Button mt="10px" onClick={submitForm} width="">
          Convert URL
        </Button>
        <Heading size="md">
          Converted URL:
          {shortenedURL !== '' ? PRODUCTION_URL + shortenedURL : ''}
        </Heading>
      </Flex>
    </Flex>
  );
}

export default App;
