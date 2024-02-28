export const formattedPrice = (price, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(price);
};

export const getFormattedLabel = (value) => {
    if (!value) {
      return "";
    }
    let splittedVal = value.split("_");
    let finalValue = "";
    splittedVal.forEach((val, idx) => {
      finalValue += `${idx > 0 ? " ": ""}${val.substring(0,1)}${val.substring(1).toLowerCase()}`;
    });
    return finalValue;
  };