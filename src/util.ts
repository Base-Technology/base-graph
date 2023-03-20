import { BigInt, Bytes } from "@graphprotocol/graph-ts"

export function decodeUint256(data: Bytes): BigInt {
    let result = BigInt.zero();
    for (let i = 0; i < data.length; i++) {
        result = result * BigInt.fromU32(256) + BigInt.fromU32(data[i]);
    }
    return result;
}