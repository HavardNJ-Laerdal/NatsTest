import { Autocomplete, Stack, TextField } from '@mui/material';
import { StringCodec } from 'nats.ws';
import PropTypes from 'prop-types';
import { useState } from 'react';

export function NatsPublish(props) {
  const [subscriptions, setSubscriptions] = useState(['com.laerdal.simulation.vitalstate/v1']);
  const [publishAddress, setPublishAddress] = useState();
  const [pubMsg, setPubMsg] = useState("{\"hello\": \"world\"}");
  const [sc] = useState(StringCodec());

  function sendMsg(payload) {
    console.log(`Publishing to ${publishAddress}: ${payload}`);
    props.nats?.publish(publishAddress, sc.encode(JSON.stringify(payload)));
    if(!subscriptions.includes(publishAddress)) {
        setSubscriptions([...subscriptions, publishAddress]);
    }
  }

  return (
    <Stack spacing={2} sx={{ flexGrow: 1, width: '100vh'}}>
      <Stack direction="row" spacing={2} sx={{ flexGrow: 1, width: '100%'}}>
        <Autocomplete
          value={publishAddress}
          onChange={(event, newValue) => {
                setPublishAddress(newValue);
            }}
          sx={{ flexGrow: 1}}
          filterOptions={(options, params) => {
            const { inputValue } = params;

            const filtered = options.filter((option) => option.includes(inputValue));
            const isExisting = inputValue != '' && options.includes(inputValue);
            if (!isExisting) {
                filtered.push(inputValue);
            }
            return filtered;
            }}
          selectOnFocus
          clearOnBlur
          handleHomeEndKeys
          id="free-solo-with-text-demo"
          options={subscriptions}
          getOptionLabel={(option) => {
            // Value selected with enter, right from the input
            if (typeof option === 'string') {
                return option;
            }
            }}
          renderOption={(props, option) => {
            const { key, ...optionProps } = props;
            return (
              <li key={key} {...optionProps}>
                {option}
              </li>
            );
            }}
          freeSolo
          renderInput={(params) => (
            <TextField {...params} label="Publish" />
          )}
        />
        <button onClick={() => sendMsg(pubMsg)}>Publish</button>
      </Stack>
      <TextField
        id="standard-multiline-flexible"
        label="Message to send"
        variant="outlined"
        sx={{width: '100vh'}}
        multiline
        rows={20}
        value={pubMsg}
        onChange={(event) => {
      setPubMsg(event.target.value);
    }}
  />
    </Stack>
  );
}

NatsPublish.propTypes = {
    nats: PropTypes.object.isRequired,
};   