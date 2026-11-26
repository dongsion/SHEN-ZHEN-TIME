import { pinyin } from 'pinyin-pro'
import RAW_BUS_LINES from './bus-lines.js'

const RAW_LINES = [
  {
    id: '1',
    name: '1号线',
    color: '#00b140',
    first: '06:20',
    last: '23:00',
    peak: 2,
    off: 4,
    late: 6,
    hop: 2.4,
    stations: '罗湖,国贸,老街,大剧院,科学馆,华强路,岗厦,会展中心,购物公园,香蜜湖,车公庙,竹子林,侨城东,华侨城,世界之窗,白石洲,高新园,深大,桃园,大新,鲤鱼门,前海湾,新安,宝安中心,宝体,坪洲,西乡,固戍,后瑞,机场东'
  },
  {
    id: '2',
    name: '2号线',
    color: '#c2703c',
    first: '06:20',
    last: '23:00',
    peak: 2.5,
    off: 5,
    late: 7,
    hop: 2.4,
    through: true,
    stations: '赤湾,蛇口港,海上世界,水湾,东角头,湾厦,海月,登良,后海,科苑,红树湾,世界之窗,侨城北,深康,安托山,侨香,香蜜,香梅北,景田,莲花西,福田,市民中心,岗厦北,华强北,燕南,大剧院,湖贝,黄贝岭,新秀,莲塘口岸,仙湖路,莲塘'
  },
  {
    id: '3',
    name: '3号线',
    color: '#00a9e0',
    first: '06:20',
    last: '23:00',
    peak: 2.5,
    off: 5,
    late: 7,
    hop: 2.4,
    stations: '福保,益田,石厦,购物公园,福田,少年宫,莲花村,华新,通新岭,红岭,老街,晒布,翠竹,田贝,水贝,草埔,布吉,木棉湾,大芬,丹竹头,六约,塘坑,横岗,永湖,荷坳,大运,爱联,吉祥,龙城广场,南联,双龙,梨园,新生,坪西,低碳城,白石塘,富坪,坪地六联'
  },
  {
    id: '4',
    name: '4号线',
    color: '#e4002b',
    first: '06:30',
    last: '23:00',
    peak: 2.5,
    off: 6,
    late: 8,
    hop: 2.5,
    stations: '福田口岸,福民,会展中心,市民中心,少年宫,莲花北,上梅林,民乐,白石龙,深圳北站,红山,上塘,龙胜,龙华,清湖,清湖北,竹村,茜坑,长湖,观澜,松元厦,观澜湖,牛湖'
  },
  {
    id: '5',
    name: '5号线',
    color: '#a05eb5',
    first: '06:20',
    last: '23:00',
    peak: 2.5,
    off: 5,
    late: 7,
    hop: 2.4,
    stations: '赤湾,荔湾,铁路公园,妈湾,前湾公园,前湾,桂湾,前海湾,临海,宝华,宝安中心,翻身,灵芝,洪浪北,兴东,留仙洞,西丽,大学城,塘朗,长岭陂,深圳北站,民治,五和,坂田,杨美,上水径,下水径,长龙,布吉,百鸽笼,布心,太安,怡景,黄贝岭,湖贝,东门,大剧院'
  },
  {
    id: '6',
    name: '6号线',
    color: '#00c7b1',
    first: '06:20',
    last: '23:00',
    peak: 3,
    off: 6,
    late: 8,
    hop: 2.6,
    stations: '科学馆,通新岭,体育中心,八卦岭,银湖,翰岭,梅林关,深圳北站,红山,上芬,元芬,阳台山东,官田,上屋,长圳,凤凰城,光明大街,光明,科学公园,楼村,红花山,公明广场,合水口,薯田埔,松岗公园,溪头,松岗'
  },
  {
    id: '6b',
    name: '6号线支线',
    color: '#169bd5',
    first: '06:30',
    last: '23:00',
    peak: 5,
    off: 8,
    late: 10,
    hop: 2.8,
    stations: '深理工,中大,圳美,光明,碧眼,虹桥公园,光明城'
  },
  {
    id: '7',
    name: '7号线',
    color: '#003da5',
    first: '06:20',
    last: '23:00',
    peak: 3,
    off: 6,
    late: 8,
    hop: 2.4,
    stations: '深大丽湖,北大,西丽湖,西丽,茶光,珠光,龙井,桃源村,深云,安托山,农林,车公庙,上沙,沙尾,石厦,皇岗村,福民,皇岗口岸,赤尾,华强南,华强北,华新,黄木岗,八卦岭,红岭北,笋岗,洪湖,田贝,太安'
  },
  {
    id: '8',
    name: '8号线',
    color: '#ea5b0c',
    first: '06:20',
    last: '23:00',
    peak: 2.5,
    off: 5,
    late: 7,
    hop: 2.4,
    through: true,
    stations: '莲塘,梧桐山南,沙头角,海山,盐田港西,深外高中,盐田路,鸿安围,盐田墟,大梅沙,小梅沙,溪涌'
  },
  {
    id: '9',
    name: '9号线',
    color: '#7b6469',
    first: '06:20',
    last: '23:00',
    peak: 3,
    off: 6,
    late: 8,
    hop: 2.4,
    stations: '前湾,梦海,怡海,荔林,南油西,南油,南山书城,深大南,粤海门,高新南,红树湾南,深湾,深圳湾公园,下沙,车公庙,香梅,景田,梅景,下梅林,梅村,上梅林,孖岭,银湖,泥岗,红岭北,园岭,红岭,红岭南,鹿丹村,人民,向西村,文锦'
  },
  {
    id: '10',
    name: '10号线',
    color: '#f8779e',
    first: '06:20',
    last: '23:00',
    peak: 3,
    off: 6,
    late: 8,
    hop: 2.5,
    stations: '双拥街,平湖,禾花,华南城,木古,上李朗,凉帽山,甘坑,雪象,岗头,华为,贝尔路,坂田北,五和,光雅园,南坑,雅宝,孖岭,冬瓜岭,莲花村,岗厦北,岗厦,福民,福田口岸'
  },
  {
    id: '11',
    name: '11号线',
    color: '#6a2c91',
    first: '06:20',
    last: '23:00',
    peak: 4,
    off: 7,
    late: 10,
    hop: 3.2,
    stations: '红岭南,华强南,福星,岗厦北,福田,车公庙,红树湾南,后海,南山,前海湾,宝安,碧海湾,机场,机场北,福永,桥头,塘尾,马安山,沙井,后亭,松岗,碧头'
  },
  {
    id: '12',
    name: '12号线',
    color: '#a192b2',
    first: '06:20',
    last: '23:00',
    peak: 3,
    off: 6,
    late: 8,
    hop: 2.3,
    stations: '左炮台东,太子湾,海上世界,花果山,四海,南油,南光,南山,桃园,南头古城,中山公园,同乐南,新安公园,灵芝,上川,流塘,宝安客运站,宝田一路,平峦山,西乡桃源,钟屋南,黄田,兴围,机场东,福围,怀德,福永,桥头西,福海西,国展,国展北,海上田园南,海上田园东,蚝乡,沙蚝,沙井古墟,步涌,朗下,松岗'
  },
  {
    id: '13',
    name: '13号线',
    color: '#de7c00',
    first: '06:30',
    last: '23:00',
    peak: 4,
    off: 7,
    late: 10,
    hop: 2.8,
    stations: '深圳湾口岸,人才公园,后海,科苑,粤海门,深大,高新中,高新北,石鼓,留仙洞,百旺,应人石,罗租,石岩,上屋,红坳公园,光明城,德雅路,凤凰城,月亮路,将围,新庄,公明广场,上村,下村,李松蓢'
  },
  {
    id: '14',
    name: '14号线',
    color: '#f4c400',
    first: '06:20',
    last: '23:00',
    peak: 4,
    off: 7,
    late: 10,
    hop: 3.4,
    stations: '岗厦北,黄木岗,罗湖北,布吉,石芽岭,六约北,四联,坳背,大运,嶂背,南约,宝龙,锦龙,坪山围,坪山广场,坪山中心,坑梓,沙田'
  },
  {
    id: '16',
    name: '16号线',
    color: '#9dd2c8',
    first: '06:20',
    last: '23:00',
    peak: 4,
    off: 7,
    late: 10,
    hop: 2.5,
    stations: '园山西坑,安良,福坑,大康,园山,大安,吉溪,金源,大运,大运中心,龙城公园,黄阁坑,愉园,回龙埔,尚景,盛平,龙园,双龙,新塘围,龙东,宝龙同乐,坪山,新和,六和,坪山围,坪环,东纵纪念馆,沙壆,燕子湖,石井,技术大学,田心'
  },
  {
    id: '20',
    name: '20号线',
    color: '#d4a017',
    first: '06:30',
    last: '23:00',
    peak: 6,
    off: 8,
    late: 10,
    hop: 3.0,
    stations: '机场北,国展南,国展,国展北,会展城'
  }
]

