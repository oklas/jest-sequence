const quantDuration: number = parseInt(process.env.JEST_SEQUENCE_QUANT || '0') || 200

export default quantDuration
