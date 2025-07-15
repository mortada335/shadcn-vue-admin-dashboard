export const capitalize = (str: string) => {
  const arr = str.split(' ')
  for (let index = 0; index < arr.length; index++) {
    arr[index] = arr[index].charAt(0).toUpperCase() + arr[index].slice(1)
  }
  return arr.join(' ')
}

export const initials = (str: string, fallback: string) => {
  if (!str || str == '') return fallback;
  const arr = str.split(' ')
  let initials = '';
  for (let index = 0; index < arr.length; index++) {
    initials += arr[index].charAt(0).toUpperCase() + ' ';
  }
  return initials.trim();
}

export const camelCaseToRegular = (str: string) => {
  let result = str[0];
  for (let index = 1; index < str.length; index++) {
    if (str[index] == str[index].toUpperCase()) result += ' ' + str[index]
    else result += str[index]
  }
  return capitalize(result);
}