const ALIAS = {
  深圳北: '深圳北站',
  学城: '大学城'
}

function splitStations(text) {
  return text.split(',').map((name) => ALIAS[name] || name)
}

function makePinyin(name) {
  const full = pinyin(name, { toneType: 'none', type: 'array' }).join('').toLowerCase()
  const abbr = pinyin(name, { pattern: 'first', toneType: 'none', type: 'array' }).join('').toLowerCase()
  return { pinyin: full.replace(/\s/g, ''), abbr: abbr.replace(/\s/g, '') }
}

const line2Stations = splitStations(RAW_LINES.find((l) => l.id === '2').stations)
const line8Stations = splitStations(RAW_LINES.find((l) => l.id === '8').stations)
const THROUGH_2_8 = [...line2Stations, ...line8Stations.slice(1)]

function buildLine(raw, kind) {
  const stations = splitStations(raw.stations)
  const runStations = raw.through ? THROUGH_2_8 : stations
  return {
    id: raw.id,
    name: raw.name,
    color: raw.color,
    kind,
    group: raw.group || kind,
    first: raw.first,
    last: raw.last,
    peak: raw.peak,
    off: raw.off,
    late: raw.late,
    hop: raw.hop,
    stations,
    runStations,
    terminals: [runStations[0], runStations[runStations.length - 1]]
  }
}

