import { ethers } from 'ethers'

const INFURA_KEY = `${process.env.EXPO_PUBLIC_INFURA_API}`

export const provider = new ethers.InfuraProvider("sepolia", INFURA_KEY);