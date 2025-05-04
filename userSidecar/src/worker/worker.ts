import { parentPort } from "worker_threads"

/**
 * this class is for making charts data for application and pannel
 */
export class analyzor {

    async start(users){
        console.log('after getting data >>>' , users.invoices[0])
        let analyzedData = await this.barChart(users.invoices)
        let lineChart = await this.lineChart(users.invoices)
        let priceChart = await this.monthlyPrice(users.prices)
        parentPort.postMessage({ appDashboard : priceChart , pannelCharts :  { barChart: analyzedData, lineChart: lineChart }})
    }

    
    private async firstMonthesOrSecondMonthes(month: string) {
        let mainMonth = 0;
        let firstMonthes = ['01',
            '02',
            '03',
            '04',
            '05',
            '06']
        let secondMonthes = ['07',
            '08',
            '09',
            '10',
            '11',
            '12']
        if (firstMonthes.includes(month)) {
            mainMonth = 0
        } else if (secondMonthes.includes(month)) {
            mainMonth = 1
        } else {
            mainMonth = 2
        }
        return mainMonth
    }


    private async wichMonth(month: string) {
        let mainMonth = '';
        switch (month) {
            case '01':
                mainMonth = 'farvardin';
                break;
            case '02':
                mainMonth = 'ordibehesht';
                break;
            case '03':
                mainMonth = 'khordad';
                break;
            case '04':
                mainMonth = 'tir';
                break;
            case '05':
                mainMonth = 'mordad';
                break;
            case '06':
                mainMonth = 'shahrivar';
                break;
            case '07':
                mainMonth = 'mehr';
                break;
            case '08':
                mainMonth = 'aban';
                break;
            case '09':
                mainMonth = 'azar';
                break;
            case '10':
                mainMonth = 'dey';
                break;
            case '11':
                mainMonth = 'bahman';
                break;
            case '12':
                mainMonth = 'esfand';
                break;
            case '۰۱':
                mainMonth = 'farvardin';
                break;
            case '۰۲':
                mainMonth = 'ordibehesht';

                break;
            case '۰۳':
                mainMonth = 'khordad';
                break;
            case '۰۴':
                mainMonth = 'tir';
                break;
            case '۰۵':
                mainMonth = 'mordad';
                break;
            case '۰۶':
                mainMonth = 'shahrivar';
                break;
            case '۰۷':
                mainMonth = 'mehr';
                break;
            case '۰۸':
                mainMonth = 'aban';
                break;
            case '۰۹':
                mainMonth = 'azar';
                break;
            case '۱۰':
                mainMonth = 'dey';
                break;
            case '۱۱':
                mainMonth = 'bahman';
                break;
            case '۱۲':
                mainMonth = 'esfand';
                break;
            default:
                break;
        }
        return mainMonth
    }


    private async changeMonthToPersian(month: string) {
        let persianMonth: string = '';

        switch (month) {
            case 'farvardin':
                persianMonth = 'فروردین';
                break;
            case 'ordibehesht':
                persianMonth = 'اردیبهشت';
                break;
            case 'khordad':
                persianMonth = 'خرداد';
                break;
            case 'tir':
                persianMonth = 'تیر';
                break;
            case 'mordad':
                persianMonth = 'مرداد';
                break;
            case 'shahrivar':
                persianMonth = 'شهریور';
                break;
            case 'mehr':
                persianMonth = 'مهر';
                break;
            case 'aban':
                persianMonth = 'آبان';
                break;
            case 'azar':
                persianMonth = 'آذر';
                break;
            case 'dey':
                persianMonth = 'دی';
                break;
            case 'bahman':
                persianMonth = 'بهمن';
                break;
            case 'esfand':
                persianMonth = 'اسفند';
                break;

            default:
                break;
        }
        return persianMonth;


    }


