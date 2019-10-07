import { EthereumEvent, BigInt, Bytes,  } from "@graphprotocol/graph-ts"
import {
  Contract,
  PaymentExecuted,
  PaymentAuthorized,
  PaymentCanceled
} from "../generated/Contract/Contract"
import { Payment, MetaData } from "../generated/schema"
import { log } from '@graphprotocol/graph-ts'

// function calculateAuthorizedPayments(event: EthereumEvent): void {
//   let contract = Contract.bind(event.address)
//   let meta = MetaData.load('')
//   let numberOfAuthorizedPayments = contract.numberOfAuthorizedPayments() //function returns uint 
//   if(meta == null){
//     meta = new MetaData(event.transaction.from.toHex())
//   }
//   meta.numberOfAuthorizedPayments = numberOfAuthorizedPayments.toI32()
//   meta.latestBlock = event.block.number.toI32()
//   meta.save()
// }

export function handlePaymentExecuted(event: PaymentExecuted): void {
  let contract = Contract.bind(event.address)
  let entity = Payment.load(event.params.idPayment.toString())
  if(entity == null){
    // log.info("CREATING NEW ENTITY..., from: {}", [event.params.idPayment.toString()])
    entity = new Payment(event.params.idPayment.toString()) //Does this become the ID?
    entity.address = event.params.idPayment
    entity.name = contract.authorizedPayments(event.params.idPayment).value0
    entity.spender = contract.authorizedPayments(event.params.idPayment).value2
    entity.recipient = contract.authorizedPayments(event.params.idPayment).value6
    entity.token = contract.authorizedPayments(event.params.idPayment).value7
    entity.amount = contract.authorizedPayments(event.params.idPayment).value8
  }
  entity.status = "executed"
  entity.save()
  // calculateAuthorizedPayments(event);
}

export function handlePaymentAuthorized(event: PaymentAuthorized): void {
  let contract = Contract.bind(event.address)
  let entity = Payment.load(event.params.idPayment.toString())
  if(entity == null){
    entity = new Payment(event.params.idPayment.toString()) //Does this become the ID?
    entity.address = event.params.idPayment
    entity.name = contract.authorizedPayments(event.params.idPayment).value0
    entity.spender = contract.authorizedPayments(event.params.idPayment).value2
    entity.recipient = contract.authorizedPayments(event.params.idPayment).value6
    entity.token = contract.authorizedPayments(event.params.idPayment).value7
    entity.amount = contract.authorizedPayments(event.params.idPayment).value8
  }
  entity.status = "authorized"
  entity.save()

  let meta = MetaData.load("")
  if(meta == null) {
    meta = new MetaData("")
    meta.numOfPaymentsAuthorized = BigInt.fromI32(0)
    meta.authorisedPayments = new Array<string>()  
  }
  meta.numOfPaymentsAuthorized = meta.numOfPaymentsAuthorized.plus(BigInt.fromI32(1))
  let authorizedPayments = meta.authorisedPayments
  authorizedPayments.push(entity.id)  
  meta.authorisedPayments = authorizedPayments
  meta.save()
}

export function handlePaymentCanceled(event: PaymentCanceled): void {
  let contract = Contract.bind(event.address)
  let entity = Payment.load(event.params.idPayment.toString())
  if(entity == null){
    entity = new Payment(event.params.idPayment.toString()) //Does this become the ID?
  }
  entity.address = event.params.idPayment
  entity.name = contract.authorizedPayments(event.params.idPayment).value0
  entity.spender = contract.authorizedPayments(event.params.idPayment).value2
  entity.recipient = contract.authorizedPayments(event.params.idPayment).value6
  entity.token = contract.authorizedPayments(event.params.idPayment).value7
  entity.amount = contract.authorizedPayments(event.params.idPayment).value8
  entity.status = "cancelled"
  entity.save()

  let meta = MetaData.load("")
  if(meta == null) {
    meta = new MetaData("")
    meta.numOfPaymentsCancelled = BigInt.fromI32(0)
  }
  meta.numOfPaymentsCancelled = meta.numOfPaymentsCancelled.plus(BigInt.fromI32(1))
  meta.save()
}





