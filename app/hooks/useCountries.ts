import countries from 'world-countries';

// {  format.country }
const formattedCountries = countries.map((country) => ({
    value: country.cca2,
    label: country.name.common,
    flag: country.flag,
    latlng: country.latlng,
    region: country.region
}))

// { เข้าถึงข้อมูลประเทศ  }
// {  getByValue => ( ค้นหา value:country ) => 
// แล้วคืนค่า return formattedCountriesที่รับเข้ามา = item.value === value   }
// { !== undefined } => return getall , getByValue
const useCountries = () => {
    const getAll = () => formattedCountries;

    const getByValue = (value: string) => {
        return formattedCountries.find((item) => item.value === value);
    }

    return {
        getAll,
        getByValue
    }
};

export default useCountries;

