
import cache from '../../cache/google-cloud-cache.json'
import { Storage, type File } from '@google-cloud/storage';
import { REVERSE_CHRONO, type GoogleCloudBrushworkFile, type Order, type KeyedLinks, CHRONO } from '@/lib/brushwork_types';

const zeroPad = (num: string, places: number) => String(num).padStart(places, '0')
const prefix = 'brushwork'

function convertToMonthName(monthNumber: number) {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December'
  ];

  // Convert the input to a number
  monthNumber = Number(monthNumber);

  // Check if the input is a valid month number (1-12)
  if (isNaN(monthNumber) || monthNumber < 1 || monthNumber > 12) {
    throw new Error('Invalid month number. Please provide a valid month number (1-12).');
  }

  // Subtract 1 from the month number to get the corresponding index in the monthNames array
  const monthIndex = monthNumber - 1;

  // Return the month name in title case
  return monthNames[monthIndex];
}

function convertToTwoDigitMonth(monthInput: string) {
  const monthMap = {
    'jan': '01',
    'january': '01',
    'feb': '02',
    'february': '02',
    'mar': '03',
    'march': '03',
    'apr': '04',
    'april': '04',
    'may': '05',
    'jun': '06',
    'june': '06',
    'jul': '07',
    'july': '07',
    'aug': '08',
    'august': '08',
    'sep': '09',
    'september': '09',
    'oct': '10',
    'october': '10',
    'nov': '11',
    'november': '11',
    'dec': '12',
    'december': '12'
  };

  // Remove leading/trailing whitespaces and convert to lowercase
  monthInput = monthInput.trim().toLowerCase();

  // If monthInput is already in two-digit format, return as is
  if (/^\d{2}$/.test(monthInput)) {
    return monthInput;
  }

  // If monthInput is a single digit, add leading zero
  if (/^\d$/.test(monthInput)) {
    return '0' + monthInput;
  }

  // Lookup the monthInput in monthMap and return the corresponding value
  return monthMap[monthInput] || '';
}

function onlyUnique(value: any[]) {
  return Array.from(new Set(value))
}

const processFile = ({ allRawFiles, date, i }) => {
  const v2Image = allRawFiles.find((v: any) => v.name.replace('-v2.jpg', '') === date)
  const v1Image = allRawFiles.find((v: any) => v.name.replace('.jpg', '') === date)
  const file = v2Image || v1Image
  const splitDate = date.split('-')
  const number = i+1
  const core = {
    name: file.id,
    date: date,
    year: splitDate[0],
    month: splitDate[1],
    day: splitDate[2],
    number,
    volume: Math.ceil(number / 60),
    // source: file.metadata.mediaLink,
    source: `/brushwork/${file.id}`,
  }
  return {
    ...core, 
    href: `/${prefix}/${core.year}/${convertToMonthName(core.month).toLowerCase()}/${core.day}`,
    text: formatDate(core.date),
    alt: `Brushwork photo from ${core.date}`
  }
}

export const getFiles = async (): Promise<GoogleCloudBrushworkFile[]> => {
  const allRawFiles = await getAllRawFiles()
  const datesAvailable = onlyUnique(allRawFiles.map(v => v.name.replace('-v2.jpg', '').replace('.jpg', ''))).sort()
  const results = datesAvailable.map((date, i) => {
    try {
      return processFile({allRawFiles, date, i})
    } catch (e) {
      return undefined;
    }
  }).filter(v => v)
  return results
}

export const getApi = async (opt?: { order?: Order }) => {
  const { order } = { order: REVERSE_CHRONO, ...opt }
  let files = await getFiles()

  const listOfMonthsObj = files.reduce((acc: KeyedLinks, file) => {
    const { year, month } = file
    const monthKey = `${year}-${month}`
    if (!acc[monthKey]) {
      acc[monthKey] = {
        href: `/${prefix}/${year}/${convertToMonthName(month).toLowerCase()}`,
        text: `${convertToMonthName(month)} ${year}`
      }
    }
    return acc
  }, {})

  const listOfMonths = Object.values(listOfMonthsObj)
  
  const listOfVolumesObj = files.reduce((acc: KeyedLinks, file) => {
    const { volume } = file
    const volumeKey = `--${volume}--`
    if (!acc[volumeKey]) acc[volumeKey] = {
      href: `/${prefix}/volume/${volume}`,
      text: `Volume ${volume}`
    }
    return acc
  }, {})

  const listOfVolumes = Object.values(listOfVolumesObj)
  files = order === REVERSE_CHRONO ? files.reverse() : files
  return { files, listOfMonths, listOfVolumes }
}

