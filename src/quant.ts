import timeout from './timeout'

const quantTimeout: number = parseInt(process.env.JEST_SEQUENCE_QUANT || '0') || 200

export default async (quantCount: number) => timeout(quantCount * quantTimeout)
