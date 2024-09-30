import './App.css';

import { Stack } from '@mui/material';
import { React, useState } from 'react';

import { NatsConnect } from '../Components/NatsConnect';
import { NatsPublish } from '../Components/NatsPublish';
import { NatsSubscribe } from '../Components/NatsSubscribe';

function App() {
  const [nats, setNats] = useState();

  return (
    <Stack  spacing={2} sx={{ flexGrow: 1, width: '100vh'}}>
      <NatsConnect onConnected={setNats} />
      <NatsSubscribe nats={nats} />
      <NatsPublish nats={nats} />
    </Stack>
  );
}

export default App;
