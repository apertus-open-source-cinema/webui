/**
 * An abstraction for querying ctrl in an async way
 * to get the value of the path "a/b/c" simply do (await ctrl.a.b.c)
 * to list available values / folders do Object.keys(await ctrl)
 */
import {cached_ls, cat} from "./execCommands";

const BASE_PATH = "./ctrl_mountpoint";

const handler = {get, set, ownKeys, getOwnPropertyDescriptor};
export const ctrl = new Proxy({path: '/', cache: new Map()}, handler);
window.ctrl = ctrl;

function get(obj, prop) {
    if (typeof prop === 'symbol') return undefined;
    const cache_key = prop;
    const {cache, path, parent} = obj;

    if (prop === 'then' && obj.children) {
        // lowered (awaited) children are not thenable anymore
        return undefined;
    } else if (prop === 'then') {
        return (callback) => {
            if (!cache.has(callback)) {
                // cache to guarantee stable object instances
                cache.set(callback, (async () => {
                    const [all, parent_path, end] = path.match(/(.*)\/([^\/]*)$/);
                    console.log(all, parent_path, end);
                    const parent_ls = await cached_ls(BASE_PATH + parent_path);
                    console.log(parent_ls.filter(x => x.startsWith(end)));
                    try {
                        const ls_result = await cached_ls(BASE_PATH + path);
                        return callback(new Proxy({path: path, children: ls_result, cache: new Map()}, handler))
                    } catch {
                        try {
                            const [std_out] = await cat(BASE_PATH + path.replace(/\/$/, ''));
                            return callback(std_out);
                        } catch {
                            throw `the path '${path}' does not exist`;
                        }
                    }
                })())
            }
            return cache.get(callback);
        };
}

if (!cache.has(cache_key)) {
    cache.set(cache_key, new Proxy({path: `${path}${prop}/`, cache: new Map()}, handler));
}
return cache.get(cache_key);
}

function set(obj, prop, value) {
    throw Error("writing is not implemented yet!")
}

function ownKeys(obj) {
    if (!obj.children) {
        console.warn(`the children of this object are not fetched yet. did you mean (await ctrl${obj.path.replace(/\//g, '.').replace(/\.$/g, '.')})?`)
        return [];
    }
    return obj.children.map(x => x.replace(/\/$/, ''));
}

// this is needed for some Object.keys to work
function getOwnPropertyDescriptor(obj) {
    return {enumerable: true, configurable: true}
}

function get_parent_children(path) {
    const parent_path = path.match(/(.*)\/([^\/]*)$/)[1];
    const parent = parent_path === '/' ? ctrl : ctrl_path(parent_path);
    return parent;
}


export function ctrl_path(path) {
    return path.split('/').filter(x => x).reduce((acc, cur) => acc[cur], ctrl);
}
window.path = ctrl_path;