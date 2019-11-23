import { exec } from './exec';

let fs_wisdom = new Map();
export async function fill_wisdom(path, depth) {
  const striped_path = path.replace(/\/$/, '');
  const [find_result, err] = await exec(
    `find -L ${striped_path} -maxdepth ${depth} -printf '%p\\t%y\\n'`
  );
  const parsed = find_result.split('\n').map(line => line.split('\t'));
  parsed.forEach(([path, type]) => fs_wisdom.set(path, { type: type }));
  return fs_wisdom;
}
window.wisdom = fs_wisdom;

export async function get_type(path) {
  const striped_path = path.replace(/\/$/, '');
  if (!fs_wisdom.has(striped_path)) {
    await fill_wisdom(striped_path, 1);
  }
  return fs_wisdom.get(striped_path).type;
}

export async function is_dir(path) {
  return (await get_type(path)) === 'd';
}

export async function is_file(path) {
  return (await get_type(path)) === 'f';
}

export async function ls(path) {
  const striped_path = path.replace(/\/$/, '');

  if (!(await is_dir(striped_path))) throw Error(`'${path}' is not a dir`);

  const wisdom_promise = fill_wisdom(path, 3);
  const get_direct_children = () =>
    Array.from(fs_wisdom.keys())
      .filter(x => x.startsWith(striped_path))
      .map(x => x.replace(striped_path + '/', ''))
      .filter(x => x.match(/^\/?[^\/]*\/?$/))
      .map(x => x.replace(/^\//, ''));

  let direct_children = get_direct_children();
  if (direct_children.length === 0) {
    await wisdom_promise;
    direct_children = get_direct_children();
    console.info('fetch eager', striped_path);
  }

  return direct_children.map(x => ({
    name: x,
    path: striped_path + '/' + x,
    ...fs_wisdom.get(striped_path + '/' + x),
  }));
}
window.ls = ls;

export async function cat(path) {
  const striped_path = path.replace(/\/$/, '');
  if (!(await is_file(striped_path))) throw Error(`'${path}' is not a file`);

  const remove_zeros = v => v.replace(/\0/g, '');
  return (await exec(`cat "${striped_path}"`)).map(remove_zeros)[0];
}
window.cat = cat;

let path_cache = new Map();
export async function get_path(path) {
  const striped_path = path.replace(/\/$/, '');
  if (!path_cache.has(striped_path)) {
    path_cache.set(
      striped_path,
      (async () => {
        const type = await get_type(striped_path);
        if (type === 'd') {
          return await ls(striped_path);
        } else if (type === 'f') {
          return await cat(striped_path);
        }
        throw new Error(`cant handle ${path} with type ${type}`);
      })()
    );
  }
  return path_cache.get(striped_path);
}
window.get_path = get_path;

export async function set(path, value) {
  return await exec(`echo -n '${value}' > "${path}"`);
}
