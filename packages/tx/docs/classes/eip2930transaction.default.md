[@ethereumjs/tx](../README.md) / [eip2930Transaction](../modules/eip2930transaction.md) / default

# Class: default

[eip2930Transaction](../modules/eip2930transaction.md).default

Typed transaction with optional access lists

- TransactionType: 1
- EIP: [EIP-2930](https://eips.ethereum.org/EIPS/eip-2930)

## Hierarchy

- [*BaseTransaction*](basetransaction.basetransaction-1.md)<[*default*](eip2930transaction.default.md)\>

  ↳ **default**

## Table of contents

### Constructors

- [constructor](eip2930transaction.default.md#constructor)

### Properties

- [AccessListJSON](eip2930transaction.default.md#accesslistjson)
- [accessList](eip2930transaction.default.md#accesslist)
- [chainId](eip2930transaction.default.md#chainid)
- [common](eip2930transaction.default.md#common)
- [data](eip2930transaction.default.md#data)
- [gasLimit](eip2930transaction.default.md#gaslimit)
- [gasPrice](eip2930transaction.default.md#gasprice)
- [nonce](eip2930transaction.default.md#nonce)
- [r](eip2930transaction.default.md#r)
- [s](eip2930transaction.default.md#s)
- [to](eip2930transaction.default.md#to)
- [v](eip2930transaction.default.md#v)
- [value](eip2930transaction.default.md#value)

### Accessors

- [senderR](eip2930transaction.default.md#senderr)
- [senderS](eip2930transaction.default.md#senders)
- [transactionType](eip2930transaction.default.md#transactiontype)
- [type](eip2930transaction.default.md#type)
- [yParity](eip2930transaction.default.md#yparity)

### Methods

- [\_processSignature](eip2930transaction.default.md#_processsignature)
- [getBaseFee](eip2930transaction.default.md#getbasefee)
- [getDataFee](eip2930transaction.default.md#getdatafee)
- [getMessageToSign](eip2930transaction.default.md#getmessagetosign)
- [getMessageToVerifySignature](eip2930transaction.default.md#getmessagetoverifysignature)
- [getSenderAddress](eip2930transaction.default.md#getsenderaddress)
- [getSenderPublicKey](eip2930transaction.default.md#getsenderpublickey)
- [getUpfrontCost](eip2930transaction.default.md#getupfrontcost)
- [hash](eip2930transaction.default.md#hash)
- [isSigned](eip2930transaction.default.md#issigned)
- [raw](eip2930transaction.default.md#raw)
- [serialize](eip2930transaction.default.md#serialize)
- [sign](eip2930transaction.default.md#sign)
- [toCreationAddress](eip2930transaction.default.md#tocreationaddress)
- [toJSON](eip2930transaction.default.md#tojson)
- [validate](eip2930transaction.default.md#validate)
- [verifySignature](eip2930transaction.default.md#verifysignature)
- [fromRlpSerializedTx](eip2930transaction.default.md#fromrlpserializedtx)
- [fromSerializedTx](eip2930transaction.default.md#fromserializedtx)
- [fromTxData](eip2930transaction.default.md#fromtxdata)
- [fromValuesArray](eip2930transaction.default.md#fromvaluesarray)

## Constructors

### constructor

\+ **new default**(`txData`: [*AccessListEIP2930TxData*](../interfaces/types.accesslisteip2930txdata.md), `opts?`: [*TxOptions*](../interfaces/types.txoptions.md)): [*default*](eip2930transaction.default.md)

This constructor takes the values, validates them, assigns them and freezes the object.

It is not recommended to use this constructor directly. Instead use
the static factory methods to assist in creating a Transaction object from
varying data types.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `txData` | [*AccessListEIP2930TxData*](../interfaces/types.accesslisteip2930txdata.md) | - |
| `opts` | [*TxOptions*](../interfaces/types.txoptions.md) | {} |

**Returns:** [*default*](eip2930transaction.default.md)

Overrides: [BaseTransaction](basetransaction.basetransaction-1.md)

Defined in: [eip2930Transaction.ts:127](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip2930Transaction.ts#L127)

## Properties

### AccessListJSON

• `Readonly` **AccessListJSON**: [*AccessList*](../modules/types.md#accesslist)

Defined in: [eip2930Transaction.ts:27](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip2930Transaction.ts#L27)

___

### accessList

• `Readonly` **accessList**: [*AccessListBuffer*](../modules/types.md#accesslistbuffer)

Defined in: [eip2930Transaction.ts:26](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip2930Transaction.ts#L26)

___

### chainId

• `Readonly` **chainId**: *BN*

Defined in: [eip2930Transaction.ts:25](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip2930Transaction.ts#L25)

___

### common

• `Readonly` **common**: *default*

Inherited from: [BaseTransaction](basetransaction.basetransaction-1.md).[common](basetransaction.basetransaction-1.md#common)

Defined in: [baseTransaction.ts:37](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L37)

___

### data

• `Readonly` **data**: *Buffer*

Inherited from: [BaseTransaction](basetransaction.basetransaction-1.md).[data](basetransaction.basetransaction-1.md#data)

Defined in: [baseTransaction.ts:36](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L36)

___

### gasLimit

• `Readonly` **gasLimit**: *BN*

Inherited from: [BaseTransaction](basetransaction.basetransaction-1.md).[gasLimit](basetransaction.basetransaction-1.md#gaslimit)

Defined in: [baseTransaction.ts:33](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L33)

___

### gasPrice

• `Readonly` **gasPrice**: *BN*

Defined in: [eip2930Transaction.ts:28](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip2930Transaction.ts#L28)

___

### nonce

• `Readonly` **nonce**: *BN*

Inherited from: [BaseTransaction](basetransaction.basetransaction-1.md).[nonce](basetransaction.basetransaction-1.md#nonce)

Defined in: [baseTransaction.ts:32](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L32)

___

### r

• `Optional` `Readonly` **r**: *BN*

Inherited from: [BaseTransaction](basetransaction.basetransaction-1.md).[r](basetransaction.basetransaction-1.md#r)

Defined in: [baseTransaction.ts:40](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L40)

___

### s

• `Optional` `Readonly` **s**: *BN*

Inherited from: [BaseTransaction](basetransaction.basetransaction-1.md).[s](basetransaction.basetransaction-1.md#s)

Defined in: [baseTransaction.ts:41](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L41)

___

### to

• `Optional` `Readonly` **to**: *Address*

Inherited from: [BaseTransaction](basetransaction.basetransaction-1.md).[to](basetransaction.basetransaction-1.md#to)

Defined in: [baseTransaction.ts:34](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L34)

___

### v

• `Optional` `Readonly` **v**: *BN*

Inherited from: [BaseTransaction](basetransaction.basetransaction-1.md).[v](basetransaction.basetransaction-1.md#v)

Defined in: [baseTransaction.ts:39](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L39)

___

### value

• `Readonly` **value**: *BN*

Inherited from: [BaseTransaction](basetransaction.basetransaction-1.md).[value](basetransaction.basetransaction-1.md#value)

Defined in: [baseTransaction.ts:35](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L35)

## Accessors

### senderR

• get **senderR**(): *undefined* \| *BN*

EIP-2930 alias for `r`

**Returns:** *undefined* \| *BN*

Defined in: [eip2930Transaction.ts:33](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip2930Transaction.ts#L33)

___

### senderS

• get **senderS**(): *undefined* \| *BN*

EIP-2930 alias for `s`

**Returns:** *undefined* \| *BN*

Defined in: [eip2930Transaction.ts:40](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip2930Transaction.ts#L40)

___

### transactionType

• get **transactionType**(): *number*

Returns the transaction type

**Returns:** *number*

Defined in: [baseTransaction.ts:79](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L79)

___

### type

• get **type**(): *number*

Alias for `transactionType`

**Returns:** *number*

Defined in: [baseTransaction.ts:86](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L86)

___

### yParity

• get **yParity**(): *undefined* \| *BN*

EIP-2930 alias for `v`

**Returns:** *undefined* \| *BN*

Defined in: [eip2930Transaction.ts:47](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip2930Transaction.ts#L47)

## Methods

### \_processSignature

▸ **_processSignature**(`v`: *number*, `r`: *Buffer*, `s`: *Buffer*): [*default*](eip2930transaction.default.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `v` | *number* |
| `r` | *Buffer* |
| `s` | *Buffer* |

**Returns:** [*default*](eip2930transaction.default.md)

Overrides: BaseTransaction.\_processSignature

Defined in: [eip2930Transaction.ts:287](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip2930Transaction.ts#L287)

___

### getBaseFee

▸ **getBaseFee**(): *BN*

The minimum amount of gas the tx must have (DataFee + TxFee + Creation Fee)

**Returns:** *BN*

Inherited from: [BaseTransaction](basetransaction.basetransaction-1.md)

Defined in: [baseTransaction.ts:114](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L114)

___

### getDataFee

▸ **getDataFee**(): *BN*

The amount of gas paid for the data in this tx

**Returns:** *BN*

Overrides: [BaseTransaction](basetransaction.basetransaction-1.md)

Defined in: [eip2930Transaction.ts:181](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip2930Transaction.ts#L181)

___

### getMessageToSign

▸ **getMessageToSign**(`hashMessage?`: *boolean*): *Buffer*

Returns the serialized unsigned tx (hashed or raw), which is used to sign the transaction.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `hashMessage` | *boolean* | true | Return hashed message if set to true (default: true) |

**Returns:** *Buffer*

Overrides: [BaseTransaction](basetransaction.basetransaction-1.md)

Defined in: [eip2930Transaction.ts:228](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip2930Transaction.ts#L228)

___

### getMessageToVerifySignature

▸ **getMessageToVerifySignature**(): *Buffer*

Computes a sha3-256 hash which can be used to verify the signature

**Returns:** *Buffer*

Overrides: [BaseTransaction](basetransaction.basetransaction-1.md)

Defined in: [eip2930Transaction.ts:252](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip2930Transaction.ts#L252)

___

### getSenderAddress

▸ **getSenderAddress**(): *Address*

Returns the sender's address

**Returns:** *Address*

Inherited from: [BaseTransaction](basetransaction.basetransaction-1.md)

Defined in: [baseTransaction.ts:203](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L203)

___

### getSenderPublicKey

▸ **getSenderPublicKey**(): *Buffer*

Returns the public key of the sender

**Returns:** *Buffer*

Overrides: [BaseTransaction](basetransaction.basetransaction-1.md)

Defined in: [eip2930Transaction.ts:259](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip2930Transaction.ts#L259)

___

### getUpfrontCost

▸ **getUpfrontCost**(): *BN*

The up front amount that an account must have for this transaction to be valid

**Returns:** *BN*

Overrides: [BaseTransaction](basetransaction.basetransaction-1.md)

Defined in: [eip2930Transaction.ts:190](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip2930Transaction.ts#L190)

___

### hash

▸ **hash**(): *Buffer*

Computes a sha3-256 hash of the serialized tx

**Returns:** *Buffer*

Overrides: [BaseTransaction](basetransaction.basetransaction-1.md)

Defined in: [eip2930Transaction.ts:241](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip2930Transaction.ts#L241)

___

### isSigned

▸ **isSigned**(): *boolean*

**Returns:** *boolean*

Inherited from: [BaseTransaction](basetransaction.basetransaction-1.md)

Defined in: [baseTransaction.ts:170](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L170)

___

### raw

▸ **raw**(): [*AccessListEIP2930ValuesArray*](../modules/types.md#accesslisteip2930valuesarray)

Returns a Buffer Array of the raw Buffers of this transaction, in order.

Use `serialize()` to add to block data for `Block.fromValuesArray()`.

**Returns:** [*AccessListEIP2930ValuesArray*](../modules/types.md#accesslisteip2930valuesarray)

Overrides: [BaseTransaction](basetransaction.basetransaction-1.md)

Defined in: [eip2930Transaction.ts:199](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip2930Transaction.ts#L199)

___

### serialize

▸ **serialize**(): *Buffer*

Returns the serialized encoding of the transaction.

**Returns:** *Buffer*

Overrides: [BaseTransaction](basetransaction.basetransaction-1.md)

Defined in: [eip2930Transaction.ts:218](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip2930Transaction.ts#L218)

___

### sign

▸ **sign**(`privateKey`: *Buffer*): [*default*](eip2930transaction.default.md)

Signs a tx and returns a new signed tx object

#### Parameters

| Name | Type |
| :------ | :------ |
| `privateKey` | *Buffer* |

**Returns:** [*default*](eip2930transaction.default.md)

Inherited from: [BaseTransaction](basetransaction.basetransaction-1.md)

Defined in: [baseTransaction.ts:215](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L215)

___

### toCreationAddress

▸ **toCreationAddress**(): *boolean*

If the tx's `to` is to the creation address

**Returns:** *boolean*

Inherited from: [BaseTransaction](basetransaction.basetransaction-1.md)

Defined in: [baseTransaction.ts:144](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L144)

___

### toJSON

▸ **toJSON**(): [*JsonTx*](../interfaces/types.jsontx.md)

Returns an object with the JSON representation of the transaction

**Returns:** [*JsonTx*](../interfaces/types.jsontx.md)

Overrides: [BaseTransaction](basetransaction.basetransaction-1.md)

Defined in: [eip2930Transaction.ts:313](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip2930Transaction.ts#L313)

___

### validate

▸ **validate**(): *boolean*

Checks if the transaction has the minimum amount of gas required
(DataFee + TxFee + Creation Fee).

**Returns:** *boolean*

Inherited from: [BaseTransaction](basetransaction.basetransaction-1.md)

Defined in: [baseTransaction.ts:94](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L94)

▸ **validate**(`stringError`: ``false``): *boolean*

#### Parameters

| Name | Type |
| :------ | :------ |
| `stringError` | ``false`` |

**Returns:** *boolean*

Inherited from: [BaseTransaction](basetransaction.basetransaction-1.md)

Defined in: [baseTransaction.ts:95](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L95)

▸ **validate**(`stringError`: ``true``): *string*[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `stringError` | ``true`` |

**Returns:** *string*[]

Inherited from: [BaseTransaction](basetransaction.basetransaction-1.md)

Defined in: [baseTransaction.ts:96](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L96)

___

### verifySignature

▸ **verifySignature**(): *boolean*

Determines if the signature is valid

**Returns:** *boolean*

Inherited from: [BaseTransaction](basetransaction.basetransaction-1.md)

Defined in: [baseTransaction.ts:190](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/baseTransaction.ts#L190)

___

### fromRlpSerializedTx

▸ `Static` **fromRlpSerializedTx**(`serialized`: *Buffer*, `opts?`: [*TxOptions*](../interfaces/types.txoptions.md)): [*default*](eip2930transaction.default.md)

Instantiate a transaction from the serialized tx.
(alias of `fromSerializedTx()`)

Note: This means that the Buffer should start with 0x01.

**`deprecated`** this constructor alias is deprecated and will be removed
in favor of the `fromSerializedTx()` constructor

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `serialized` | *Buffer* | - |
| `opts` | [*TxOptions*](../interfaces/types.txoptions.md) | {} |

**Returns:** [*default*](eip2930transaction.default.md)

Defined in: [eip2930Transaction.ts:90](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip2930Transaction.ts#L90)

___

### fromSerializedTx

▸ `Static` **fromSerializedTx**(`serialized`: *Buffer*, `opts?`: [*TxOptions*](../interfaces/types.txoptions.md)): [*default*](eip2930transaction.default.md)

Instantiate a transaction from the serialized tx.

Note: this means that the Buffer should start with 0x01.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `serialized` | *Buffer* | - |
| `opts` | [*TxOptions*](../interfaces/types.txoptions.md) | {} |

**Returns:** [*default*](eip2930transaction.default.md)

Defined in: [eip2930Transaction.ts:63](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip2930Transaction.ts#L63)

___

### fromTxData

▸ `Static` **fromTxData**(`txData`: [*AccessListEIP2930TxData*](../interfaces/types.accesslisteip2930txdata.md), `opts?`: [*TxOptions*](../interfaces/types.txoptions.md)): [*default*](eip2930transaction.default.md)

Instantiate a transaction from a data dictionary

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `txData` | [*AccessListEIP2930TxData*](../interfaces/types.accesslisteip2930txdata.md) | - |
| `opts` | [*TxOptions*](../interfaces/types.txoptions.md) | {} |

**Returns:** [*default*](eip2930transaction.default.md)

Defined in: [eip2930Transaction.ts:54](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip2930Transaction.ts#L54)

___

### fromValuesArray

▸ `Static` **fromValuesArray**(`values`: [*AccessListEIP2930ValuesArray*](../modules/types.md#accesslisteip2930valuesarray), `opts?`: [*TxOptions*](../interfaces/types.txoptions.md)): [*default*](eip2930transaction.default.md)

Create a transaction from a values array.

The format is:
chainId, nonce, gasPrice, gasLimit, to, value, data, access_list, yParity (v), senderR (r), senderS (s)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `values` | [*AccessListEIP2930ValuesArray*](../modules/types.md#accesslisteip2930valuesarray) | - |
| `opts` | [*TxOptions*](../interfaces/types.txoptions.md) | {} |

**Returns:** [*default*](eip2930transaction.default.md)

Defined in: [eip2930Transaction.ts:100](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/eip2930Transaction.ts#L100)
