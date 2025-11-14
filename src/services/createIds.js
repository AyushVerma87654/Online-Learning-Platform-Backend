export const createIds = (data, name) =>
  data.map((item, index) => {
    const newIndex = index + 1;
    const id = name + "-" + newIndex;
    return { ...item, id };
  });
