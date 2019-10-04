import { BigInt, Bytes,  } from "@graphprotocol/graph-ts"
import {
  Contract,
  PaymentExecuted
} from "../generated/Contract/Contract"
import { Payment, MetaData } from "../generated/schema"
import { log } from '@graphprotocol/graph-ts'


export function handlePaymentExecuted(event: PaymentExecuted): void {
  let contract = Contract.bind(event.address)
  let entity = Payment.load(event.transaction.from.toHex())
  if(entity == null){
    log.info("CREATING NEW ENTITY...", [])
    entity = new Payment(event.transaction.from.toHex()) //Does this become the ID?
  }
  entity.address = event.params.idPayment
  entity.name = contract._name
  entity.spender = event.transaction.from //not sure if this is correct
  entity.recipient = event.params.recipient
  entity.token = event.params.token
  entity.amount = event.params.amount
  entity.status = "executed"
  entity.save()

  calculateAuthorizedPayments();

  function calculateAuthorizedPayments(): void {
    let contract = Contract.bind(event.address)
    let meta = MetaData.load('')
    let numberOfAuthorizedPayments = contract.numberOfAuthorizedPayments() //function returns uint 
    if(meta == null){
      meta = new MetaData(event.transaction.from.toHex())
    }
    meta.numberOfAuthorizedPayments = numberOfAuthorizedPayments.toI32()
    meta.latestBlock = event.block.number.toI32()
    meta.save()
  }
}


// export function handlePaymentAuthorized(event: PaymentAuthorized): void {
//   let contract = Contract.bind(event.address)
//   let entity = new Payment(event.transaction.hash.toHex())
//   entity.address = event.params.idPayment
//   entity.recipient = event.params.recipient
//   entity.amount = event.params.amount
//   entity.token = event.params.token
//   entity.status = "authorized"
//   entity.save()
// }

// export function handlePaymentCanceled(event: PaymentCanceled): void {
//   let contract = Contract.bind(event.address)
//   let entity = new Payment(event.transaction.hash.toHex())
//   entity.address = event.params.idPayment
//   entity.status = "cancelled"
//   // entity.canceled = contract.authorizedPayments(event.params.idPayment).toMap
//   entity.name = contract._name
//   let testt = contract.try_authorizedPayments(event.params.idPayment)
//   log.info("testt", [])
//   log.info("testtasdas", [])
//   log.info("testtsrgeh", [])
//   entity.save()
// }

  //   /// @notice `onlyOwner` Cancel a payment all together
  //   /// @param _idPayment ID of the payment to be canceled.
  //   function cancelPayment(uint _idPayment) onlyOwner external {
  //     require(_idPayment < authorizedPayments.length);

  //     Payment storage p = authorizedPayments[_idPayment];

  //     require(!p.canceled);
  //     require(!p.paid);

  //     p.canceled = true;
  //     emit PaymentCanceled(_idPayment);
  // }







// function createVault(escapeHatchCaller:Bytes, escapeHatchDestination:Bytes, timeLock:BigInt, securityGuard:Bytes): Object {
//   let contract = Contract.bind(event.address)
//   contract.
//   let vault = Vault.load('')
//   vault.escapeHatchCaller = escapeHatchCaller
// }




// export function handleDonate(event: Donate): void {
//   let entity = ExampleEntity.load(event.transaction.from.toHex())

//   // Entities only exist after they have been saved to the store;
//   // `null` checks allow to create entities on demand
//   if (entity == null) {
//     entity = new ExampleEntity(event.transaction.from.toHex())

//     // Entity fields can be set using simple assignments
//     entity.count = BigInt.fromI32(0)
//   }

//   // BigInt and BigDecimal math are supported
//   entity.count = entity.count + BigInt.fromI32(1)

//   // Entity fields can be set based on event parameters
//   entity.giverId = event.params.giverId
//   entity.receiverId = event.params.receiverId

//   // Entities can be written to the store with `.save()`
//   entity.save()
// }
//   case 'Donate': {
//     const { giverId, receiverId, token, amount } = event.returnValues;
//     return Promise.all([
//         this.web3.eth.getTransaction(event.transactionHash),
//         this.getToken(token),
//     ]).then(([tx, sideToken]) => {
//         if (!tx)
//             throw new Error(`Failed to fetch transaction ${event.transactionHash}`);
//         return {
//             homeTx: event.transactionHash,
//             giverId,
//             receiverId,
//             mainToken: token,
//             sideToken,
//             amount,
//             sender: tx.from,
//             data: this.lp.methods
//                 .donate(giverId, receiverId, sideToken, amount)
//                 .encodeABI(),
//         };
//     });
// }

// function donate(uint64 giverId, uint64 receiverId) payable external {
//   donate(giverId, receiverId, 0, 0);
// }

// /**
// * @notice It is not recommened to call this function outside of the giveth dapp (giveth.io)
// * this function is bridged to a side chain. If for some reason the sidechain tx fails, the donation
// * will end up in the givers control inside LiquidPledging contract. If you do not use the dapp, there
// * will be no way of notifying the sender/giver that the giver has to take action (withdraw/donate) in
// * the dapp
// *
// * @param giverId The adminId of the liquidPledging pledge admin who is donating
// * @param receiverId The adminId of the liquidPledging pledge admin receiving the donation
// * @param token The token to donate. If donating ETH, then 0x0. Note: the token must be whitelisted
// * @param _amount The amount of the token to donate. If donating ETH, then 0x0 as the msg.value will be used instead.
// */
// function donate(uint64 giverId, uint64 receiverId, address token, uint _amount) whenNotPaused payable public {
//   require(giverId != 0);
//   require(receiverId != 0);
//   uint amount = _receiveDonation(token, _amount);
//   emit Donate(giverId, receiverId, token, amount);
// }
