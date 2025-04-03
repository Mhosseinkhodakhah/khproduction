





export default class profitService {

    async makeProfit(invoices: any[], wallet: string, livePrice: string) {
        let newInvoices = []
        for (let i = 0; i < invoices.length; i++) {
            let data = {
                percent: ((((+livePrice) - (+invoices[i].goldPrice)) / (+livePrice)) * 100) / (+invoices[i]) / (+wallet),
                type: 1,
            }
            newInvoices.push(data)
        }
        let percent = 0;
        newInvoices.forEach((element)=>{
            if (element.type == 0){
                percent += element.percent
            }
            if (element.type == 1){
                percent -= element.percent
            }
        })

        console.log('the percent is >>>>>' , percent)
        return percent;
    }

}