
import requests
import pandas as pd
import random 
from persiantools.jdatetime import JalaliDate
import datetime


class getWithdrawal():
    def __init__(self):
        self.url = 'http://localhost:3001/interservice/invoice/all'
        self.walletUrl = 'http://localhost:3001/interservice/wallet/all'
        self.path = '/etc/reports'
        print('its herer . . .' , self.url)
    
    ###this private method is for cleaning and making excell
    def __excellGeneratedTransActions(self , data):
        name = str(JalaliDate.today())
        number = str(datetime.datetime.now()).split(' ')[1]
        newData = []
        for i in data:
            i['نام کاربر'] = f'{i['wallet']['user']['firstName']} {i['wallet']['user']['lastName']}'
            # i['نام پدر'] = i['wallet']['user']['fatherName']
            # i['شهر'] = i['wallet']['user']['officeName']
            i['کد ملی کاربر'] = f'{i['wallet']['user']['nationalCode']}'
            i['شماره همراه کاربر'] = i['wallet']['user']['phoneNumber']
            i['شماره کارت کاربر'] = i['wallet']['user']['bankAccounts'][0]['cardNumber']
            i['شماره شبا کاربر'] = i['wallet']['user']['bankAccounts'][0]['shebaNumber']
            i['نام بانک کاربر'] = i['wallet']['user']['bankAccounts'][0]['name']
            # i['موجودی صندوق طلای کارب'] = i['wallet']['goldWeight']
            # i['موجودی ریالی کاربر'] = int(i['wallet']['balance'])
            
            
            # if (i['type'] == 'withdraw'):                
            i.pop('authority')
            i.pop('invoiceId')

            if (i['type'] == 'deposit'):
                i.pop('withdrawalId')
            
            i['amount'] = int(i['amount'])
            
            i.pop('wallet')
            i.pop('createDate')
            i.pop('updatedAt')
            i.pop('deletedAt')
            i.pop('id')
            
            # if (i['status'] == 'completed'):
            #     i['status'] = 'موفق'
            # elif(i['status'] == 'pending' and i['type'] == 'withdraw'):
            #     i['status'] = 'در انتظار واریز'
            # elif(i['status'] == 'pending' and i['type'] == 'deposit'):
            #     i['status'] = 'تراکنش نا مشخص از سمت درگاه'
            # elif (i['status'] == 'failed'):
            #     i['status'] = 'نا موفق'
            # elif (i['status'] == 'init'):
            #     i['status'] = 'پرداخت نشده'
            
            i.pop('status')
            i.pop('description')
            i.pop('authority')
            i.pop('time')
            i.pop('date')
            
            # i['type'] = 'واریز' if i['type'] == 'deposit' else 'برداشت'
            i.pop('type')
            
            newData.append(i)
        
        df = pd.DataFrame.from_dict(newData)
        df.rename(columns={'totalPrice': 'کل مبلغ معامله' ,'withdrawalId' : 'شماره پیگیری تراکنش' ,'amount' : 'مقدار' ,'invoiceId':'شماره تراکنش' , 'status' : 'وضعیت معامله' ,
        'date' : 'تاریخ ثبت تراکنش' , 'time' : 'ساعت ثبت تراکنش' , 'type' : 'نوع معامله' , 
        'authority' : 'شماره پیگیری درگاه' ,'admin' : 'ادمین فعال در تراکنش','adminDescription' : 'توضیحات ادمین', 'description' : 'توضیحات تراکنش' , 'accounterDescription' : 'توضیحات حسابدار'  }, inplace=True)
        # print (df)
        df.to_excel(f'/etc/report/walletTransActions-{name}-{number}.xlsx')   
        return [f'https://excell.khanetala.ir/walletTransActions-{name}-{number}.xlsx' , f'واریز برداشت-{name}-{number}']
    
    
    
    
    
    
    
    
    
    ###this private method is for filtering
    def __filter1(self , data):
        # print(self.url)
        # filters = [type , byPhone , status , user]
        # print([type , byPhone , status , user])
        firstFilter = []
        secondFilter = []
        thirdFilter = []
        forthFilter = []
        fifthFilter = []
        sixFilter = []
        ###first filter for type
        # if (type != 'all'):
        for i in data :
            if (i['type'] == 'withdraw'):
                firstFilter.append(i)
        # else:
        #     firstFilter = data
        
        print('111' , len(firstFilter))
        
        
        ###second filter for fromphone
        secondFilter = firstFilter
        
        ###third filter for status
        # if (status != 'all'):
        for i in secondFilter:
            if (i['status'] == 'pending'):
                thirdFilter.append(i)
        # else : 
            # thirdFilter = secondFilter
        print('333' , len(thirdFilter))

        ###forth filter for user
        # # if (user != 'all'):
        # for i in thirdFilter:
        #     if (i['wallet']['user']['nationalCode'] == user):
        #         forthFilter.append(i)
        # else : 
        forthFilter = thirdFilter
        
        
        # middleForth =[]
        # for j in forthFilter:
        #     if (':' in j['date']):
        #         time = j['time']
        #         date = j['date']
        #         j['date'] = time
        #         j['time'] = date
        #         middleForth.append(j)
        #         print(j['date'])  
        #     else:
        #         middleForth.append(j)
                 
        
        # ###fifth filter
        # if (startDate != 'all' and endDate != 'all'):
        #     start = {'year' : int(startDate.split('/')[0]) , 'month' : int(startDate.split('/')[1]) , 'day' : int(startDate.split('/')[2])}
        #     end = {'year' : int(endDate.split('/')[0]) , 'month' : int(endDate.split('/')[1]) , 'day' : int(endDate.split('/')[2])}
        #     # print('end' , end)
        #     if (start['year'] == end['year']):      # when in the both field enter same year
        #         if (start['month'] == end['month']):             #when in the both field enter same month
        #             for i in middleForth:
        #                 fullTime = {'year' : int(i['date'].split('/')[0]) , 'month' : int(i['date'].split('/')[1]) , 'day' : int(i['date'].split('/')[2])}
        #                 if ((fullTime['year'] == start['year'] and fullTime['month'] == start['month']) and(fullTime['day'] >= start['day'] and fullTime['day'] <= end['day'])):
        #                     fifthFilter.append(i)
        #         if (start['month'] < end['month']):
        #             for i in middleForth:
        #                 fullTime = {'year' : int(i['date'].split('/')[0]) , 'month' : int(i['date'].split('/')[1]) , 'day' : int(i['date'].split('/')[2])}
        #                 if ((fullTime['year'] == start['year']) and fullTime['month'] == start['month']):
        #                     if (fullTime['day'] > start['day']):
        #                         fifthFilter.append(i)
                                
        #                 elif((fullTime['year'] == start['year']) and fullTime['month'] == end['month']):
        #                     if (fullTime['day'] < end['day']):
        #                         fifthFilter.append(i)
                                
        #                 elif((fullTime['year'] == start['year']) and (fullTime['month'] > start['month'] and fullTime['month'] < end['month'])):
        #                     fifthFilter.append(i)     
        #         else : 
        #             print('bad value')
            
            
        #     elif(start['year'] < end['year']):
        #         for i in middleForth:
        #             fullTime = {'year' : int(i['date'].split('/')[0]) , 'month' : int(i['date'].split('/')[1]) , 'day' : int(i['date'].split('/')[2])}
        #             if (fullTime['year'] == start['year']):
        #                 if (fullTime['month'] == start['month']):
        #                     if (fullTime['day'] >= start['day']):
        #                         fifthFilter.append(i)
        #                 elif(fullTime['month'] > start['month']):
        #                     fifthFilter.append(i)
        #             elif(fullTime['year'] == end['year']):
        #                 if (fullTime['month'] == end['month']):
        #                     if (fullTime['day'] <= end['day']):
        #                         fifthFilter.append(i)
        #                 elif(fullTime['month'] < end['month']):
        #                     fifthFilter.append(i)
        #             elif(fullTime['year'] > start['year'] and fullTime['year'] < end['year']):
        #                 fifthFilter.append(i)
        #     else:
        #         print('bad input value')  
                
        # else:
        fifthFilter = forthFilter      
        
        print(fifthFilter)
        
        ###six filter
        # if (startTime != 'all' and endTime != 'all'):
        #     timeStart = {'hour' : int(startTime.split(':')[0]) , 'minute' : int(startTime.split(':')[1]) , 'second' : int(startTime.split(':')[2])}
        #     print( 'start', start)
        #     timeEnd = {'hour' : int(endTime.split(':')[0]) , 'minute' : int(endTime.split(':')[1]) , 'second' : int(endTime.split(':')[2])}
        #     for i in fifthFilter:
        #         timeFull = {'hour' : int(i['time'].split(':')[0]) , 'minute' : int(i['time'].split(':')[1]) , 'second' : int(i['time'].split(':')[2])}
        #         if ((timeFull['hour'] >= timeStart['hour'] and timeFull['hour'] <= timeEnd['hour']) and (timeFull['minute'] >= timeStart['minute'] and timeFull['minute'] <= timeEnd['minute'])and(timeFull['second'] >= timeStart['second'] and timeFull['second'] <= timeEnd['second'])):
        #             sixFilter.append(i)
             
        # else:
        
        sixFilter = fifthFilter
        
        path = self.__excellGeneratedTransActions(sixFilter)
        return [path[1] , path[0]]
    
    
    def getData(self ):
        response = requests.get(self.walletUrl)
        # print(type , status , nationalCode)
        data = response.json()
        # print(data['data'][0])
        typeFilter = self.__filter1(data['data'])
        print(typeFilter)
        return typeFilter

            