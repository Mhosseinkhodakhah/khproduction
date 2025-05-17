import requests




class analyzor:
    
    def __init__(self):
        pass
    
    
    def invoiceMaker(self , data , filter):
        
        
        
        #################### 1 ####################   
        #first filter for trade type
        tradeType = []
        for i in data:
            if (int(i['tradeType']) == int(filter['tradeType'])):
                tradeType.append(i)
                
        #################### 1 ################### 
                
        ################## new ######################        
        status = []
        if (filter['status'] != 'all'):    
            for i in tradeType:
                print('test>>>' , int(i['status']))
                if (int(i['status']) == int(filter['status'])):
                    status.append(i)
        else:
            status = tradeType
        ################## new ######################     
        

        ################## new ######################
        invoiceId = []
        if (filter['invoiceId'] != 'all'):
            for i in status:
                if (filter['invoiceId'] in i['invoiceId']):
                    invoiceId.append(i)
        else:
            invoiceId = status
        ################## new ######################

    
                
        ################## 2 ######################        
        #filter for goldPrice 
        goldPrice = []
        if (filter['goldPrice'] != 'all'):    
            for i in invoiceId:
                print('test>>>' , int(i['goldPrice']))
                if (int(i['goldPrice']) == int(filter['goldPrice'])):
                    goldPrice.append(i)
        else:
            goldPrice = invoiceId
        ################## 2 ######################      
                        
                        
                        
        ################### 3 #####################        
        #filter for goldWeight
        goldWeight = []
        if (filter['goldWeight'] != 'all'):
            for i in goldPrice:
                if (float(i['goldWeight']) == float(filter['goldWeight'])):
                    goldWeight.append(i)
                    
        else:
            goldWeight = goldPrice
        ################## 3 #####################        
                    
                    
        
        ################## 4 ######################        
        #filter for admin
        admin = []
        if (filter['admin'] != 'all'):
            for i in goldWeight:
                if (filter['admin'] in i['adminId']):
                    admin.append(i)
        else:
            admin = goldWeight
        ################## 4 ######################        
        
        
        
        ################## 5 ######################
        #filter for accounter
        accountant = []
        if (filter['accounter'] != 'all'):
            for i in admin:
                if (filter['accounter'] in i['accounterId']):
                    accountant.append(i)
        else:
            accountant = admin    
        ################# 5 #######################        
        
        
        
        ################## 6 ######################
        #filter for accounter
        startDate = []
        if (filter['startDate'] != 'all'):
            mainyear = int(startDate.split('/')[0])
            mainmonth = int(startDate.split('/')[1])
            mainday = int(startDate.split('/')[2])
            for i in accountant:
                year = int(i['date'].split('/')[0])
                month = int(i['date'].split('/')[1])
                day = int(i['date'].split('/')[2])
                if (year == mainyear):
                    print('first condition done >>> ')                    
                    if (month == mainmonth):
                        print('second condition done >>> ')                    
                        if (day >= mainday):
                            print('third conditions >>> ')
                            startDate.append(i)
                    elif(month > mainmonth):
                        print('forth conditions')
                        startDate.append(i)
                elif(year > mainyear):
                    print('fifth conditions >>>> ')
                    startDate.append(i)
        else:
            startDate = accountant
        ################# 6 #######################  
        
        
        ################## 7 ######################
        endDate=[]
        if (filter['endDate'] != 'all'):
            mainyear = int(endDate.split('/')[0])
            mainmonth = int(endDate.split('/')[1])
            mainday = int(endDate.split('/')[2])
            for i in startDate:
                year = int(i['date'].split('/')[0])
                month = int(i['date'].split('/')[1])
                day = int(i['date'].split('/')[2])
                if (year == mainyear):
                    if (month == mainmonth):
                        if (day <= mainday):
                            endDate.append(i)
                        
                    elif(month < mainmonth):
                        endDate.append(i)
                elif(year < mainyear):
                    endDate.append(i)
        else:
            endDate = startDate
        ################## 7 ######################      
        
        
        
        ################## 8 ######################
        startTime = []
        if (filter['startTime'] != 'all'):
            mainTime = int(startTime.split(':')[0])
            for i in endDate:
                mainyear = int(startDate.split('/')[0])
                mainmonth = int(startDate.split('/')[1])
                mainday = int(startDate.split('/')[2])
                year = int(i['date'].split('/')[0])
                month = int(i['date'].split('/')[1])
                day = int(i['date'].split('/')[2])
                time = int(i['time'].split(':')[0])
                if (year == mainyear):
                    if (month == mainmonth):
                        if (day == mainday):
                            if (time >= mainTime):
                                startTime.append(i)
                        elif (day > mainday):
                            startTime.append(i)
                    elif(month > mainmonth):
                        startTime.append(i)
                elif(year > mainyear):
                    startTime.append(i)
        else:
            startTime = endDate
        ################## 8 ######################      
        
        
        
        
        ################## 9 ######################
        endTime = []
        if (filter['endTime'] != 'all'):
            mainTime = int(endTime.split(':')[0])
            for i in startTime:
                    mainyear = int(endDate.split('/')[0])
                    mainmonth = int(endDate.split('/')[1])
                    mainday = int(endDate.split('/')[2])
                    year = int(i['date'].split('/')[0])
                    month = int(i['date'].split('/')[1])
                    day = int(i['date'].split('/')[2])
                    time = int(i['time'].split(':')[0])
                    if (year == mainyear):
                        if (month == mainmonth):
                            if (day == mainday):
                                if (time <= mainTime):
                                    endTime.append(i)
                            elif (day < mainday):
                                endTime.append(i)
                        elif(month < mainmonth):
                            endTime.append(i)
                    elif(year < mainyear):
                        endTime.append(i)
        else:
            endTime = startTime
        ################## 9 ######################
        return endTime
    
    
    

    
    ###############################################################
    ###############################################################
    ###############################################################
    def walletTransActionMaker(self , data , filter):
        ################## 1 ######################
        cardPan = []
        if (filter['cardPan'] != 'all'):
            for i in data:
                if(filter['cardPan'] in i['cardPan']):
                    cardPan.append(i)
                    
        else:
            cardPan = data
        ################## 1 ######################
        
        ################## 2 ######################
        shebaNumber = []
        if (filter['shebaNumber'] != 'all'):
            for i in cardPan:
                if (filter['shebaNumber'] in i['shebaNumber']):
                    shebaNumber.append(i)
        else:
            shebaNumber = cardPan
        ################## 2 ######################
    
        ################## 3 ######################
        invoiceId = []
        if (filter['invoiceId'] != 'all'):
            for i in shebaNumber:
                if (filter['invoiceId'] in i['invoiceId']):
                    invoiceId.append(i)
        else:
            invoiceId = shebaNumber
        ################## 3 ######################
        
        ################## 4 ######################
        withdrawalId = []
        if (filter['withdrawalId'] != 'all'):
            for i in invoiceId:
                if (filter['withdrawalId'] in i['withdrawalId']):
                    withdrawalId.append(i)
        else:
            withdrawalId = invoiceId
        ################## 4 ######################
        
        ################## 5 ######################
        amount = []
        if (filter['amount'] != 'all'):
            for i in withdrawalId:
                if (int(filter['amount']) == int(i['amount'])):
                    amount.append(i)
        else:
            amount = withdrawalId
        ################## 5 ######################
        
        ################## 6 ######################
        description = []
        if (filter['description'] != 'all'):
            for i in amount:
                if (filter['description'] in i['description']):
                    description.append(i)
        else:
            description = amount
        ################## 6 ######################
        
        
        ################## 7 ######################
        #filter for accounter
        startDate = []
        if (filter['startDate'] != 'all'):
            mainyear = int(startDate.split('/')[0])
            mainmonth = int(startDate.split('/')[1])
            mainday = int(startDate.split('/')[2])
            for i in description:
                year = int(i['date'].split('/')[0])
                month = int(i['date'].split('/')[1])
                day = int(i['date'].split('/')[2])
                if (year == mainyear):
                    print('first condition done >>> ')                    
                    if (month == mainmonth):
                        print('second condition done >>> ')                    
                        if (day >= mainday):
                            print('third conditions >>> ')
                            startDate.append(i)
                    elif(month > mainmonth):
                        print('forth conditions')
                        startDate.append(i)
                elif(year > mainyear):
                    print('fifth conditions >>>> ')
                    startDate.append(i)
        else:
            startDate = description
        ################# 7 #######################  
        
        
        
         ################## 8 ######################
        endDate=[]
        if (filter['endDate'] != 'all'):
            mainyear = int(endDate.split('/')[0])
            mainmonth = int(endDate.split('/')[1])
            mainday = int(endDate.split('/')[2])
            for i in startDate:
                year = int(i['date'].split('/')[0])
                month = int(i['date'].split('/')[1])
                day = int(i['date'].split('/')[2])
                if (year == mainyear):
                    if (month == mainmonth):
                        if (day <= mainday):
                            endDate.append(i)
                        
                    elif(month < mainmonth):
                        endDate.append(i)
                elif(year < mainyear):
                    endDate.append(i)
        else:
            endDate = startDate
        ################## 8 ###################### 
        
        
        ################## 9 ######################
        startTime = []
        if (filter['startTime'] != 'all'):
            mainTime = int(startTime.split(':')[0])
            for i in endDate:
                mainyear = int(startDate.split('/')[0])
                mainmonth = int(startDate.split('/')[1])
                mainday = int(startDate.split('/')[2])
                year = int(i['date'].split('/')[0])
                month = int(i['date'].split('/')[1])
                day = int(i['date'].split('/')[2])
                time = int(i['time'].split(':')[0])
                if (year == mainyear):
                    if (month == mainmonth):
                        if (day == mainday):
                            if (time >= mainTime):
                                startTime.append(i)
                        elif (day > mainday):
                            startTime.append(i)
                    elif(month > mainmonth):
                        startTime.append(i)
                elif(year > mainyear):
                    startTime.append(i)
        else:
            startTime = endDate
        ################## 9 ######################      
        
        
        
        
        ################## 10 ######################
        endTime = []
        if (filter['endTime'] != 'all'):
            mainTime = int(endTime.split(':')[0])
            for i in startTime:
                    mainyear = int(endDate.split('/')[0])
                    mainmonth = int(endDate.split('/')[1])
                    mainday = int(endDate.split('/')[2])
                    year = int(i['date'].split('/')[0])
                    month = int(i['date'].split('/')[1])
                    day = int(i['date'].split('/')[2])
                    time = int(i['time'].split(':')[0])
                    if (year == mainyear):
                        if (month == mainmonth):
                            if (day == mainday):
                                if (time <= mainTime):
                                    endTime.append(i)
                            elif (day < mainday):
                                endTime.append(i)
                        elif(month < mainmonth):
                            endTime.append(i)
                    elif(year < mainyear):
                        endTime.append(i)
        else:
            endTime = startTime
        ################## 10 ######################

        return endTime
        
        
        

