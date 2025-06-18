import { provider } from './InfuraProvider'
import { ethers } from "ethers";

export const getBalance = async (address) => {
   const balanceWei =  await provider.getBalance(address)

   return ethers.formatEther(balanceWei);
}