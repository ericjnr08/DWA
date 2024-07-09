const provinces = ['Western Cape', 'Gauteng', 'Northern Cape', 'Eastern Cape', 'KwaZulu-Natal', 'Free State']
const names = ['Ashwin', 'Sibongile', 'Jan-Hendrik', 'Sifso', 'Shailen', 'Frikkie']

names.forEach((names => console.log(names)));

names.forEach((names, index) => {
    console.log(`${names}, (${provinces[index]})`)
}); 

const toUpperCase = (str) => str.toUpperCase();

const upperCaseProvinces = provinces.map(toUpperCase);
console.log(upperCaseProvinces);

const charAmount = names.map(names => names.length);
console.log(charAmount);

const alphProvince = provinces.toSorted()
console.log(alphProvince);

const provinceCheck = provinces.filter(province => !province.includes('Cape'));
const availProvinces = provinceCheck.length
console.log(availProvinces);

const containsS = names.map(names => names.split('').some(
    letter => letter === 'S'));

console.log(containsS)

const provinceByName = names.reduce((acc, name, index) => {
    acc[name] = provinces[index];
    return acc;
}, {});
console.log(provinceByName)
