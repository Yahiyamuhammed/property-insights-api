import axios from 'axios';
import * as cheerio from 'cheerio';

export async function fetchProfileTab(pin) {
    const targetUrl = `https://assessorpropertydetails.cookcountyil.gov/Datalets/Datalet.aspx?mode=profileall_cc&UseSearch=no&pin=${pin}`;
    
    try {
        const response = await axios.get(targetUrl);
        const $ = cheerio.load(response.data);
        
        const getValueByLabel = (label) => {
            return $('td.DataletSideHeading')
                .filter((_, el) => $(el).text().trim() === label)
                .next('td')
                .text()
                .replace(/\u00a0/g, ' ') 
                .replace(/\s+/g, ' ')    
                .trim();
        };

        const propertyClass = getValueByLabel('Class');

        // Expanded JSON payload with ALL profile data
        return {
            parcelId: pin,
            meta: {
                taxYear: getValueByLabel('Tax Year'),
                payYear: getValueByLabel('Pay Year'),
                address: getValueByLabel('Property Address'),
                buildingUnit: getValueByLabel('Building/Unit #:'),
                city: getValueByLabel('City & Zip Code'), 
                multipleAddresses: getValueByLabel('Multiple Addresses:'),
                propertyClass: propertyClass,
                isExempt: propertyClass.includes('EX'),
                neighborhood: getValueByLabel('Neighborhood'),
                taxDistrict: getValueByLabel('Tax District'),
                keyPin: getValueByLabel('Key PIN'),
                townName: getValueByLabel('Town Name'),
                triTown: getValueByLabel('Tri-Town')
            }
        };

    } catch (error) {
        console.error(`Error scraping PIN ${pin}:`, error.message);
        throw new Error('Failed to retrieve data from the legacy system');
    }
}