export const formatAmount = (amount, decimalCount = 2, decimal = ".", thousands = ",") => {
	try {
		decimalCount = Math.abs(decimalCount);
		decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

		const negativeSign = amount < 0 ? "-" : "";

		let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
		let j = (i.length > 3) ? i.length % 3 : 0;

		return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
	} catch (e) {
		console.log(e)
	}
};

export const compareArray = (array1, array2) => {
	if (!array1  || !array2) {
		return;
	}
	
	return array1.length === array2.length && array1.sort().every((value, index) => value === array2.sort()[index]);
};

export const isObject = obj => {
  const type = typeof obj;
  return type === 'function' || type === 'object' && !!obj;
};