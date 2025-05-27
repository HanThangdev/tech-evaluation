"use client"
import { motion } from "framer-motion"
import TransactionList from "./components/transactions/TransactionList"

const features = [
 {
  title: "Get FORGE",
  description:
   "Acquire FORGE tokens and unlock the power of decentralized finance.",
  buttonText: "Get FORGE",
  buttonLink: "/get-forge",
  icon: "fire", // Replace with your icon
 },
 {
  title: "Stake",
  description:
   "Stake your FORGE tokens to earn IGNIS rewards with competitive APYs.",
  buttonText: "Start Staking",
  buttonLink: "/stake",
  icon: "iron", // Replace with your icon
 },
 {
  title: "Borrow & Lend",
  description:
   "Access decentralized borrowing and lending with your FORGE tokens.",
  buttonText: "Borrow Now",
  buttonLink: "/borrow",
  icon: "crysto", // Replace with your icon
 },
 {
  title: "Save",
  description: "Save your FORGE tokens securely and earn stable rewards.",
  buttonText: "Start Saving",
  buttonLink: "/save",
  icon: "shild", // Replace with your icon
 },
]

export default function HomePage() {
 return (
  <div className="max-w-6xl mx-auto p-6">
   <TransactionList />
  </div>
 )
}
