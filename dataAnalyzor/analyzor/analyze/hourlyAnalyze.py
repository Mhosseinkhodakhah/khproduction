
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
    def __filter1(self , data , startDate , endDate , startTime , endTime):
        
        filter1 = []
        if (startDate!='all'):
            mainyear = int(startDate.split('/')[0])
            mainmonth = int(startDate.split('/')[1])
            mainday = int(startDate.split('/')[2])
            for i in data:
                year = int(i['date'].split('/')[0])
                month = int(i['date'].split('/')[1])
                day = int(i['date'].split('/')[2])
                if (year == mainyear):
                    if (month == mainmonth):
                        if (day >= mainday):
                            filter1.append(i)
                        
                    elif(month > mainmonth):
                        filter1.append(i)
                    else:
                        pass
                elif(year > mainyear):
                    filter1.append(i)
                
        else:
            filter1=data
            
            
        filter2=[]
        if (endDate != 'all'):
            mainyear = int(endDate.split('/')[0])
            mainmonth = int(endDate.split('/')[1])
            mainday = int(endDate.split('/')[2])
            for i in filter1:
                year = int(i['date'].split('/')[0])
                month = int(i['date'].split('/')[1])
                day = int(i['date'].split('/')[2])
                if (year == mainyear):
                    if (month == mainmonth):
                        if (day <= mainday):
                            filter2.append(i)
                        
                    elif(month < mainmonth):
                        filter2.append(i)
                    else:
                        pass
                elif(year < mainyear):
                    filter2.append(i)
        else:
            filter2=filter1
            
            
        
        filter3 = []
        
        if (startTime!='all'):
            mainTime = int(startTime.split(':')[0])
            for i in filter2:
                if (startDate != 'all'):
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
                                    filter3.append(i)
                            elif (day > mainday):
                                filter3.append(i)
                        elif(month > mainmonth):
                            filter3.append(i)
                    elif(year > mainyear):
                        filter3.append(i)
                else:                                                     # در غیر اینصورت باید تاریخ امروز ثبت بشه حتما
                    time = int(i['time'].split(':')[0])
                    
                   
                   
        filter4 = [] 
        if (endTime != 'all'):
            mainTime = int(endTime.split(':')[0])
            for i in filter3:
                if (endDate != 'all'):
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
                                    filter4.append(i)
                            elif (day < mainday):
                                filter4.append(i)
                        elif(month < mainmonth):
                            filter4.append(i)
                    elif(year < mainyear):
                        filter4.append(i)
                else:                                                     # در غیر اینصورت باید تاریخ امروز ثبت بشه حتما
                    time = int(i['time'].split(':')[0])
                    
                    
        finalData= []
        goldW = 0
        for j in filter4:
            goldWeight = j['goldWeight']
            if (j['status' == 'completed']):
                if (j['type']['title'] ==  'buy'):
                    goldW += float(j['goldWeight'])
                    pass
                elif(j['type']['title'] ==  'sell'):
                    goldW -= float(j['goldWeight'])
                    pass
                
        return goldW
                
                    
                    
        
        
        
        
        
        
        
        
        
        # localTime = str(datetime.datetime.today()).split(' ')[1]
        # nowDate = f'{int(str(JalaliDate.today()).split('-')[0])}-{int(str(JalaliDate.today()).split('-')[1])}-{int(str(JalaliDate.today()).split('-')[2])}'
        # nowTime = f'{int(localTime.split(':')[0])}:{int(localTime.split(':')[1])}:00'
        # print(nowDate)
        # print(nowTime)
        
        # allUsersList = []
        # for i in data['allUsers']:
        #     time = str(datetime.datetime.strptime(str(i['createdAt']),"%Y-%m-%dT%H:%M:%S.%fZ")).split(' ')[0]
        #     dateTime = str(datetime.datetime.strptime(str(i['createdAt']),"%Y-%m-%dT%H:%M:%S.%fZ")).split(' ')[1]
        #     year = time.split('-')[0]
        #     month = time.split('-')[1]
        #     day = time.split('-')[2]
        #     hour = dateTime.split(':')[0]
        #     minute = dateTime.split(':')[1]
        #     second = dateTime.split(':')[2]
        #     newDate = str(JalaliDateTime.to_jalali(datetime.datetime(int(year), int(month), int(day), int(hour), int(minute), int(float(second)))))
        #     i['createdAt'] = newDate.split(' ')[0]
        #     i['createTime'] = newDate.split(' ')[1]
        #     print('in user counter>>>>' , i['createdAt'] , i['createTime'])
        #     if (i['createdAt'] == nowDate):
        #         print('user in 1' ,nowTime.split(':')[0] , i['createTime'].split(':')[0] )
        #         if ((int(nowTime.split(':')[0]))-(int(i['createTime'].split(':')[0])) == 1):
        #             print('user in 2' ,nowTime.split(':')[1] , i['createTime'].split(':')[1] )
        #             if ((int(nowTime.split(':')[1])) - (int(i['createTime'].split(':')[1])) <= 0):
        #                 print('user in 3' ,nowTime.split(':')[1] , i['createTime'].split(':')[1] )
        #                 allUsers.append(i)
        #     # print(i['createdAt'] , i['createTime'] )

        
        # allTransActions = []
        # for i in data['transActions']:
        #     if ( ':' in i['date']):
        #         d = i['date']
        #         t = i['time']
        #         i['date'] = t
        #         i['time'] = d
        #     year = int(i['date'].split('/')[0])
        #     month = int(i['date'].split('/')[1])
        #     day = int(i['date'].split('/')[2])
        #     finalDate = f'{year}-{month}-{day}'
        #     if (finalDate == nowDate):
        #         if ((int(nowTime.split(':')[0]))-(int(i['time'].split(':')[0])) == 1):
        #             if ((int(nowTime.split(':')[1])) - (int(i['time'].split(':')[1])) <= 0):
        #                 allTransActions.append(i)
        
        
        # ### filter invoices    
        # allInvoices = []
        # for i in data['invoices']:
        #     if ( ':' in i['date']):
        #         d = i['date']
        #         t = i['time']
        #         i['date'] = t
        #         i['time'] = d
        #     # print('into the allinvoices loop' , i['date'] , nowDate)
        #     year = int(i['date'].split('/')[0])
        #     month = int(i['date'].split('/')[1])
        #     day = int(i['date'].split('/')[2])
        #     finalDate = f'{year}-{month}-{day}'
        #     # print('finalDate>>>>>>>>' , finalDate)
        #     if (finalDate == nowDate):
        #         print('into the allinvoices' , finalDate , nowDate)
        #         print((int(nowTime.split(':')[0]))-(int(i['time'].split(':')[0])) == 1 , int(i['time'].split(':')[0]) , int(nowTime.split(':')[0]))
        #         if ((int(nowTime.split(':')[0]))-(int(i['time'].split(':')[0])) == 1):
        #             print((int(nowTime.split(':')[1])) - (int(i['time'].split(':')[1])) <= 0 , int(i['time'].split(':')[1]) ,int(nowTime.split(':')[1])) 
        #             if ((int(nowTime.split(':')[1])) - (int(i['time'].split(':')[1])) <= 0):
        #                 print('into the deepest invoices')
        #                 allInvoices.append(i)
                        
        

        # print('finall allinvoices' , allInvoices)
        # ##### after time filtering
        # # print(data)
        # allUsers = {'کاربران اضافه شده' : 0 ,
        #             'طلای خریداری شده توسط کاربران' : 0,
        #             'طلای فروخته شده توسط کاربران' : 0,
        #             'حجم پول برداشت شده توسط کاربران' : 0,
        #             'حجم پول واریز شده توسط کاربران' : 0
        # }
       
       
        # # for i in allUsers:        
        # allUsers['کاربران اضافه شده'] = len(allUsersList)

        # for k in allInvoices:
        #     if (k['type']['title']=='buy'):
        #         allUsers['طلای خریداری شده توسط کاربران'] += float(k['goldWeight'])
        #     else:
        #         allUsers['طلای فروخته شده توسط کاربران'] += float(k['goldWeight'])
        
        # for j in allTransActions:
        #     if (j['type'] == 'withdraw'):
        #         allUsers['حجم پول برداشت شده توسط کاربران'] += int(j['amount'])
        #     else:
        #         allUsers['حجم پول واریز شده توسط کاربران'] += int(j['amount'])
                
                
                
        # path = self.__excellGeneratedTransActions(allUsers)
        # return [[] , path]
    

    def getData(self , startDate , endDate , startTime , endTime):
        response = requests.get(self.url)
        # response2 = requests.get(self.oldUrl)
        data = response.json()
        # data2 = response2.json()
        # data = data1['data'] + data2['data']
        typeFilter = self.__filter1(data['data'] , startDate , endDate , startTime , endTime)
        return typeFilter

            