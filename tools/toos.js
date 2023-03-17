export function My_split(str, item) {
	let arr = [];
	if (str.length === 0) {
		return;
	}
	let index = str.indexOf(item);
	while (index > -1) {
		let temp = str;
		index = str.indexOf(item)

		if (str.substring(0, index)) {
			arr.push(str.substring(0, index))
		}
		str = str.substring(index + 1, str.length + 1)
		if (temp.length === 1 && temp.indexOf(item)) {
			arr.push(temp)
		}
	}
	return arr;
}
