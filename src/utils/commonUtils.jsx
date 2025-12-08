export const convertCurrency = (y_list, toFixed = null) => {
    const maxAmount = Math.max(...y_list
        .filter(y => !isNaN(y) && y !== '-')  // '-'を除外し、数値のみを残す。
        .map(y => Math.abs(y))  // 絶対値を取る。
    );

    let divValue = 1;
    let unit;

    if (maxAmount >= 1e12) {
        // 兆単位に変換 (10^12で割る)
        divValue = 1e12;
        unit = "兆";
    } else if (maxAmount >= 1e8) {
        // 億単位に変換 (10^8で割る)
        divValue = 1e8;
        unit = "億";
    } else if (maxAmount >= 1e6) {
        // 100万円単位に変換 (10^6で割る)
        divValue = 1e6;
        unit = "百万";
    } else {
        // そのままの値と単位を返す
        unit = "";
    }

    let converted = []
    if (maxAmount >= 1e6) {
        converted = y_list.map(y => {
        // 値が '-' なら '-' をそのまま返す。
            if (y === '-' || y == undefined) {
                return '-';
            } else {
                const num = parseFloat(y);
                // 数値に変換し、1e12で割った後、小数点以下1桁に丸める。
                if (toFixed) {
                    return (num / divValue).toFixed(toFixed);
                } else {
                    const value = num / divValue
                    if (Math.abs(value) < 10) {
                        return (num / divValue).toFixed(2);
                    } else {
                        return (num / divValue).toFixed(1);
                    }
                }
            }
        });
    
    } else {
        converted = y_list.map(y => {
        // 値が '-' なら '-' をそのまま返す。
            if (y === '-' || y == undefined) {
                return '-';
            } else {
                if (toFixed) {
                    return y.toFixed(toFixed);
                } else {
                    const num = parseFloat(y);
                    if (Math.abs(y) < 10) {
                        return num.toFixed(2);
                    } else {
                        return num.toFixed(1);
                    }
                }
            }
        });
    }
    
    converted = converted.map(item => item === null ? '-' : item);
    return { converted, unit, divValue};
}


export const convertCurrencyMulti = (y_list_of_list, toFixed=1) => {
    // 二次元配列から絶対値の最大値を見つける
    const maxAmount = Math.max(...y_list_of_list.map(y_list =>
        Math.max(...y_list
            .filter(y => !isNaN(y) && y !== '-')  // '-'を除外し、数値のみを残す
            .map(y => Math.abs(y))  // 絶対値を取る
        )
    ));

    let unit, divValue;

    if (maxAmount >= 1e12) {
        divValue = 1e12;
        unit = "兆";
    } else if (maxAmount >= 1e8) {
        divValue = 1e8;
        unit = "億";
    } else if (maxAmount >= 1e6) {
        divValue = 1e6;
        unit = "百万";
    } else {
        unit = "";
    }

    let converted = y_list_of_list.map(y_list =>
        y_list.map(y => {
            if (y === '-' || y == undefined) {
                return '-';
            } else if (unit !== "") {
                let num = parseFloat(y);
                return (num / divValue).toFixed(toFixed);
            } else {
                return y.toFixed(toFixed);
            }
        })
    );

    converted = converted.map(y_list =>
        y_list.map(item => item === null ? '-' : item)
    );
    return { converted, unit };
}


export const getEdinetUrl = (submitDate, docId) => {
    const containerName = "yuho-container";
    const strUrl = `https://cs110032002a220e751.blob.core.windows.net/${containerName}/edinet/${submitDate}/${docId}/orig.pdf`;
    return strUrl;
}

export const getTdnetUrl = (submitDate, pdfName) => {
    const containerName = "timely-disclosure-container";
    const strUrl = `https://cs110032002a220e751.blob.core.windows.net/${containerName}/tdnet/${submitDate}/${pdfName}`;
    return strUrl;
}

