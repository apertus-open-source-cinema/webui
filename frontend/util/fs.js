import { exec } from './exec';

/**
 * A global cache to save the types and location of known files
 * @type {Map<String, {type: String}>}
 */
const fs_wisdom = new Map();
export async function fill_wisdom(path, depth) {
  const striped_path = path.replace(/\/$/, '');
  if (depth === 1 && fs_wisdom.has(striped_path)) {
    return true;
  }

  const [find_result, err] = await exec(
    `find -L ${striped_path} -maxdepth ${depth} -printf "%p\\t%y\\n"`
  );
  const parsed = find_result.split('\n').map(line => line.split('\t'));
  parsed.forEach(([path, type]) => fs_wisdom.set(path.replace(/\/$/, ''), { type: type }));
  return true;
}

const issued_instances = new Map();
export class Fs {
  static of(path) {
    if (!issued_instances.has(path)) {
      issued_instances.set(path, new Fs(path, true));
    }
    return issued_instances.get(path);
  }

  /**
   * This constructor MUSTNT be called directly. Always use NctrlValue.of()
   * @param path
   * @param calledByOf
   */
  constructor(path, calledByOf) {
    if (!calledByOf) {
      throw Error('constructor mustnt be called directly');
    }
    this.path = path.replace(/\/$/, '');
  }

  // Maybe promise
  name() {
    return this.path.match(/\/([^\/]*)?$/)[1];
  }

  // Maybe promise
  exists() {
    if (fs_wisdom.has(this.path)) {
      return true;
    } else {
      return fill_wisdom(this.path, 1).then(() => !!fs_wisdom.has(this.path));
    }
  }

  // Maybe promise
  type() {
    if (!fs_wisdom.has(this.path)) {
      return fill_wisdom(this.path, 1).then(() => fs_wisdom.get(this.path).type);
    }
    return fs_wisdom.get(this.path).type;
  }

  // Maybe promise
  isDir() {
    if (typeof this.type() === 'string') {
      return this.type() === 'd';
    } else {
      return this.type().then(type => type === 'd');
    }
  }

  async isFile() {
    if (typeof this.type() === 'string') {
      return this.type() === 'f';
    } else {
      return this.type().then(type => type === 'f');
    }
  }

  async ls() {
    if (!(await this.exists())) throw Error(`'${this.path}' does not Exist`);
    if (!(await this.isDir())) throw Error(`'${this.path}' is not a dir`);

    const wisdom_promise = fill_wisdom(this.path, 3);
    const getDirectChildren = () =>
      Array.from(fs_wisdom.keys())
        .filter(x => x.startsWith(this.path))
        .map(x => x.replace(this.path + '/', ''))
        .filter(x => x.match(/^\/?[^\/]*\/?$/))
        .map(x => x.replace(/^\//, ''));

    let direct_children = getDirectChildren();
    if (direct_children.length === 0) {
      await wisdom_promise;
      direct_children = getDirectChildren();
      console.info('fetch eager', this.path);
    }

    return [...new Set(direct_children)].map(x => Fs.of(this.path + '/' + x));
  }

  async load() {
    if (!(await this.exists())) throw Error(`'${this.path}' does not Exist`);
    if (!(await this.isFile())) throw Error(`'${this.path}' is not a file`);
    const exec_result = await exec(`cat "${this.path}"`);
    return exec_result[0];
  }

  async upload(value) {
    if (await this.isDir()) throw Error(`'${this.path}' is a directory`);

    return exec(`echo -n '${value}' > "${this.path}"`).then(sucess => true);
  }
}

window.Fs = Fs;
