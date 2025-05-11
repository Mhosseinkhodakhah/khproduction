import requests




class analyzor:
    
    def invoiceMaker(data,filter):
        
        #first filter
        firstName = []
        if (filter['firstName'] != 'all'):
            for i in data:    
                if (filter['firstName'] in i):
                    firstName.append(i)
        elif (filter['firstName'] == 'all'):
            firstName = data
        
        #seecondFilter
        lastName = []
        if (filter['lastName'] != 'all'):
            for i in firstName:
                if (filter['lasatName'] in i):
                    lastName.append(i)
        elif (filter['lastName'] == 'all'):
            lastName = firstName
            
            
        #thirdFilter
        nationalCode = []
        if (filter['nationalCode'] != 'all'):
            for i in lastName:
                if (filter['nationalCode'] in i):
                    nationalCode.append(i)
        elif (filter['nationalCode'] == 'all'):
            nationalCode = lastName
            
            
        #forthFilter
        
        




urls = {
    "invoices" : 'http://localhost:3001/interservice/invoice/all',
    "wallets" :  'http://localhost:3001/interservice/invoice/all',
    "users" : 'http://localhost:3001/interservice/invoice/all',
    "walletTransActions" : "http://localhost:3001/interservice/invoice/all",
}



class professionalFilter :
    def __init__(self , type):
        self.url = urls[type]
        self.response = requests.get(self.url).json()
        
        
    def invoice(self , filter):
        data = self.response.json()
        
        pass
        
        
    def wallet(self):
        pass
        
        
    def users(self):
        pass
        
        
    def walletInvoices(self):
        pass
        