import * as React from 'react';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Grid,
  makeStyles,
  Typography,
  withStyles,
} from '@material-ui/core';
import { Link, Link as RouterLink } from 'react-router-dom';
import ReactMarkdown from 'markdown-to-jsx';
import { routes } from '../*/*.tsx';
import { PlainCommand } from './SystemInformation';

export const title = 'Home';
export const route = '/';
export const position = 1;

const useStyles = makeStyles(theme => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    padding: theme.spacing(12, 0, 6),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    padding: theme.spacing(1),
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardContent: {
    flexGrow: 1,
  },
  cardTitle: {
    paddingBottom: theme.spacing(2),
  },
  cardActions: {
    justifyContent: 'space-around',
    paddingTop: -theme.spacing(2),
    paddingBottom: theme.spacing(4),
  },
}));

export function Component(props) {
  const classes = useStyles();

  return (
    <div>
      <div className={classes.heroContent}>
        <Container maxWidth="sm">
          <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
            AXIOM <br />
            WebUI
          </Typography>
          <Typography variant="h5" align="center" color="textSecondary" paragraph>
            Control and experiment with your AXIOM camera with fun & ease.
          </Typography>
        </Container>
      </div>

      <Container className={classes.cardGrid} maxWidth="md">
        <Grid container spacing={4}>
          <HomeCard title={'Connect via SSH'} raw>
            <Typography>Connect to the camera via ssh to get a normal linux shell.</Typography>
            <pre>
              $ ssh operator@
              <PlainCommand
                command={`ip -4 addr show wlan0 | grep -oP '(?<=inet\\s)\\d+(\\.\\d+){3}'  `}
                interval={10000}
              />
            </pre>
            or
            <pre>
              $ ssh operator@
              <PlainCommand
                command={`ip -4 addr show eth0 | grep -oP '(?<=inet\\s)\\d+(\\.\\d+){3}'  `}
                interval={10000}
              />
            </pre>
            <Typography>
              The <b>password</b> is <i>axiom</i>.
            </Typography>
          </HomeCard>

          {Object.values(routes)
            .filter(({ explanation }) => explanation)
            .map(({ explanation, route, title }) => (
              <HomeCard key={route} title={title} route={route}>
                {explanation}
              </HomeCard>
            ))}
        </Grid>
      </Container>
    </div>
  );
}

function HomeCard({ title, route, children, raw }) {
  const classes = useStyles();

  const link = React.forwardRef((props, ref) => (
    <RouterLink innerRef={ref} to={route} {...props} />
  ));

  const actions = route ? (
    <CardActions className={classes.cardActions}>
      <Button size="small" color="primary" variant="outlined" component={link}>
        open {title}
      </Button>
    </CardActions>
  ) : (
    <></>
  );

  const reactMarkdownOptions = {
    overrides: {
      h1: {
        component: Typography,
        props: {
          gutterBottom: true,
          variant: 'h5',
        },
      },
      h2: { component: Typography, props: { gutterBottom: true, variant: 'h6' } },
      h3: { component: Typography, props: { gutterBottom: true, variant: 'subtitle1' } },
      h4: {
        component: Typography,
        props: { gutterBottom: true, variant: 'caption', paragraph: true },
      },
      p: { component: Typography, props: { paragraph: true } },
      a: { component: Link },
      li: {
        component: withStyles(theme => ({
          listItem: {
            marginTop: theme.spacing(1),
          },
        }))(({ classes, ...props }) => (
          <li className={classes.listItem}>
            <Typography component="span" {...props} />
          </li>
        )),
      },
      code: {
        component: CodeComponent,
      },
    },
  };

  return (
    <Grid item xs={12} sm={8} md={6}>
      <Card className={classes.card}>
        <CardContent className={classes.cardContent}>
          <Typography gutterBottom variant="h5" component="h2" className={classes.cardTitle}>
            {title}
          </Typography>
          {raw ? (
            children
          ) : (
            <ReactMarkdown options={reactMarkdownOptions}>{children}</ReactMarkdown>
          )}
        </CardContent>
        {actions}
      </Card>
    </Grid>
  );
}

function CodeComponent({ children }) {
  return <pre>{children}</pre>;
}