    private async changeToEnglish(number: string) {
        let englishNumber: number = 0;
        switch (number) {
            case '۰۱':
                englishNumber = 1
                break;
            case '۰۲':
                englishNumber = 2
                break;
            case '۰۳':
                englishNumber = 3
                break;
            case '۰۴':
                englishNumber = 4
                break;
            case '۰۵':
                englishNumber = 5
                break;
            case '۰۶':
                englishNumber = 6
                break;
            case '۰۷':
                englishNumber = 7
                break;
            case '۰۸':
                englishNumber = 8
                break;
            case '۰۹':
                englishNumber = 9
                break;
            case '۱۰':
                englishNumber = 10
                break;
            case '۱۱':
                englishNumber = 11
                break;
            case '۱۲':
                englishNumber = 12
                break;

            case '۱۳':
                englishNumber = 13
                break;
            case '۱۴':
                englishNumber = 14
                break;
            case '۱۵':
                englishNumber = 15
                break;
            case '۱۶':
                englishNumber = 16
                break;
            case '۱۷':
                englishNumber = 17
                break;
            case '۱۸':
                englishNumber = 18
                break;
            case '۱۹':
                englishNumber = 19
                break;
            case '۲۰':
                englishNumber = 20
                break;
            case '۲۱':
                englishNumber = 21
                break;
            case '۲۲':
                englishNumber = 22
                break;
            case '۲۳':
                englishNumber = 23
                break;
            case '۲۴':
                englishNumber = 24
                break;
            case '۲۵':
                englishNumber = 25
                break;
            case '۲۶':
                englishNumber = 26
                break;
            case '۲۷':
                englishNumber = 27
                break;
            case '۲۸':
                englishNumber = 28
                break;
            case '۲۹':
                englishNumber = 29
                break;
            case '۳۰':
                englishNumber = 30
                break;
            case '۳۱':
                englishNumber = 31
                break;
            case '۱':
                englishNumber = 1
                break;
            case '۲':
                englishNumber = 2
                break;
            case '۳':
                englishNumber = 3
                break;
            case '۴':
                englishNumber = 4
                break;
            case '۵':
                englishNumber = 5
                break;
            case '۶':
                englishNumber = 6
                break;
            case '۷':
                englishNumber = 7
                break;
            case '۸':
                englishNumber = 8
                break;
            case '۹':
                englishNumber = 9
                break;
            case '۱۰':
                englishNumber = 10
                break;
            case '۱۱':
                englishNumber = 11
                break;
            case '۱۲':
                englishNumber = 12
                break;

            case '۱۳':
                englishNumber = 13
                break;
            case '۱۴':
                englishNumber = 14
                break;
            case '۱۵':
                englishNumber = 15
                break;
            case '۱۶':
                englishNumber = 16
                break;
            case '۱۷':
                englishNumber = 17
                break;
            case '۱۸':
                englishNumber = 18
                break;
            case '۱۹':
                englishNumber = 19
                break;
            case '۲۰':
                englishNumber = 20
                break;
            case '۲۱':
                englishNumber = 21
                break;
            case '۲۲':
                englishNumber = 22
                break;
            case '۲۳':
                englishNumber = 23
                break;
            case '۲۴':
                englishNumber = 24
                break;
            case '۲۵':
                englishNumber = 25
                break;
            case '۲۶':
                englishNumber = 26
                break;
            case '۲۷':
                englishNumber = 27
                break;
            case '۲۸':
                englishNumber = 28
                break;
            case '۲۹':
                englishNumber = 29
                break;
            case '۳۰':
                englishNumber = 30
                break;
            case '۳۱':
                englishNumber = 31
                break;
            default:
                break;
        }
        return englishNumber
    }


