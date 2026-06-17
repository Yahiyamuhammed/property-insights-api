import axios from "axios";
import * as cheerio from "cheerio";

const discoveredFields = new Set();
const discoveredTabs = new Set();

const MODES = [
  "profileall_cc",
  "maildetail",
  "exadmn2",
  "exdet_hist",
  "curyear_asmt_values",
  "value_summary_cc",
  "full_legal_cd",
  "land_cc",
  "residential_cc",
  "res_addn",
  "oby",
  "commercial_bldg_cc",
  "permit_ck_cc",
  "prop_association",
  "sales",
  "appeals_cc"
];

async function fetchTab(pin, mode) {
  const url =
    `https://assessorpropertydetails.cookcountyil.gov/Datalets/Datalet.aspx` +
    `?mode=${mode}&UseSearch=no&pin=${pin}`;

  try {
    const { data } = await axios.get(url, {
      timeout: 10000,
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    return {
      mode,
      html: data
    };
  } catch (err) {
    return {
      mode,
      html: null
    };
  }
}

function extractFields(html) {
  const $ = cheerio.load(html);

  const fields = {};

  $("td.DataletSideHeading").each((_, el) => {
    const label = $(el)
      .text()
      .replace(/\s+/g, " ")
      .trim();

    const value = $(el)
      .next("td")
      .text()
      .replace(/\u00a0/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    if (label) {
      fields[label] = value;
    }
  });

  return fields;
}

async function inspectParcel(pin) {
  
console.log(`\n========== PIN ${pin} ==========\n`);

  const results = await Promise.all(
    MODES.map(mode => fetchTab(pin, mode))
  );

  for (const result of results) {
    if (!result.html) continue;

    if (
      result.html.includes("No Data") ||
      result.html.includes("-- No Data --")
    ) {
      continue;
    }

    const fields = extractFields(result.html);

    let hasNewField = false;

    for (const fieldName of Object.keys(fields)) {
      const key = `${result.mode}:${fieldName}`;

      if (!discoveredFields.has(key)) {
        discoveredFields.add(key);
        hasNewField = true;
      }
    }

    if (hasNewField) {
      console.log(`\nNEW TAB FOUND -> ${result.mode}`);

      console.log(
        JSON.stringify(fields, null, 2)
      );

      discoveredTabs.add(result.mode);
    }
  }
}

async function main() {
  const pins = [
   "17031000010000",
"17031000020000",
"17031000030000",
"17031000050000",
"17031000090000",
"17031000110000",
"17031000131001",
"17031000131002",
"17031000131003",
"17031000131004",
"17031000131005",
"17031000131006",
"17031000131007",
"17031000131008",
"17031000131009",
"17031000131010",
"17031000131011",
"17031000131012",
"17031000131013",
"17031000131014",
"17031000131015",
"17031000131016",
"17031000131017",
"17031000131018",
"17031000131019",
"17031000131020",
"17031000131021",
"17031000131022",
"17031000131023",
"17031000131024",
"17031000131025",
"17031000131026",
"17031000131027",
"17031000131028",
"17031000131029",
"17031000131030",
"17031000131031",
"17031000131032",
"17031000131033",
"17031000131034",
"17031000131035",
"17031000131036",
"17031000131037",
"17031000131038",
"17031000131039",
"17031000131043",
"17031000131044",
"17031000131045",
"17031000131046",
"17031000131047",
"17031000131048",
"17031000131049",
"17031000131050",
"17031000131051",
"17031000131052",
"17031000131053",
"17031000131054",
"17031000131055",
"17031000131056",
"17031000131057",
"17031000141001",
"17031000141002",
"17031000141003",
"17031000141004",
"17031000141005",
"17031000141006",
"17031000141007",
"17031000141008",
"17031000141009",
"17031000151001",
"17031000151002",
"17031000151003",
"17031000160000",
"17031000170000",
"17031000180000",
"17031010090000",
"17031010130000",
"17031010150000",
"17031010180000",
"17031010190000",
"17031010200000",
"17031010210000",
"17031010220000",
"17031010271001",
"17031010271004",
"17031010271005",
"17031010271006",
"17031010271007",
"17031010271008",
"17031010271009",
"17031010271012",
"17031010271015",
"17031010271016",
"17031010271017",
"17031010271018",
"17031010271019",
"17031010271022",
"17031010271023",
"17031010271024",
"17031010271025"
  ];

  for (const pin of pins) {
    await inspectParcel(pin);
  }

  console.log("\n============================");
  console.log("DISCOVERED TABS");
  console.log("============================");

  console.log([...discoveredTabs]);
}

main();