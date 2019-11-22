import {exec_table} from "./exec";

export async function ls(path) {
    const ls_result = await exec_table(`ls -la --file-type "${path}"`, 1, ['Permissions', '_', 'Owner', 'Group', 'Size', 'Day', 'Month', 'Time', 'Name']);
    const files = ls_result.map(x => x['Name']).filter(x => x !== "./" && x !== "../");
    return files;
}

const cache = {};
export async function cached_ls(path) {
    if(!(path in cache)) {
        cache[path] = ls(path);
    }
    return cache[path]
}

window.ls = ls;

export async function cat(path) {
    const remove_zeros = v => v.replace(/\0/g, '');
    return (await exec(`cat "${path}"`)).map(remove_zeros)
}

window.cat = cat;
