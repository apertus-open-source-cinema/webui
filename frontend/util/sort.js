export const sortArrayOfObjects = (wifi_networks, key) => {
  if (key === 'Default') {
    return wifi_networks;
  }
  wifi_networks.sort((a, b) => {
    return a[key].localeCompare(b[key], undefined, {
      numeric: true,
      sensitivity: 'base',
    });
  });

  return wifi_networks;
};
