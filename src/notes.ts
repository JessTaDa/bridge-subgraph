
export function handlePoolSharesBurned(event: SharesBurned): void {
    let member = PoolMember.load(event.params.recipient.toHex());
    member.shares.minus(event.params.sharesToBurn);
    member.save();
  
    let meta = PoolMeta.load("");
    if (!meta) {
      meta = new PoolMeta("");
    }
    meta.totalPoolShares = event.params.totalPoolShares;
    meta.save();
  }
  
  
  export function handleAbort(event: Abort): void {
    let proposal = Proposal.load(event.params.proposalIndex.toString());
    proposal.aborted = true;
    proposal.save();
  
    let applicant = Applicant.load(event.params.applicantAddress.toHex());
    applicant.aborted = true;
    applicant.save();
  }
  
  
  export function handleSummonComplete(event: SummonComplete): void {
    let member = new Member(event.params.summoner.toHex());
    member.delegateKey = event.params.summoner;
    member.shares = event.params.shares;
    member.isActive = true;
    member.tokenTribute = BigInt.fromI32(0);
    member.didRagequit = false;
    member.votes = new Array<string>();
    member.submissions = new Array<string>();
    member.save();
  }
  
  QUESTIONS
  let contract = Moloch.bind(event.address);
  let proposalFromContract = contract.proposalQueue(event.params.proposalIndex);
  let startingPeriod = proposalFromContract.value3;  //value3?
  let details = proposalFromContract.value10; //value10?



  KLEROS

  if (court == null) {
    let courtData = getKlerosContract().try_courts(courtId)

    // Register court if not exists
    if (!courtData.reverted) {
      court = new Court(courtId.toString())
      court.name = getCourtName(courtId)
      court.parent = courtData.value.value0.toString()
      court.hiddenVotes = courtData.value.value1
      court.minStake = toDecimal(courtData.value.value2)
      court.alpha = courtData.value.value3
      court.feeForJuror = toDecimal(courtData.value.value4)
      court.jurorsForCourtJump = toDecimal(courtData.value.value5)

      court.disputeCount = BigInt.fromI32(0)

      // Register court in platform summary
      let summary = getSummaryEntity()
      summary.courtCount = summary.courtCount.plus(ONE)

      // Persist all the entities
      court.save()
      summary.save()
    }