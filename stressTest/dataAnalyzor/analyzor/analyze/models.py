from django.db import models

class reports(models.Model):
    
    firstName = models.CharField(max_length=30)
    
    lastName = models.CharField(max_length=30)
    
    
    
    
class reportList(models.Model):
    
    name = models.TextField(null=True)
    
    link = models.TextField(null=True)
    
    admin = models.ForeignKey(reports, on_delete=models.CASCADE, related_name='admin')