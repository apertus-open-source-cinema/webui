export const sortArrayOfObjects = (wifi_networks, key) => {
  wifi_networks.sort((a, b) => {
    let fa = a[key].toLowerCase(),
      fb = b[key].toLowerCase();

    if (fa < fb) {
      return -1;
    }
    if (fa > fb) {
      return 1;
    }
    return 0;
  });

  return wifi_networks;
};
