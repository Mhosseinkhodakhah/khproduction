import requests




class analyzor:
    
    def __init__(self):
        pass
    
    
    def invoiceMaker(self , data , filter):
        
        tradeType = []
        for i in data:
            if (i['tradeType'] == filter['tradeType']):
                tradeType.append(i)
                
        
        
        goldPrice = []
        if (filter['goldPrice'] != 'all'):    
            for i in tradeType:
                if (int(i['goldPrice']) == int(filter['goldPrice'])):
                    goldPrice.append(i)
        else:
            goldPrice = tradeType
            
            
        
        goldWeight = []
        if (filter['goldWeight'] != 'all'):
            for i in goldPrice:
                if (float(i['goldWeight']) == float(filter['goldWeight'])):
                    goldWeight.append(i)
                    
        else:
            goldWeight = goldPrice
            
        
        
        admin = []
        if (filter['admin'] != 'all'):
            for i in goldWeight:
                if (filter['admin'] in i['adminId']):
                    admin.append(i)
                    
                    
        else:
            admin = goldWeight
            
        
        
        accountant = []
        if (filter['accounter'] != 'all'):
            for i in admin:
                if (filter['accounter'] in i['accounterId']):
                    accountant.append(i)
                    
        else:
            accountant = admin    
            
        
        
        
        return accountant
        
        


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
        print(len(data['data']))
        print(filter)
        finalData = analyz.invoiceMaker(data['data'] , filter)

        return finalData
        
        
    def wallet(self):
        pass
        
        
    def users(self):
        pass
        
        
    def walletInvoices(self):
        pass
        