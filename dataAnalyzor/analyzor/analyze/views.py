from django.http import HttpResponse
import json
from django.views.decorators.csrf import csrf_exempt
# import * from dataMaker
from .dataMaker import datamaker2
from django.http import JsonResponse
from .walletTransActions import walletTransActionsFilter
from .userAnalyzor import userFilter
from .hourlyAnalyze import hourlyFilter
from jose import jwt
from .models import reports , reportList
import simplejson as json
from django.core import serializers
from django.core.serializers import serialize
from .withdrawal import getWithdrawal


withdrawal1 = getWithdrawal()
datamaker = datamaker2()
userMaker = userFilter()
walletFiltering = walletTransActionsFilter()
hourly = hourlyFilter()
def index(request):
    return HttpResponse("Hello, world. You're at the polls index.")


@csrf_exempt 
def analyze(request):
    if request.method == 'POST':
        try:
            token = request.headers['Authorization']
            token = token.split(' ')[1]
            decoded = jwt.decode(token , '69b9381954141365ff7be95516f16c252edcb37eb39c7a42eaaf6184d93bccb2')
            if (decoded == False):
                return JsonResponse({"error" : "token expired!"},status=401 , safe=False)
            print('decoded token' , decoded)
        except Exception as e:
            print(e)
            return JsonResponse({"msg" : 'something went wrong'},status=401 , safe=False)
        
        body = json.loads(request.body.decode('utf-8'))
        for i in body.keys():
            if (body[i] == ''):
                body[i] = 'all'
        print('body' , body)
        res = ''
        if (body['report'] == 2):
            res = datamaker.getData(body['type'] ,body['deal'] , body['status'] , body['nationalCode'] , body['startDate'] , body['endDate'] , body['startTime'] , body['endTime'])
            print(f'user {decoded['firstName']} {decoded['lastName']} create new report in معاملات')
        if (body['report'] == 1):
            res = walletFiltering.getData(body['type'] , body['status'] , body['nationalCode'] , body['startDate'] , body['endDate'] , body['startTime'] , body['endTime'])
            print('activity>>>' , res[0])
            print(f'user {decoded['firstName']} {decoded['lastName']} create new report in معاملات  کیف پول')
        if (body['report'] == 3):
            # print('users')
            res = userMaker.getData(body['auth'] , body['startDate'] , body['endDate'] , body['startTime'] , body['endTime'])
            print(f'user {decoded['firstName']} {decoded['lastName']} create new report in کاربران')

        if (body['report'] == 4):
            res = hourly.getData(body['startDate'] , body['endDate'] , body['startTime'] , body['endTime'])
            print('hourly report')
        
        if (body['report'] == 5):
            res = withdrawal1.getData()
            print('activity>>>' , res[0])
            print(f'user {decoded['firstName']} {decoded['lastName']} create new report in معاملات  کیف پول')

            
        if (body['report'] == 4):
            return JsonResponse({"ret" : res[0]} , safe=False)
        else:
            admin = reports.objects.filter(firstName = decoded['firstName']).exists()
            print(admin)
            if (admin):
                admin = reports.objects.filter(firstName = decoded['firstName']).get()
                newR = reportList()
                newR.name = res[0]
                newR.link = res[1]
                newR.admin = admin
                newR.save()
                allReports = reportList.objects.filter(admin = admin).all()
                # qs = SomeModel.objects.all()
                serialized_data = serialize("json", allReports)
                serialized_data = json.loads(serialized_data)
                dataS = []
                for i in range(len(serialized_data)):
                    dataS.append(serialized_data[i]['fields'])
                    
                res.append(dataS)
                    # res.append(data)
                # print('data>>>' , list(data))
                # for i in qs_json:
                #     print(i)
                    
            else:
                newAdmin = reports()
                newAdmin.firstName = decoded['firstName']
                newAdmin.lastName = decoded['lastName']
                print('after stringify' , newAdmin)
                newAdmin.save()
                admin = reports.objects.filter(firstName = decoded['firstName']).get()
                newR = reportList()
                newR.name = res[0]
                newR.link = res[1]
                newR.admin = admin
                newR.save()

            return JsonResponse(res , safe=False)
    else:
        return HttpResponse('not allowed method')
    
    
    
    


@csrf_exempt 
def getReporstHistory(request):
    if request.method == 'GET':
        try:
            token = request.headers['Authorization']
            token = token.split(' ')[1]
            decoded = jwt.decode(token , '69b9381954141365ff7be95516f16c252edcb37eb39c7a42eaaf6184d93bccb2')
            if (decoded == False):
                return JsonResponse({"error" : "token expired!"}, status=401 , safe=False)
            print('decoded token' , decoded)
        except Exception as e:
            print(e)
            return JsonResponse({"msg" : "token expired!"},status=401 , safe=False)
        
    
        admin = reports.objects.filter(firstName = decoded['firstName']).exists()
        if (admin == False):
            newAdmin = reports()
            newAdmin.firstName = decoded['firstName']
            newAdmin.lastName = decoded['lastName']
            print('after stringify' , newAdmin)
            newAdmin.save()
            return JsonResponse({'data' : [] , "msg" : 'get all report succeed'},status=200 , safe=False)
        else:
            admin = reports.objects.filter(firstName = decoded['firstName']).get()
            allReports = reportList.objects.filter(admin = admin).all()
            # qs = SomeModel.objects.all()
            serialized_data = serialize("json", allReports)
            serialized_data = json.loads(serialized_data)
            dataS = []
            for i in range(len(serialized_data)):
                dataS.append(serialized_data[i]['fields'])
                
            return JsonResponse({'data' : dataS , "msg" : 'get all report succeed' , "scope" : "report service"},status=200 , safe=False)
    else:
        return HttpResponse('not allowed method')
    
    




@csrf_exempt 
def getAllHistory(request):
    if request.method == 'GET':
        # try:
        #     token = request.headers['Authorization']
        #     token = token.split(' ')[1]
        #     decoded = jwt.decode(token , '69b9381954141365ff7be95516f16c252edcb37eb39c7a42eaaf6184d93bccb2')
        #     if (decoded == False):
        #         return JsonResponse({"error" : "token expired!"}, status=401 , safe=False)
        #     print('decoded token' , decoded)
        # except Exception as e:
        #     print(e)
        #     return JsonResponse({"msg" : "token expired!"},status=401 , safe=False)
        
    
        # admin = reports.objects.filter(firstName = decoded['firstName']).exists()
        allReports = reportList.objects.all().prefetch_related('admin')
        serialized_data = serialize("json", allReports)
        serialized_data = json.loads(serialized_data)
        dataS = []
        for i in range(len(serialized_data)):
            dataS.append(serialized_data[i]['fields'])

        # if (admin == False):
        #     newAdmin = reports()
        #     newAdmin.firstName = decoded['firstName']
        #     newAdmin.lastName = decoded['lastName']
        #     print('after stringify' , newAdmin)
        #     newAdmin.save()
        #     return JsonResponse({'data' : [] , "msg" : 'get all report succeed'},status=200 , safe=False)
        # else:
        #     admin = reports.objects.filter(firstName = decoded['firstName']).get()
        #     # qs = SomeModel.objects.all()
        #     serialized_data = serialize("json", allReports)
        #     serialized_data = json.loads(serialized_data)
        #     dataS = []
        #     for i in range(len(serialized_data)):
        #         dataS.append(serialized_data[i]['fields'])
                
        return JsonResponse({'data' : dataS , "msg" : 'get all report succeed' , "scope" : "report service"},status=200 , safe=False)
    else:
        return HttpResponse('not allowed method')