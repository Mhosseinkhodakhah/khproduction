import requests




class analyzor:
    
    def invoiceMaker(data,filter):
        return data
        
        




urls = {
    "invoices" : 'http://localhost:3003/interservice/invoice/all',
    "wallets" :  'http://localhost:3003/interservice/invoice/all',
    "users" : 'http://localhost:3003/interservice/invoice/all',
    "walletTransActions" : "http://localhost:3003/interservice/invoice/all",
}


analyz = analyzor()


class professionalFilter :
    def __init__(self , type):
        self.url = urls[type]
    
    def invoice(self , filter):
        
        if(filter['nationalCode'] != 'all'):
            response = requests.get(f'{self.url}?nationalCode={filter['nationalCode']}&tradeType={filter['tradeType']}&title={filter['type']}')
        elif(filter['phoneNumber'] != 'all'):
            response = requests.get(f'{self.url}?phoneNumber={filter['phoneNumber']}&tradeType={filter['tradeType']}&title={filter['type']}')
        elif (filter['firstName'] != 'all'):
            response = requests.get(f'{self.url}?firstName={filter['firstName']}&tradeType={filter['tradeType']}&title={filter['type']}')
        elif(filter['lastName'] != 'all'):
            response = requests.get(f'{self.url}?lastName={filter['lastName']}&tradeType={filter['tradeType']}&title={filter['type']}')
        else:
            response = requests.get(f'{self.url}?title={filter['type']}')
        
        data = response.json()
        finalData = analyz.invoiceMaker(data['data'] , filter)

        return finalData
        
        
    def wallet(self):
        pass
        
        
    def users(self):
        pass
        
        
    def walletInvoices(self):
        pass
        