export function randChoice(arr: any[]) {
  return arr[Math.floor(Math.random() * arr.length)]
}

export const getLatestFiles = async () => {
  const { files, listOfMonths, listOfVolumes } = await getApi({ order: REVERSE_CHRONO })
  return { files, listOfMonths, listOfVolumes }
}

export const getRandom = async () => {
  const { files, listOfMonths, listOfVolumes } = await getApi({ order: REVERSE_CHRONO })
  return { files: [randChoice(files)], listOfMonths, listOfVolumes }
}

function formatDate(dateStr: string) {
  const date = dateStr.split('-')
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const year = date[0]
  const month = monthNames[parseInt(date[1]) - 1].toUpperCase()
  const day = date[2]
  return `${month} ${day} ${year}`
}

export const getFilesByMonth = async (_month: string, year: string, day?: string) => {
  const month = convertToTwoDigitMonth(_month)

  const { files, listOfMonths, listOfVolumes } = await getApi({ order: CHRONO })
  const filteredFiles = files.filter(file => {
    if (day) return file.month === month && file.year === year && file.day === zeroPad(day, 2)
    return file.month === month && file.year === year
  })
  return { files: filteredFiles, listOfMonths, listOfVolumes }
}

export const getFilesByVolume = async (volume: string) => {
  const { files, listOfMonths, listOfVolumes } = await getApi({ order: CHRONO })
  const filteredFiles = files.filter(file => {
    return file.volume === parseInt(volume)
  })
  return { files: filteredFiles, listOfMonths, listOfVolumes  }
}

export const getMonthsMentioned = (files: GoogleCloudBrushworkFile[]) => {
  const uniqueYearMonths = files.reduce((acc, { year, month }) => {
    const yearMonth = `${year}-${month}`;
    acc.add(yearMonth);
    return acc;
  }, new Set<string>());
  
  const yearMonthObjects = [...uniqueYearMonths].map(item => {
    const [year, month] = item.split('-');
    return { year, month };
  });
  return yearMonthObjects
}

export async function getAllRawFiles (useCache = true): Promise<File[]> {
  if (useCache) return cache as File[]
  
  const storage = new Storage({
    projectId: import.meta.env.PROJECT_ID,
    credentials: {
      client_email: import.meta.env.CLIENT_EMAIL,
      private_key: import.meta.env.PRIVATE_KEY,
    },
  });
  
  const bucket = storage.bucket(import.meta.env.BUCKET_NAME);
  
  return (await bucket.getFiles())[0]
}

interface YearMonthInput {
  year: string;
  month: string;
}

interface ExpandedYearMonth {
  year: string;
  month: string;
}

export function expandYearMonth(input: YearMonthInput): ExpandedYearMonth[] {
  const monthNames: { [key: string]: { full: string; short: string } } = {
    "01": { full: "January", short: "Jan" },
    "02": { full: "February", short: "Feb" },
    "03": { full: "March", short: "Mar" },
    "04": { full: "April", short: "Apr" },
    "05": { full: "May", short: "May" },
    "06": { full: "June", short: "Jun" },
    "07": { full: "July", short: "Jul" },
    "08": { full: "August", short: "Aug" },
    "09": { full: "September", short: "Sep" },
    "10": { full: "October", short: "Oct" },
    "11": { full: "November", short: "Nov" },
    "12": { full: "December", short: "Dec" },
  };

  const { year, month } = input;
  const monthInfo = monthNames[month];

  if (!monthInfo) {
    throw new Error(`Invalid month: ${month}`);
  }

  const unleadZeroMonth = month.startsWith('0') ? month.substring(1) : month;

  return [
    { year, month: monthInfo.full.toLowerCase() },
    { year, month: monthInfo.short.toLowerCase() },
    { year, month },
    { year, month: unleadZeroMonth }
  ];
}


export async function staticDay() {
  const { files } = await getApi()
  return files.flatMap(m => {
    const exp = expandYearMonth(m)
    return exp.flatMap(e => {
      return {
        params: {...e, day: m.day},
        props: m
      }
    })
  })
}

export async function staticMonth() {
  const { files } = await getApi()
  const months = getMonthsMentioned(files)
  return months.flatMap(m => {
    const exp = expandYearMonth(m)
    return exp.flatMap(e => {
      return {
        params: e,
        props: m
      }
    })
  })
}

export async function staticVolume() {
  const { listOfVolumes } = await getApi()
  return listOfVolumes.map(vol => {
    const volume = vol.href.replace('/brushwork/volume/', '')
    return { params: { number: volume }, props: { volume } }
  })
}