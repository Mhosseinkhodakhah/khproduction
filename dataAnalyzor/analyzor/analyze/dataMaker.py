
import requests
import pandas as pd
import random 
from persiantools.jdatetime import JalaliDate
import datetime



class datamaker2():
    def __init__(self):
        self.url = 'http://localhost:3001/interservice/invoice/all'
        self.path = '/etc/reports'
        print('its herer . . .' , self.url)
    

    def __excellGeneratedTransActions(self , data):
        name = str(JalaliDate.today())
        number = str(datetime.datetime.now()).split(' ')[1]
        newData = []
        for i in data:
            i['type'] = i['type']['title']
            if (i['type'] == 'buy'):
                i['نام خریدار'] = f'{i['buyer']['firstName']} {i['buyer']['lastName']}'
                i['کد ملی خریدار'] = f'{i['buyer']['nationalCode']}'
                i['شماره همراه خریدار'] = i['buyer']['phoneNumber']
            elif(i['type'] == 'sell'):
                i['نام فروشنده'] = f'{i['seller']['firstName']} {i['seller']['lastName']}'
                i['کد ملی فروشنده'] = f'{i['seller']['nationalCode']}'
                i['شماره همراه فروشنده'] = i['seller']['phoneNumber']
            i.pop('buyer')
            i.pop('seller')
            i.pop('createdAt')
            i.pop('updatedAt')
            i.pop('deletedAt')
            
            if (i['status'] == 'completed'):
                i['status'] = 'موفق'
            elif(i['status'] == 'pending'):
                i['status'] = 'در انتظار'
            elif (i['status'] == 'failed'):
                i['status'] = 'نا موفق'
            elif (i['status'] == 'init'):
                i['status'] = 'پرداخت نشده'
                
                
            i['type'] = 'خرید' if i['type'] == 'buy' else 'فروش'
            if (i['fromPhone'] == True):
                i['معامله'] = 'تلفنی'
            elif(i['inPerson'] == True):
                i['معامله'] = 'حضوری'
            elif(i['fromGateway'] == True):
                i['معامله'] = 'آنلاین'
            i.pop('fromPhone')      
            i.pop('inPerson')         
            i.pop('fromGateway')      
            newData.append(i)
        
        df = pd.DataFrame.from_dict(newData)
        df.rename(columns={'goldPrice': 'قیمت طلا', 'goldWeight': 'حجم معامله', 'totalPrice': 'کل مبلغ معامله' , 'invoiceId':'شماره تراکنش' , 'status' : 'وضعیت معامله' ,
        'date' : 'تاریخ ثبت معامله' , 'time' : 'ساعت ثبت معامله'  , 'type' : 'نوع معامله' , 
        'buyer' : 'خریدار'  , 'seller' : 'فروشنده', 'authority' : 'شماره پیگیری درگاه' , 'adminId' : 'ادمین ثبت کننده' , 'accounterId' : 'حسابدار مربوط' , 'description' : 'توضیحات ادمین' , 'accounterDescription' : 'توضیحات حسابدار'  }, inplace=True)
        print (df)
        df.to_excel(f'/etc/report/invoice-{name}-{number}.xlsx') 
        return [f'https://excell.khaneetala.ir/invoice-{name}-{number}.xlsx' , f'معاملات-{name}-{number}']
        
        
    

    def __filter1(self , type , byPhone , status , user , startDate , endDate , startTime , endTime , data):
        # print(self.url)
        filters = [type , byPhone , status , user]
        # print([type , byPhone , status , user])
        firstFilter = []
        secondFilter = []
        thirdFilter = []
        forthFilter = []
        fifthFilter = []
        sixFilter = []
        seventhFilter = []
        ###first filter for type
        if (type != 'all'):
            for i in data :
                if (i['type']['title'] == type):
                    firstFilter.append(i)
        else:
            firstFilter = data
        
        print('111' , len(firstFilter))
        
        
        ###second filter for fromphone
        print(firstFilter[0])
        if (byPhone != 'all'):
            if (byPhone == 'fromPhone'):
                for i in firstFilter:
                    if (i['fromPhone'] == True):
                        secondFilter.append(i)
            elif(byPhone == 'fromGateway'):
                for i in firstFilter:
                    if (i['fromGateway'] == True):
                        secondFilter.append(i)
            elif(byPhone == 'inPerson'):
                for i in firstFilter:
                    print(i)
                    if (i['inPerson'] == True):
                        secondFilter.append(i)
        else:
            secondFilter = firstFilter

        print('222' , len(secondFilter))
        
        
        ###third filter for status
        if (status != 'all'):
            for i in secondFilter:
                if (i['status'] == status):
                    thirdFilter.append(i)
        else : 
            thirdFilter = secondFilter
        print('333' , len(thirdFilter))

        ###forth filter for user
        if (user != 'all'):
            if (type == 'buy'):
                for i in thirdFilter:
                    if (i['buyer']['nationalCode'] == user):
                        forthFilter.append(i)
            elif(type == 'sell'):
                for i in thirdFilter:
                    if (i['seller']['nationalCode'] == user):
                        forthFilter.append(i)
            elif(type == 'all') :
                for i in thirdFilter:
                    if (i['seller']['nationalCode'] == user or i['buyer']['nationalCode'] == user):
                        forthFilter.append(i)
        else : 
            forthFilter = thirdFilter
        
        middleForth =[]
        for j in forthFilter:
            if (':' in j['date']):
                time = j['time']
                date = j['date']
                j['date'] = time
                j['time'] = date
                middleForth.append(j)
                print(j['date'])  
            else:
                middleForth.append(j)
                 
        
        ###fifth filter
        if (startDate != 'all' and endDate != 'all'):
            start = {'year' : int(startDate.split('/')[0]) , 'month' : int(startDate.split('/')[1]) , 'day' : int(startDate.split('/')[2])}
            end = {'year' : int(endDate.split('/')[0]) , 'month' : int(endDate.split('/')[1]) , 'day' : int(endDate.split('/')[2])}
            # print('end' , end)
            if (start['year'] == end['year']):      # when in the both field enter same year
                if (start['month'] == end['month']):             #when in the both field enter same month
                    for i in middleForth:
                        fullTime = {'year' : int(i['date'].split('/')[0]) , 'month' : int(i['date'].split('/')[1]) , 'day' : int(i['date'].split('/')[2])}
                        if ((fullTime['year'] == start['year'] and fullTime['month'] == start['month']) and(fullTime['day'] >= start['day'] and fullTime['day'] <= end['day'])):
                            fifthFilter.append(i)
                if (start['month'] < end['month']):
                    for i in middleForth:
                        fullTime = {'year' : int(i['date'].split('/')[0]) , 'month' : int(i['date'].split('/')[1]) , 'day' : int(i['date'].split('/')[2])}
                        if ((fullTime['year'] == start['year']) and fullTime['month'] == start['month']):
                            if (fullTime['day'] > start['day']):
                                fifthFilter.append(i)
                                
                        elif((fullTime['year'] == start['year']) and fullTime['month'] == end['month']):
                            if (fullTime['day'] < end['day']):
                                fifthFilter.append(i)
                                
                        elif((fullTime['year'] == start['year']) and (fullTime['month'] > start['month'] and fullTime['month'] < end['month'])):
                            fifthFilter.append(i)
                            
                else : 
                    print('bad value')
            
            
            elif(start['year'] < end['year']):
                for i in middleForth:
                    fullTime = {'year' : int(i['date'].split('/')[0]) , 'month' : int(i['date'].split('/')[1]) , 'day' : int(i['date'].split('/')[2])}
                    if (fullTime['year'] == start['year']):
                        if (fullTime['month'] == start['month']):
                            if (fullTime['day'] >= start['day']):
                                fifthFilter.append(i)
                        elif(fullTime['month'] > start['month']):
                            fifthFilter.append(i)
                    elif(fullTime['year'] == end['year']):
                        if (fullTime['month'] == end['month']):
                            if (fullTime['day'] <= end['day']):
                                fifthFilter.append(i)
                        elif(fullTime['month'] < end['month']):
                            fifthFilter.append(i)
                    elif(fullTime['year'] > start['year'] and fullTime['year'] < end['year']):
                        fifthFilter.append(i)
            else:
                print('bad input value')  
                
        else:
            fifthFilter = middleForth      
        
        print(fifthFilter)
        
        ###six filter
        
        if (startTime != 'all' and endTime != 'all'):
            timeStart = {'hour' : int(startTime.split(':')[0]) , 'minute' : int(startTime.split(':')[1]) , 'second' : int(startTime.split(':')[2])}
            print( 'start', start)
            timeEnd = {'hour' : int(endTime.split(':')[0]) , 'minute' : int(endTime.split(':')[1]) , 'second' : int(endTime.split(':')[2])}
            for i in fifthFilter:
                timeFull = {'hour' : int(i['time'].split(':')[0]) , 'minute' : int(i['time'].split(':')[1]) , 'second' : int(i['time'].split(':')[2])}
                if ((timeFull['hour'] >= timeStart['hour'] and timeFull['hour'] <= timeEnd['hour']) and (timeFull['minute'] >= timeStart['minute'] and timeFull['minute'] <= timeEnd['minute'])and(timeFull['second'] >= timeStart['second'] and timeFull['second'] <= timeEnd['second'])):
                    sixFilter.append(i)
             
        else:
            sixFilter = fifthFilter
        
        path = self.__excellGeneratedTransActions(sixFilter)
        return [path[1] , path[0]]

    def getData(self , type , fromPhone , status , nationalCode , startDate , endDate , startTime , endTime):
        response = requests.get(self.url)
        print(type , fromPhone , status , nationalCode)
        data = response.json()
        # print(data['data'][0])
        typeFilter = self.__filter1(type , fromPhone , status , nationalCode , startDate , endDate , startTime , endTime , data['data'])
        print(typeFilter)
        return typeFilter

            