    async barChart(data: any[]) {
        let mainMonth = {
            farvardin: 0,
            ordibehesht: 0,
            khordad: 0,
            tir: 0,
            mordad: 0,
            shahrivar: 0,
            mehr: 0,
            aban: 0,
            azar: 0,
            dey: 0,
            bahman: 0,
            esfand: 0
        }
        for (let i = 0; i < data.length; i++) {
            if (+data[i].goldWeight > 0){
            let weight = +data[i].goldWeight
            if (data[i].date) {
                let date = data[i].date.split('/')
                let nowDate = (new Date().toLocaleString('fa-IR').split(',')[0]).split('/')[0]
                if (date[0] == nowDate) {
                    switch (date[1]) {
                        case '۰۱':
                            if (data[i].type.title == 'sell') {
                                mainMonth.farvardin -= weight;
                            } else {
                                mainMonth.farvardin += weight;
                            }
                            break;
                        case '۰۲':
                            if (data[i].type.title == 'sell') {
                                mainMonth.ordibehesht -= weight;
                            } else {
                                mainMonth.ordibehesht += weight;
                            }
                            break;
                        case '۰۳':
                            if (data[i].type.title == 'sell') {
                                mainMonth.khordad -= weight;
                            } else {
                                mainMonth.khordad += weight;
                            }
                            break;
                        case '۰۴':
                            if (data[i].type.title == 'sell') {
                                mainMonth.tir -= weight;
                            } else {
                                mainMonth.tir += weight;
                            }
                            break;
                        case '۰۵':
                            if (data[i].type.title == 'sell') {
                                mainMonth.mordad -= weight;
                            } else {
                                mainMonth.mordad += weight;
                            }
                            break;
                        case '۰۶':
                            if (data[i].type.title == 'sell') {
                                mainMonth.shahrivar -= weight;
                            } else {
                                mainMonth.shahrivar += weight;
                            }
                            break;
                        case '۰۷':
                            if (data[i].type.title == 'sell') {
                                mainMonth.mehr -= weight;
                            } else {
                                mainMonth.mehr += weight;
                            }
                            break;
                        case '۰۸':
                            if (data[i].type.title == 'sell') {
                                mainMonth.aban -= weight;
                            } else {
                                mainMonth.aban += weight;
                            }
                            break;
                        case '۰۹':
                            if (data[i].type.title == 'sell') {
                                mainMonth.azar -= weight;
                            } else {
                                mainMonth.azar += weight;
                            }
                            break;
                        case '۱':
                            if (data[i].type.title == 'sell') {
                                mainMonth.farvardin -= weight;
                            } else {
                                mainMonth.farvardin += weight;
                            }
                            break;
                        case '۲':
                            if (data[i].type.title == 'sell') {
                                mainMonth.ordibehesht -= weight;
                            } else {
                                mainMonth.ordibehesht += weight;
                            }
                            break;
                        case '۳':
                            if (data[i].type.title == 'sell') {
                                mainMonth.khordad -= weight;
                            } else {
                                mainMonth.khordad += weight;
                            }
                            break;
                        case '۴':
                            if (data[i].type.title == 'sell') {
                                mainMonth.tir -= weight;
                            } else {
                                mainMonth.tir += weight;
                            }
                            break;
                        case '۵':
                            if (data[i].type.title == 'sell') {
                                mainMonth.mordad -= weight;
                            } else {
                                mainMonth.mordad += weight;
                            }
                            break;
                        case '۶':
                            if (data[i].type.title == 'sell') {
                                mainMonth.shahrivar -= weight;
                            } else {
                                mainMonth.shahrivar += weight;
                            }
                            break;
                        case '۷':
                            if (data[i].type.title == 'sell') {
                                mainMonth.mehr -= weight;
                            } else {
                                mainMonth.mehr += weight;
                            }
                            break;
                        case '۸':
                            if (data[i].type.title == 'sell') {
                                mainMonth.aban -= weight;
                            } else {
                                mainMonth.aban += weight;
                            }
                            break;
                        case '۹':
                            if (data[i].type.title == 'sell') {
                                mainMonth.azar -= weight;
                            } else {
                                mainMonth.azar += weight;
                            }
                            break;
                        case '۱۰':
                            if (data[i].type.title == 'sell') {
                                mainMonth.dey -= weight;
                            } else {
                                mainMonth.dey += weight;
                            }
                            break;
                        case '۱۱':
                            if (data[i].type.title == 'sell') {
                                mainMonth.bahman -= weight;
                            } else {
                                mainMonth.bahman += weight;
                            }
                            break;
                        case '۱۲':
                            if (data[i].type.title == 'sell') {
                                mainMonth.esfand -= weight;
                            } else {
                                mainMonth.esfand += weight;
                            }
                            mainMonth.esfand += weight;
                            break;
                        default:
                            break;
                    }
                }
            }
        }
    }
        let finalData = []
        let label = []
        for (let j of Object.keys(mainMonth)) {
            label.push(await this.changeMonthToPersian(j))
            finalData.push((mainMonth[j]).toFixed(2))
        }
        return { label: label, data: finalData };
    }


