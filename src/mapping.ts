import { EthereumEvent, BigInt, Bytes  } from "@graphprotocol/graph-ts"
import {
  Contract,
  PaymentExecuted,
  PaymentAuthorized,
  PaymentCanceled
} from "../generated/Contract/Contract"
import { Payment, MetaData } from "../generated/schema"
import { log } from '@graphprotocol/graph-ts'

export function handlePaymentExecuted(event: PaymentExecuted): void {
  let contract = Contract.bind(event.address)
  let authPaymentData = contract.authorizedPayments(event.params.idPayment)
  let entity = Payment.load(event.params.idPayment.toString())
  if(entity == null){
    entity = new Payment(event.params.idPayment.toString()) 
    entity.name = authPaymentData.value0
    entity.spender = authPaymentData.value2
    entity.recipient = authPaymentData.value6
    entity.token = authPaymentData.value7
    entity.amount = authPaymentData.value8
  }
  entity.status = "executed"
  entity.save()

  let meta = MetaData.load("")
  if(meta == null) {
    meta = new MetaData("")
    meta.numOfPaymentsAuthorized = BigInt.fromI32(0)
    meta.numOfPaymentsCancelled = BigInt.fromI32(0)
    meta.executedPayments = new Array<string>()  
  }
  meta.numOfPaymentsAuthorized = meta.numOfPaymentsAuthorized.plus(BigInt.fromI32(1)) as BigInt
  let executedPaymentsArray = meta.executedPayments
  executedPaymentsArray.push(entity.id)  
  meta.executedPayments = executedPaymentsArray
  meta.save()
}

export function handlePaymentAuthorized(event: PaymentAuthorized): void {
  let contract = Contract.bind(event.address)
  let authPaymentData = contract.authorizedPayments(event.params.idPayment)
  let entity = Payment.load(event.params.idPayment.toString())
  if(entity == null){
    entity = new Payment(event.params.idPayment.toString()) 
    entity.name = authPaymentData.value0
    entity.spender = authPaymentData.value2
    entity.recipient = authPaymentData.value6
    entity.token = authPaymentData.value7
    entity.amount = authPaymentData.value8
  }
  entity.status = "authorized"
  entity.save()

  let meta = MetaData.load("")
  if(meta == null) {
    meta = new MetaData("")
    meta.numOfPaymentsAuthorized = BigInt.fromI32(0)
    meta.numOfPaymentsCancelled = BigInt.fromI32(0)
    meta.executedPayments = new Array<string>()  
  }
  meta.numOfPaymentsAuthorized = meta.numOfPaymentsAuthorized.plus(BigInt.fromI32(1)) as BigInt
  meta.save()
}

export function handlePaymentCanceled(event: PaymentCanceled): void {
  let contract = Contract.bind(event.address)
  let authPaymentData = contract.authorizedPayments(event.params.idPayment)
  let entity = Payment.load(event.params.idPayment.toString())
  if(entity == null){
    entity = new Payment(event.params.idPayment.toString())
  }
  entity.name = authPaymentData.value0
  entity.spender = authPaymentData.value2
  entity.recipient = authPaymentData.value6
  entity.token = authPaymentData.value7
  entity.amount = authPaymentData.value8
  entity.status = "cancelled"
  entity.save()

  let meta = MetaData.load("")
  if(meta == null) {
    meta = new MetaData("")
    meta.numOfPaymentsAuthorized = BigInt.fromI32(0)
    meta.numOfPaymentsCancelled = BigInt.fromI32(0)
    meta.executedPayments = new Array<string>()  
  }
  meta.numOfPaymentsCancelled = meta.numOfPaymentsCancelled.plus(BigInt.fromI32(1)) as BigInt
  meta.save()
}





