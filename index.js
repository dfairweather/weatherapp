const form = document.querySelector('form');
const text = document.querySelector('#text');
const img = document.querySelector('img');
const local = document.querySelector('#location');
const temp = document.querySelector('#temp');
const description = document.querySelector('#description');
const feelsDsc = document.querySelector('#feelsDsc');
const wind = document.querySelector('#wind');
const api_key = '48026b5c576b4cf1830151523200412';
const abstract_key = '328c8ed13d6f4d19b5a81b3d4e65b7fb';



form.addEventListener('submit', (e) => {
    const query = search.value;
    search.value = '';
    search.blur();
    e.preventDefault();
    const report = searchCity(query);
    report.then(displayWeather);
})

function displayWeather(report) {
    console.log(report);
    if (report.location.country.includes('United States of America') || report.location.country.includes('USA')) {
        local.textContent = `${report.location.name}, ${getStateTwoDigitCode(report.location.region)}`;
    } else {
        local.textContent = `${report.location.name}, ${report.location.country}`;
    }
    
    temp.innerHTML = `${Math.round(report.current.temp_f)}&deg`;

    const conditions = report.current.condition.text.toLowerCase();
    if (conditions.includes('clear') || conditions.includes('sunny')) {
        img.src = 'sunny.png';
    } else if (conditions.includes('partly')) {
        img.src = 'partly_cloudy.png';
    } else if (conditions.includes('cloudy') || 
        conditions.includes('overcast') || 
        conditions.includes('fog')) {
        img.src = 'cloudy.png';
    } else if (conditions.includes('rain')) {
        img.src = 'rain.png';
    } else if (conditions.includes('snow') || conditions.includes('sleet')) {
        img.src = 'snow.png';
    }

    feelsDsc.innerHTML = `${Math.round(report.current.feelslike_f)}&deg`;
    description.textContent = conditions;
    wind.textContent = `wind ${report.current.wind_dir} ${Math.round(report.current.wind_mph)} mph`
}

async function getUserZip() {
    try {
        const response = await fetch(`https://ipgeolocation.abstractapi.com/v1/?api_key=${abstract_key}`, {mode: 'cors'});
        const result = await response.json();
        console.log(result.postal_code);
        return result.postal_code;
    } catch {
        console.log('ip not found');
    }
}

async function searchCity(query) {
    try {
        
        const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${api_key}&q=${query}`, {mode: 'cors'});
        const report = await response.json();
        return report
    } catch {
        console.log('not found');
    };
}

async function getGif(weather) {
    try {
        const response = await fetch(`https://api.giphy.com/v1/gifs/translate?api_key=cbFFhjiZ8KsDVV9MLRTmo7H8yQGi8fqK&s=${weather}`, {mode: 'cors'}); 
        const gif = await response.json();
        img.src = gif.data.images.original.url;
    } catch {
        console.log('no image found');
    }
}


getStateTwoDigitCode = function (stateFullName) {
    return stateList[stateFullName];
    }
    
const stateList = {
'Arizona': 'AZ',
'Alabama': 'AL',
'Alaska':'AK',
'Arkansas': 'AR',
'California': 'CA',
'Colorado': 'CO',
'Connecticut': 'CT',
'Delaware': 'DE',
'Florida': 'FL',
'Georgia': 'GA',
'Hawaii': 'HI',
'Idaho': 'ID',
'Illinois': 'IL',
'Indiana': 'IN',
'Iowa': 'IA',
'Kansas': 'KS',
'Kentucky': 'KY',
'Louisiana': 'LA',
'Maine': 'ME',
'Maryland': 'MD',
'Massachusetts': 'MA',
'Michigan': 'MI',
'Minnesota': 'MN',
'Mississippi': 'MS',
'Missouri': 'MO',
'Montana': 'MT',
'Nebraska': 'NE',
'Nevada': 'NV',
'New Hampshire': 'NH',
'New Jersey': 'NJ',
'New Mexico': 'NM',
'New York': 'NY',
'North Carolina': 'NC',
'North Dakota': 'ND',
'Ohio': 'OH',
'Oklahoma': 'OK',
'Oregon': 'OR',
'Pennsylvania': 'PA',
'Rhode Island': 'RI',
'South Carolina': 'SC',
'South Dakota': 'SD',
'Tennessee': 'TN',
'Texas': 'TX',
'Utah': 'UT',
'Vermont': 'VT',
'Virginia': 'VA',
'Washington': 'WA',
'West Virginia': 'WV',
'Wisconsin': 'WI',
'Wyoming': 'WY'};

async function loadPage() {
    const zip = await getUserZip();
    console.log(typeof(zip));
    const report = await searchCity(zip);
    displayWeather(report);
}

loadPage();