export const getUs8kUrl = (secCode, submitDate, pdfName) => {
    const containerName = "us-8k";
    const strUrl = `https://cs110032002a220e751.blob.core.windows.net/${containerName}/${secCode}/${submitDate}/${pdfName}.htm`;
    return strUrl;
}

export const getUsSecReportUrl = (secCode, pdfName) => {
    const containerName = "us-sec-report";
    const strUrl = `https://cs110032002a220e751.blob.core.windows.net/${containerName}/${pdfName}`;
    return strUrl;
}

// 単位を変換して返す ("x億", "x百万", ...)
export const convertSingleValue = (rawValue, unit="", toFixed=null) => {
    const converted = convertCurrency([rawValue], toFixed)
    if (converted['converted'][0] != '-') {
        return converted['converted'][0] + converted['unit'] + unit
    } else {
        return ''
    }
}

// 単位を変換して数値のみを返す ("x")
export const convertSingleValueOnly = (rawValue, toFixed=null) => {
    const converted = convertCurrency([rawValue], toFixed)
    return converted.converted[0]
}

// 単位を変換し単位のみを返す ("億", "千", ...)
export const convertSingleUnit = (rawValue, toFixed=null) => {
    const converted = convertCurrency([rawValue], toFixed)
    return converted['unit']
}

export const formatFiscalDateFromString = (fiscalDate, format='YYYY年m月期') => {
    // 文字列をDateオブジェクトに変換
    const date = new Date(fiscalDate);

    // 年と月を取得
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    // フォーマットされた文字列を返す
    if (format == "YYYY年m月期") {
        return `${year}年${month}月期`;
    } else if (format == "YYYY/m") {
        return `${year}/${month}`;
    } else if (format == "YYYY年m月") {
        return `${year}年${month}月`;
    } else if (format == "YYYY年m月d日") {
        return `${year}年${month}月${day}日`; 
    } else {
        return `${year}年${month}月期`;
    }

    
};

export const formatDateTimeString = (dateStr, format = 'YYYY年MM月DD日h:m:s') => {
    // 文字列をDateオブジェクトに変換
    const date = new Date(dateStr);

    // 各要素を取得
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 月は0から始まるため+1。2桁にする
    const day = String(date.getDate()).padStart(2, '0'); // 日も2桁にする
    const hours = String(date.getHours()).padStart(2, '0'); // 2桁にする
    const minutes = String(date.getMinutes()).padStart(2, '0'); // 2桁にする
    const seconds = String(date.getSeconds()).padStart(2, '0'); // 2桁にする

    // フォーマットされた文字列を返す
    if (format === "YYYY年MM月DD日h:m:s") {
        return `${year}年${month}月${day}日${hours}:${minutes}:${seconds}`;
    } else if (format === "YYYY年m月d日") {
        return `${year}年${parseInt(month)}月${parseInt(day)}日`;
    } else if (format === "YYYY年m月d日h:m:s") {
        return `${year}年${parseInt(month)}月${parseInt(day)}日${hours}:${minutes}:${seconds}`;
    } else if (format === "YYYY年m月") {
        return `${year}年${parseInt(month)}月`;
    } else if (format === "m月d日") {
        return `${parseInt(month)}月${parseInt(day)}日`;
    }

    // 他のフォーマットも追加可能
    return date.toLocaleString(); // デフォルトの形式で返す
};

export const toYYYYMMDD = (strDate) => {
    const date = new Date(strDate); // 入力された日付文字列をDateオブジェクトに変換
    const year = date.getFullYear(); // 年を取得
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 月を取得 (0が1月なので+1し、2桁にゼロ埋め)
    const day = String(date.getDate()).padStart(2, '0'); // 日を取得し、2桁にゼロ埋め

    return `${year}${month}${day}`; // YYYYMMDD形式にフォーマット
};

export const formatDateWeekday = (dateString) => {
    const date = new Date(dateString);
    
    // オプションで日付をフォーマット
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short', // 曜日を短縮形式で取得
    };
  
    // 日本のロケールでフォーマットする
    return new Intl.DateTimeFormat('ja-JP', options).format(date);
  };
  