export const metroLines = RAW_LINES.map((raw) => buildLine(raw, 'metro'))
export const busLines = RAW_BUS_LINES.map((raw) => buildLine(raw, 'bus'))
export const lines = [...metroLines, ...busLines]
export const lineById = Object.fromEntries(lines.map((line) => [line.id, line]))

export function linesForMode(mode) {
  return mode === 'bus' ? busLines : metroLines
}

export function modeOfLine(lineId) {
  return String(lineId || '').startsWith('bus-') ? 'bus' : 'metro'
}

export const BUS_GROUPS = [
  { id: 'num', label: '数字线' },
  { id: 'M', label: 'M线' },
  { id: 'B', label: 'B线' },
  { id: 'E', label: 'E线' },
  { id: 'peak', label: '高峰' },
  { id: 'kua', label: '高快' },
  { id: 'night', label: '夜班' },
  { id: 'other', label: '其他' }
]

export function busLinesInGroup(groupId) {
  return busLines.filter((line) => line.group === groupId)
}

const stationMap = new Map()
for (const line of lines) {
  for (const name of line.stations) {
    let station = stationMap.get(name)
    if (!station) {
      const py = makePinyin(name)
      station = { id: name, name, pinyin: py.pinyin, abbr: py.abbr, lineIds: [] }
      stationMap.set(name, station)
    }
    if (!station.lineIds.includes(line.id)) station.lineIds.push(line.id)
  }
}

export const stations = [...stationMap.values()].sort((a, b) => a.pinyin.localeCompare(b.pinyin))
export const stationById = Object.fromEntries(stations.map((s) => [s.id, s]))

export function linesAtStation(stationId) {
  const station = stationById[stationId]
  if (!station) return []
  return station.lineIds.map((id) => lineById[id])
}
