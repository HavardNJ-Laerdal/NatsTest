import { Autocomplete, Stack, TextField } from '@mui/material';
import { SimpleTreeView }  from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem2 as TreeItem } from '@mui/x-tree-view/TreeItem2';
import { StringCodec } from 'nats.ws';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

export function NatsSubscribe(props) {
    const [sub, setSub] = useState();

    const [sc] = useState(StringCodec());

    const [messages, setMessages] = useState(["{ \"hello\": {\"world\": \"test\"} }"]);

    const [subscriptionAddress, setSubscriptionAddress] = useState();
    const [subscriptions, setSubscriptions] = useState(['com.laerdal.simulation.vitalstate/v1']);

    useEffect(() => {
        (async () => {
          if(sub){
            for await (const msg of sub) {
              const decodedMsg = JSON.parse(sc.decode(msg.data));
              console.log("Received message:", decodedMsg);
              // Update the state with the new message
              setMessages((prevMessages) => [decodedMsg, ...prevMessages, ]);
            }
          }
        })();
      }, [sub]);

    function subscribe(subscription) {
        sub?.unsubscribe();
        if(subscription?.length) {
            console.log(`Subscribing to ${subscription}`);
            const s = props.nats?.subscribe(subscription);
            setSub(s);
            if(!subscriptions.includes(subscription)) {
                setSubscriptions([...subscriptions, subscription]);
            }
        }
    }

    const renderTree = (id, item) => {
        console.log("rendering tree", id, item);
        const label = typeof item !== 'object' ? `${id}: ${item}` : id;
        return (
          <TreeItem key={id} itemId={id} label={label}>
            {(typeof item === 'object') ? Object.keys(item).map((key) => {
            return renderTree(key, item[key]);
            }) : null}
          </TreeItem>
        );
    };
    
    return (
      <>
        <Stack direction="row" spacing={2} sx={{ flexGrow: 1, width: '100%' }}>
          <Autocomplete
            id="subscription combo"
            sx={{ flexGrow: 1 }}
            value={subscriptionAddress}
            onChange={(event, newValue) => {
                    setSubscriptionAddress(newValue);
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
            options={subscriptions}
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
              <TextField {...params} label="Subscripton" />
                )} />
          <button onClick={() => subscribe(subscriptionAddress)}>Subscribe</button>
        </Stack>
        <Stack direction="row" spacing={2} sx={{ flexGrow: 1, width: '100%' }}>
          <SimpleTreeView sx={{
                minHeight: 200, flexGrow: 1, border: '2px solid', // Defines the border
                borderColor: 'primary.main', // Custom color for the border (can also be a hex or named color)
                borderRadius: '8px', // Rounded corners
                padding: '16px', // Optional: adds padding inside the border
                boxShadow: 3, // Adds a shadow for a more elevated look
                width: 300, // Optional: sets a specific width for the box
                '.MuiTreeItem-label': {
                    textAlign: 'left', // Globally aligns all TreeItem labels to the left
                    paddingLeft: '8px', // Optional: controls padding for all TreeItems
                },
            }}>
            {renderTree("root", JSON.parse(messages[0]) || {})}
          </SimpleTreeView>
          <TextField
            id="standard-multiline-flexible"
            label="Received Message"
            variant="outlined"
            sx={{ minHeight: 200, flexGrow: 1 }}
            multiline
            rows={20}
            value={messages[0] && JSON.stringify(JSON.parse(messages[0]), null, 2)}
            slotProps={{
                        input: {
                            readOnly: true,
                        },
                    }} />
        </Stack>
      </>
    );
}

NatsSubscribe.propTypes = {
    nats: PropTypes.object.isRequired,
};   