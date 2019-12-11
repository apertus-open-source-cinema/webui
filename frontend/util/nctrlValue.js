import { Fs } from './fs';

const issued_instances = new Map();
export class NctrlValue {
  static of(path) {
    if (!issued_instances.has(path)) {
      issued_instances.set(path, new NctrlValue(path, true));
    }
    return issued_instances.get(path);
  }

  /**
   * This constructor MUSTNT be called directly. Always use NctrlValue.of()
   * @param path
   * @param is_called_by_from_string
   */
  constructor(path, is_called_by_from_string) {
    if (!is_called_by_from_string) {
      throw Error('constructor mustnt be called directly');
    }

    const normalized_path = path.replace(/\/value(\/)?$/, '');
    this.path = normalized_path;
  }

  name() {
    return this.path.match(/\/([^\/]*)?$/)[1];
  }

  async isWritable() {
    return Fs.of(`${this.path}/writable`)
      .load()
      .then(x => x !== 'false')
      .catch(notExplicit => true);
  }

  async getMap() {
    return await Fs.of(`${this.path}/map/`)
      .ls()
      .then(async entries => {
        return await Promise.all(
          entries.map(async entry => ({ representation: entry.name(), value: await entry.load() }))
        );
      })
      .catch(noMap => null);
  }

  async value() {
    return Fs.of(`${this.path}/value`).load();
  }

  async setValue(newValue) {
    return Fs.of(`${this.path}/value`).upload(newValue);
  }

  isValue() {
    if (Fs.of(this.path).isFile()) {
      return false;
    }
    if (this.path.match(/scripts\//)) {
      return ['description', 'value'].every(i => i !== this.name());
    } else {
      return Fs.of(`${this.path}/value`).isFile();
    }
  }
}

window.NctrlValue = NctrlValue;
