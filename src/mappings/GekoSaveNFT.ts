/* eslint-disable prefer-const */
import { Item, Event} from '../generated/schema'
import { PunkMint, Transfer } from '../generated/GekoSaveNFT/GekoSaveNFT'

export function handleTransfer(event: Transfer): void
{
	let entityId = event.address.toHex() + '-' + event.params.tokenId.toString()
	let item = Item.load(entityId)
	if (item != null) {
		item.timestamp = event.block.timestamp
		item.owner = event.params.to
		item.save()
	}	
}

export function handlePunkMint(event: PunkMint): void {	
	let entityId = event.address.toHex() + '-' + event.params._punk.tokenId.toString()
	let entity = new Item(entityId)
	entity.timestamp = event.block.timestamp
	entity.txhash = event.transaction.hash.toHexString()
	entity.logIndex = event.transactionLogIndex

	entity.collection = event.address
	entity.tokenId = event.params._punk.tokenId
	entity.uri = event.params._punk.uri
	entity.creator = event.params._punk.creator
	entity.owner = event.params._punk.creator	
	entity.save()	

	let eventId = event.transaction.hash.toHexString() + '-' + event.transactionLogIndex.toString()
	let eventItem = new Event(eventId)
	eventItem.timestamp = event.block.timestamp
	eventItem.txhash = event.transaction.hash.toHexString()
	eventItem.logIndex = event.transactionLogIndex

	eventItem.collection = event.address
	eventItem.tokenId = event.params._punk.tokenId
	eventItem.name = "Minted"
	eventItem.userAddress = event.params._punk.creator
	eventItem.save()
}