export const exchangeToCurrency = (exchangeShortName) => {
    switch (exchangeShortName) {
        case 'NASDAQ':
            return 'USD'
        case 'NYSE':
            return 'USD'
        case 'JPX':
            return 'JPY'
        case 'SHZ':
            return 'CNY'
        case 'SHH':
            return 'CNY' 
        default:
            return ''
    }
}

export const exchangeToCurrencySymbol = (exchangeShortName) => {
    switch (exchangeShortName) {
        case 'NASDAQ':
            return currencyToSymbol('USD')
        case 'NYSE':
            return currencyToSymbol('USD')
        case 'JPX':
            return currencyToSymbol('JPY')
        case 'SHZ':
            return currencyToSymbol('CNY')
        case 'SHH':
            return currencyToSymbol('CNY')
        default:
            return ''
    }
}

export const getCountryName = (country) => {
    const countryNames = {
        US: '米国',
        JP: '日本',
        CN: '中国',
    };
    return countryNames[country] || null;
}


export const currencyToSymbol = (currency) => {
    const currencyNames = {
        USD: 'ドル',
        JPY: '円',
        CNY: '言',
    };
    return currencyNames[currency] || currency;
}


// export const saveAccessLog = async (activity) => {
//     try {
//         const response = await api.post(`${process.env.REACT_APP_API_URL}/chat/api/save-activity/`, {
//             activity: activity
//         })
//     } catch (error) {
//     }
// }


export const japaneseTickFormatter = (value, unit) => {
    if (Math.abs(value) >= 1e12) {
        return (value / 1e12).toFixed(1) + "兆" + unit; // 1兆 = 10^12
    } else if (Math.abs(value) >= 1e8) {
        return (value / 1e8).toFixed(1) + "億" + unit; // 1億 = 10^8
    } else if (Math.abs(value) >= 1e6) {
        return (value / 1e6).toFixed(1) + "百万" + unit; // 1億 = 10^8
    }
    return value.toString() + unit; // 1億未満はそのまま表示
};


export const getExchangeIcon = (exchange) => {
      const countryIcons = {
          // NASDAQ: usIcon,
          // NYSE: usIcon,
          // JPX: japanIcon,
          // SHZ: chinaIcon,
          // SHH: chinaIcon,
      };
      return countryIcons[exchange] || null;
  }

export const defaultStopColor = [
  { start: "rgba(45, 186, 177, .5)", end: "rgba(45, 186, 77, .5)", toolTip: "rgba(45, 186, 77, 1)" },
  { start: 'rgba(145, 186, 250, 1)', end: 'rgba(80, 140, 200, 1)' , toolTip: "rgba(80, 140, 200, 1)" },
  { start: 'rgba(225, 97, 50, 1)', end: 'rgba(255, 120, 90, 1)' , toolTip: "rgba(255, 120, 90, 1)" },
  { start: 'rgba(147, 112, 219, 1)', end: 'rgba(75, 0, 130, 1)' , toolTip: "rgba(75, 0, 130, 1))" },
  { start: 'rgba(255, 235, 59, 1)', end: 'rgba(251, 192, 45, 1)' , toolTip: "rgba(251, 192, 45, 1)" },
];

export const popularStopColor = [
  { start: 'rgba(145, 186, 250, 1)', end: 'rgba(80, 140, 200, 1)' , toolTip: "rgba(80, 140, 200, 1)" },
  { start: 'rgba(225, 97, 50, 1)', end: 'rgba(255, 120, 90, 1)', toolTip: "rgba(255, 120, 90, 1)" },
  { start: "rgba(45, 186, 177, .5)", end: "rgba(45, 186, 77, .5)", toolTip: "rgba(45, 186, 77, 1)" },
  { start: 'rgba(147, 112, 219, 1)', end: 'rgba(75, 0, 130, 1)' , toolTip: "rgba(75, 0, 130, 1))" },
  { start: 'rgba(255, 235, 59, 1)', end: 'rgba(251, 192, 45, 1)' , toolTip: "rgba(251, 192, 45, 1)" },
];