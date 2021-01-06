import React, { useState, useEffect, useCallback } from 'react';
import { JsonRpc } from 'eosjs';
import {
  Container,
  Box,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  LinearProgress,
} from '@material-ui/core';
import RefreshIcon from '@material-ui/icons/Refresh';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  summary: {
    display: 'block',
  },
  detail: {
    overflowWrap: 'anywhere',
    whiteSpace: 'pre-wrap',
  }
}));

const rpc = new JsonRpc('https://eos.greymass.com');

function App() {
  const classes = useStyles();
  const [blocks, setBlocks] = useState([]);
  const [error, setError] = useState('Failed to load blocks data.');
  const [loading, setLoading] = useState(false);
  const [loadTick, setLoadTick] = useState(0);

  const loadData = useCallback(() => {
    (async () => { 
      try {
        setLoading(true);
        setError(null);

        // load chain info first.
        const { head_block_num } = await rpc.get_info();

        // load latest 10 blocks.
        const blockRequests = [...Array(10).keys()].map((i) => rpc.get_block(head_block_num - i));
        const data = await Promise.all(blockRequests);
        setBlocks(data)
      } catch (ex) {
        console.log('failed to load data.', ex);
        setError('Failed to load blocks data.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    loadData();
  }, [loadTick, loadData]);

  return (
    <Container className={classes.root}>
      <Box mb={2}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5">EOS Blocks List</Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<RefreshIcon />}
            onClick={() => setLoadTick(t => t + 1)}
          >
            Load
          </Button>
        </Box>
        {loading && <LinearProgress color="secondary" />}
      </Box>

      {blocks.map((block) => (
        <Accordion key={block.id}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} classes={{ content: classes.summary }}>
            <Typography>
              Hash:{' '}
              <Typography color="secondary" component="span">{block.id}</Typography>
            </Typography>
            <Typography>
              Date/Time:{' '}
              <Typography color="secondary" component="span">{block.timestamp}</Typography>
            </Typography>
            <Typography>
              Transaction Count:{' '}
              <Typography color="secondary" component="span">{block.transactions?.length || 0}</Typography>
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <pre className={classes.detail}>{JSON.stringify(block)}</pre>
          </AccordionDetails>
        </Accordion>
      ))}

      {error && <Typography variant="h6" color="error">{error}</Typography>}
    </Container>
  );
}

export default App;
