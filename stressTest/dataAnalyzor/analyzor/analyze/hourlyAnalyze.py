
import requests
import pandas as pd
import random 
from persiantools.jdatetime import JalaliDate
import datetime
from persiantools.jdatetime import JalaliDate
import datetime
from persiantools.jdatetime import JalaliDateTime
import jdatetime 

class hourlyFilter():
    def __init__(self):
        self.url = 'http://localhost:3001/interservice/report/hour'
        self.path = '/etc/reports'
        print('its herer . . .' , self.url)

    ###this private method is for cleaning and making excell
    def __excellGeneratedTransActions(self , data):
        name = str(JalaliDate.today())
        number = int(random.random()*1000000)
        print(data)
        df = pd.DataFrame.from_dict([data])

        df.to_excel(f'/etc/report/hourlyReport-{name}-{number}.xlsx')   
        return f'https://excell.khaneetala.ir/hourlyReport-{name}-{number}.xlsx'
    
    ###this private method is for filtering
    def __filter1(self , data):
        localTime = str(datetime.datetime.today()).split(' ')[1]
        nowDate = f'{int(str(JalaliDate.today()).split('-')[0])}-{int(str(JalaliDate.today()).split('-')[1])}-{int(str(JalaliDate.today()).split('-')[2])}'
        nowTime = f'{int(localTime.split(':')[0])}:{int(localTime.split(':')[1])}:00'
        print(nowDate)
        print(nowTime)
        
        allUsersList = []
        for i in data['allUsers']:
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
            print('in user counter>>>>' , i['createdAt'] , i['createTime'])
            if (i['createdAt'] == nowDate):
                print('user in 1' ,nowTime.split(':')[0] , i['createTime'].split(':')[0] )
                if ((int(nowTime.split(':')[0]))-(int(i['createTime'].split(':')[0])) == 1):
                    print('user in 2' ,nowTime.split(':')[1] , i['createTime'].split(':')[1] )
                    if ((int(nowTime.split(':')[1])) - (int(i['createTime'].split(':')[1])) <= 0):
                        print('user in 3' ,nowTime.split(':')[1] , i['createTime'].split(':')[1] )
                        allUsers.append(i)
            # print(i['createdAt'] , i['createTime'] )

        
        allTransActions = []
        for i in data['transActions']:
            if ( ':' in i['date']):
                d = i['date']
                t = i['time']
                i['date'] = t
                i['time'] = d
            year = int(i['date'].split('/')[0])
            month = int(i['date'].split('/')[1])
            day = int(i['date'].split('/')[2])
            finalDate = f'{year}-{month}-{day}'
            if (finalDate == nowDate):
                if ((int(nowTime.split(':')[0]))-(int(i['time'].split(':')[0])) == 1):
                    if ((int(nowTime.split(':')[1])) - (int(i['time'].split(':')[1])) <= 0):
                        allTransActions.append(i)
        
        
        ### filter invoices    
        allInvoices = []
        for i in data['invoices']:
            if ( ':' in i['date']):
                d = i['date']
                t = i['time']
                i['date'] = t
                i['time'] = d
            # print('into the allinvoices loop' , i['date'] , nowDate)
            year = int(i['date'].split('/')[0])
            month = int(i['date'].split('/')[1])
            day = int(i['date'].split('/')[2])
            finalDate = f'{year}-{month}-{day}'
            # print('finalDate>>>>>>>>' , finalDate)
            if (finalDate == nowDate):
                print('into the allinvoices' , finalDate , nowDate)
                print((int(nowTime.split(':')[0]))-(int(i['time'].split(':')[0])) == 1 , int(i['time'].split(':')[0]) , int(nowTime.split(':')[0]))
                if ((int(nowTime.split(':')[0]))-(int(i['time'].split(':')[0])) == 1):
                    print((int(nowTime.split(':')[1])) - (int(i['time'].split(':')[1])) <= 0 , int(i['time'].split(':')[1]) ,int(nowTime.split(':')[1])) 
                    if ((int(nowTime.split(':')[1])) - (int(i['time'].split(':')[1])) <= 0):
                        print('into the deepest invoices')
                        allInvoices.append(i)
                        
        

        print('finall allinvoices' , allInvoices)
        ##### after time filtering
        # print(data)
        allUsers = {'کاربران اضافه شده' : 0 ,
                    'طلای خریداری شده توسط کاربران' : 0,
                    'طلای فروخته شده توسط کاربران' : 0,
                    'حجم پول برداشت شده توسط کاربران' : 0,
                    'حجم پول واریز شده توسط کاربران' : 0
        }
       
       
        # for i in allUsers:        
        allUsers['کاربران اضافه شده'] = len(allUsersList)

        for k in allInvoices:
            if (k['type']['title']=='buy'):
                allUsers['طلای خریداری شده توسط کاربران'] += float(k['goldWeight'])
            else:
                allUsers['طلای فروخته شده توسط کاربران'] += float(k['goldWeight'])
        
        for j in allTransActions:
            if (j['type'] == 'withdraw'):
                allUsers['حجم پول برداشت شده توسط کاربران'] += int(j['amount'])
            else:
                allUsers['حجم پول واریز شده توسط کاربران'] += int(j['amount'])
                
                
                
        path = self.__excellGeneratedTransActions(allUsers)
        return [[] , path]
    

    def getData(self):
        response = requests.get(self.url)
        # response2 = requests.get(self.oldUrl)
        data = response.json()
        # data2 = response2.json()
        # data = data1['data'] + data2['data']
        typeFilter = self.__filter1(data['data'])
        return typeFilter

            