import * as React from "react";
import {makeStyles} from "@material-ui/core";
import {ls} from '../exec/ls';
import {useEffect, useState} from "react";
import {exec} from "../exec/exec";

export const text = "Register Explorer";
export const route = "/registers";

const column_width = "300px";
const useStyles = makeStyles(theme => ({
    column_container: {
        display: 'flex',
        height: '100%',
        width: '100%',
        overflowX: 'scroll',
    },
    column: {
        height: '100%',
        width: column_width,
        borderRight: '1px solid lightgray',
        flexShrink: 0,
        padding: 0,
    },
    ul: {
        listStyle: 'none',
        padding: 0,
    },
    li: {
        padding: '5px 10px',
    },
    active: {
        background: 'dodgerblue',
        color: 'white',
    },
    float_right: {
        float: 'right',
        fontStyle: 'italic',
        color: '#555',
    },
}));

const basepath = "./ctrl_mountpoint/";

export function Component(props) {
    const classes = useStyles();

    const [active, setActive] = useState([basepath]);
    const columns = active.map((x, i) =>
        <Column
            key={i}
            path={active.slice(0, i + 1).reduce((a, b) => a + b)}
            setActive={x => setActive([...active.slice(0, i + 1), x])}
            active={active[i + 1]}
        />);

    return (
        <div className={classes.column_container}>
            {columns}
        </div>
    );

}

function Column(props) {
    const {path} = props;
    const classes = useStyles();


    const inline_all = ['channel', 'addr', 'range', 'map'];
    const property = ['functions', 'registers', 'scripts'];

    const [content, setContent] = useState(<></>);
    useEffect(() => {
        ls(path).then(files => {
            if (!path.endsWith("/")) {
                setContent(<DataColumn {...props}/>)
            } else {
                const directories = files.filter(x => x.endsWith('/')).filter(x => inline_all.every(c => c + '/' !== x));
                if (directories.length === 0) {
                    setContent(<ListColumn {...props}/>);
                } else {
                    setContent(<ListColumn {...props}/>);
                }
            }
        });
    }, [path, props]);

    return (
        <div className={classes.column}>
            {content}
        </div>
    )
}

function DataColumn(props) {
    const {path, name} = props;

    return (
        <>
            <h4>{name}</h4>
            path: {path.replace(basepath, '')} <br/>
            value: <Value path={path}/>
        </>
    );
}

function ListColumn(props) {
    const {path} = props;
    const classes = useStyles();

    const [entries, setEntries] = useState([]);
    useEffect(() => {
        ls(path).then(result => setEntries(result));
    }, [path]);

    const files = entries.filter(x => !x.endsWith("/"));
    const directories = entries.filter(x => x.endsWith("/"));

    return (
        <>
            <List title={"values"} children={files} {...props}/>
            <List title={"children"} children={directories} {...props}/>
        </>
    )
}

function List(props) {
    const {children, title, path} = props;
    const classes = useStyles();

    if (children.length === 0) {
        return <></>;
    }

    return (
        <>
            <h5 className={classes.li}>{title}</h5>
            <ul className={classes.ul}>
                {children.map(x => <ListEntry key={x} name={x} right={
                    x.endsWith("/") ? ">" : <Value path={path + x}/>
                } {...props}/>)}
            </ul>
        </>
    )
}

function ListEntry(props) {
    const {name, right, active, setActive} = props;
    const classes = useStyles();

    return (
        <li
            key={name}
            className={(classes.li + (active === name ? " " + classes.active : ""))}
            onClick={() => setActive(name)}
        >
            {name.replace(/\/$/, "")}<span className={classes.float_right}>{right}</span>
        </li>
    )
}

function Value(props) {
    const {path} = props;
    const [value, setValue] = useState("");
    useEffect(() => {
        exec(`cat "${path}"`).then(([stdout, stderr]) => setValue(stdout));
    }, [path]);

    return <>{value}</>;
}