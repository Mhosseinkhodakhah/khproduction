
import requests
import pandas as pd
import random 
from persiantools.jdatetime import JalaliDate
import datetime
from persiantools.jdatetime import JalaliDateTime

class userFilter():
    def __init__(self):
        self.url = 'http://localhost:3001/interservice/user/all'
        self.oldUrl = 'http://localhost:5004/interservice/user/all'
        # self.walletUrl = 'http://localhost:3001/interservice/wallet/all'
        self.path = '/etc/reports'
        print('its herer . . .' , self.url)
    
    ###this private method is for cleaning and making excell
    def __excellGeneratedTransActions(self , data):
        name = str(JalaliDate.today())
        number = str(datetime.datetime.now()).split(' ')[1]
        newData = []
        for i in data:
            # i['نام کاربر'] = f'{i['firstName']} {i['lastName']}'
            # i['نام پدر'] = i['fatherName']
            # i['شهر'] = i['officeName']
            # i['کد ملی کاربر'] = f'{i['nationalCode']}'
            # i['شماره همراه کاربر'] = i['phoneNumber']
            # i['شماره کارت کاربر'] = i['bankAccounts'][0]['cardNumber'] if (len(i['bankAccounts'])!=0) else ''
            # i['شماره شبا کاربر'] = i['bankAccounts'][0]['shebaNumber'] if (len(i['bankAccounts'])!=0) else ''
            # i['نام بانک کاربر'] = i['bankAccounts'][0]['name']  if (len(i['bankAccounts']) != 0) else ''
            i['موجودی صندوق طلای کاربر'] = i['wallet']['goldWeight']  
            i['موجودی ریالی کاربر'] = i['wallet']['balance']
            
            
            if (('bankAccounts' in i) and (len(i['bankAccounts']) != 0)):
                i['شماره کارت کاربر'] = i['bankAccounts'][0]['cardNumber'] 
                i['شماره شبا کاربر'] = i['bankAccounts'][0]['shebaNumber']
                i['نام بانک کاربر'] = i['bankAccounts'][0]['name']
                i.pop('bankAccounts')
            
            
            
            if ('bankAccounts' in i):
                i.pop('bankAccounts')
                

            if ('fullName' in i):
                pass
            else:
                i['fullName'] = f'{i['firstName']} {i['lastName']}'
                
            
            
            if ('verificationType' in i):
                if (i['verificationType'] == 2):
                    i['اطلاعات کاربر'] = 'بدون شماره همراه'
                elif(i['verificationType'] == 3):
                     i['اطلاعات کاربر'] = 'ناقص'
             
                elif(i['verificationType'] == 1):
                     i['اطلاعات کاربر'] = 'بدون کد ملی'
                     
                elif(i['verificationType'] == 0):
                     i['اطلاعات کاربر'] = 'کامل'
                i.pop('verificationType')
            else:
                i['اطلاعات کاربر'] = 'کامل'
                
            
            
            
            sellAmount = 0
            for k in i['sells']:
                if (k['status'] == 'completed'):
                    sellAmount += float(k['goldWeight'])
                
            buyAmount = 0
            for l in i['buys']:
                if (l['status'] == 'completed'):
                    buyAmount += float(l['goldWeight'])
            
            i['تعداد تراکنش های خرید'] = len(i['buys'])
            i['تعداد تراکنش های فروش'] = len(i['sells'])
            
            i['حجم تراکنش های خرید'] = buyAmount
            i['حجم تراکنش های فروش'] = sellAmount
            
            
            if (i['verificationStatus'] == 0):
                i['وضعیت احراز هویت'] = 'تایید شده'
            elif (i['verificationStatus'] == 1):
                 i['وضعیت احراز هویت'] = 'تایید نشده'
            elif (i['verificationStatus'] == 2):
                 i['وضعیت احراز هویت'] = 'کاربران تلفنی'
               
                                           
            if(i['gender'] == 'True'):
                i['جنسیت'] = 'مرد'
            elif(i['gender'] == False):
                i['جنسیت'] ='زن'
            
            if(i['liveStatus'] == 'True'):
                i['وضعیت حیات'] = 'مرحوم'
            elif(i['liveStatus'] == False):
                i['وضعیت حیات'] ='در قید حیات'
            
            
        
            # if (i['type'] == 'withdraw'):                
            #     i.pop('authority')
            #     i.pop('invoiceId')

            # if (i['type'] == 'deposit'):
            #     i.pop('withdrawalId')
                        
            i.pop('gender')
            i.pop('buys')
            i.pop('sells')
            i.pop('liveStatus')
            i.pop('identityNumber')
            i.pop('wallet')
            i.pop('verificationStatus')
            i.pop('email')
            i.pop('password')
            # i.pop('createdAt')
            i.pop('updatedAt')
            i.pop('deletedAt')
            i.pop('id')
            i.pop('identityTraceCode')
            i.pop('isSystemUser')
            i.pop('age')
            i.pop('isHaveBank')
            
            
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
                
                
            # i['type'] = 'واریز' if i['type'] == 'deposit' else 'برداشت'
            
            newData.append(i)
        
        df = pd.DataFrame.from_dict(newData)
        df.rename(columns={'birthDate': 'تاریخ تولد' ,'firstName' : 'نام' ,'lastName' : 'نام خانوادگی' ,'fatherName':'نام پدر' , 'identitySerial' : 'شماره سریال شناسنامه' ,
        'identitySeri' : 'شماره سری شناسنامه' , 'officeName' : 'محل تولد' , 'phoneNumber' : 'شماره تلفن ' , 
        'nationalCode' : 'کد ملی' ,'fullName' : 'نام کامل','createdAt' : 'تاریخ ثبت نام', 'createTime' : 'ساعت ثبت نام' , 'accounterDescription' : 'توضیحات حسابدار'  }, inplace=True)
        # print (df)
        df.to_excel(f'/etc/report/userdatas-{name}-{number}.xlsx')   
        return [f'https://excell.khanetala.ir/userdatas-{name}-{number}.xlsx' , f'کاربران-{name}-{number}']
    
    ###this private method is for filtering
    def __filter1(self , status ,startDate , endDate , startTime , endTime , data):
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
        if (status != 'all'):
            if (status == 'approved'):
                for i in data :
                    if (i['verificationStatus'] == 0):
                        firstFilter.append(i)
            elif(status == 'pending'):
                for i in data :
                    if (i['verificationStatus'] == 2):
                        firstFilter.append(i)  
        else:
            for i in data:
                if (i['verificationStatus'] == 0 or i['verificationStatus'] == 2):
                    firstFilter.append(i)            
            
            
        # firstFilter = data
        # print('111' , len(firstFilter))
        
        ###second filter for fromphone
        secondFilter = firstFilter
        
        ###third filter for status
        
        thirdFilter = secondFilter
        print('333' , len(thirdFilter))

        ###forth filter for user
        forthFilter = thirdFilter
        
        
        middleForth= forthFilter
                 
                 
        for i in data:
            time = str(datetime.datetime.strptime(str(i['createdAt']),"%Y-%m-%dT%H:%M:%S.%fZ")).split(' ')[0]
            dateTime = str(datetime.datetime.strptime(str(i['createdAt']),"%Y-%m-%dT%H:%M:%S.%fZ")).split(' ')[1]
            year = time.split('-')[0]
            month = time.split('-')[1]
            day = time.split('-')[2]
            hour = dateTime.split(':')[0]
            minute = dateTime.split(':')[1]
            second = dateTime.split(':')[2]
            newDate = str(JalaliDateTime.to_jalali(datetime.datetime(int(year), int(month), int(day), int(hour), int(minute), int(float(second)))))
            i['createdAt'] = newDate.split(' ')[0]
            i['createTime'] = newDate.split(' ')[1]
            print(i['createdAt'] , i['createTime'] )
        
        ###fifth filter
        if (startDate != 'all' and endDate != 'all'):
            start = {'year' : int(startDate.split('/')[0]) , 'month' : int(startDate.split('/')[1]) , 'day' : int(startDate.split('/')[2])}
            end = {'year' : int(endDate.split('/')[0]) , 'month' : int(endDate.split('/')[1]) , 'day' : int(endDate.split('/')[2])}
            # print('end' , end)
            if (start['year'] == end['year']):      # when in the both field enter same year
                if (start['month'] == end['month']):             #when in the both field enter same month
                    for i in middleForth:
                        fullTime = {'year' : int(i['createdAt'].split('-')[0]) , 'month' : int(i['createdAt'].split('-')[1]) , 'day' : int(i['createdAt'].split('-')[2])}
                        if ((fullTime['year'] == start['year'] and fullTime['month'] == start['month']) and(fullTime['day'] >= start['day'] and fullTime['day'] <= end['day'])):
                            fifthFilter.append(i)
                if (start['month'] < end['month']):
                    for i in middleForth:
                        fullTime = {'year' : int(i['createdAt'].split('-')[0]) , 'month' : int(i['createdAt'].split('-')[1]) , 'day' : int(i['createdAt'].split('-')[2])}
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
                    fullTime = {'year' : int(i['createdAt'].split('-')[0]) , 'month' : int(i['createdAt'].split('-')[1]) , 'day' : int(i['createdAt'].split('-')[2])}
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
        
        # print(fifthFilter)
        
        ###six filter
        if (startTime != 'all' and endTime != 'all'):
            timeStart = {'hour' : int(startTime.split(':')[0]) , 'minute' : int(startTime.split(':')[1]) , 'second' : int(startTime.split(':')[2])}
            # print( 'start', start)
            timeEnd = {'hour' : int(endTime.split(':')[0]) , 'minute' : int(endTime.split(':')[1]) , 'second' : int(endTime.split(':')[2])}
            for i in fifthFilter:
                timeFull = {'hour' : int(i['createTime'].split(':')[0]) , 'minute' : int(i['createTime'].split(':')[1]) , 'second' : int(i['createTime'].split(':')[2])}
                if ((timeFull['hour'] >= timeStart['hour'] and timeFull['hour'] <= timeEnd['hour']) and (timeFull['minute'] >= timeStart['minute'] and timeFull['minute'] <= timeEnd['minute'])and(timeFull['second'] >= timeStart['second'] and timeFull['second'] <= timeEnd['second'])):
                    sixFilter.append(i)
        else:
            sixFilter = fifthFilter
        
        
        path = self.__excellGeneratedTransActions(sixFilter)
        return [path[1] , path[0]]
    
    
    def getData(self , status ,startDate , endDate , startTime , endTime):
        response = requests.get(self.url)
        response2 = requests.get(self.oldUrl)
        data1 = response.json()
        data2 = response2.json()
        data = data1['data'] + data2['data']
        typeFilter = self.__filter1(status ,startDate , endDate , startTime , endTime , data)
        return typeFilter

            