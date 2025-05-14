from django.urls import path

from . import views

urlpatterns = [
    path("data", views.analyze, name="index"),
    path("history", views.getReporstHistory, name="history"),
    path("history/all", views.getAllHistory, name="all"),
    path("report/invoice", views.profInvoiceFilter, name="all"),
    path("report/wallettransactions", views.profWalletInvoiceFilter, name="all"),
]