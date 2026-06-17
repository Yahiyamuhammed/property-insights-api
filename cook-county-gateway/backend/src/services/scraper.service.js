import axios from 'axios';
import * as cheerio from 'cheerio';

async function fetchSubPage(pin, mode) {
    const url = `https://assessorpropertydetails.cookcountyil.gov/Datalets/Datalet.aspx?mode=${mode}&UseSearch=no&pin=${pin}`;
    try {
        const response = await axios.get(url, { timeout: 8000 });
        return { mode, html: response.data };
    } catch (error) {
        console.error(`Failed to fetch ${mode} tab for PIN ${pin}`);
        return { mode, html: null };
    }
}

export async function fetchPropertyData(pin) {
    const modes = [
        'profileall_cc', 
        'maildetail', 
        'full_legal_cd', 
        'sales', 
        'permit_ck_cc',
        'value_summary_cc' // <-- Added the new tab here
    ];
    
    const results = await Promise.all(modes.map(mode => fetchSubPage(pin, mode)));
    
    const fullProfile = { 
        parcelId: pin,
        tabs: {}
    };

    results.forEach(({ mode, html }) => {
        if (!html) return;
        if (html.includes("No Data") || html.includes("-- No Data --")) return;
        
        const $ = cheerio.load(html);

        // ==========================================
        // 1. PARSE TABULAR DATA (Tables with rows/columns)
        // ==========================================
        if (mode === 'value_summary_cc') {
            const tableData = [];
            let headers = [];

            // Find the table that contains "Process Name"
            const targetTable = $('th:contains("Process Name"), td:contains("Process Name")').closest('table');

            targetTable.find('tr').each((rowIndex, row) => {
                const cells = $(row).find('th, td');

                // Extract Headers from the first row
                if (rowIndex === 0 || $(cells[0]).text().trim() === 'Year') {
                    if (headers.length === 0) {
                        cells.each((_, c) => headers.push($(c).text().replace(/\s+/g, ' ').trim()));
                    }
                    return; // Skip to next row
                }

                // Extract Data Rows
                const rowObj = {};
                let hasData = false;
                
                cells.each((cellIndex, cell) => {
                    const colName = headers[cellIndex];
                    if (colName) {
                        const val = $(cell).text().replace(/\s+/g, ' ').trim();
                        rowObj[colName] = val;
                        if (val && val !== '----') hasData = true;
                    }
                });

                // Only add valid rows that have a Year attached
                if (hasData && rowObj['Year']) {
                    tableData.push(rowObj);
                }
            });

            if (tableData.length > 0) {
                fullProfile.tabs[mode] = tableData; // Saves as an Array instead of an Object
            }
            return; // Stop execution here so it doesn't run the Key-Value logic below
        }

        // ==========================================
        // 2. PARSE KEY-VALUE DATA (Standard Side Headings)
        // ==========================================
        const tabData = {};
        
        $('td.DataletSideHeading').each((_, el) => {
            const rawLabel = $(el).text().replace(/\s+/g, " ").trim();
            const cleanLabel = rawLabel.replace(/:$/, '').trim();

            const value = $(el).next('td').text().replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();

            if (cleanLabel && value !== '----' && value !== '') {
                tabData[cleanLabel] = value;
            }
        });
        
        if (Object.keys(tabData).length > 0) {
             fullProfile.tabs[mode] = tabData;
        }
    });

    return fullProfile;
}