import * as React from "react";
import {useEffect, useMemo, useRef, useState} from "react";
import {makeStyles, Typography} from "@material-ui/core";
import {usePromise} from "../util/usePromise";
import {ctrl} from "../util/ctrl";
import {Value} from "../components/PromiseValue";

export const text = "Register Explorer";
export const route = "/registers";

const column_width = "275px";
const useStyles = makeStyles(theme => ({
    column_container: {
        display: 'flex',
        height: 'calc(100vh - 64px)',
        width: '100%',
        overflowX: 'scroll',
        scrollbarWidth: 'thin',
        scrollbarColor: 'lightgray transparent',
    },
    column: {
        height: '100%',
        overflowY: 'auto',
        scrollbarWidth: 'thin',
        scrollbarColor: 'lightgray transparent',
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
    list: {
        padding: '0 10px',
    },
    active: {
        background: 'dodgerblue',
        color: 'white',
    },
    float_right: {
        fontStyle: 'italic',
        color: '#555',
        float: 'right',
    },
    item: {
        display: 'inline-block',
        width: '100%',
    },
}));

export function Component(props) {
    const classes = useStyles();

    const ref = useRef();
    const scroll_fn = () => {
        if(ref.current !== undefined) {
            // @ts-ignore
            ref.current.scrollLeft = 10e10;
        }
    };

    const [active, setActive] = useState([ctrl]);
    const columns = active.map((x, i) =>
        <Column
            key={i}
            ctrl={x}
            setActive={x => setActive([...active.slice(0, i + 1), x])}
            active={active[i+1]}
            scrollFn={scroll_fn}
        />);

    return (
        <div ref={ref} className={classes.column_container}>
            {columns}
        </div>
    );

}

function Column(props) {
    const {ctrl, scrollFn} = props;
    const classes = useStyles();

    const inline_all = ['channel', 'addr', 'range', 'map'];
    const property = ['functions', 'registers', 'scripts'];

    let entries = usePromise(ctrl.then(Object.keys));
    useEffect(scrollFn, [entries]);

    if (entries === undefined) {
        return <></>
    }

    if (Array.isArray(entries)) {
        return <ListColumn {...props}/>
    } else {
        return <></>;
    }
}

function ListColumn(props) {
    const {ctrl} = props;
    const classes = useStyles();

    const entries = usePromise(ctrl.then(Object.keys));
    if (entries === undefined) {
        return <></>
    }

    const files = entries.filter(x => !x.endsWith("/"));
    const directories = entries.filter(x => x.endsWith("/"));

    return (
        <div className={classes.column}>
            <List children={files} {...props}/>
            <List children={directories} {...props}/>
        </div>
    )
}

function List(props) {
    const {children, title, ctrl} = props;
    const classes = useStyles();

    if (children.length === 0) {
        return <></>;
    }

    return (
        <>
            {title ? <h5 className={classes.li}>{title}</h5> : <></>}
            <ul className={classes.ul}>
                {children.map(x => {
                    return <ListEntry key={x} name={x} right={<Value promise={ctrl[x]}/>} {...props}/>;
                })}
            </ul>
        </>
    )
}

function ListEntry(props) {
    const {name, right, active, setActive, ctrl} = props;
    const classes = useStyles();

    return (
        <li
            key={name}
            className={(classes.li + (active === ctrl[name] ? " " + classes.active : ""))}
            onClick={() => setActive(ctrl[name])}
        >
            <div className={classes.item}>
                <Typography>
                    {name.replace(/\/$/, "")}<span className={classes.float_right}>{right}</span>
                </Typography>
            </div>
        </li>
    )
}