urls = {
    "invoices" : 'http://localhost:3003/interservice/invoice/all',
    "wallets" :  'http://localhost:3003/interservice/invoice/all',
    "users" : 'http://localhost:3003/interservice/invoice/all',
    "walletTransActions" : "http://localhost:3003/interservice/wallettransactions/all",
}


analyz = analyzor() 


class professionalFilter :
    def __init__(self , type):
        self.url = urls[type]
    
    def invoice(self , filter):
        if(filter['nationalCode'] != 'all'):
            response = requests.get(f'{self.url}?nationalCode={filter['nationalCode']}&tradeType={filter['tradeType']}&title={filter['type']}&status={filter['status']}')
        elif(filter['phoneNumber'] != 'all'):
            response = requests.get(f'{self.url}?phoneNumber={filter['phoneNumber']}&tradeType={filter['tradeType']}&title={filter['type']}&status={filter['status']}')
        elif (filter['firstName'] != 'all'):
            response = requests.get(f'{self.url}?firstName={filter['firstName']}&tradeType={filter['tradeType']}&title={filter['type']}&status={filter['status']}')
        elif(filter['lastName'] != 'all'):
            response = requests.get(f'{self.url}?lastName={filter['lastName']}&tradeType={filter['tradeType']}&title={filter['type']}&status={filter['status']}')
        else:
            response = requests.get(f'{self.url}?title={filter['type']}&status={filter['status']}')
        data = response.json()
        print(len(data['data']))
        print(filter)
        finalData = analyz.invoiceMaker(data['data'] , filter)
        return finalData
        
        
    def wallet(self , filter):
        pass


    def users(self):
        pass
        
        
    def walletInvoices(self , filter):
        if(filter['nationalCode'] != 'all'):
            response = requests.get(f'{self.url}?nationalCode={filter['nationalCode']}&type={filter['type']}&status={filter['status']}')
        elif(filter['phoneNumber'] != 'all'):
            response = requests.get(f'{self.url}?phoneNumber={filter['phoneNumber']}&type={filter['type']}&status={filter['status']}')
        elif (filter['firstName'] != 'all'):
            response = requests.get(f'{self.url}?firstName={filter['firstName']}&type={filter['type']}&status={filter['status']}')
        elif(filter['lastName'] != 'all'):
            response = requests.get(f'{self.url}?lastName={filter['lastName']}&type={filter['type']}&status={filter['status']}')
        else:
            response = requests.get(f'{self.url}?type={filter['type']}&status={filter['status']}')
        data = response.json()
        # print(len(data['data']))
        # print(filter)
        finalData = analyz.walletTransActionMaker(data['data'] , filter)
        return finalData