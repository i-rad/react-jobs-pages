import React, { useEffect, useState, useCallback } from 'react';
import logo from './logo.svg';
import './App.css';
import moment from 'moment'
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';

function App() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  // Since only the original 10 jobs need to be filtered this variable stores the initial fetch
  // otherwise new jobs would be fetched every time and there would be no need for this variable
  // initial jobs list which will change state on button clicks
  const [itemsList, setItemsList] = useState([]);

  const useStyles = makeStyles((theme) => ({
    root: {
      padding: '10px',
    },
    fullHeightCard: {
      height: "100%",
    },
    button: {
      margin: "0px 5px 10px 0px",
    },
  }));

  // Because of the empty array []
  // this useEffect will run once
  useEffect(() => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          { "companySkills": true,
            "dismissedListingHashes": [],
            "fetchJobDesc": true,
            "jobTitle": "Business Analyst",
            "locations": [],
            "numJobs": 20,
            "previousListingHashes": [] })
    };
    fetch("https://www.zippia.com/api/jobs/", requestOptions)
      .then(res => res.json())
      .then(
        (result) => {
          const jobsArray = result.jobs.slice(0, 10)
          setIsLoaded(true);
          setItems(jobsArray);
          setItemsList(jobsArray);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
  }, [])
  // function for changing the state of items according to search terms
  const handleSearchByCompanyNameClick = useCallback(() => {
        var words = search.split(" ");
        const list = itemsList.filter(item => words.some(word => item.companyName.includes(word)));
        setItems(list);
  });

  // function for changing the state of items according to date
  const handleLast7DaysClick = useCallback(() => {
        const list = itemsList.filter(item => moment(item.OBJpostingDate, 'YYYY-MM-DDTHH:mm:ss.SSSZ').isAfter(moment().add(-7, 'days')));
        setItems(list);
  });

  // reset to inital items list (10)
  const handleResetFiltersClick = useCallback(() => {
        setSearch("");
        setItems(itemsList);
  });

  const classes = useStyles();

  // checking for errors, if there are none check if fetch finished otherwise return loader
  if (error) {
   return <div>Error: {error.message}</div>;
 } else if (!isLoaded) {
   return (
          <Grid
              container
              spacing={0}
              direction="column"
              alignItems="center"
              justify="center"
              style={{ minHeight: '100vh' }}
            >

              <Grid item xs={3}>
                <CircularProgress />
              </Grid>

          </Grid>
  );
 } else {
    return (
      <div className={classes.root}>
        <Grid container spacing={3}>
              <Grid item xs={12} sm={4} align="center">
                <Button className={classes.button} variant="contained" color="primary" onClick={handleSearchByCompanyNameClick}>
                  Search by company name
                </Button>
                <br />
                <TextField value={search} className={classes.button} id="outlined-basic" label="Company Name" variant="outlined" onChange={e => setSearch(e.target.value)} />
              </Grid>
              <Grid item xs={12} sm={4} align="center">
                <Button className={classes.button} variant="contained" color="primary" onClick={handleLast7DaysClick}>
                  Show from last 7 days
                </Button>
              </Grid>
              <Grid item xs={12} sm={4} align="center">
                <Button className={classes.button} variant="contained" color="primary" onClick={handleResetFiltersClick}>
                  Reset filters
                </Button>
              </Grid>
          </Grid>
          <br />
          <Grid container direction="column" wrap="nowrap" spacing={2}>
              {items.map(item =>
                <Grid item xs>
                    <Card className={classes.fullHeightCard}>
                      <CardActionArea>
                        <CardContent>
                          <Typography gutterBottom variant="h5" component="h2">
                            {item.jobTitle}
                          </Typography>
                          <Typography variant="body2" color="textSecondary" component="p">
                            {item.companyName}
                          </Typography>
                          <Typography variant="body2" component="p">
                            {item.shortDesc}
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                </Grid>
              )}
          </Grid>
        </div>
      );
  }
}

export default App;
