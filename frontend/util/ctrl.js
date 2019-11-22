/**
 * An abstraction for querying ctrl in an async way
 * to get the value of the path "a/b/c" simply do (await ctrl.a.b.c)
 * to list available values / folders do Object.keys(await ctrl)
 */
import {cached_ls, cat} from "./execCommands";

const BASE_PATH = "./ctrl_mountpoint";

const handler = {get, set, ownKeys, getOwnPropertyDescriptor};
export const ctrl = new Proxy({path: '/', cache: {}}, handler);
window.ctrl = ctrl;

function get(obj, prop) {
    if (prop === 'path') {
        return path => [...obj.path.split('/').filter(x => x), ...path].reduce((acc, cur) => acc[cur], ctrl)
    } else if (prop === 'then' && obj.not_thenable) {
        return undefined;
    } else if (prop === 'then') {
        return (callback) => {
            // cache to guarantee stable object instances
            const key = callback.toString();
            if (!(key in obj.cache)){
                obj.cache[key] = new Promise((resolve, reject) => {
                    cached_ls(BASE_PATH + obj.path)
                        .then(result => {
                            resolve(new Proxy({path: obj.path, children: result, not_thenable: true, cache: obj.cache}, handler))
                        })
                        .catch(error => {
                            cat(BASE_PATH + obj.path.replace(/\/$/, ''))
                                .then(([stdout, stderr]) => {
                                    resolve(stdout)
                                })
                                .catch(e => reject(`${obj.path} does not exist`));
                        });
                }).then(callback)
            }
            return obj.cache[key]
        }
    } else if (prop === 'then') {
        // this is a very ugly hack to make the browser not flatten the promise and produce an endless loop
        obj.not_thenable = false;
        return undefined
    }

    if(!(prop in obj.cache)) {
        obj.cache[prop] = new Proxy({path: `${obj.path}${prop}/`, cache: {}}, handler);
    }
    return obj.cache[prop]
}

function set(obj, prop, value) {
    throw Error("writing is not implemented yet!")
}

function ownKeys(obj) {
    if(!obj.children) {
        throw Error(`the children of this object are not fetched yet. did you mean (async ctrl${obj.path.replace(/\//g, '.')})?`)
    }
    return obj.children.map(x => x.replace(/\/$/, ''));
}

// this is needed for some Object.keys to work
function getOwnPropertyDescriptor(obj) {
    return {enumerable: true, configurable: true}
}
