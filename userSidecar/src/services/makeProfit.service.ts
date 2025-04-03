





export default class profitService {

    async makeProfit(invoices: any[], wallet: string, livePrice: string) {
        let newInvoices = []
        console.log('test for invoices?????' , wallet , livePrice)
        for (let i = 0; i < invoices.length; i++) {
            let data = {
                percent: ((((+livePrice) - (+invoices[i].goldPrice)) / (+livePrice)) * 100) / ((+invoices[i].goldWeight)/(+wallet)),
                type: (invoices[i].type.title == 'buy') ? 1 : 0,
            }
            console.log('after created data >>>>' , data)
            newInvoices.push(data)
        }
        let percent = 0;
        console.log('after don all data >>>' , newInvoices)
        newInvoices.forEach((element)=>{
            if (element.type == 0){
                console.log("type1111")
                percent -= (+element.percent)
            }
            if (element.type == 1){
                console.log('type2222')
                percent += (+element.percent)
            }
            console.log('percents>?>>>' , percent)
        })

        console.log('the percent is >>>>>' , percent)
        return percent;
    }

}