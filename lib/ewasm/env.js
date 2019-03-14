const assert = require('assert')
const fs = require('fs')
const path = require('path')
const BN = require('bn.js')
const { VmError, ERROR, FinishExecution } = require('../exceptions.js')

const transformerRaw = fs.readFileSync(path.join(__dirname, '/system/transform-i64.wasm'))
const transformerModule = WebAssembly.Module(transformerRaw)

module.exports = class Env {
  constructor (data) {
    this._data = data
    this._results = {
      gasUsed: new BN(0)
    }

    // Wasm-js api doesn't yet support i64 param/return values.
    // https://github.com/WebAssembly/proposals/issues/7
    this.transformer = WebAssembly.Instance(transformerModule, {
      interface: {
        useGas: this._useGas.bind(this),
        getGasLeftHigh: this._getGasLeftHigh.bind(this),
        getGasLeftLow: this._getGasLeftLow.bind(this),
        call: this._call.bind(this),
        callCode: this._callCode.bind(this),
        callDelegate: this._callDelegate.bind(this),
        callStatic: this._callStatic.bind(this)
      }
    })
  }

  get imports () {
    return {
      ethereum: this.ethereum
    }
  }

  get ethereum () {
    return {
      getAddress: this.getAddress.bind(this),
      getBalance: this.getBalance.bind(this),
      getTxGasPrice: this.getTxGasPrice.bind(this),
      getTxOrigin: this.getTxOrigin.bind(this),
      getCaller: this.getCaller.bind(this),
      getCodeSize: this.getCodeSize.bind(this),
      codeCopy: this.codeCopy.bind(this),
      getCallValue: this.getCallValue.bind(this),
      getCallDataSize: this.getCallDataSize.bind(this),
      callDataCopy: this.callDataCopy.bind(this),
      useGas: this.transformer.exports.useGas,
      getGasLeft: this.transformer.exports.getGasLeft,
      call: this.transformer.exports.call,
      callCode: this.transformer.exports.callCode,
      callDelegate: this.transformer.exports.callDelegate,
      callStatic: this.transformer.exports.callStatic,
      getReturnDataSize: this.getReturnDataSize.bind(this),
      returnDataCopy: this.returnDataCopy.bind(this),
      storageLoad: this.storageLoad.bind(this),
      storageStore: this.storageStore.bind(this),
      selfDestruct: this.selfDestruct.bind(this),
      finish: this.finish.bind(this),
      revert: this.revert.bind(this)
    }
  }

  getAddress () {
    console.log('getAddress')
    return this._data.address
  }

  getBalance () {
    console.log('getBalance')
    return this._data.balance
  }

  getTxGasPrice () {
    console.log('getTxGasPrice')
    return this._data.gasPrice
  }

  getTxOrigin () {
    console.log('getTxOrigin')
    return this._data.origin
  }

  getCaller () {
    console.log('getCaller')
    return this._data.caller
  }

  getCodeSize () {
    console.log('getCodeSize', this._data.code.length)
    return this._data.code.length
  }

  codeCopy (resultOffset, codeOffset, length) {
    console.log('codeCopy', resultOffset, codeOffset, length)
    const vBuf = this._data.code.slice(codeOffset, codeOffset + length)
    this._memory.write(resultOffset, length, vBuf)
  }

  /**
   * Gets the deposited value by the instruction/transaction responsible
   * for this execution and loads it into memory at the given location.
   * @param {Number} offset - The memory offset to load the value into
   */
  getCallValue (offset) {
    console.log('getCallValue')
    const vBuf = this._data.value
    this._memory.write(offset, 16, vBuf)
  }

  /**
   * Returns size of input data in current environment. This pertains to the
   * input data passed with the message call instruction or transaction.
   */
  getCallDataSize () {
    console.log('getCallDataSize', this._data.data.length)
    return this._data.data.length
  }

  /**
   * Copies the input data in current environment to memory. This pertains to
   * the input data passed with the message call instruction or transaction.
   * @param {Number} resultOffset - The memory offset to load data into
   * @param {Number} dataOffset - The offset in the input data
   * @param {Number} length - The length of data to copy
   */
  callDataCopy (resultOffset, dataOffset, length) {
    console.log('callDataCopy', resultOffset, dataOffset, length)
    if (length === 0) {
      return
    }

    const data = this._data.data.slice(dataOffset, dataOffset + length)
    this._memory.write(resultOffset, length, data)
  }

  _useGas (high, low) {
    console.log('_useGas')
    const amount = fromI64(high, low)
    this.useGas(amount)
  }

  /**
   * Subtracts an amount from the gas counter.
   * @param {BN} amount - The amount to subtract to the gas counter
   * @throws VmError if gas limit is exceeded
   */
  useGas (amount) {
    console.log('useGas')
    amount = new BN(amount)
    const gasUsed = this._results.gasUsed.add(amount)
    if (this._data.gasLimit.lt(gasUsed)) {
      this._results.exception = 0
      this._results.exceptionError = ERROR.OUT_OF_GAS
      this._results.gasUsed = this._data.gasLimit
      this._results.return = Buffer.from([])
      throw new VmError(ERROR.OUT_OF_GAS)
    }

    this._results.gasUsed = gasUsed
  }

  _getGasLeftHigh () {
    console.log('_getGasLeftHigh')
    return Math.floor(this._data.gasLeft / 4294967296)
  }

  _getGasLeftLow () {
    console.log('_getGasLeftLow')
    return this._data.gasLeft
  }

  _call (gasHigh, gasLow, addressOffset, valueOffset, dataOffset, dataLength) {
    console.log('call')
  }

  _callCode (gasHigh, gasLow, addressOffset, valueOffset, dataOffset, dataLength) {
    console.log('callCode')
  }

  _callDelegate (gasHigh, gasLow, addressOffset, dataOffset, dataLength) {
    console.log('callDelegate')
  }

  _callStatic (gasHigh, gasLow, addressOffset, dataOffset, dataLength) {
    console.log('callStatic')
  }

  getReturnDataSize () {
    console.log('getReturnDataSize')
    return 0
  }

  returnDataCopy (resultOffset, dataOffset, length) {
    console.log('returnDataCopy', resultOffset, dataOffset, length)
  }

  storageLoad () {
    console.log('storage load')
  }

  storageStore (pathOffset, valueOffset) {
    console.log('storage store', pathOffset, valueOffset)
    const path = Buffer.from(this._memory.read(pathOffset, 32))
    const value = Buffer.from(this._memory.read(valueOffset, 32))
    console.log(path.toString('hex'), value.toString('hex'))
  }

  selfDestruct () {
    console.log('selfDestruct')
  }

  /**
   * Set the returning output data for the execution.
   * This will halt the execution immediately.
   * @param {Number} offset - The memory offset of the output data
   * @param {Number} length - The length of the output data
   * @throws FinishExecution
   */
  finish (offset, length) {
    console.log('finish', offset, length)
    let ret = Buffer.from([])
    if (length) {
      ret = Buffer.from(this._memory.read(offset, length))
    }

    // 1 = success
    this._results.exception = 1
    this._results.return = ret

    throw new FinishExecution('WASM execution finished, should halt')
  }

  /**
   * Set the returning output data for the execution. This will
   * halt the execution immediately and set the execution
   * result to "reverted".
   * @param {Number} offset - The memory offset of the output data
   * @param {Number} length - The length of the output data
   * @throws VmError
   */
  revert (offset, length) {
    let ret = Buffer.from([])
    if (length) {
      ret = Buffer.from(this._memory.read(offset, length))
    }

    this._results.exception = 0
    this._results.exceptionError = ERROR.REVERT
    this._results.gasUsed = this._data.gasLimit
    this._results.return = ret

    throw new VmError(ERROR.REVERT)
  }

  setMemory (memory) {
    this._memory = memory
  }
}

// Converts a 64 bit number represented by `high` and `low`, back to a JS numbers
// Adopted from https://github.com/ewasm/ewasm-kernel/blob/master/EVMimports.js
function fromI64 (high, low) {
  if (high < 0) {
    // convert from a 32-bit two's compliment
    high = 0x100000000 - high
  }

  // High shouldn't have any bits set between 32-21
  assert((high & 0xffe00000) === 0, 'Failed to convert wasm i64 to JS numbers')

  if (low < 0) {
    // convert from a 32-bit two's compliment
    low = 0x100000000 - low
  }
  // JS only bitshift 32bits, so instead of high << 32 we have high * 2 ^ 32
  return (high * 4294967296) + low
}