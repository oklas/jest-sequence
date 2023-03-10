import timeout from './timeout'
import quantDuration from './quantDuration'

export default async (quantCount: number) => timeout(quantCount * quantDuration)
