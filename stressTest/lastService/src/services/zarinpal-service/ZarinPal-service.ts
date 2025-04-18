import ZarinPal from 'zarinpal-node-sdk';
import axios from 'axios';
import { AppDataSource } from '../../data-source';
import { PaymentInfo } from '../../entity/PaymentInfo';
import monitor from '../../util/statusMonitor';
export class ZarinPalService {
    private paymentInfoRepository = AppDataSource.getRepository(PaymentInfo)
    private zarinpal = new ZarinPal({
        merchantId: '3de1e8f6-7992-4707-82d7-ace38372d4d9',
        sandbox: false
      });

      async initiatePayment(info) {
        try {
            let {amount,
                description,invoiceId,callback_url,cardPan,phoneNumber} = info
                
          // const response = await this.zarinpal.payments.create({
          //   amount : Math.floor(+amount),
          //   callback_url,
          //   description,
          //   // mobile,
          //   // email,
          //  cardPan
          // });
          const response = await axios.post('https://payment.zarinpal.com/pg/v4/payment/request.json', {
            merchant_id: '3de1e8f6-7992-4707-82d7-ace38372d4d9',
            amount: amount*10,
            callback_url: callback_url,
            description: description,
            metadata: {
              card_pan:cardPan,
              mobile: phoneNumber
            }
          }, {
            headers: {
              'accept': 'application/json',
              'content-type': 'application/json'
            }
          });
          amount = Math.floor(+amount)
          console.log('response of the payment . . .' , response.data)
          console.log('its newwwwwwwwwwwwwwwwwww',response.data.data);
          if (!response.data.data.authority){
            return 'error'
          }
          let paymentForSave =  this.paymentInfoRepository.create({amount , authority: response.data.data.authority,userId : info.userId , invoiceId})
          console.log('payment info' , paymentForSave)
          let payinfo = await this.paymentInfoRepository.save(paymentForSave)
          console.log('check hereeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee<><' , payinfo)
          let url = this.zarinpal.payments.getRedirectUrl(response.data.data.authority)
          if (!url){
            return 'error'
          }
          console.log('redirect url' , url)
          return {url : url , authority : response.data.data.authority , invoiceId : invoiceId}
        } catch (error){
          monitor.error.push(`error in inititate payment :::: ${error}`)
          console.log(error);
          if (error.response){
            if (error.response.status == 422){
              return 'tooMuch'
            }
          }
          return 'error'
        }
      }

      async verifyPayment (info) {
        if (info.status === 'OK') {
          const paymentInfo = await this.paymentInfoRepository.findOneByOrFail({authority : info.authority})
          console.log('paymentInfo' , paymentInfo)
          if (paymentInfo) {
            try {
              console.log('after verification of transAction' , paymentInfo.amount);
              console.log(Math.floor(paymentInfo.amount)*10)
              const response = await this.zarinpal.verifications.verify({
                amount: Math.floor(paymentInfo.amount)*10,
                authority: paymentInfo.authority,
              });
              console.log('after the verifying the payment data' , response)
             
              console.log('zarinpal status >>>>>' , response.status)

              if (+response.status >= 500){
                return {status  : false , code : 500}
              }

              if (response.data.code === 100) {
                console.log('Payment Verified:');
                console.log('Reference ID:', response.data.ref_id);
                console.log('Card PAN:', response.data.card_pan);
                console.log('Fee:', response.data.fee);
                return {status  : true , code : 100 , data : response.data}

              } else if (response.data.code === 101) {
                console.log('Payment already verified.');
                return {status  : true , code : 101 , data : response.data}
              
              }else {
                console.log('Transaction failed with code:', response.data);
                return {status  : false , data : response.data}
              }
            } catch (error) {
              console.log('zarinpal status >>>>>', error.response.status)
              if (+error.response.status >= 500){
                return {status  : false , code : 500}
              }
              monitor.error.push(`error in verify payment :::: ${error}`)
              if (error.response.data.errors){
                if (error.response.data.errors.message == 'Session is not valid, session is not active paid try.'){
                  console.log('error.response.data.errors' , error.response.data.errors.code)
                }
                console.error('Payment Verification Failed:', error.response.data.errors);
                return {status  : false}
              }else{
                return {status : 'unknown'}
              }

            }
          } else {
            console.log('No Matching Transaction Found For This Authority Code.');
            return {status  : false }
          }
        } else {
          const paymentInfo = await this.paymentInfoRepository.findOneByOrFail({authority : info.authority})
          if (!paymentInfo){
            console.log('Transaction was cancelled or failed.');
            return {status  : false }
          }
          console.log('paymentInfo' , paymentInfo)
          // const response = await this.zarinpal.verifications.verify({
          //   amount: Math.floor(paymentInfo.amount),
          //   authority: paymentInfo.authority,
          // });
          // console.log('after the verifying the payment data' , response)
          return {status  : false }
        }
      }


  async getTransActionStatus(authority : string) {
    const paymentInfo = await this.paymentInfoRepository.findOneByOrFail({ authority: authority })
    if (!paymentInfo) {
      return { status: false, data: { message: 'سند تراکنش یافت نشد' } }
    }
    console.log('after verification of transAction', paymentInfo.amount);
    const inquiryResult = await this.zarinpal.inquiries.inquire({
      authority: authority,
    });
    console.log('result of inquery', inquiryResult)
    
    if (inquiryResult.data.status == 'IN_BANK') {
      return { status: 'IN_BANK' }
    }

    else if (inquiryResult.data.status == 'FAILED') {
      return { status: 'FAILED' }
    }

    else if (inquiryResult.data.status == 'VERIFIED') {
      return { status: 'VERIFIED' }
    }

    else if (inquiryResult.data.status == 'REVERSED') {
      return { status: 'REVERSED' }
    }else { 
      return {status : 'unknown'}
    }
  }

  async handledVerify(authority: string) {
    const paymentInfo = await this.paymentInfoRepository.findOneByOrFail({ authority: authority })
    if (!paymentInfo) {
      return { status: false, data: { message: 'سند تراکنش یافت نشد' } }
    }
    try {
        const response = await this.zarinpal.verifications.verify({
          amount: Math.floor(paymentInfo.amount) * 10,
          authority: paymentInfo.authority,
        });
        console.log('zarinpal status >>>>>' , response.status)

        if (response.data.code === 100) {
          console.log('Payment Verified:');
          // console.log('Reference ID:', response.data.ref_id);
          // console.log('Card PAN:', response.data.card_pan);
          // console.log('Fee:', response.data.fee);
          return { status: true, code: 100, data: response.data }
        } else if (response.data.code === 101) {
          console.log('Payment already verified.');
          return { status: true, code: 101, data: response.data }
        } else {
          console.log('Transaction failed with code:', response.data.code);
          return { status: false, data: response.data }
        }
    } catch (error) {
      console.log('zarinpal status >>>>>' , error.response.status)

      const inquiryResult = await this.zarinpal.inquiries.inquire({
        authority: authority,
      });
      monitor.error.push(`error in handle verifying:: ${error}`)
      console.error('Payment Verification Failed:', error.response.data.errors);
      if (error.response.data.errors){
        if (error.response.data.errors.message == 'Session is not valid, session is not active paid try.'){
          console.log('error.response.data.errors' , error.response.data.errors.code)
        }
        return { status: false, data: { message:error.response.data.errors.code}}
      }else{
        return {status : 'unknown'}
      }
    }
  }
}