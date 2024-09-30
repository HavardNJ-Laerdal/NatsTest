import { Autocomplete, Stack, TextField } from '@mui/material';
import { connect } from 'nats.ws';
import PropTypes from 'prop-types';
import { useState } from 'react';

export function NatsConnect(props) {
    const [nats, setNats] = useState();

    const [server, setServer] = useState();
    const [servers, setServers] = useState(["http://localhost:8080"]);

    async function connectToServer() {
        nats?.drain();

        const natsConnection = await connect({
          servers: [server],
        });
        console.log("connected to NATS");
        setNats(natsConnection);
        props.onConnected(natsConnection);
    }  
  
    return (
      <Stack direction="row" spacing={2} sx={{ flexGrow: 1, width: '100%' }}>
        <Autocomplete
          id="subscription combo"
          sx={{ flexGrow: 1 }}
          value={server}
          onChange={(event, newValue) => {
                    setServer(newValue);
                    if(!servers.includes(newValue)) {
                        setServers([...servers, newValue]);
                    }
                } }
          filterOptions={(options, params) => {
                    const { inputValue } = params;

                    const filtered = options.filter((option) => option.includes(inputValue));
                    const isExisting = inputValue != '' && options.includes(inputValue);
                    if (!isExisting) {
                        filtered.push(inputValue);
                    }
                    return filtered;
                } }
          selectOnFocus
          clearOnBlur
          handleHomeEndKeys
          options={servers}
          getOptionLabel={(option) => {
                    // Value selected with enter, right from the input
                    if (typeof option === 'string') {
                        return option;
                    }
                } }
          renderOption={(props, option) => {
                    const { key, ...optionProps } = props;
                    return (
                      <li key={key} {...optionProps}>
                        {option}
                      </li>
                    );
                } }
          freeSolo
          renderInput={(params) => (
            <TextField {...params} label="Server" />
                )} />
        <button onClick={() => connectToServer()}>Connect</button>
      </Stack>
    );
}

NatsConnect.propTypes = {
    onConnected: PropTypes.func.isRequired,
};