    async lineChart(data) {
        let mainMonth;
        let mainMonth2;
        let label1 = ['۰۱', '۰۲', '۰۳', '۰۴', '۰۵', '۰۶', '۰۷', '۰۸', '۰۹', '۱۰', '۱۱', '۱۲', '۱۳', '۱۴', '۱۵', '۱۶', '۱۷', '۱۸', '۱۹', '۲۰', '۲۱', '۲۲', '۲۳', '۲۴', '۲۵', '۲۶', '۲۷', '۲۸', '۲۹', '۳۰']
        let label2 = ['۰۱', '۰۲', '۰۳', '۰۴', '۰۵', '۰۶', '۰۷', '۰۸', '۰۹', '۱۰', '۱۱', '۱۲', '۱۳', '۱۴', '۱۵', '۱۶', '۱۷', '۱۸', '۱۹', '۲۰', '۲۱', '۲۲', '۲۳', '۲۴', '۲۵', '۲۶', '۲۷', '۲۸', '۲۹', '۳۰', '۳۱']
        let label;
        let monthType = await this.firstMonthesOrSecondMonthes(new Date().toLocaleString("fa-IR").split(',')[0].split('/')[1])
        if (monthType == 2) {
            label = label1
            mainMonth = new Array(30).fill(0)
            mainMonth2 = new Array(30).fill(0)
        } else {
            label = (monthType == 0) ? label2 : label1;
            mainMonth = (monthType == 0) ? new Array(31).fill(0) : new Array(30).fill(0)
            mainMonth2 = (monthType == 0) ? new Array(31).fill(0) : new Array(30).fill(0)
        }
        for (let i = 0; i < data.length; i++) {
            if (data[i].goldWeight > 0){
                if (data[i].date != null) {
                    let day = data[i].date.split('/');
                    let month = (new Date().toLocaleString("fa-Ir").split(",")[0]).split('/')[1]
                    let year = (new Date().toLocaleString("fa-Ir").split(",")[0]).split('/')[0]
                    if (day[0] == year && day[1] == month) {
                        let numberDay = await this.changeToEnglish(day[2])
                        if (data[i].type.title == 'sell'){
                            mainMonth2[numberDay - 1] = ((+mainMonth2[numberDay - 1])+(+data[i].goldWeight)).toFixed(2);
                        }else{
                            mainMonth[numberDay - 1] = ((+mainMonth[numberDay - 1])+(+data[i].goldWeight)).toFixed(2);
                        }
                    }
                }
            }
        }
        return [{ label: label, data: mainMonth }, { label: label, data: mainMonth2 }]
    }


    async monthlyPrice(prices) {
        let label = {
            farvardin: 0,
            ordibehesht: 0,
            khordad: 0,
            tir: 0,
            mordad: 0,
            shahrivar: 0,
            mehr: 0,
            aban: 0,
            azar: 0,
            dey: 0,
            bahman: 0,
            esfand: 0
        }
        let label3 = {
            farvardin: 0,
            ordibehesht: 0,
            khordad: 0,
            tir: 0,
            mordad: 0,
            shahrivar: 0,
            mehr: 0,
            aban: 0,
            azar: 0,
            dey: 0,
            bahman: 0,
            esfand: 0
        }
        let nowDate = new Date().toLocaleString('fa-IR').split(',')[0]
        let yearAgo = `${parseInt(nowDate.split('/')[0]) - 1}/${nowDate.split('/')[1]}/${nowDate.split('/')[2]}`
        for (let i = 0; i < prices.length; i++) {
            let year = prices[i].Date.split('/')[0]
            if (year == '1404') {
                let month2 = await this.wichMonth(prices[i].Date.split('/')[1])
                if (label[month2] < +prices[i].Geram18) {
                    label[month2] = +prices[i].Geram18;
                }
            }
            if (year == '1403') {
                let month3 = await this.wichMonth(prices[i].Date.split('/')[1])
                if (label3[month3] < +prices[i].Geram18) {
                    label3[month3] = +prices[i].Geram18;
                }
            }
        }
        let nowDate1 = await this.changeToEnglish(new Date().toLocaleString('fa-IR').split(',')[1])
        let newLabel = {}

        for (let i = 0; i < Object.keys(label3).length; i++) {
            let monthName = Object.keys(label3)[i]
            if (i >= nowDate1 + 1) {
                newLabel[monthName] = label3[Object.keys(label3)[i]]
            }
        }
        for (let i = 0; i < Object.keys(label).length; i++) {
            let monthName = Object.keys(label)[i]
            if (i <= nowDate1) {
                newLabel[monthName] = label[Object.keys(label)[i]]
            }
        }
        let data = []
        let label2 = []
        for (let j of Object.keys(newLabel)) {
            label2.push(await this.changeMonthToPersian(j))
            data.push(newLabel[j])
        }
        return { data: data, label: label2 }
    }
}


let starter = new analyzor()
parentPort.on('message' , async(msg)=>{
    await starter.start(msg)
})