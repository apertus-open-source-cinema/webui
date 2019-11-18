import {exec_table} from "./exec";

export async function ls(path) {
    try {
        const ls_result = await exec_table(`/usr/bin/ls -la --file-type "${path}"`, 1, ['Permissions', '_', 'Owner', 'Group', 'Size', 'Day', 'Month', 'Time', 'Name'])
        const files = ls_result.map(x => x['Name']).filter(x => x !== "./" && x !== "../");
        return files;
    } catch (e) {
        return null;
    }
}

window.ls = ls;